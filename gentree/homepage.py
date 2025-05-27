from flask import Blueprint, g, render_template, session
from gentree.utils import login_required


bp = Blueprint('homepage', __name__, url_prefix='/')

@bp.before_request
def load_logged_user():
    username = session.get('username')
    if username is not None:
        g.username = username
    else:
        g.username = None

@bp.route("/", methods=['GET'])
@login_required
def home():
    username = g.username
    return render_template('index.html', username=username)