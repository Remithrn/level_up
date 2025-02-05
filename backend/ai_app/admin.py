from django.contrib import admin

# Register your models here.
from .models import MockInterview,Feedback,Quiz
admin.site.register(MockInterview)
admin.site.register(Feedback)
admin.site.register(Quiz)