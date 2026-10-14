from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import user_passes_test
from django.db import models


def staff_required(view_func):
    """เข้าได้เฉพาะ admin (is_staff) ถ้าไม่ใช่จะถูกส่งไปหน้า admin-login"""
    return user_passes_test(
        lambda u: u.is_authenticated and u.is_staff,
        login_url="admin-login",
    )(view_func)


def index(request):
    return render(request, "scanner/index.html")


def login_page(request):
    if request.method == "POST":
        username = request.POST.get("username", "").strip()
        password = request.POST.get("password", "")

        user = authenticate(request, username=username, password=password)

        if user is not None:
            login(request, user)

            if user.is_staff:
                return redirect("admin-dashboard")

            return redirect("dashboard")

        return render(request, "scanner/login.html", {
            "error": "Username or password is incorrect."
        })

    return render(request, "scanner/login.html")


def signup_page(request):
    return render(request, "scanner/signup.html")


def dashboard(request):
    return render(request, "scanner/dashboard.html")


def scan(request):
    return render(request, "scanner/scan.html")


def meal_history(request):
    return render(request, "scanner/meal-history.html")


def statistics(request):
    return render(request, "scanner/statistics.html")


def goal(request):
    return render(request, "scanner/goal.html")


def profile(request):
    return render(request, "scanner/profile.html")


def settings(request):
    return render(request, "scanner/settings.html")


def profile_setup(request):
    return render(request, "scanner/peofile-setup.html")


def admin_login(request):
    if request.method == "POST":
        username = request.POST.get("username", "").strip()
        password = request.POST.get("password", "")

        user = authenticate(request, username=username, password=password)

        if user is None:
            return render(request, "scanner/admin-login.html", {
                "error": "Invalid username or password."
            })

        if not user.is_staff:
            return render(request, "scanner/admin-login.html", {
                "error": "This account does not have admin access."
            })

        login(request, user)
        return redirect("admin-dashboard")

    return render(request, "scanner/admin-login.html")


@staff_required
def admin_dashboard(request):
    from django.contrib.auth.models import User
    from api.models import Meal
    from django.db.models import Sum

    meals = Meal.objects.all()

    context = {
        "total_users": User.objects.count(),
        "total_scans": meals.count(),
        "total_foods": meals.values("food_name").distinct().count(),
        "total_calories": meals.aggregate(total=Sum("calories"))["total"] or 0,
        "recent_scans": meals.select_related("user").order_by("-created_at")[:5],
    }

    return render(request, "scanner/admin-dashboard.html", context)

@staff_required
def admin_users(request):
    from django.contrib.auth.models import User

    users = User.objects.all().order_by("id")
    keyword = request.GET.get("q", "").strip()

    if keyword:
        users = users.filter(username__icontains=keyword) | users.filter(email__icontains=keyword)

    context = {
        "users": users,
        "total_users": User.objects.count(),
        "active_users": User.objects.filter(is_active=True).count(),
        "keyword": keyword,
    }

    return render(request, "scanner/admin-user.html", context)

@staff_required
def admin_foods(request):
    from api.models import Meal

    foods = Meal.objects.all().order_by("-created_at")
    keyword = request.GET.get("q", "").strip()

    if keyword:
        foods = foods.filter(food_name__icontains=keyword)

    return render(request, "scanner/admin-food.html", {
        "foods": foods,
        "total_foods": foods.count(),
        "keyword": keyword,
    })




@staff_required
def admin_scan(request):
    from api.models import Meal
    from django.db import models

    scans = Meal.objects.select_related("user").order_by("-created_at")
    keyword = request.GET.get("q", "").strip()

    if keyword:
        scans = scans.filter(
            models.Q(user__username__icontains=keyword)
            | models.Q(food_name__icontains=keyword)
        )

    return render(request, "scanner/admin-scan.html", {
        "scans": scans,
        "total_scans": scans.count(),
        "total_calories": sum(item.calories for item in scans),
        "keyword": keyword,
    })




def logout_view(request):
    logout(request)
    return redirect("login")