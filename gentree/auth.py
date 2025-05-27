from flask import Blueprint, redirect, render_template, request, session, url_for
from flask_wtf import FlaskForm
from wtforms import PasswordField, StringField
from wtforms.validators import DataRequired


bp = Blueprint('auth', __name__, url_prefix="/auth")


class LoginForm(FlaskForm):
    email = StringField('email', validators=[DataRequired()])
    password = PasswordField('password', validators=[DataRequired()])


@bp.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'GET':
        form = LoginForm()
        return render_template('auth/login.html', form=form)
    
    else:
        user_mail = request.form['email']
        user_password = request.form['password']

        if 'next' in request.args:
            return redirect(request.args['next'])
        else:
            return redirect(url_for('homepage.home'))

@bp.route('/logout', methods=['GET'])
def logout():
    session.pop('username', None)
    return redirect(url_for('auth.login'))
