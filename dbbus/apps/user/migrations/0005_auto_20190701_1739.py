# Generated by Django 2.2.2 on 2019-07-01 16:39

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('user', '0004_auto_20190627_0050'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='user_profile',
            field=models.ImageField(upload_to='avatar', verbose_name='user_image'),
        ),
    ]
