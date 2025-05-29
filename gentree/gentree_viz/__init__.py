from flask import Blueprint
from gentree.utils import load_logged_user

from .api import api as api_blueprint

genviz = Blueprint('gentree_viz', __name__, url_prefix='/gen-tree')
genviz.register_blueprint(api_blueprint)

genviz.before_request(load_logged_user)

from . import views
