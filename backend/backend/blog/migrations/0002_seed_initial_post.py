from django.db import migrations
from django.utils import timezone


def seed_initial_blog_post(apps, schema_editor):
    BlogPost = apps.get_model('blog', 'BlogPost')

    BlogPost.objects.get_or_create(
        slug='primeras-historias-de-fundacion-mtm',
        defaults={
            'title': 'Primeras historias del Blog Fundación MTM',
            'summary': (
                'Un espacio para contar actividades, aprendizajes e historias reales '
                'de las familias, voluntarios y aliados que hacen parte de la fundación.'
            ),
            'content': (
                'El Blog de Fundación MTM nace como un espacio para compartir de manera '
                'cercana el trabajo que realizamos en la Orinoquía. Aquí publicaremos '
                'historias de acompañamiento, jornadas solidarias, aprendizajes de nuestros '
                'programas y noticias institucionales.\n\n'
                'Este primer artículo funciona como publicación de prueba para validar el '
                'diseño público y el flujo administrativo. Desde el panel se podrá editar '
                'el contenido, cambiar la imagen principal, dejar publicaciones en borrador '
                'o publicarlas cuando estén listas.'
            ),
            'image_url': 'https://res.cloudinary.com/djee0c2fs/image/upload/f_auto,q_auto,w_1200/v1779826037/DSC01937_arqymg.jpg',
            'image_public_id': 'DSC01937_arqymg',
            'image_alt': 'Equipo y comunidad de Fundación MTM',
            'published_at': timezone.now(),
            'status': 'published',
            'is_active': True,
        },
    )


def remove_initial_blog_post(apps, schema_editor):
    BlogPost = apps.get_model('blog', 'BlogPost')
    BlogPost.objects.filter(slug='primeras-historias-de-fundacion-mtm').delete()


class Migration(migrations.Migration):

    dependencies = [
        ('blog', '0001_initial'),
    ]

    operations = [
        migrations.RunPython(seed_initial_blog_post, remove_initial_blog_post),
    ]
