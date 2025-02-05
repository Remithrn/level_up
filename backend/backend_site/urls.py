from django.contrib import admin
from django.urls import path, include
from accounts.views import (
    email_confirmation,
    reset_password_confirm,
    GoogleLogin,
    ProfileDetailView,
    UpdateUsernameView,
    FriendProfileDetailView,
)
from django.conf import settings
from django.conf.urls.static import static


urlpatterns = [
    path("admin/", admin.site.urls),
    path("dj-rest-auth/", include("dj_rest_auth.urls")),
    path(
        "dj-rest-auth/registration/account-confirm-email/<str:key>/", email_confirmation
    ),
    path("dj-rest-auth/registration/", include("dj_rest_auth.registration.urls")),
    path(
        "reset/password/confirm/<uid>/<str:token>",
        reset_password_confirm,
        name="password_reset_confirm",
    ),
    path(
        "profile/friend/<int:friend_id>/",
        FriendProfileDetailView.as_view(),
        name="friend-profile-detail",
    ),
    path("dj-rest-auth/google/", GoogleLogin.as_view(), name="google_login"),
    path("api/profile/", ProfileDetailView.as_view(), name="profile-detail"),
    path("api/update-username/", UpdateUsernameView.as_view(), name="update-username"),
    path("search/", include("search.urls")),
    path("ai/", include("ai_app.urls")),
    path("api/chat/", include("chat.urls")),
    path("api/streaks/", include("streaks.urls")),
    path("api/payments/", include("payments.urls")),
    path("custom_admin/", include("custom_admin.urls")),
    path("ai_chatbot/", include("ai_chatbot.urls")),
]
# adding media urls
if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
