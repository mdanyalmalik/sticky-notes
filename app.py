from flask import Flask, render_template, url_for, redirect, session, request, abort
from flask_session import Session
from flask_sqlalchemy import SQLAlchemy
import datetime
import os
import json
from google_auth_oauthlib.flow import Flow
import google
import google.auth.transport.requests as requests
import google.oauth2.id_token as id_token
import pip._vendor.cachecontrol as cachecontrol
import requests  # needed for google request lib above
import pathlib


KEY_SIZE = 6
MAX_NOTE_LENGTH = 500
DEBUG_MODE = True

app = Flask(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///notes.db'
app.config["SESSION_TYPE"] = "filesystem"
app.config["SESSION_PERMANENT"] = True
Session(app)

db = SQLAlchemy(app)

app.secret_key = os.urandom(KEY_SIZE)

app.permanent_session_lifetime = datetime.timedelta(days=365)

# allowing just for testing purposes
# temp
os.environ["OAUTHLIB_INSECURE_TRANSPORT"] = "1"

GOOGLE_CLIENT_ID = "313543264639-ti3ua7fftkkt6uucg7ih4nc81lm4jhc7.apps.googleusercontent.com"

client_secrets_file = os.path.join(
    pathlib.Path(__file__).parent, "client_secret.json")

flow = Flow.from_client_secrets_file(
    client_secrets_file=client_secrets_file,
    scopes=["https://www.googleapis.com/auth/userinfo.profile",
            "https://www.googleapis.com/auth/userinfo.email", "openid"],
    redirect_uri="http://127.0.0.1:5000/callback"
)


class Users(db.Model):
    id = db.Column(db.String(), primary_key=True,
                   default=os.urandom(KEY_SIZE))
    name = db.Column(db.String())
    date_created = db.Column(db.DateTime, default=datetime.datetime.utcnow())
    notes = db.relationship('Notes', backref='user')


class Notes(db.Model):
    user_id = db.Column(db.String(), db.ForeignKey('users.id'))
    id = db.Column(db.Integer, primary_key=True)
    content = db.Column(db.String(MAX_NOTE_LENGTH), nullable=False)
    date_created = db.Column(db.DateTime, default=datetime.datetime.utcnow())
    x = db.Column(db.Integer)
    y = db.Column(db.Integer)


def notes_to_db(db, notes_class, session, user_id):
    for key in session:
        try:
            content = session[key]['content']
            new_note = notes_class(user_id=user_id,
                                   id=key, content=session[key]['content'], x=session[key]['x'], y=session[key]['y'])
            db.session.add(new_note)
            db.session.commit()
        except Exception as e:
            pass


@app.route('/')
def home():
    return render_template('home.html')


@app.route('/add', methods=['POST'])
def add():
    if "google_id" not in session:
        id = request.json['id']
        content = request.json['content']
        x, y = request.json['x'], request.json['y']

        session.permanent = True

        session[str(id)] = {
            'content': content,
            'x': x,
            'y': y
        }
    else:
        notes_to_db(db, Notes, session, session['google_id'])

    return "Success"


@app.route('/load_notes')
def load_notes():
    notes = {}
    for x in session.items():
        try:
            content = session[x[0]]['content']
            notes.update({x[0]: x[1]})
        except:
            pass

    return notes


@app.route('/delete/<id>', methods=['DELETE'])
def delete_note(id):
    session.pop(id)

    return id


@app.route('/clear', methods=['DELETE'])
def session_clear():
    session.clear()

    return "Success"


@app.route('/login')
def login():
    authorisation_url, state = flow.authorization_url()
    session["state"] = state
    return redirect(authorisation_url)


@app.route('/callback')
def callback():
    flow.fetch_token(authorization_response=request.url)

    if not session["state"] == request.args["state"]:
        abort(500)

    credentials = flow.credentials
    request_session = requests.session()
    cached_session = cachecontrol.CacheControl(request_session)
    token_request = google.auth.transport.requests.Request(
        session=cached_session)

    id_info = id_token.verify_oauth2_token(
        id_token=credentials._id_token, request=token_request, audience=GOOGLE_CLIENT_ID)

    session["google_id"] = id_info.get("sub")
    session["name"] = id_info.get("name")

    # adding user to db
    if not db.session.query(Users.id).filter_by(id=id_info.get("sub")):
        new_user = Users(id=id_info.get("sub"), name=id_info.get("name"))
        db.session.add(new_user)
        db.session.commit()

    notes_to_db(db, Notes, session, id_info.get("sub"))

    return redirect("/user_notes")


@app.route('/logout')
def logout():
    session.clear()
    return redirect('/')


@app.route('/')
def index():
    return "Home <br> <a href='/login'>Login</a>"


def login_is_required(function):
    def wrapper(*args, **kwargs):
        if "google_id" not in session:
            return abort(401)
        else:
            return function()
    return wrapper


@app.route('/user_notes')
@login_is_required
def user_notes():
    return "User Notes <br> <a href = '/logout'>Logout</a> "


if __name__ == '__main__':
    app.run(debug=DEBUG_MODE)
