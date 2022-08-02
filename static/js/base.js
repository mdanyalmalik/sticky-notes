function add() {
    var content = "";
    var x = 0;
    var y = 0;

    // adding note to page
    const textarea = document.createElement("textarea");

    textarea.setAttribute("oninput", "update_note(this)");
    textarea.classList.add("note");

    noteslist = document.querySelector(".noteslist");
    noteslist.append(textarea);

    // sending note to flask
    fetch("/add", {
    method: "POST",
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
        content: content,
        x: document.clientWidth/2-textarea.width/2,
        y: document.clientHeight/2-textarea.height/2
    })
    }).then().catch(err => console.log(err));
}

function update_note(note) {
    console.log(note.value);
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