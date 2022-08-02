from flask import Flask, render_template, url_for, redirect, session, request
from flask_sqlalchemy import SQLAlchemy
import datetime
import os
import json

KEY_SIZE = 12
MAX_NOTE_LENGTH = 500

app = Flask(__name__)

# change this based on which db you are creating
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///notes.db'

db = SQLAlchemy(app)

app.secret_key = os.urandom(KEY_SIZE)

app.permanent_session_lifetime = datetime.timedelta(days=365)


@app.route('/')
def home():
    return render_template('home.html')


@app.post('/add')
def add():
    key = os.urandom(KEY_SIZE)
    while str(key) in session:
        key = os.urandom(KEY_SIZE)

    session[str(key)] = request.json

    return redirect('/')


if __name__ == '__main__':
    app.run(debug=True)
