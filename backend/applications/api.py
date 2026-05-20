from uuid import UUID

from django.db.models import Q
from django.shortcuts import get_object_or_404
from ninja import Router

from . import services
from .models import Application
from .schemas import (
    ApplicationCreateIn,
    ApplicationListItem,
    ApplicationOut,
    ApplicationUpdateIn,
    DecisionIn,
)

router = Router(tags=["applications"])


@router.post("/", response={201: ApplicationOut})
def create_application(request, payload: ApplicationCreateIn):
    app = services.create_draft(payload.model_dump())
    return 201, app


@router.get("/", response=list[ApplicationListItem])
def list_applications(
    request,
    status: str | None = None,
    application_type: str | None = None,
    search: str | None = None,
):
    qs = Application.objects.all()
    if status:
        qs = qs.filter(status=status)
    if application_type:
        qs = qs.filter(application_type=application_type)
    if search:
        qs = qs.filter(
            Q(tracking_number__icontains=search)
            | Q(applicant_name__icontains=search)
            | Q(company_name__icontains=search)
        )
    return qs


@router.get("/{app_id}/", response=ApplicationOut)
def get_application(request, app_id: UUID):
    return get_object_or_404(Application, id=app_id)


@router.patch("/{app_id}/", response=ApplicationOut)
def update_application(request, app_id: UUID, payload: ApplicationUpdateIn):
    app = get_object_or_404(Application, id=app_id)
    data = payload.model_dump(exclude_unset=True)
    return services.update_draft(app, data)


@router.post("/{app_id}/submit/", response=ApplicationOut)
def submit_application(request, app_id: UUID):
    return services.submit(get_object_or_404(Application, id=app_id))


@router.post("/{app_id}/start-review/", response=ApplicationOut)
def start_review_application(request, app_id: UUID):
    return services.start_review(get_object_or_404(Application, id=app_id))


@router.post("/{app_id}/decision/", response=ApplicationOut)
def record_decision(request, app_id: UUID, payload: DecisionIn):
    app = get_object_or_404(Application, id=app_id)
    return services.record_decision(app, payload.decision, payload.comment)
