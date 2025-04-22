from neomodel import (
    StructuredRel, 
    UniqueIdProperty, 
    StringProperty, 
    RelationshipTo, 
    RelationshipFrom, 
    DateProperty, 
    StructuredNode
)
from neomodel.sync_.match import NodeSet


class FamilyRel(StructuredRel):
    role_choices = {'child':'child', 'partner': 'partner'}
    status = StringProperty(required=True, choices=role_choices)


class Person(StructuredNode):
    sex_choices = {'male': 'male', 'female': 'female'}

    uid = UniqueIdProperty()
    firstname = StringProperty(required=True)
    birth_date = DateProperty()
    sex = StringProperty(choices=sex_choices, required=True)
    families = RelationshipTo('FamilyTree', 'IS_MEMBER_OF', model=FamilyRel)

    def get_born_family(self):
        person = Person.nodes.get(uid=self.uid)
        family = NodeSet(person.families.match(status='child')) \
            .first_or_none()
        return family
    

class FamilyTree(StructuredNode):
    uid = UniqueIdProperty()
    name = StringProperty(required=True)
    members = RelationshipFrom('Person', 'IS_MEMBER_OF', model=FamilyRel)

    @property
    def parents(self):
        return self.members.match(status='partner').all()

    @property
    def children(self):
        return self.members.match(status='child').all()
