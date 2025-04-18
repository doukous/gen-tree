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

    
    def find_family(self):
        try:
            results, columns = self.cypher(
                f"""
                MATCH (f:FamilyTree) \
                WHERE (p:Person {{uid:'{self.uid}'}})-[:IS_MEMBER_OF]->(f) \
                RETURN f
                """
            )

            return [self.inflate(row[0]) for row in results]
        
        except Exception as e:
            return e
    

class FamilyTree(StructuredNode):
    uid = UniqueIdProperty()
    name = StringProperty(required=True)
    members = RelationshipFrom('Person', 'IS_MEMBER_OF', model=FamilyRel)
