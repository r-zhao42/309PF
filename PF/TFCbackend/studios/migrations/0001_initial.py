# Generated by Django 4.1.3 on 2022-12-01 22:49

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion
import location_field.models.plain
import phonenumber_field.modelfields
import studios.models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Class',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=155)),
                ('desc', models.CharField(max_length=300)),
                ('coach', models.CharField(max_length=50)),
                ('keywords', models.JSONField(default=studios.models.get_default_dict)),
                ('capacity', models.PositiveIntegerField(blank=True, default=0, null=True)),
                ('start_time', models.DateTimeField()),
                ('end_time', models.DateTimeField()),
                ('repeat_until', models.DateField(blank=True, null=True)),
                ('frequency', models.CharField(choices=[('no_repeat', "Doesn't Repeat"), ('daily', 'Daily'), ('weekly', 'Weekly'), ('montly', 'Monthly')], default='no_repeat', max_length=14)),
            ],
            options={
                'verbose_name_plural': 'classes',
            },
        ),
        migrations.CreateModel(
            name='Studio',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=150, unique=True)),
                ('address', models.CharField(max_length=150, unique=True)),
                ('location', location_field.models.plain.PlainLocationField(max_length=63, unique=True)),
                ('postal_code', models.CharField(max_length=50)),
                ('phone_num', phonenumber_field.modelfields.PhoneNumberField(blank=True, max_length=128, null=True, region=None, unique=True)),
            ],
        ),
        migrations.CreateModel(
            name='RepeatClass',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('start_time', models.DateTimeField()),
                ('end_time', models.DateTimeField()),
                ('cancelled', models.BooleanField(default=False)),
                ('cancel_future', models.BooleanField(default=False)),
                ('parent_class', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='repeat_class', to='studios.class')),
                ('studio', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='studios.studio')),
            ],
            options={
                'verbose_name': 'class instance',
                'verbose_name_plural': 'class instances',
            },
        ),
        migrations.CreateModel(
            name='Image',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('image', models.ImageField(upload_to=studios.models.get_image_path)),
                ('studio', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='images', to='studios.studio')),
            ],
            options={
                'verbose_name': 'images',
                'verbose_name_plural': 'images',
            },
        ),
        migrations.AddField(
            model_name='class',
            name='studio',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='classes', to='studios.studio'),
        ),
        migrations.CreateModel(
            name='Enrollment',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('repeat_class', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='studios.repeatclass')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'unique_together': {('repeat_class', 'user')},
            },
        ),
        migrations.CreateModel(
            name='Amenity',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=150)),
                ('quantity', models.PositiveIntegerField(blank=True, default=0, null=True)),
                ('studio', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='amenities', to='studios.studio')),
            ],
            options={
                'verbose_name': 'amenity',
                'verbose_name_plural': 'amenities',
                'unique_together': {('studio', 'name')},
            },
        ),
    ]
