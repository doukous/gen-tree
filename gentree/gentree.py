from flask import Blueprint, flash, g, redirect, render_template
import neo4j
from gentree.utils import get_driver, login_required, load_logged_user


bp = Blueprint('gentree', __name__, url_prefix='/gen-tree')

from . import api
bp.register_blueprint(api.bp)

bp.before_request(load_logged_user)


@bp.route('/<uuid:gentree_id>/', methods=['GET'])
@login_required
def get_tree(gentree_id):
    driver = get_driver()
    user_id = g.user_id

    access_right = driver.execute_query(
        """
        MATCH (: Person { uid: $person_id }) -[r:HAS_ACCESS_TO]-> (: GenealogicalTree { uid: $gentree_id })
        RETURN r.status AS status
        """,
        database_= 'gentree',
        result_transformer_=neo4j.Result.single,
        gentree_id=str(gentree_id),
        person_id=str(user_id)
    )

    if access_right['status'] is None:
        flash("You don't have access to this Genealogical Tree.", 'access_denial')
        return redirect('user.home')

    else:
        return render_template('gentree.html', status=access_right['status'])