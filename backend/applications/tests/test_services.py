import re

import pytest

from applications import services
from applications.enums import ApplicationStatus, ApplicationType
from applications.exceptions import WorkflowError

_TRACKING_FORMAT = re.compile(r"^APP-\d{6}-[A-Z0-9]{6}$")

pytestmark = pytest.mark.django_db


def _payload(**overrides):
    base = {
        "applicant_name": "Test User",
        "applicant_email": "test@example.com",
        "company_name": "Test Co",
        "application_type": ApplicationType.RENEWAL,
        "description": "",
    }
    base.update(overrides)
    return base


# ---------- creation + tracking ----------

def test_create_draft_starts_in_draft_with_tracking_number():
    app = services.create_draft(_payload())
    assert app.status == ApplicationStatus.DRAFT
    assert _TRACKING_FORMAT.match(app.tracking_number), app.tracking_number


def test_tracking_numbers_are_unique():
    a = services.create_draft(_payload(applicant_email="a@x.com"))
    b = services.create_draft(_payload(applicant_email="b@x.com"))
    assert a.tracking_number != b.tracking_number


# ---------- update_draft ----------

def test_update_draft_succeeds(draft):
    services.update_draft(draft, {"company_name": "renamed co"})
    draft.refresh_from_db()
    assert draft.company_name == "renamed co"


def test_update_nmi_succeeds(nmi):
    services.update_draft(nmi, {"description": "now with bank statements"})
    nmi.refresh_from_db()
    assert nmi.description == "now with bank statements"


@pytest.mark.parametrize(
    "state_fixture", ["submitted", "under_review", "approved", "rejected"]
)
def test_update_raises_on_non_editable_states(request, state_fixture):
    app = request.getfixturevalue(state_fixture)
    with pytest.raises(WorkflowError, match="can be edited"):
        services.update_draft(app, {"company_name": "should not change"})


# ---------- submit ----------

def test_submit_sets_status_and_submitted_at(draft):
    assert draft.submitted_at is None
    services.submit(draft)
    draft.refresh_from_db()
    assert draft.status == ApplicationStatus.SUBMITTED
    assert draft.submitted_at is not None


@pytest.mark.parametrize(
    "state_fixture", ["submitted", "under_review", "approved", "rejected"]
)
def test_submit_raises_on_non_submittable_states(request, state_fixture):
    app = request.getfixturevalue(state_fixture)
    with pytest.raises(WorkflowError, match="can be submitted"):
        services.submit(app)


def test_resubmit_from_nmi_updates_submitted_at(nmi):
    original = nmi.submitted_at
    services.submit(nmi)
    nmi.refresh_from_db()
    assert nmi.status == ApplicationStatus.SUBMITTED
    assert nmi.submitted_at >= original


# ---------- start_review ----------

def test_start_review_from_submitted_succeeds(submitted):
    services.start_review(submitted)
    submitted.refresh_from_db()
    assert submitted.status == ApplicationStatus.UNDER_REVIEW


@pytest.mark.parametrize(
    "state_fixture", ["draft", "under_review", "approved", "rejected", "nmi"]
)
def test_start_review_raises_on_other_states(request, state_fixture):
    app = request.getfixturevalue(state_fixture)
    with pytest.raises(WorkflowError, match="move to Under Review"):
        services.start_review(app)


# ---------- record_decision ----------

def test_record_decision_approved_does_not_require_comment(under_review):
    services.record_decision(under_review, ApplicationStatus.APPROVED)
    under_review.refresh_from_db()
    assert under_review.status == ApplicationStatus.APPROVED
    assert under_review.reviewed_at is not None
    assert under_review.reviewer_comment == ""


def test_record_decision_rejected_without_comment_raises(under_review):
    with pytest.raises(WorkflowError, match="comment is required"):
        services.record_decision(under_review, ApplicationStatus.REJECTED, comment="")


def test_record_decision_nmi_without_comment_raises(under_review):
    with pytest.raises(WorkflowError, match="comment is required"):
        services.record_decision(
            under_review, ApplicationStatus.NEED_MORE_INFO, comment="   "
        )


@pytest.mark.parametrize(
    "state_fixture", ["draft", "submitted", "approved", "rejected", "nmi"]
)
def test_record_decision_raises_on_non_under_review(request, state_fixture):
    app = request.getfixturevalue(state_fixture)
    with pytest.raises(WorkflowError, match="can receive a reviewer decision"):
        services.record_decision(app, ApplicationStatus.APPROVED)


def test_record_decision_invalid_value_raises(under_review):
    with pytest.raises(WorkflowError, match="Invalid reviewer decision"):
        services.record_decision(under_review, "BANANA")
