import secrets
import string

from django.utils import timezone

_ALPHABET = string.ascii_uppercase + string.digits


def generate_tracking_number() -> str:
    suffix = "".join(secrets.choice(_ALPHABET) for _ in range(6))
    return f"APP-{timezone.now():%Y%m}-{suffix}"
