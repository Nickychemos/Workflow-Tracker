from django.contrib import admin
from django.urls import path
from ninja import NinjaAPI

from applications.api import router as applications_router
from applications.exceptions import WorkflowError

api = NinjaAPI(title="Application Workflow API", version="1.0")
api.add_router("/applications/", applications_router)


@api.exception_handler(WorkflowError)
def workflow_error(request, exc):
    return api.create_response(request, {"detail": str(exc)}, status=409)


urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/", api.urls),
]
