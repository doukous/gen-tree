from flask import Blueprint
from gentree.utils import load_logged_user

from .api import api as api_blueprint

graph = Blueprint('graph', __name__, url_prefix='/gen-tree')
graph.register_blueprint(api_blueprint)

graph.before_request(load_logged_user)

from . import views
