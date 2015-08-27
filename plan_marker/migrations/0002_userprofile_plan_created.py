# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('plan_marker', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='userprofile',
            name='plan_created',
            field=models.DateField(null=True, blank=True),
        ),
    ]
