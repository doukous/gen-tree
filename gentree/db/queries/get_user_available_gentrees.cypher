MATCH (p: Person { uid: $uid })
CALL (p) {
  MATCH (p)-[:HAS_ACCESS_TO]->(g: GenealogicalTree)
  RETURN collect({
    id: g.uid,
    title: g.title
    }) AS gentrees
  }
  RETURN p.firstname AS firstname, p.uid AS id, gentrees
