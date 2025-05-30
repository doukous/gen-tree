from flask_wtf import FlaskForm
from wtforms import FormField, StringField, DateField, SelectField
from wtforms.validators import DataRequired
from gentree.db import db


class Choices:
    def __init__(self, gentree_id):
        self.gentree_id = gentree_id

    @property
    def family_choices(self):
        driver = db.driver


class PersonForm(FlaskForm):
    firstname = StringField('Firstname')
    birth_date = DateField('Birth date')


class ChildrenForm(PersonForm):
    SEX_CHOICES = [('male', 'Male'), ('female', 'Female')]
    sex = SelectField('Sex', choices=SEX_CHOICES)


class PartnerForm(PersonForm):
    driver = db.get_driver()

    family_choice = SelectField('Family choice')
    partner_choice = SelectField('Choosen partner')



class FamilyTreeForm(FlaskForm):
    name = StringField('Family name', validators=[DataRequired()])

    new_male_partner = FormField(PersonForm)
    new_female_partner = FormField(PersonForm)
