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

    from . import api
    app.register_blueprint(api.bp)

    from . import homepage
    app.register_blueprint(homepage.bp)

    from . import auth
    app.register_blueprint(auth.bp)

    return app