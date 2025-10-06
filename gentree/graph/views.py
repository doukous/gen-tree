from flask import flash, g, redirect, render_template, request
import neo4j
from gentree.graph.forms import Choices, FamilyTreeForm
from gentree.utils import login_required
from . import graph
from gentree.db.neo_driver import db
from pprint import pprint


@graph.route('/<uuid:gentree_id>/', methods=['GET'])
@login_required
def get_tree(gentree_id):
    user_id = g.user_id

    access_right = db.run_query(
        'get_user_status',
        result_transformer_=neo4j.Result.single,
        gentree_id=str(gentree_id),
        person_id=str(user_id)
    )

    if access_right['status'] is None:
        flash("Cannot load the Genealogical Tree.", 'access_denial')
        return redirect('user.home')

    else:
        return render_template('graph/index.html', gentree_id=gentree_id, status=access_right['status'])


@graph.route('/<uuid:gentree_id>/family-trees', methods=['GET', 'POST'])
@login_required
def new_family_tree(gentree_id):
    if request.method == 'GET':
        male_existing_people = Choices.get_people_choices(gentree_id, sex='male')
        women_existing_people = Choices.get_people_choices(gentree_id, sex='female')
        existing_people = Choices.get_people_choices(gentree_id)

        form = FamilyTreeForm()

        form.male_existing_choices.choices = male_existing_people
        form.female_existing_choices.choices = women_existing_people
        form.children_choices.choices = existing_people

        return render_template('graph/forms/new-family-form.html', gentree_id=gentree_id, form=form)

    else:
        male_existing_people = Choices.get_people_choices(gentree_id, sex='male')
        women_existing_people = Choices.get_people_choices(gentree_id, sex='female')
        existing_people = Choices.get_people_choices(gentree_id)

        form = FamilyTreeForm(request.form)

        form.male_existing_choices.choices = male_existing_people
        form.female_existing_choices.choices = women_existing_people
        form.children_choices.choices = existing_people

        if form.validate():
            pprint(form.name.data)
        else:
            pprint(form.errors)

        return render_template('graph/forms/form-successfully-created.html')
