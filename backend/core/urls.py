from django.contrib import admin
from django.urls import path
from ninja import NinjaAPI

api = NinjaAPI(title="Application Workflow API", version="1.0")


urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/", api.urls),
]
