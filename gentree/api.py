from flask import Blueprint
from gentree.utils import get_driver


bp = Blueprint('api', __name__, url_prefix='/api')


@bp.route('families', methods=['GET'])
def get_family_members():
    driver = get_driver()

    records, _, _ = driver.execute_query(
        """
        MATCH (f:FamilyTree) 
        RETURN f.uid AS uid, f.name AS name
        """,
        database_="gentree"
    )

    data = [record.data() for record in records]

    return data


@bp.route('genealogical-trees', methods=['GET'])
def get_genealogical_trees():
    pass