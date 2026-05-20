from datetime import datetime
from typing import Literal
from uuid import UUID

from ninja import Schema
from pydantic import EmailStr

from .enums import ApplicationType


class ApplicationCreateIn(Schema):
    applicant_name: str
    applicant_email: EmailStr
    company_name: str
    application_type: ApplicationType
    description: str = ""


class ApplicationUpdateIn(Schema):
    applicant_name: str | None = None
    applicant_email: EmailStr | None = None
    company_name: str | None = None
    application_type: ApplicationType | None = None
    description: str | None = None


class DecisionIn(Schema):
    decision: Literal["APPROVED", "REJECTED", "NEED_MORE_INFO"]
    comment: str = ""


class ApplicationListItem(Schema):
    id: UUID
    tracking_number: str
    applicant_name: str
    company_name: str
    application_type: str
    status: str
    created_at: datetime


class ApplicationOut(Schema):
    id: UUID
    tracking_number: str
    applicant_name: str
    applicant_email: str
    company_name: str
    application_type: str
    description: str
    status: str
    reviewer_comment: str
    created_at: datetime
    updated_at: datetime
    submitted_at: datetime | None
    reviewed_at: datetime | None
