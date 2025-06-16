from gentree import create_app
from whitenoise import WhiteNoise

app = create_app()
app.wsgi_app = WhiteNoise(app.wsgi_app, root='gentree/static/', prefix='static')
