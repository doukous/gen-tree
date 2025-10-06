from flask import flash, redirect, render_template, request, session, url_for
import neo4j
from werkzeug.security import check_password_hash
from gentree.db.neo_driver import db
from .forms import LoginForm, RegistrationForm
from . import auth


@auth.route('/login', methods=['GET', 'POST'])
def login():
    form = LoginForm()
    error = None

    if request.method == 'POST':
        if form.validate_on_submit():

            user = db.run_query(
                'get_user',
                result_transformer_=neo4j.Result.single,
                email=form.email.data,
            )

            if user is None:
                error = 'The entered email is incorrect.'
            elif not check_password_hash(user['password'], form.password.data):
                error = 'The entered password is incorrect.'

            if error is None:
                session.clear()
                session['user_id'] = user['uid']

                if 'next' in request.args:
                    return redirect(request.args['next'])
                else:
                    return redirect(url_for('user.user_home'))

            flash(error)

    return render_template('auth/login.html', form=form)


@auth.route('/logout', methods=['GET'])
def logout():
    session.pop('user_id', None)
    return redirect(url_for('auth.login'))


@auth.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'GET':
        form = RegistrationForm()

    else:
        form = RegistrationForm(request.form)

        if form.validate():
            return render_template('auth/registration-completed.html')

    return render_template('auth/register.html', form=form)
