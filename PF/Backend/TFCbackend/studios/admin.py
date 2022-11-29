from django.contrib import admin
from datetime import timedelta
from .models import Studio, Class, Amenity, RepeatClass, Enrollment, Image
from dateutil.relativedelta import relativedelta
from django.utils import timezone
from django import forms
from django.core.exceptions import ValidationError

class ImageInline(admin.TabularInline):
    model = Image
    extra = 0

class RepeatClassInline(admin.StackedInline):
    model = RepeatClass
    extra = 0
    can_delete = False
    fields = ['studio', 'start_time', 'end_time', 'cancelled', 'cancel_future']
    readonly_fields = ['studio']

class AmenityClassInline(admin.StackedInline):
    model = Amenity
    extra = 0

@admin.register(Studio)
class StudioAdmin(admin.ModelAdmin):
    list_display = ['name', 'address', 'location', 'postal_code', 'phone_num']
    inlines = [
        AmenityClassInline,
        ImageInline
    ]

@admin.register(Amenity)
class AmenityAdmin(admin.ModelAdmin):
    list_display = ['name', 'studio', 'quantity']
    ordering = ['studio', 'name']

@admin.register(Enrollment)
class EnrollmentAdmin(admin.ModelAdmin):
    list_display = ['id', 'get_studio', 'get_class', 'user']
    fields = ['get_studio', 'get_class', 'user']
    readonly_fields = ['get_studio', 'get_class', 'user']
    ordering = ['repeat_class__studio__name', 'repeat_class__parent_class__name']

    @admin.display(description='Class', ordering='repeat_class__parent_class__name')
    def get_class(self, obj):
        return obj.repeat_class.parent_class.name

    @admin.display(description='Studio', ordering='repeat_class__studio__name')
    def get_studio(self, obj):
        return obj.repeat_class.parent_class.studio.name

class ClassAdminForm(forms.ModelForm):
    def clean(self):
        start_time = self.cleaned_data.get("start_time")
        end_time = self.cleaned_data.get("end_time")
        repeat_until = self.cleaned_data.get("repeat_until")
        frequency = self.cleaned_data.get("frequency")
        if start_time is not None and end_time is not None and start_time > end_time:
            raise ValidationError("End time must be after start time")
        if frequency != 'no_repeat' and repeat_until is None:
             raise ValidationError("Repeat Until Date Missing")
        if frequency != 'no_repeat' and end_time.date() > repeat_until:
            raise ValidationError("Repeat until date must be after end time")

@admin.register(Class)
class ClassAdmin(admin.ModelAdmin):
    form = ClassAdminForm
    list_display = ['name', 'studio']
    ordering = ['studio', 'name']
    fields = ['name', 'studio', 'desc', 'coach', 'keywords', 'capacity', 'start_time', 'end_time', 'repeat_until', 'frequency']
    
    inlines = [
        RepeatClassInline,
    ]

    def get_readonly_fields(self, request, obj=None):
        if obj:
            return ['frequency']
        else:
            return []

    def get_form(self, request, obj=None, change=False, **kwargs):
        form = super().get_form(request, obj, change, **kwargs)
        form.base_fields['start_time'].label = 'Start Date of First Class/Time'
        form.base_fields['end_time'].label = 'End Date of First Class/Time'
        # form.base_fields['every'].label = 'Frequency'
        return form
    
    def get_interval(self, parent):
        if parent.frequency == "daily":
            time_increment = timedelta(days=1)
        elif parent.frequency == "weekly":
            time_increment = timedelta(weeks=1)
        else:
            time_increment = relativedelta(months=+1)
        return time_increment

    def build_new(self, until, counter, parent, new_times, interval, studio):
        counter = counter
        curr = new_times['start'] + (counter * interval)
        while curr.date() <= until:
            rp = RepeatClass(studio=studio, parent_class=parent, start_time=new_times['start'] + interval * counter, end_time=new_times['end'] + interval * counter)
            curr = curr + interval
            rp.save()
            counter += 1
    
    def edit_start_curr(self, curr, until, counter, diff, queryset, interval):
        counter = counter
        while curr.date() <= until:
            counter += 1
            # find if a start_time of a class matches the time of curr
            q = queryset.filter(start_time=curr)
            if q.exists():
                target_class = q.first()

                # add the time different to target_class
                target_class.start_time = target_class.start_time + diff
                target_class.save()
            curr = curr + interval
        
        return counter
    
    def edit_end_curr(self, curr, until, counter, diff, queryset, interval):
        counter = counter
        while curr.date() <= until:
            counter += 1
            # find if a end_time of a class matches the time of curr
            q = queryset.filter(end_time=curr)
            if q.exists():
                target_class = q.first()

                # add the time different to target_class
                target_class.end_time = target_class.end_time + diff
                target_class.save()
            curr = curr + interval

    def save_model(self, request, obj, form, change):
        new_times = {}
        new_times['start'] = obj.start_time
        new_times['end'] = obj.end_time
        
        # class is newly created
        if obj._state.adding:
            obj.save()

            # class is repeating
            if obj.frequency != 'no_repeat':
                interval = self.get_interval(obj)
                self.build_new(obj.repeat_until, 0, obj, new_times, interval, obj.studio)
            # class in a one time instance
            else:
                rp = RepeatClass(studio=obj.studio, parent_class=obj, start_time=new_times['start'], end_time=new_times['end'])
                rp.save()
        
        # class already exists and is being edited
        else:
            if obj.frequency != 'no_repeat':
                old_class = Class.objects.get(pk=form.instance.pk)
                interval = self.get_interval(old_class)
                queryset = RepeatClass.objects.filter(parent_class=old_class, start_time__gte=timezone.now())
                
                if 'start_time' in form.changed_data:
                    diff = new_times['start'] - old_class.start_time
                    # update all classes that follow the preestablished pattern
                    counter = self.edit_start_curr(old_class.start_time, old_class.repeat_until, 0, diff, queryset, interval)
                    self.build_new(obj.repeat_until, counter, old_class, new_times, interval, obj.studio)
                    q = queryset.filter(start_time__gte=obj.repeat_until + interval)
                    for target_class in q:
                        target_class.cancelled = True
                        target_class.save()
                    queryset = RepeatClass.objects.filter(parent_class=old_class, start_time__gte=timezone.now())
                
                if 'end_time' in form.changed_data:
                    # update all classes that follow the preestablished pattern
                    self.edit_end_curr(old_class.end_time, old_class.repeat_until, 0, new_times['end'] - old_class.end_time, queryset, interval)
                    q = queryset.filter(start_time__gte=obj.repeat_until + interval)
                    for target_class in q:
                        target_class.cancelled = True
                        target_class.save()
                    queryset = RepeatClass.objects.filter(parent_class=old_class, start_time__gte=timezone.now())
                
                if 'repeat_until' in form.changed_data:
                    # repeat until moved back in time. Cancel all classes outside of range
                    if old_class.repeat_until > obj.repeat_until:
                        queryset = queryset.filter(start_time__gte=obj.repeat_until + interval)
                        for target_class in queryset:
                            target_class.cancelled = True
                            target_class.save()
                    else: # moved forward in time
                        self.build_new(obj.repeat_until, len(queryset), old_class, new_times, interval, obj.studio)
                    queryset = RepeatClass.objects.filter(parent_class=old_class, start_time__gte=timezone.now())
                
                if 'studio' in form.changed_data:
                    for rc in queryset:
                        rc.studio = obj.studio
                        rc.save()
            else:
                RepeatClass.objects.filter(parent_class=obj).update(start_time=new_times['start'], end_time=new_times['end'], studio=obj.studio)
            obj.save()

    def save_formset(self, request, form, formset, change) -> None:
        # update repeating classes - if cancel future is selected
        instances = formset.save()

        for instance in instances:
            if instance.cancel_future:
                instance.cancelled = True
                RepeatClass.objects.filter(start_time__gt = instance.start_time).update(cancelled=True)
                instance.save()

        return super().save_formset(request, form, formset, change)
    
    