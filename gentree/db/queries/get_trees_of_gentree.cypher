MATCH (f: FamilyTree) -[:IS_ROOT_OF]-> (:GenealogicalTree { uid: $gentree_uid })
CALL (f) {
  MATCH (p: Person)-[r:IS_MEMBER_OF]->(f)
  
  OPTIONAL MATCH (p)-[r2:IS_MEMBER_OF]->(f2:FamilyTree)
  WHERE r2.status =
  
CASE r.status
   WHEN 'partner' THEN 'child'
   WHEN 'child' THEN 'partner'
  END
  
  RETURN collect({
    id: p.uid,
    firstname: p.firstname,
    sex: p.sex,
    family_status: r.status,
    linked_family_id: f2.uid
    }) AS members
  }
  RETURN f.name AS family_name, f.uid AS family_id, members
