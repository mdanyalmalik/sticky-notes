function add() {
    var content = "";
    var x = 0;
    var y = 0;

    // adding note to page
    const form = document.createElement("form");
    const textarea = document.createElement("textarea");

    textarea.setAttribute("oninput", "update_note(this)");
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
    }).then().catch(err => console.log(err));
}

function update_note(note) {
    console.log(note.value);
}

function move_note() {
    const elements = document.querySelectorAll(":hover");
    const element = elements[elements.length-1];
    if(element.className == "note") {
        element.onmousedown = () => {
            document.onmousemove = (e) => {
                element.style.left = String(e.clientX-document.body.clientWidth/2-element.style.width/2)+'px';
                element.style.top = String(e.clientY-document.body.clientHeight/2-element.style.height/2)+'px';
            }
        }
        document.onmouseup = () => {
            element.onmousedown = null;
            document.onmousemove = null;
        }
    }
}

document.addEventListener('keydown', event => {
  if (event.key == "Control") {
    notes = document.querySelectorAll(".note");
    notes.forEach(element => {
        element.style.cursor = "move";
    });
    move_note();
  }
});

document.addEventListener('keyup', event => {
  if (event.key == "Control") {
    notes = document.querySelectorAll(".note");
    notes.forEach(element => {
        element.style.cursor = "text";
        element.onmousedown = null;
    });
    document.onmousemove = null;
  }
});