MATCH (:User { uid: $person_id }) -[r:HAS_ACCESS_TO]-> (:GenealogicalTree { uid: $gentree_id })
RETURN r.status AS status
