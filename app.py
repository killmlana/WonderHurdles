import os
from functools import wraps
from flask_mail import Mail
from flask import Flask, render_template, request, session, redirect, url_for, flash
from db import create_user, is_user_exist
from email_service import setup_mail, send_email
from config import Config


app = Flask(__name__)
app.config.from_object(Config)
mail = setup_mail(app)

def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'logged_in' not in session:
            flash('You must be logged in to view this page.')
            return redirect(url_for('signin'))
        return f(*args, **kwargs)
    return decorated_function

@app.route('/')
def home():
    return render_template('LandingPage.html')

@app.route('/signin')
def signin():
    return render_template('Signin.html')

@app.route('/signup')
def signup():
    return render_template('SignUp.html')

@app.route('/card')
#@login_required
def card():
    return render_template('Card.html')

@app.route('/cardquiz')
#@login_required
def card_quiz():
    return render_template('CardQuiz.html')

@app.route('/maze')
#@login_required
def maze():
    return render_template('Maze.html')

@app.route('/mazequiz')
#@login_required
def maze_quiz():
    return render_template('Mazequiz.html')

@app.route('/modules')
#@login_required
def modules():
    return render_template('Module.html')

@app.route('/AboutUs')
#@login_required
def About():
    return render_template('About.html')

@app.route('/right1')
#@login_required
def rightone():
    return render_template('right1.html')

@app.route('/right2')
#@login_required
def righttwo():
    return render_template('right2.html')

@app.route('/contact_us', methods=['GET', 'POST'])
def contact_us():
    if request.method == 'POST':
        name = request.form['name']
        email = request.form['email']
        phone = request.form['phone']
        subject = f"New Contact Request from {name}"
        message_body = f"Name: {name}\nPhone: {phone}\nEmail: {email}"
        try:
            send_email(mail, subject, app.config['MAIL_USERNAME'], [email], message_body)
            flash('Thank you for your message. We will contact you soon!')
        except Exception as e:
            app.logger.error(f"Failed to send email: {e}")
            flash('Failed to send your message, please try again later.')
        return redirect(url_for('contact_us'))
    
    return render_template('email.html')



@app.route('/logout')
def logout():
    session.pop('logged_in', None)
    flash('You have been logged out.')
    return redirect(url_for('signin'))


@app.route("/login_post", methods=["POST"])
def login_post():
    try:
        data = request.get_json(force=True)
        email = data["email"]
        password = data["password"]
        token = is_user_exist(email, password)

        if token:
            return {"status": "success", "token": token}
        else:
            return {"status": "failed"}
    except Exception as e:
        print(e)
        return {"status": "failed"}

@app.route("/signup_post", methods=["POST"])
def signup_post():
    try:
        data = request.get_json(force=True)
        email = data["email"]
        password = data["password"]
        user = create_user(email, password)

        if user:
            return {"status": "success"}
        else:
            return {"status": "failed"}
    except Exception as e:
        print(e)
        return {"status": "failed"}


