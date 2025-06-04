from flask import flash, g, redirect, render_template, request
import neo4j
from gentree.gentree_viz.forms import Choices, FamilyTreeForm
from gentree.utils import login_required
from . import genviz
from gentree.db import db


@genviz.route('/<uuid:gentree_id>/', methods=['GET'])
@login_required
def get_tree(gentree_id):
    driver = db.driver
    user_id = g.user_id

    access_right = driver.execute_query(
        """
        MATCH (:Person { uid: $person_id }) -[r:HAS_ACCESS_TO]-> (:GenealogicalTree { uid: $gentree_id })
        RETURN r.status AS status
        """,
        database_= 'gentree',
        result_transformer_=neo4j.Result.single,
        gentree_id=str(gentree_id),
        person_id=str(user_id)
    )

    if access_right['status'] is None:
        flash("Cannot load the Genealogical Tree.", 'access_denial')
        return redirect('user.home')

    else:
        return render_template('gentree_viz/index.html', gentree_id=gentree_id, status=access_right['status'])


@genviz.route('/<uuid:gentree_id>/family-trees', methods=['GET', 'POST'])
def new_family_tree(gentree_id):
    if request.method == 'GET':    
        form = FamilyTreeForm()
        male_existing_people = Choices.get_people_choices(gentree_id, sex='male')
        women_existing_people = Choices.get_people_choices(gentree_id, sex='female')
        
        form.male_existing_choices.choices = male_existing_people
        form.female_existing_choices.choices = women_existing_people

        return render_template('gentree_viz/forms/new-family-form.html', gentree_id=gentree_id, form=form)

    else:
        pass
