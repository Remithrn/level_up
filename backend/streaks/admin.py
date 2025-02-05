from django.contrib import admin
from .models import LeetcodeSubmission, UserStreaks, DailyTasks,Badges,UserBadges     
# Register your models here.
admin.site.register(LeetcodeSubmission)
admin.site.register(UserStreaks)
admin.site.register(DailyTasks)
admin.site.register(Badges)
admin.site.register(UserBadges)

