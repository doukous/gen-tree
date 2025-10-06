MATCH (f: FamilyTree)-[:BELONGS_TO]->(: GenealogicalTree { uid: $uid })
CALL (f) {
  MATCH (p: Person { sex: $sex })-[:IS_MEMBER_OF {status: "child"}]->(f)
  RETURN collect({
    id: p.uid,
    firstname: p.firstname,
    sex: p.sex
    }) AS members
  }
  RETURN f.name AS family_name, f.uid AS family_id, members
