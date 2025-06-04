from flask_wtf import FlaskForm
from wtforms import FormField, StringField, DateField, SelectField
from wtforms.validators import DataRequired
from gentree.db import db
from gentree.gentree_viz.schemas import FamilyChoice


class Choices:
    @classmethod
    def get_people_choices(cls, gentree_id, sex=None):
        driver = db.driver

        results = None

        if sex:
            results, _, _ = driver.execute_query(
            """
            MATCH (f: FamilyTree)-[:BELONGS_TO]->(: GenealogicalTree { uid: $uid })
            CALL (f) {
                MATCH (p: Person {sex: $sex})-[:IS_MEMBER_OF {status: "child"}]->(f)
                RETURN collect({
                    id: p.uid,
                    firstname: p.firstname,
                    sex: p.sex
                }) as members
            }
            RETURN f.name AS family_name, f.uid AS family_id, members
            """,
            database_='gentree',
            uid=str(gentree_id),
            sex=sex
        )
        
        else:
            results, _, _ = driver.execute_query(
                """
                MATCH (f: FamilyTree)-[:BELONGS_TO]->(: GenealogicalTree { uid: $uid })
                CALL (f) {
                    MATCH (p: Person)-[:IS_MEMBER_OF {status: "child"}]->(f)
                    RETURN collect({
                        id: p.uid,
                        firstname: p.firstname,
                        sex: p.sex
                    }) as members
                }
                RETURN f.name AS family_name, f.uid AS family_id, members
                """,
                database_='gentree',
                uid=str(gentree_id)
            )

        results = [
            FamilyChoice.model_validate(result.data()) 
            for result in results
        ]

        choices = {}

        for result in results:
            (key, value), = result.model_dump().items()
            choices[key] = value
        
        return choices
    

class PersonForm(FlaskForm):
    firstname = StringField('Firstname')
    birth_date = DateField('Birth date')


class ChildrenForm(PersonForm):
    SEX_CHOICES = [('male', 'Male'), ('female', 'Female')]
    sex = SelectField('Sex', choices=SEX_CHOICES)


class PartnerForm(PersonForm):
    driver = db.driver

    family_choice = SelectField('Family choice')
    partner_choice = SelectField('Choosen partner', choices=[])  


class FamilyTreeForm(FlaskForm):
    name = StringField('Family name', validators=[DataRequired()])
    
    male_existing_choices = SelectField('Choices')
    female_existing_choices = SelectField('Choices')

    new_male_partner = FormField(PersonForm)
    new_female_partner = FormField(PersonForm)
