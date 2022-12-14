# Sticky Notes

## Description

This is a sticky notes app written with Flask and Vanilla Javascript. You can add notes, move them around on the screen and the app will keep both their contents and positions saved. On touch screen devices, the notes will simply appear in a column. You can login using your google account. This will save your notes to your account and any more notes you add will be added to your account as well.

## Getting Started

### Dependencies

Mentioned in the requirements.txt file.

### Executing program

To run the code on your own system,

- install the dependencies, using a virtual environment or otherwise
- run app.py

```
python app.py
```

## Authors

[@Me](https://github.com/mdanyalmalik)

## Version History

- 1.0.0

  - initial release
  - hosting on heroku
  - notes saved in sessions alone

- 2.0.0
  - hosting on heroku
  - notes saved in session if not logged in
  - logging in saves notes to database under your account

## License

This project is licensed under the MIT License - see the LICENSE.md file for details
