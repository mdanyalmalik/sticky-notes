function add() {
    var content = "";
    var x = 0;
    var y = 0;

    // adding note to page
    const form = document.createElement("form");
    const textarea = document.createElement("textarea");

    textarea.onchange = update_note();
    textarea.classList.add("note");
    form.append(textarea);

    noteslist = document.querySelector(".noteslist");

    noteslist.append(form);

    // sending note to flask
    fetch("/add", {
    method: "POST",
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
        content: content,
        x: x,
        y: y
    })
    }).then(res).catch(err => console.log(err));
}

function update_note() {
    console.log("changed");
}

document.addEventListener('keydown', event => {
  if (event.key == "Control") {
    notes = document.querySelectorAll(".note");
    notes.forEach(element => {
        element.style.cursor = "move";
    });
  }
});

document.addEventListener('keyup', event => {
  if (event.key == "Control") {
    notes = document.querySelectorAll(".note");
    notes.forEach(element => {
        element.style.cursor = "text";
    });
  }
});