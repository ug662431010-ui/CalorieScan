from django.shortcuts import render


def index(request):
    return render(request, "scanner/index.html")


def login_page(request):
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



from django.contrib.auth.decorators import login_required, user_passes_test

@login_required
@user_passes_test(lambda user: user.is_staff)
def admin_dashboard(request):
    return render(request, "scanner/admin-dashboard.html")