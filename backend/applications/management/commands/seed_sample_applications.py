from django.core.management.base import BaseCommand
from django.utils import timezone

from applications.enums import ApplicationStatus, ApplicationType
from applications.models import Application


class Command(BaseCommand):
    help = (
        "Create one sample Application per status for demos and screenshots. "
        "Idempotent: skips if applications already exist, unless --force is passed."
    )

    def add_arguments(self, parser):
        parser.add_argument(
            "--force",
            action="store_true",
            help="Delete existing applications and reseed from scratch.",
        )

    def handle(self, *args, **options):
        if Application.objects.exists() and not options["force"]:
            self.stdout.write(
                self.style.WARNING(
                    "Applications already exist. Run with --force to wipe and reseed."
                )
            )
            return

        deleted, _ = Application.objects.all().delete()
        now = timezone.now()

        samples = [
            dict(
                applicant_name="Wangari Maathai",
                applicant_email="wangari@greenbelt.example",
                company_name="Green Belt Movement",
                application_type=ApplicationType.RECORDATION,
                description=(
                    "Recordation for the environmental advocacy programmes "
                    "we run across the country."
                ),
                status=ApplicationStatus.DRAFT,
            ),
            dict(
                applicant_name="Tom Mboya",
                applicant_email="tom@africanaffairs.example",
                company_name="African Affairs Ltd",
                application_type=ApplicationType.RENEWAL,
                description="Annual renewal of operating permits and licences.",
                status=ApplicationStatus.SUBMITTED,
                submitted_at=now,
            ),
            dict(
                applicant_name="Lupita Nyong'o",
                applicant_email="lupita@yalafilm.example",
                company_name="Yala Film Productions",
                application_type=ApplicationType.CHANGE_OF_NAME,
                description="Renaming the production company to reflect new branding.",
                status=ApplicationStatus.UNDER_REVIEW,
                submitted_at=now,
            ),
            dict(
                applicant_name="Eliud Kipchoge",
                applicant_email="eliud@ngongmar.example",
                company_name="Ngong Marathon Co",
                application_type=ApplicationType.CHANGE_OF_OWNERSHIP,
                description=(
                    "Transfer of ownership to new shareholders following "
                    "internal restructuring."
                ),
                status=ApplicationStatus.NEED_MORE_INFO,
                reviewer_comment=(
                    "Please provide the updated shareholder agreement and a "
                    "current tax compliance certificate."
                ),
                submitted_at=now,
                reviewed_at=now,
            ),
            dict(
                applicant_name="Mekatilili Wa Menza",
                applicant_email="mekatilili@coastal.example",
                company_name="Coastal Heritage Trust",
                application_type=ApplicationType.RECORDATION,
                description=(
                    "Recordation of the historical site preservation programme "
                    "along the coast."
                ),
                status=ApplicationStatus.APPROVED,
                submitted_at=now,
                reviewed_at=now,
            ),
            dict(
                applicant_name="Dedan Kimathi",
                applicant_email="dedan@nyandarua.example",
                company_name="Nyandarua Highlands Ltd",
                application_type=ApplicationType.DISCONTINUATION,
                description="Discontinuation of dormant business operations.",
                status=ApplicationStatus.REJECTED,
                reviewer_comment=(
                    "Outstanding tax obligations must be cleared before "
                    "discontinuation can be processed."
                ),
                submitted_at=now,
                reviewed_at=now,
            ),
        ]

        for data in samples:
            Application.objects.create(**data)

        if deleted:
            self.stdout.write(
                self.style.SUCCESS(
                    f"Cleared {deleted} existing application(s) and created "
                    f"{len(samples)} samples."
                )
            )
        else:
            self.stdout.write(
                self.style.SUCCESS(f"Created {len(samples)} sample applications.")
            )
        for app in Application.objects.order_by("status"):
            self.stdout.write(
                f"  {app.tracking_number}  "
                f"{app.get_status_display():22}  {app.applicant_name}"
            )
