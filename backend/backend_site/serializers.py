from rest_framework import serializers
from django.conf import settings
from django.urls import reverse

class BaseSerializer(serializers.ModelSerializer):
    def get_media_url(self, instance, field_name):
        """
        Generate full media URL for a given field on the instance.
        """
        file_field = getattr(instance, field_name, None)
        if file_field:
            # Generate the relative URL
            relative_url = reverse('media_file_view_name', kwargs={'filename': file_field.name})
            # Construct the full URL
            return f'http://localhost{relative_url}'
        return None
