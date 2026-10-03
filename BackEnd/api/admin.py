from django.contrib import admin
from .models import Meal


@admin.register(Meal)
class MealAdmin(admin.ModelAdmin):
    list_display = ("id", "user", "food_name", "calories", "created_at")
    list_filter = ("user",)
    search_fields = ("food_name", "user__username", "user__email")
    ordering = ("-created_at",)