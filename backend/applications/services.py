from django.utils import timezone

from .enums import ApplicationStatus
from .exceptions import WorkflowError
from .models import Application

_EDITABLE_STATES = (ApplicationStatus.DRAFT, ApplicationStatus.NEED_MORE_INFO)
_SUBMITTABLE_STATES = (ApplicationStatus.DRAFT, ApplicationStatus.NEED_MORE_INFO)
_DECISION_STATES = {
    ApplicationStatus.APPROVED,
    ApplicationStatus.REJECTED,
    ApplicationStatus.NEED_MORE_INFO,
}
_COMMENT_REQUIRED_FOR = {
    ApplicationStatus.REJECTED,
    ApplicationStatus.NEED_MORE_INFO,
}


def create_draft(payload: dict) -> Application:
    return Application.objects.create(**payload)


def update_draft(app: Application, payload: dict) -> Application:
    if app.status not in _EDITABLE_STATES:
        raise WorkflowError(
            "Only Draft or Need More Information applications can be edited."
        )
    for field, value in payload.items():
        setattr(app, field, value)
    app.save()
    return app


def submit(app: Application) -> Application:
    if app.status not in _SUBMITTABLE_STATES:
        raise WorkflowError(
            "Only Draft or Need More Information applications can be submitted."
        )
    app.status = ApplicationStatus.SUBMITTED
    app.submitted_at = timezone.now()
    app.save(update_fields=["status", "submitted_at", "updated_at"])
    return app


def start_review(app: Application) -> Application:
    if app.status != ApplicationStatus.SUBMITTED:
        raise WorkflowError(
            "Only Submitted applications can move to Under Review."
        )
    app.status = ApplicationStatus.UNDER_REVIEW
    app.save(update_fields=["status", "updated_at"])
    return app


def record_decision(
    app: Application, decision: str, comment: str = ""
) -> Application:
    if app.status != ApplicationStatus.UNDER_REVIEW:
        raise WorkflowError(
            "Only Under Review applications can receive a reviewer decision."
        )
    if decision not in _DECISION_STATES:
        raise WorkflowError("Invalid reviewer decision.")
    if decision in _COMMENT_REQUIRED_FOR and not (comment or "").strip():
        label = ApplicationStatus(decision).label
        raise WorkflowError(f"A reviewer comment is required for {label}.")

    app.status = decision
    app.reviewer_comment = comment
    app.reviewed_at = timezone.now()
    app.save(
        update_fields=["status", "reviewer_comment", "reviewed_at", "updated_at"]
    )
    return app
