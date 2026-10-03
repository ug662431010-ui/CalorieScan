from django.urls import path
from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("login/", views.login_page, name="login"),
    path("signup/", views.signup_page, name="signup"),
    path("dashboard/", views.dashboard, name="dashboard"),
    path("scan/", views.scan, name="scan"),
    path("meal-history/", views.meal_history, name="meal-history"),
    path("statistics/", views.statistics, name="statistics"),
    path("goal/", views.goal, name="goal"),
    path("profile/", views.profile, name="profile"),
    path("settings/", views.settings, name="settings"),
    path("profile-setup/", views.profile_setup, name="profile-setup"),
]