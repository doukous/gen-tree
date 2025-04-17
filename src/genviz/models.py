from neomodel import StructuredRel, UniqueIdProperty, StringProperty, RelationshipTo, RelationshipFrom, DateProperty, StructuredNode


class FamilyRel(StructuredRel):
    role_choices = {'child':'child', 'parent': 'parent'}
    role = StringProperty(required=True)


class Person(StructuredNode):
    sex_choices = {'male': 'male', 'female' : 'female'}

    uid = UniqueIdProperty()
    firstname = StringProperty(required=True)
    birth_date = DateProperty()
    sex = StringProperty(choices=sex_choices, required=True)
    family = RelationshipTo('Person', 'IS_MEMBER_OF', model=FamilyRel)

    @property
    def lastname(self):
       if self.family.all():
        return self.family.all()[0].get('name')
       else : return ""

    def find_family(self):
        try:
            results, meta = self.cypher(f"MATCH (f:FamilyTree) WHERE (p:Person {{uid:'{self.uid}'}})-[:IS_MEMBER_OF]->(f) RETURN f")
            return results[0][0]
        
        except Exception as e:
            return None


class FamilyTree(StructuredNode):
    uid = UniqueIdProperty()
    name = StringProperty(required=True)
    members = RelationshipFrom('Person', 'IS_MEMBER_OF', model=FamilyRel)
