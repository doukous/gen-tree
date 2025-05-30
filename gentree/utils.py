from functools import wraps
from flask import redirect, request, url_for
import os
from flask import g, session


def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if g.user_id is None:
            return redirect(url_for('auth.login', next=request.url))
        return f(*args, **kwargs)
    return decorated_function


def load_logged_user():
    user_id = session.get('user_id')
    if user_id is not None:
        g.user_id = user_id
    else:
        g.user_id = None
