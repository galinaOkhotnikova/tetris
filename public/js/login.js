function store() {
    let username = document.getElementById("username").value;
    localStorage.setItem("lab1_tetris.username", username);
    console.log(username);
}

function read() {
    let nameValue = localStorage["lab1_tetris.username"];
    if (nameValue) {
        let name = document.getElementById("username");
        name.value = nameValue;
    }
}

function nextPage() {
    document.location.href = "/main";
    return false;
}