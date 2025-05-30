from flask import jsonify, g
import neo4j
from gentree.utils import login_required
from gentree.db import neo4j_driver
from .schemas import FamilyTree
from . import api


@api.url_value_preprocessor
def get_gentree_id(_, values):
    g.gentree_id = values.pop('gentree_id', None)
    g.family_tree_id = values.pop('family_tree_id', None)


@api.route('/')
@api.route('/<uuid:family_tree_id>', methods=['GET'])
@login_required
def get_family_tree():
    family_data = {}
    driver = neo4j_driver.get_driver()

    if g.family_tree_id is None:
        result = driver.execute_query(
            """
            MATCH  (f: FamilyTree) -[r:IS_ROOT_OF]-> (:GenealogicalTree { uid: $gentree_uid })
            CALL (f) {
                MATCH (p: Person)-[r:IS_MEMBER_OF]->(f)
                RETURN collect({
                    id: p.uid, 
                    firstname: p.firstname,
                    sex: p.sex,
                    family_status: r.status
                }) as members
            }
            RETURN f.name AS family_name, f.uid AS family_id, members
            """,
            database_='gentree',
            result_transformer_=neo4j.Result.single,
            gentree_uid=str(g.gentree_id)
        )
    
    else:
        result = driver.execute_query(
            """
            MATCH  (f: FamilyTree { uid: $family_uid }) -[r:BEYOND_TO]-> (:GenealogicalTree { uid: $gentree_uid })
            CALL (f) {
                MATCH (p: Person)-[r:IS_MEMBER_OF]->(f)
                RETURN collect({
                    id: p.uid, 
                    firstname: p.firstname,
                    sex: p.sex,
                    family_status: r.status
                }) as members
            }
            RETURN f.name AS family_name, f.uid AS family_id, members
            """,
            database_='gentree',
            result_transformer_=neo4j.Result.single,
            gentree_uid=str(g.gentree_id),
            family_uid=str(g.family_tree_id)
        )

    validated_data = FamilyTree(**result.data())
    family_data = validated_data.model_dump()

    return jsonify(family_data)
