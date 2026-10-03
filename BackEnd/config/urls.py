"""
URL configuration for config project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/6.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include

from api.views import (signup,login_user,add_meal, scan_food)


urlpatterns = [

    path('admin/',admin.site.urls),

    path('api/signup/',signup),

    path('api/login/',login_user),

    path('api/add-meal/',add_meal),

    path('api/scan-food/',scan_food),

    path("", include("scanner.urls")),


]