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
                applicant_name="John Mwangi",
                applicant_email="john@mwangihardware.example",
                company_name="Mwangi Hardware",
                application_type=ApplicationType.RECORDATION,
                description="First time recordation of the hardware shop.",
                status=ApplicationStatus.DRAFT,
            ),
            dict(
                applicant_name="Grace Wanjiru",
                applicant_email="grace@wanjirusalon.example",
                company_name="Wanjiru Salon and Spa",
                application_type=ApplicationType.RENEWAL,
                description="Annual renewal of the trading licence.",
                status=ApplicationStatus.SUBMITTED,
                submitted_at=now,
            ),
            dict(
                applicant_name="David Kiplagat",
                applicant_email="david@highlandcoffee.example",
                company_name="Highland Coffee Traders",
                application_type=ApplicationType.CHANGE_OF_NAME,
                description="Renaming the business to reflect the new shop premises.",
                status=ApplicationStatus.UNDER_REVIEW,
                submitted_at=now,
            ),
            dict(
                applicant_name="Mary Achieng",
                applicant_email="mary@achiengtailors.example",
                company_name="Achieng Tailors",
                application_type=ApplicationType.CHANGE_OF_OWNERSHIP,
                description=(
                    "Moving from sole proprietorship to a partnership with two new partners."
                ),
                status=ApplicationStatus.NEED_MORE_INFO,
                reviewer_comment=(
                    "Please attach the updated partnership agreement and the KRA PIN for each partner."
                ),
                submitted_at=now,
                reviewed_at=now,
            ),
            dict(
                applicant_name="Peter Otieno",
                applicant_email="peter@otienoautospares.example",
                company_name="Otieno Auto Spares",
                application_type=ApplicationType.RECORDATION,
                description="Recordation of the auto spares shop in Kisumu.",
                status=ApplicationStatus.APPROVED,
                submitted_at=now,
                reviewed_at=now,
            ),
            dict(
                applicant_name="Susan Wambui",
                applicant_email="susan@wambuiboutique.example",
                company_name="Wambui Boutique",
                application_type=ApplicationType.DISCONTINUATION,
                description="Closing down the boutique due to relocation.",
                status=ApplicationStatus.REJECTED,
                reviewer_comment=(
                    "Outstanding tax obligations must be cleared before discontinuation can be processed."
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
