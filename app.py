from flask import Flask, render_template, url_for, redirect, session, request
from flask_sqlalchemy import SQLAlchemy
import datetime
import os
import json

KEY_SIZE = 6
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


@app.route('/add', methods=['POST'])
def add():
    id = request.json['id']
    content = request.json['content']
    x, y = request.json['x'], request.json['y']

    session.permanent = True

    session[str(id)] = {
        'content': content,
        'x': x,
        'y': y
    }

    print(session)

    return redirect('/')


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


@app.route('/clear')
def session_clear():
    session.clear()
    session.clear()  # didnt work every time with one for some reason
    return redirect('/')


if __name__ == '__main__':
    app.run(debug=True)
