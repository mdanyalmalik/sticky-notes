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
    });
}

function update_note() {
    console.log("changed");
}