from flask import Blueprint
from gentree.utils import load_logged_user


main = Blueprint('user', __name__)
main.before_request(load_logged_user)

from . import views