from flask import g, render_template
import neo4j
from gentree.utils import login_required
from gentree.db.neo_driver import db
from . import main


@main.route('/user/', methods=['GET'])
@login_required
def user_home():
    user_id = g.user_id
    result = db.run_query(
        'get_user_available_gentrees',
        result_transformer_=neo4j.Result.single,
        uid=user_id
    )

    user_firstname = result['firstname']

    user_gentrees = [
        {'id': gentree['id'], 'title': gentree['title']}
        for gentree in result['gentrees']
    ]

    return render_template('main/index.html', firstname=user_firstname, gentrees=user_gentrees)
