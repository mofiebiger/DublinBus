# Generated by Django 2.2.2 on 2019-06-26 10:55

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('user', '0002_auto_20190625_1315'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='user_password',
            field=models.CharField(default='', max_length=255, unique=True, verbose_name='user_password'),
        ),
    ]