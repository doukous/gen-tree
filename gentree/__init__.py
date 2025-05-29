from flask import Flask
from dotenv import load_dotenv
from os import makedirs, getenv


def create_app(test_config=None):
    load_status = load_dotenv()

    if not load_status:
        raise RuntimeError("Failed to load dotenv file.")

    SECRET_KEY = getenv('SECRET_KEY')

    app = Flask(__name__)    
    app.config.from_mapping(
        SECRET_KEY=SECRET_KEY,
    )

    if test_config:
        app.config.from_pyfile('config.py', silent=True)
    else:
        app.config.from_mapping(test_config)

    try:
        makedirs(app.instance_path)
    except OSError:
        pass

    from . import user
    app.register_blueprint(user.bp)

    from . import auth
    app.register_blueprint(auth.bp)

    from . import gentree
    app.register_blueprint(gentree.bp)

    return app