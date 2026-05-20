from django.db import models


class ApplicationStatus(models.TextChoices):
    DRAFT = "DRAFT", "Draft"
    SUBMITTED = "SUBMITTED", "Submitted"
    UNDER_REVIEW = "UNDER_REVIEW", "Under Review"
    NEED_MORE_INFO = "NEED_MORE_INFO", "Need More Information"
    APPROVED = "APPROVED", "Approved"
    REJECTED = "REJECTED", "Rejected"


class ApplicationType(models.TextChoices):
    RECORDATION = "RECORDATION", "Recordation"
    RENEWAL = "RENEWAL", "Renewal"
    CHANGE_OF_OWNERSHIP = "CHANGE_OF_OWNERSHIP", "Change of Ownership"
    CHANGE_OF_NAME = "CHANGE_OF_NAME", "Change of Name"
    DISCONTINUATION = "DISCONTINUATION", "Discontinuation"
