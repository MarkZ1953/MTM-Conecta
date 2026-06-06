from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='BlogPost',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(auto_now_add=True, db_index=True, editable=False)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('is_active', models.BooleanField(db_index=True, default=True)),
                ('title', models.CharField(max_length=220)),
                ('slug', models.SlugField(db_index=True, max_length=240, unique=True)),
                ('summary', models.TextField(max_length=520)),
                ('content', models.TextField()),
                ('image_url', models.URLField(blank=True, default='', max_length=500)),
                ('image_public_id', models.CharField(blank=True, default='', max_length=255)),
                ('image_alt', models.CharField(blank=True, default='', max_length=220)),
                ('published_at', models.DateTimeField(blank=True, db_index=True, null=True)),
                ('status', models.CharField(choices=[('draft', 'Borrador'), ('published', 'Publicado')], db_index=True, default='draft', max_length=20)),
            ],
            options={
                'verbose_name': 'Blog post',
                'verbose_name_plural': 'Blog posts',
                'db_table': 'blog_posts',
                'ordering': ['-published_at', '-created_at'],
            },
        ),
    ]

