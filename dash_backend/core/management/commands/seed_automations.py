from django.core.management.base import BaseCommand

from core.seed_data import seed_automations


class Command(BaseCommand):
    help = 'Seed initial automations data.'

    def add_arguments(self, parser):
        parser.add_argument(
            '--force',
            action='store_true',
            help='Delete existing data before seeding.',
        )

    def handle(self, *args, **options):
        created = seed_automations(force=options['force'])
        if created == 0:
            self.stdout.write(self.style.WARNING('Automations already exist. Use --force to reseed.'))
            return
        self.stdout.write(self.style.SUCCESS(f'Seeded {created} automations.'))
