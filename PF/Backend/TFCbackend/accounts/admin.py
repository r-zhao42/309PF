from django.contrib import admin
from django.contrib.auth.admin import UserAdmin

from accounts.models import Account, Subscription, SubscriptionType, PaymentInfo, Payment

class SubscriptionInline(admin.TabularInline):
    model = Subscription
    extra = 0
    fields = ('sub_type', 'start_date', 'next_payment_date')
    readonly_fields = ['sub_type', 'start_date']

class PaymentInfoInline(admin.StackedInline):
    model = PaymentInfo
    extra = 0

class PaymentInline(admin.TabularInline):
    model = Payment
    extra = 0
    readonly_fields = ['account', 
                        'amount',
                        'datetime',
                        'payment_info']

    def has_add_permission(self, request, account):
        return False

@admin.register(SubscriptionType)
class SubscriptionTypeAdmin(admin.ModelAdmin):
    list_display = ['type', 'amount']
    fields = ['type', 'amount']

@admin.register(Account)
class AccountAdmin(UserAdmin):
    list_display = ['email', 'first_name', 'last_name', 'phone_num']
    search_fields = ['email', 'first_name', 'last_name']
    fields = ['id', 'email', 'avatar_preview', 'avatar', 'first_name', 
                'last_name', 'phone_num', 'is_staff', 'is_admin', 'is_superuser', 
                'is_active']
    readonly_fields = ['id', 'avatar_preview']
    ordering = ['email',]
    filter_horizontal = []
    list_filter = []
    fieldsets = []
    inlines = [
        PaymentInfoInline,
        SubscriptionInline,
        PaymentInline,
    ]
    add_fieldsets = [
        [None, {
            'fields': ['email', 'password1', 'password2', 'is_staff', 'is_admin', 'is_superuser', 'is_active']}
        ],
    ]

    def avatar_preview(self, account):
        return account.avatar_preview

from django.contrib.auth.models import Group
admin.site.unregister(Group)
