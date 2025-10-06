from flask import Blueprint


api = Blueprint('api', __name__, url_prefix='<uuid:gentree_id>/api')

from . import views