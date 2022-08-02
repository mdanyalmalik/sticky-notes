var note_id_list = [];

function add() {
    var content = "";

    // adding note to page
    const textarea = document.createElement("textarea");

    textarea.setAttribute("oninput", "update_note(this)");
    textarea.classList.add("note");

    noteslist = document.querySelector(".noteslist");
    noteslist.append(textarea);

    // creating note id
    var id = Math.floor(Math.random() * 10000);
    while (note_id_list.includes(id)) id = Math.floor(Math.random() * 1000);

    textarea.id = id;

    // sending note to flask
    fetch("/add", {
    method: "POST",
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
        id: id,
        content: content,
        x: textarea.offsetLeft,
        y: textarea.offsetTop
    })
    }).then().catch(err => console.log(err));
}

function update_note(note) {
    console.log(note.value);

}

function update_note_position() {
}

function move_note() {
    const elements = document.querySelectorAll(":hover");
    const element = elements[elements.length-1];
    if(element) { // if element exists
        if(element.className == "note") { // if it is a note
            element.onmousedown = () => {
                // when mouse is clicked and moving
                document.onmousemove = (e) => {
                    if (!(e.clientX+element.offsetWidth/2 >= document.body.clientWidth-10) && !(e.clientX-element.offsetWidth/2 <= 10)) 
                    element.style.left = String(e.clientX-element.offsetWidth/2)+'px';

                    element.style.top = String(e.clientY-document.body.clientHeight/2+20)+'px';
                }
            }
            document.onmouseup = () => {
                element.onmousedown = null;
                document.onmousemove = null;
            }
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