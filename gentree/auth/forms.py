from flask_wtf import FlaskForm
from wtforms import EmailField, PasswordField, StringField
from wtforms.validators import DataRequired, EqualTo


class LoginForm(FlaskForm):
    email = EmailField('email', validators=[DataRequired()])
    password = PasswordField('password', validators=[DataRequired()])

class RegistrationForm(FlaskForm):
    email = EmailField('email', validators=[DataRequired()])
    password = PasswordField('password', validators=[DataRequired()])
    repeated_password = PasswordField('password confirmation', validators=[DataRequired(), EqualTo(password)])

    name = StringField('name', validators=[DataRequired()])


