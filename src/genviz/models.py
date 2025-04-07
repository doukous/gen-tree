from neomodel import UniqueIdProperty, StringProperty, Relationship, DateProperty, StructuredNode

class Person(StructuredNode):
    uid = UniqueIdProperty()
    firstname = StringProperty(required=True)
    birth_date = DateProperty()


class FamilyTree(StructuredNode):
    uid = UniqueIdProperty()
    name = StringProperty(required=True)