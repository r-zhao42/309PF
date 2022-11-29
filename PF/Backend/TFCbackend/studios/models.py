from django.db import models
from accounts.models import Account
from phonenumber_field.modelfields import PhoneNumberField
from location_field.models.plain import PlainLocationField


class Studio(models.Model):
    name = models.CharField(unique=True, null=False, blank=False, max_length=150)
    address = models.CharField(unique=True, null=False, blank=False, max_length=150)
    # There is an error for location that doesn't seem to matter, cause is google billing
    location = PlainLocationField(unique=True)
    postal_code = models.CharField(null=False, blank=False, max_length=50)
    phone_num = PhoneNumberField(unique=True, null=True, blank=True)

    def __str__(self):
        return self.name

def get_image_path(self, filename):
    print(self)
    return f'studios/images/{self.studio.id}/{filename}.png'

class Image(models.Model):
    class Meta:
        verbose_name = "images"
        verbose_name_plural = "images"
    studio = models.ForeignKey(Studio, null=False, blank=False, on_delete=models.CASCADE, related_name='images')
    image = models.ImageField(null=False, blank=False, upload_to=get_image_path)

class Amenity(models.Model):
    class Meta:
        verbose_name = "amenity"
        verbose_name_plural = "amenities"
        unique_together = ('studio', 'name')

    studio = models.ForeignKey(Studio, null=False, blank=False, on_delete=models.CASCADE, related_name='amenities')
    name = models.CharField(max_length=150)
    quantity = models.PositiveIntegerField(null=True, blank=True, default=0)

    def __str__(self):
        return f'{self.studio.name}, {self.name}'

CHOICES = [
    ('no_repeat', 'Doesn\'t Repeat'),
    ('daily', 'Daily'),
    ('weekly', 'Weekly'),
    ('montly', 'Monthly'),
]

def get_default_dict():
    return {'keywords': []}

class Class(models.Model):
    class Meta:
        verbose_name_plural = "classes"

    studio = models.ForeignKey(Studio, on_delete=models.CASCADE, related_name='classes')
    name = models.CharField(null=False, blank=False, max_length=155)
    desc = models.CharField(null=False, blank=False, max_length=300)
    coach = models.CharField(null=False, blank=False, max_length=50)
    keywords = models.JSONField(default=get_default_dict)
    capacity = models.PositiveIntegerField(null=True, blank=True, default=0)
    start_time = models.DateTimeField(null=False, blank=False)
    end_time = models.DateTimeField(null=False, blank=False)
    repeat_until = models.DateField(blank=True, null=True)
    frequency = models.CharField(max_length=14, choices=CHOICES, default='no_repeat')

    def __str__(self):
        return f'{self.studio.name}, {self.name}'

class RepeatClass(models.Model):
    class Meta:
        verbose_name_plural = "class instances"
        verbose_name = "class instance"

    studio = models.ForeignKey(Studio, on_delete=models.CASCADE)
    parent_class = models.ForeignKey(Class, on_delete=models.CASCADE, related_name='repeat_class')
    start_time = models.DateTimeField(null=False, blank=False)
    end_time = models.DateTimeField(null=False, blank=False)
    cancelled = models.BooleanField(default=False)
    cancel_future = models.BooleanField(default=False)

    def __str__(self):
        return f'Class Name:{self.parent_class.name}, Class start:{self.start_time}'

class Enrollment(models.Model):
    repeat_class =  models.ForeignKey(RepeatClass, on_delete=models.CASCADE)
    user = models.ForeignKey(Account, on_delete=models.CASCADE)

    class Meta:
        unique_together = ('repeat_class', 'user',)
    
    def __str__(self):
        return f'Account: {self.user}'