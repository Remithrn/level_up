from django.contrib.auth.models import BaseUserManager
from django.core.validators import validate_email
from django.core.exceptions import ValidationError
from django.utils.translation import gettext_lazy as _

class CustomUserManager(BaseUserManager):
    def email_validation(self, email):
        try:
            validate_email(email)
        except ValidationError:
            raise ValueError(_("You must provide a valid email"))

    def create_user(self, email,username, first_name, last_name=None, password=None, **extra_fields):
        # Check if email is provided
        if not email:
            raise ValueError(_("Email is a required field"))
        
        # Validate email format
        self.email_validation(email)
        clean_email = self.normalize_email(email)
        
        if not username:
            raise ValidationError(_("Username is required"))
        # Check if first_name is provided
        if not first_name:
            raise ValueError(_("First name is a required field"))
        
        # Create user instance
        user = self.model(
            email=clean_email,
            username =username,
            first_name=first_name,
            last_name=last_name,
            **extra_fields
        )
        
        # Set password and save user
        user.set_password(password)
        user.save(using=self._db)  # Use 'using=self._db' for multi-database setup
        return user

    def create_superuser(self, email,username, first_name, last_name=None, password=None, **extra_fields):
        # Set default fields for superuser
        extra_fields.setdefault("is_active", True)
        extra_fields.setdefault("is_superuser", True)
        extra_fields.setdefault("is_staff", True)

        # Validate email and first_name as in create_user
        if not email:
            raise ValueError(_("Email is a required field"))
        
        self.email_validation(email)
        clean_email = self.normalize_email(email)

        if not username:
            raise ValidationError(_("Username is required"))

        if not first_name:
            raise ValueError(_("First name is a required field"))
        
        # Ensure superuser specific fields are set correctly
        if extra_fields.get("is_superuser") is not True:
            raise ValueError(_("Superuser must have True for is_superuser"))
        
        if extra_fields.get("is_staff") is not True:
            raise ValueError(_("Superuser must have True for is_staff"))

        # Create superuser instance using create_user method
        user = self.create_user(
            email=clean_email,username=username, first_name=first_name, last_name=last_name, password=password, **extra_fields
        )
        user.save(using=self._db)
        return user
