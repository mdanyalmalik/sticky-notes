var note_id_list = [];

function load_notes() {
    fetch("/load_notes")
    .then(res => res.json())
    .then(data => {
        Object.keys(data).forEach((e) => {
            // adding note to page
            const textarea = document.createElement("textarea");

            textarea.setAttribute("oninput", "update_note(this)");
            textarea.classList.add("note");

            noteslist = document.querySelector(".noteslist");

            textarea.id = e;
            textarea.innerHTML = data[e].content;
            textarea.style.left = String(data[e].x)+'px';
            textarea.style.top = String(data[e].y)+'px';

            noteslist.append(textarea);
            note_id_list.push(e);
        });
    })
    .catch(err => console.log(err))
}

function add() {
    var content = "";

    // adding note to page
    const textarea = document.createElement("textarea");

    textarea.setAttribute("oninput", "update_note(this)");
    textarea.classList.add("note");

    noteslist = document.querySelector(".noteslist");

    // creating note id
    var id = Math.floor(Math.random() * 10000);
    while (note_id_list.includes(id)) id = Math.floor(Math.random() * 1000);

    textarea.id = id;

    noteslist.append(textarea);

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
    // sending note to flask
    fetch("/add", {
    method: "POST",
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
        id: note.id,
        content: note.value,
        x: note.offsetLeft,
        y: note.offsetTop
    })
    }).then().catch(err => console.log(err));
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
                    
                    if (!(e.clientY <= element.offsetHeight/2+160) && !(e.clientY >= document.documentElement.clientHeight-element.offsetHeight/2-40))
                    element.style.top = String(e.clientY-50)+'px';
                }
            }
            document.onmouseup = () => {
                element.onmousedown = null;
                document.onmousemove = null;
                update_note(element);
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


window.onload = load_notes();