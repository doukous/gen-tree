MATCH (p: User { email: $email })
RETURN p.uid AS uid, p.password AS password
