import uuid

from django.db import models

from .enums import ApplicationStatus, ApplicationType
from .tracking import generate_tracking_number


class Application(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    tracking_number = models.CharField(
        max_length=32, unique=True, editable=False, blank=True
    )

    applicant_name = models.CharField(max_length=255)
    applicant_email = models.EmailField()
    company_name = models.CharField(max_length=255)
    application_type = models.CharField(
        max_length=32, choices=ApplicationType.choices
    )
    description = models.TextField(blank=True)

    status = models.CharField(
        max_length=32,
        choices=ApplicationStatus.choices,
        default=ApplicationStatus.DRAFT,
    )
    reviewer_comment = models.TextField(blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    submitted_at = models.DateTimeField(null=True, blank=True)
    reviewed_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["status"]),
            models.Index(fields=["application_type"]),
        ]

    def save(self, *args, **kwargs):
        if not self.tracking_number:
            for _ in range(5):
                candidate = generate_tracking_number()
                if not Application.objects.filter(tracking_number=candidate).exists():
                    self.tracking_number = candidate
                    break
            else:
                raise RuntimeError("could not generate a unique tracking number")
        super().save(*args, **kwargs)

    @property
    def is_editable(self) -> bool:
        return self.status in (
            ApplicationStatus.DRAFT,
            ApplicationStatus.NEED_MORE_INFO,
        )

    def __str__(self) -> str:
        return f"{self.tracking_number} ({self.get_status_display()})"
