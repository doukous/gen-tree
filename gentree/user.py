from flask import Blueprint, g, render_template, session
from gentree.utils import get_driver, login_required


bp = Blueprint('user', __name__, url_prefix='/user')

@bp.before_request
def load_logged_user():
    user_id = session.get('user_id')
    if user_id is not None:
        g.user_id = user_id
    else:
        g.user_id = None

@bp.route("/", methods=['GET'])
@login_required
def home():
    user_id = g.user_id
    driver = get_driver()

    records, _, _ = driver.execute_query(
        """
        MATCH (p: Person {uid: $uid})
        MATCH (p) -[:HAS_ACCESS_TO]-> (g: GenealogicalTree)
        RETURN p.firstname AS firstname, g.uid AS uid, g.title AS title
        """,
        database_='gentree',
        uid=user_id
    )

    user_firstname = records[0]['firstname']

    user_gen_trees = [
        {'id': record['uid'], 'title': record['title']} 
        for record in records
    ]

    return render_template('index.html', firstname=user_firstname, gentrees=user_gen_trees)