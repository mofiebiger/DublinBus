# Generated by Django 2.2.2 on 2019-07-02 17:41

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('user', '0006_auto_20190701_1902'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='user_profile',
            field=models.ImageField(default='default.jpg', upload_to='avatar', verbose_name='user_image'),
        ),
    ]
