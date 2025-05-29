from pprint import pprint
from flask import Blueprint, jsonify, g
import neo4j
from gentree.utils import get_driver, login_required
from uuid import UUID
from pydantic import BaseModel, Field, model_validator


bp = Blueprint('api', __name__, url_prefix='<uuid:gentree_id>/api')


class FamilyMember(BaseModel):
    id: UUID
    firstname: str
    sex: str


class FamilyTree(BaseModel):
    uid: UUID = Field(alias='family_id')
    name: str = Field(alias='family_name')

    partners: list[FamilyMember]
    children: list[FamilyMember]

    @model_validator(mode='before')
    @classmethod
    def preprocess_input(cls, data):
        data_preprocessed = {
            'family_id' : data['family_id'],
            'family_name' : data['family_name'],
            'partners': [],
            'children': []
        }

        for member in data['members']:
            if member['family_status'] == 'partner':
                data_preprocessed['partners'].append(member)
            else:
                data_preprocessed['children'].append(member)
            
            del member['family_status']
        
        return data_preprocessed


@bp.url_value_preprocessor
def get_gentree_id(_, values):
    g.gentree_id = values.pop('gentree_id', None)
    g.family_tree_id = values.pop('family_tree_id', None)


@bp.route('/')
@bp.route('/<uuid:family_tree_id>', methods=['GET'])
@login_required
def get_family_tree():
    family_data = {}
    driver = get_driver()

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
