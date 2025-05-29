from functools import wraps
from flask import redirect, request, url_for
import os
from flask import g, session
from neo4j import GraphDatabase


def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if g.user_id is None:
            return redirect(url_for('auth.login', next=request.url))
        return f(*args, **kwargs)
    return decorated_function


def get_driver():
    if not 'driver' in g:
        URI = os.getenv('NEO4J_URI')
        AUTH = (os.getenv('NEO4J_AUTH_USERNAME'), os.getenv('NEO4J_AUTH_PASSWORD'))

        driver = GraphDatabase.driver(URI, auth=AUTH)
        driver.verify_connectivity()

        g.driver = driver

    return g.driver


def load_logged_user():
    user_id = session.get('user_id')
    if user_id is not None:
        g.user_id = user_id
    else:
        g.user_id = None
