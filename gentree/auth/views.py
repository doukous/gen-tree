from flask import flash, redirect, render_template, request, session, url_for
import neo4j
from werkzeug.security import check_password_hash
from gentree.utils import get_driver
from .forms import LoginForm
from . import auth


@auth.route('/login', methods=['GET', 'POST'])
def login():
    form = LoginForm()
    error = None

    if request.method == 'POST':
        if form.validate_on_submit():
            driver = get_driver()

            user = driver.execute_query(
                """
                MATCH (p: Person { email: $email })
                RETURN p.uid AS uid, p.password AS password
                """,
                database_='gentree',
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
