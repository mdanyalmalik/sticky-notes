from flask import session


def notes_to_db(db, notes_class, session, user_id):
    for key in session:
        try:
            content = session[key]['content']
            if not db.session.query(notes_class.id).filter_by(id=key):
                new_note = notes_class(user_id=user_id,
                                       id=key, content=session[key]['content'], x=session[key]['x'], y=session[key]['y'])
                db.session.add(new_note)
                db.session.commit()
        except Exception as e:
            print(e)
