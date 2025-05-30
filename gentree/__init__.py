from flask import Flask
from dotenv import load_dotenv
from os import getenv
from .db import neo4j_driver

def create_app(test_config=None):
    load_status = load_dotenv()

    if not load_status:
        raise RuntimeError("Failed to load dotenv file.")

    SECRET_KEY = getenv('SECRET_KEY')

    app = Flask(__name__)    
    app.config.from_mapping(
        SECRET_KEY=SECRET_KEY,
        URI = getenv('NEO4J_URI'),
        AUTH = (getenv('NEO4J_AUTH_USERNAME'), getenv('NEO4J_AUTH_PASSWORD')),
    )

    neo4j_driver.init_app(app)

    from .main import main as main_blueprint
    app.register_blueprint(main_blueprint, url_prefix='/')

    from .auth import auth as auth_blueprint
    app.register_blueprint(auth_blueprint)

    from .gentree_viz import genviz as gentree_viz_blueprint
    app.register_blueprint(gentree_viz_blueprint)

    return app