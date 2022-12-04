from rest_framework import serializers

from .models import Studio, Class, RepeatClass, Enrollment, Image

class ImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Image
        fields = ['studio']

class ImageRelatedField(serializers.RelatedField):
    def to_representation(self, value):
        print(value)
        data = {
            "image": "value"
        }
        return data

class StudioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Studio
        fields = ['name', 'address', 'location', 'postal_code', 'phone_num', 'images', 'amenities']
        read_only_fields = ['name', 'address', 'location', 'postal_code', 'phone_num', 'images', 'amenities'] # no edits
        depth = 1

class ClassSerializer(serializers.ModelSerializer):
    class Meta:
        model = Class
        fields = ['name', 'studio', 'desc', 'coach', 'keywords', 'capacity', 'start_time', 'end_time'] # no edits

class RepeatClassSerializer(serializers.ModelSerializer):
    parent_class = ClassSerializer(read_only=True)

    class Meta:
        model = RepeatClass
        fields = ['id', 'parent_class', 'studio', 'start_time', 'end_time', 'cancelled', 'cancel_future']

class EnrollmentSerializer(serializers.ModelSerializer):
    repeat_class = RepeatClassSerializer(read_only=True)
    parent_class = ClassSerializer(read_only=True)

    class Meta:
        model = Enrollment
        fields = ['repeat_class', 'parent_class', 'user'] # no edits