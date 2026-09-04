"""Django command to pause execution until PostgreSQL is available."""

import time
from django.core.management.base import BaseCommand
from django.db import connection
from django.db.utils import OperationalError

class Command(BaseCommand):
    help = 'Waits for PostgreSQL database to become available'

    def handle(self, *args, **options):
        self.stdout.write('Checking PostgreSQL database connection...')
        db_up = False
        attempts = 0
        while not db_up and attempts < 30:
            try:
                connection.ensure_connection()
                db_up = True
            except OperationalError:
                attempts += 1
                self.stdout.write(f'PostgreSQL unavailable, waiting 1 second ({attempts}/30)...')
                time.sleep(1)

        if db_up:
            self.stdout.write(self.style.SUCCESS('PostgreSQL is ready!'))
        else:
            self.stdout.write(self.style.ERROR('PostgreSQL connection timed out.'))
