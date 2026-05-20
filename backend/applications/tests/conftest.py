import pytest
from django.utils import timezone

from applications.enums import ApplicationStatus, ApplicationType
from applications.models import Application


@pytest.fixture
def draft(db):
    return Application.objects.create(
        applicant_name="Wangari Maathai",
        applicant_email="wm@example.com",
        company_name="Green Belt Movement",
        application_type=ApplicationType.RECORDATION,
        description="initial draft",
    )


@pytest.fixture
def submitted(draft):
    draft.status = ApplicationStatus.SUBMITTED
    draft.submitted_at = timezone.now()
    draft.save(update_fields=["status", "submitted_at"])
    return draft


@pytest.fixture
def under_review(submitted):
    submitted.status = ApplicationStatus.UNDER_REVIEW
    submitted.save(update_fields=["status"])
    return submitted


@pytest.fixture
def approved(under_review):
    under_review.status = ApplicationStatus.APPROVED
    under_review.reviewed_at = timezone.now()
    under_review.save(update_fields=["status", "reviewed_at"])
    return under_review


@pytest.fixture
def rejected(under_review):
    under_review.status = ApplicationStatus.REJECTED
    under_review.reviewer_comment = "missing supporting documents"
    under_review.reviewed_at = timezone.now()
    under_review.save(
        update_fields=["status", "reviewer_comment", "reviewed_at"]
    )
    return under_review


@pytest.fixture
def nmi(under_review):
    under_review.status = ApplicationStatus.NEED_MORE_INFO
    under_review.reviewer_comment = "please include bank statements"
    under_review.reviewed_at = timezone.now()
    under_review.save(
        update_fields=["status", "reviewer_comment", "reviewed_at"]
    )
    return under_review
