from django.db import models
from django.contrib.auth.models import BaseUserManager, AbstractBaseUser
from phonenumber_field.modelfields import PhoneNumberField
from django.utils.safestring import mark_safe
from django.core.validators import MinValueValidator

# Create your models here.
class AccountManager(BaseUserManager):
    use_in_migrations = True

    def _create_user(self, email, password, **extra_fields):
        if not email:
            raise ValueError('Accounts must have an email')
        
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user
    
    def create_user(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_admin', False)
        extra_fields.setdefault('is_staff', False)
        extra_fields.setdefault('is_superuser', False)
        return self._create_user(email, password, **extra_fields)

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_admin', True)
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        return self._create_user(email, password, **extra_fields) 


def get_avatar_path(self, img_name):
    email = self.email.replace('@', '-')
    return f'accounts/{email}/avatar.png'

def get_default_avatar():
    return 'accounts/default_avatar.png'

class Account(AbstractBaseUser):
    username = None
    email = models.EmailField(null=False, blank=False, max_length=150, unique=True)

    first_name = models.CharField(null=True, blank=False, max_length=150)
    last_name = models.CharField(null=True, blank=False, max_length=150)
    phone_num = PhoneNumberField(verbose_name='phone number', null=True, blank=False, unique=True)

    avatar = models.ImageField(max_length=255, null=True, blank=False, upload_to=get_avatar_path, default=get_default_avatar)
    @property
    def avatar_preview(self):
        if self.avatar:
            return mark_safe(f'<img src="{self.avatar.url}" width="100" height="100" />')
        return ""

    is_staff = models.BooleanField(default=False)
    is_admin = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)

    objects = AccountManager()
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    def get_avatar_filename(self):
        return str(self.avatar)[str(self.avatar).index(f'avatars/{self.pk}/'):]
    
    def __str__(self):
        return self.email
    
    def has_perm(self, perm, obj=None):
        return self.is_admin
    
    def has_module_perms(self, app_label):
        return self.is_admin

class PaymentInfo(models.Model):
    account = models.OneToOneField(Account, on_delete=models.CASCADE, null=True)
    credit_num = models.CharField(max_length=20)
    credit_exp_month = models.CharField(max_length=6)
    credit_exp_year = models.CharField(max_length=6)
    credit_cvv = models.CharField(max_length=6)

    def __str__(self) -> str:
        return self.credit_num

class Payment(models.Model):
    account = models.ForeignKey(Account, on_delete=models.CASCADE)
    amount = models.FloatField()
    datetime = models.DateTimeField()
    payment_info = models.ForeignKey(PaymentInfo, on_delete=models.DO_NOTHING, verbose_name="Card Number")

    def __str__(self):
        return ""

class SubscriptionType(models.Model):
    type = models.CharField(unique=True, max_length=20, choices=[("yearly", "yearly"), ("monthly", "monthly")])
    amount = models.FloatField(validators=[MinValueValidator(0.0),], default=100.0)

    def __str__(self):
        return f'{self.type}: {self.amount}'

class Subscription(models.Model):
    account = models.ForeignKey(Account, on_delete=models.DO_NOTHING)
    sub_type = models.ForeignKey(SubscriptionType, on_delete=models.CASCADE, null=True, blank=True)
    start_date = models.DateField(auto_now_add=True)
    next_payment_date = models.DateField()

    def __str__(self) -> str:
        return f'{self.account.email}\'s subscription'
