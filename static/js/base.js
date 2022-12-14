var note_id_list = [];

// checking if it is a touch screen device
const isTouchDevice = () => {  
  return (('ontouchstart' in window) ||  
    (navigator.maxTouchPoints > 0) ||  
    (navigator.msMaxTouchPoints > 0));  
};

// move delete button alongside its corresponding note
function move_delbutton(note) {
    const delbutton = document.querySelector("[data-noteid = '" + note.id + "']");

    delbutton.style.top = String(note.offsetTop)+"px";
    delbutton.style.left = String(note.offsetLeft+note.offsetWidth-delbutton.offsetWidth)+"px";
}

// load notes onto the page from session or db
function load_notes() {
    fetch("/load_notes")
    .then(res => res.json())
    .then(data => {
        var note_keys = Object.keys(data);
        if (isTouchDevice()){
            var notes = Object.entries(data).sort((a, b) => {
                if (a[1]['y'] < b[1]['y']) return -1;
                if (a[1]['y'] > b[1]['y']) return 1;
                return 0;
            });
            note_keys = notes.map(e => {return e[0]});
        }

        note_keys.forEach((e) => {
            // adding note to page
            const textarea = document.createElement("textarea");
            const delbutton = document.createElement("button");
            delbutton.textContent = "x";

            textarea.setAttribute("oninput", "update_note(this)");
            textarea.classList.add("note");
            delbutton.setAttribute("onclick", "delete_note(this)");
            delbutton.classList.add("smallbuttonrect");

            if (isTouchDevice()) textarea.style.position = "static";

            noteslist = document.querySelector(".noteslist");

            textarea.id = e;
            delbutton.dataset.noteid = e;
            textarea.innerHTML = data[e].content;
            textarea.style.left = String(data[e].x)+'px';
            textarea.style.top = String(data[e].y)+'px';

            noteslist.append(textarea);
            noteslist.append(delbutton);
            note_id_list.push(e);

            move_delbutton(textarea);
        });
    })
    .catch(err => console.log(err));

    notes_onto_screen();
}

function add() {
    // adding note to page
    const textarea = document.createElement("textarea");
    const delbutton = document.createElement("button");
    delbutton.textContent = "x";

    textarea.setAttribute("oninput", "update_note(this)");
    textarea.classList.add("note");
    delbutton.setAttribute("onclick", "delete_note(this)");
    delbutton.classList.add("smallbuttonrect");

    noteslist = document.querySelector(".noteslist");

    if (isTouchDevice()) textarea.style.position = "static";

    // creating note id
    var id = Math.floor(Math.random() * 10000);
    while (note_id_list.includes(id)) id = Math.floor(Math.random() * 1000);

    textarea.id = id;
    delbutton.dataset.noteid = id;
    noteslist.append(textarea);
    noteslist.append(delbutton);

    // centering note
    textarea.style.left = String(document.body.clientWidth/2-textarea.offsetWidth/2)+"px";

    move_delbutton(textarea);
    update_note(textarea);

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
                    
                    if (!(e.clientY <= element.offsetHeight/2+160))
                    element.style.top = String(scrollY+e.clientY-50)+'px';

                    const delbutton = document.querySelector('[data-noteid = "' + element.id + '"]');

                    // position delbutton
                    delbutton.style.top = String(element.offsetTop)+"px";
                    delbutton.style.left = String(element.offsetLeft+element.offsetWidth-delbutton.offsetWidth)+"px";
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

// ctrl event listeners to move notes
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

// delete button from page and db/session
function delete_note(button) {
    fetch("/delete/"+button.dataset.noteid, {
    method: "DELETE"
    })
    .then(res => {
    })
    .catch(err => console.log(err));

    const note = document.querySelector("[id='"+button.dataset.noteid+"']");
    note.remove();
    button.remove();

    const index = note_id_list.indexOf(button.dataset.noteid);
    if (index > -1) { 
        note_id_list.splice(index, 1);
    }

    if (isTouchDevice()) {
        const notes = document.querySelectorAll(".note");
        notes.forEach((e) => {
            move_delbutton(e);
        });
    }
}

// clear all notes from page and db/session
function clear_notes() {
    fetch("/clear", {
    method: "DELETE"
    })
    .then(res => {
    })
    .catch(err => console.log(err));

    const notes = document.querySelectorAll(".note");

    notes.forEach((e) => {
        e.remove();
        const button = document.querySelector("[data-noteid='"+e.id+"']");
        button.remove();
    });

    note_id_list = [];
}

// correct for notes moving off screen due to resizing
function notes_onto_screen() {
    const notes = document.querySelectorAll(".note");
    notes.forEach((e) => {
        if (e.offsetLeft+e.offsetWidth >= document.body.clientWidth-10) {
            e.style.left = String(document.body.clientWidth-e.offsetWidth-10)+"px";

            move_delbutton(e);
            update_note(e);
        }
    });
}

window.onload = load_notes();
window.onresize = notes_onto_screen;