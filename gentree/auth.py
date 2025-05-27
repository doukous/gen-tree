from flask import Blueprint, redirect, render_template, request, session, url_for


bp = Blueprint('auth', __name__, url_prefix="/auth")


@bp.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'GET':
        return render_template('auth/login.html')
    
    else:
        username = request.form['username']
        session['username'] = username

        if 'next' in request.args:
            return redirect(request.args['next'])
        else:
            return redirect(url_for('homepage.home'))

@bp.route('/logout', methods=['GET'])
def logout():
    session.pop('username', None)
    return redirect(url_for('auth.login'))
