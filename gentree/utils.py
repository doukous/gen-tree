from functools import wraps
from flask import redirect, request, url_for
import os
from flask import g
from neo4j import GraphDatabase


def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if True:
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
