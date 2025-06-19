from livereload import Server
from gentree import create_app


app = create_app()
app.debug = True


if __name__ == "__main__":
    server = Server(app.wsgi_app)

    server.watch('gentree/templates/')
    server.watch('gentree/static/')

    server.serve(port=5000, host='0.0.0.0')
