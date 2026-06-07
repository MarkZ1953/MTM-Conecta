from django.core.management.base import BaseCommand, CommandError

from news.services import InstagramSyncError, sync_instagram_posts


class Command(BaseCommand):
    help = "Sincroniza publicaciones recientes de Instagram desde Meta Graph API."

    def handle(self, *args, **options):
        try:
            result = sync_instagram_posts()
        except InstagramSyncError as exc:
            raise CommandError(str(exc)) from exc

        self.stdout.write(
            self.style.SUCCESS(
                f"Instagram sincronizado: {result['created']} creadas, "
                f"{result['updated']} actualizadas, {result['total']} recibidas."
            )
        )
