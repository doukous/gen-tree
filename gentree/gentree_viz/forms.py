from flask_wtf import FlaskForm
from wtforms import FormField, StringField, DateField, SelectField
from wtforms.validators import DataRequired
from gentree.utils import get_driver


class PersonForm(FlaskForm):
    firstname = StringField('Firstname')
    birth_date = DateField('Birth date')


class ChildrenForm(PersonForm):
    SEX_CHOICES = [('male', 'Male'), ('female', 'Female')]

    sex = SelectField('Sex', choices=SEX_CHOICES)


class PartnerForm(PersonForm):
    family_choice = SelectField('Family Choice')
    partner_choice = SelectField('Choosen partner')


class FamilyTreeForm(FlaskForm):
    name = StringField('Family name', validators=[DataRequired()])

    new_male_partner = FormField(PersonForm)
    new_female_partner = FormField(PersonForm)
