# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('plan_marker', '0002_userprofile_plan_created'),
    ]

    operations = [
        migrations.AlterField(
            model_name='userprofile',
            name='plan_created',
            field=models.CharField(max_length=255, null=True, blank=True),
        ),
    ]
