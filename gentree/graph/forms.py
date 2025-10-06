from flask_wtf import FlaskForm
from wtforms import FieldList, FormField, SelectMultipleField, StringField, DateField, SelectField
from wtforms.validators import DataRequired
from wtforms import Form
from gentree.db.neo_driver import db
from gentree.graph.schemas import FamilyChoice


class Choices:
    @classmethod
    def get_people_choices(cls, gentree_id, sex=None):
        results = None

        if sex:
            results, _, _ = db.run_query(
                'get_choices_by_sex',
                uid=str(gentree_id),
                sex=sex
            )

        else:
            results, _, _ = db.run_query(
                'get_all_choices',
                uid=str(gentree_id)
            )

        data = [
            FamilyChoice.model_validate(result.data())
            for result in results
        ]

        choices = {
            'default': [('', 'Select an option')],
        }

        for result in data:
            (key, value), = result.model_dump().items()
            choices[key] = value

        return choices


class PersonForm(Form):
    firstname = StringField('Firstname')
    birth_date = DateField('Birth date')


class ChildrenForm(PersonForm):
    SEX_CHOICES = [('male', 'Male'), ('female', 'Female')]
    sex = SelectField('Sex', choices=SEX_CHOICES)


class PartnerForm(PersonForm):
    family_choice = SelectField('Family choice')
    partner_choice = SelectField('Choosen partner', choices=[])


class FamilyTreeForm(FlaskForm):
    name = StringField('Family name', validators=[DataRequired()])

    male_existing_choices = SelectField('Choices')
    female_existing_choices = SelectField('Choices')
    children_choices = SelectMultipleField('Choices')

    new_male_partner = FormField(PersonForm)
    new_female_partner = FormField(PersonForm)
    new_children = FieldList(FormField(ChildrenForm))
