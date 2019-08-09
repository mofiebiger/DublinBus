# Generated by Django 2.2.3 on 2019-07-31 15:15

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('prediction', '0004_auto_20190717_0038'),
    ]

    operations = [
        migrations.CreateModel(
            name='BusRouteNumber',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('route', models.CharField(max_length=10, verbose_name='route')),
                ('origin', models.CharField(max_length=50, verbose_name='origin')),
                ('destination', models.CharField(max_length=50, verbose_name='destination')),
                ('stops', models.CharField(max_length=2000, verbose_name='stops')),
                ('stop_number', models.IntegerField(verbose_name='stop_number')),
            ],
            options={
                'verbose_name': 'bus_route',
                'verbose_name_plural': 'bus_route',
                'db_table': 'bus_route',
            },
        ),
    ]
