# Generated by Django 2.2.2 on 2019-06-25 13:15

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('user', '0001_initial'),
    ]

    operations = [
        migrations.AlterModelManagers(
            name='user',
            managers=[
            ],
        ),
        migrations.RemoveField(
            model_name='user',
            name='date_joined',
        ),
        migrations.RemoveField(
            model_name='user',
            name='email',
        ),
        migrations.RemoveField(
            model_name='user',
            name='first_name',
        ),
        migrations.RemoveField(
            model_name='user',
            name='groups',
        ),
        migrations.RemoveField(
            model_name='user',
            name='is_staff',
        ),
        migrations.RemoveField(
            model_name='user',
            name='is_superuser',
        ),
        migrations.RemoveField(
            model_name='user',
            name='last_login',
        ),
        migrations.RemoveField(
            model_name='user',
            name='last_name',
        ),
        migrations.RemoveField(
            model_name='user',
            name='password',
        ),
        migrations.RemoveField(
            model_name='user',
            name='user_permissions',
        ),
        migrations.RemoveField(
            model_name='user',
            name='username',
        ),
        migrations.AddField(
            model_name='user',
            name='user_email',
            field=models.CharField(default='', max_length=255, unique=True, verbose_name='user_email'),
        ),
        migrations.AddField(
            model_name='user',
            name='user_name',
            field=models.CharField(default='', max_length=255, verbose_name='user_name'),
        ),
        migrations.AlterField(
            model_name='user',
            name='is_active',
            field=models.IntegerField(choices=[(0, 'not activated'), (1, 'activated')], default=0, verbose_name='is_active'),
        ),
        migrations.AlterField(
            model_name='userbusnumber',
            name='bus_number_user',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='user.User'),
        ),
        migrations.AlterField(
            model_name='userroute',
            name='route_end',
            field=models.CharField(max_length=50, verbose_name='route_end'),
        ),
        migrations.AlterField(
            model_name='userroute',
            name='route_start',
            field=models.CharField(max_length=50, verbose_name='route_start'),
        ),
        migrations.AlterField(
            model_name='userroute',
            name='route_user',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='user.User'),
        ),
        migrations.AlterField(
            model_name='userstop',
            name='station_user',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='user.User'),
        ),
        migrations.AlterField(
            model_name='userstop',
            name='stop',
            field=models.IntegerField(unique=True, verbose_name='favorite_stop'),
        ),
    ]
