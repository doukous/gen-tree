from flask import g, render_template
import neo4j
from gentree.utils import login_required
from gentree.db import db
from . import main


@main.route('/user/', methods=['GET'])
@login_required
def user_home():
    user_id = g.user_id
    driver = db.get_driver()

    result = driver.execute_query(
        """
        MATCH (p: Person { uid: $uid })
        CALL (p) {
            MATCH (p)-[:HAS_ACCESS_TO]->(g: GenealogicalTree)
            RETURN collect({
                id: g.uid,
                title: g.title
            }) AS gentrees            
        }
        RETURN p.firstname AS firstname, p.uid AS id, gentrees
        """,
        database_='gentree',
        result_transformer_=neo4j.Result.single,
        uid=user_id
    )

    user_firstname = result['firstname']

    user_gentrees = [
        {'id': gentree['id'], 'title': gentree['title']} 
        for gentree in result['gentrees']
    ]

    return render_template('main/index.html', firstname=user_firstname, gentrees=user_gentrees)