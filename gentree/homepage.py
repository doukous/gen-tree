from flask import Blueprint, render_template
from gentree.utils import login_required


bp = Blueprint('homepage', __name__, url_prefix='/')


@bp.route("/", methods=['GET'])
@login_required
def home():
    return render_template('index.html')