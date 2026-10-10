from django.shortcuts import render
from django.contrib.auth import authenticate, login, logout
from django.shortcuts import render,redirect



def index(request):
    return render(request, "scanner/index.html")


def login_page(request):
    if request.method == "POST":
        username = request.POST.get("username", "").strip()
        password = request.POST.get("password", "")

        user = authenticate(
            request,
            username=username,
            password=password
        )

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
    return render(request, "scanner/admin-login.html")
# Create your views here.

def admin_dashboard(request):
    return render(request, "scanner/admin-dashboard.html")

def admin_users(request):
    return render(request, "scanner/admin-user.html")

def admin_foods(request):
    return render(request, "scanner/admin-food.html")

def admin_scan(request):
    return render(request, "scanner/admin-scan.html")


def logout_view(request):
    logout(request)
    return redirect("login")