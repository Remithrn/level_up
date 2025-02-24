# Generated by Django 5.1 on 2025-01-30 10:24

import django.db.models.deletion
import django.utils.timezone
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Badges',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('badge_name', models.CharField(max_length=255)),
                ('badge_type', models.CharField(choices=[('streak', 'Streak'), ('experience', 'Experience')], max_length=255)),
                ('badge_threshold', models.IntegerField()),
                ('badge_description', models.TextField()),
                ('badge_image', models.ImageField(upload_to='badges/')),
            ],
        ),
        migrations.CreateModel(
            name='LeetcodeSubmission',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('question_number', models.IntegerField()),
                ('question_title', models.CharField(max_length=255)),
                ('question_link', models.URLField()),
                ('language', models.CharField(max_length=255)),
                ('code', models.TextField()),
                ('submission_date', models.DateTimeField(auto_now_add=True)),
                ('submission_time', models.TimeField(auto_now_add=True)),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='UserBadges',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('badge', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='streaks.badges')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='UserStreaks',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('streak_start_date', models.DateField(blank=True, default=django.utils.timezone.now, null=True)),
                ('streak_end_date', models.DateField(blank=True, default=django.utils.timezone.now, null=True)),
                ('streak_length', models.IntegerField(default=0)),
                ('is_active', models.BooleanField(default=True)),
                ('experience_points', models.IntegerField(default=0)),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='userstreaks', to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='DailyTasks',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('leetcodeTask', models.BooleanField(default=False)),
                ('aiInterviewTask', models.BooleanField(default=False)),
                ('aiQuizTask', models.BooleanField(default=False)),
                ('date', models.DateField(blank=True, null=True)),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'unique_together': {('user', 'date')},
            },
        ),
    ]
