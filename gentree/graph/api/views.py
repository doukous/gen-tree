from flask import jsonify, g
import neo4j
from gentree.utils import login_required
from gentree.db.neo_driver import db
from .schemas import FamilyTree
from . import api


@api.url_value_preprocessor
def get_gentree_id(_, values):
    g.gentree_id = values.pop('gentree_id', None)
    g.family_tree_id = values.pop('family_tree_id', None)


@api.route('/')
@api.route('/<uuid:family_tree_id>/', methods=['GET'])
@login_required
def get_family_tree():
    family_data = {}
    driver = db.driver

    if g.family_tree_id is None:
        result = driver.execute_query(
            'get_trees_of_gentree',
            result_transformer_=neo4j.Result.single,
            gentree_uid=str(g.gentree_id)
        )

    else:
        result = driver.execute_query(
            'get_tree_and_members',
            result_transformer_=neo4j.Result.single,
            gentree_uid=str(g.gentree_id),
            family_uid=str(g.family_tree_id).replace('-', '')
        )

    validated_data = FamilyTree(**result.data())
    family_data = validated_data.model_dump()

    return jsonify(family_data)
