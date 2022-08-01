function add() {
    var content = "";
    var x = 0;
    var y = 0;

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
  if (event.code == "ControlLeft") {
    notes = document.querySelectorAll(".note");
    notes.forEach(element => {
        element.style.cursor = "move";
    });
  }
});

document.addEventListener('keyup', event => {
  if (event.code == "ControlLeft") {
    notes = document.querySelectorAll(".note");
    notes.forEach(element => {
        element.style.cursor = "text";
    });
  }
});