from flask import Flask, render_template, url_for, redirect
from flask_sqlalchemy import SQLAlchemy
import datetime
import os

KEY_SIZE = 24
MAX_NOTE_LENGTH = 500

app = Flask(__name__)

# change this based on which db you are creating
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///users.db'

db = SQLAlchemy(app)

app.secret_key = os.urandom(KEY_SIZE)


class Users(db.Model):
    id = db.Column(db.String(KEY_SIZE), primary_key=True,
                   default=os.urandom(KEY_SIZE))
    date_created = db.Column(db.DateTime, default=datetime.utcnow)


class Notes(db.Model):
    user_id = db.Column(db.String(KEY_SIZE))
    id = db.Column(db.Integer, primary_key=True)
    content = db.Column(db.String(MAX_NOTE_LENGTH))
    date_created = db.Column(db.DateTime, default=datetime.utcnow)


@app.route('/')
def home():
    return render_template('home.html')


@app.route('/add')
def add():
    return redirect('/')


if __name__ == '__main__':
    app.run(debug=True)
