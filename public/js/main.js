function setData() {
    localStorage.setItem("lab1_tetis.level", 0);
    localStorage.setItem("lab1_tetris.score", 0);
    localStorage.setItem("lab1_tetris.line", 0);
    let name = document.getElementById("name");
    let username = localStorage.getItem("lab1_tetris.username");
    console.log(username);
    if (username == null || username === "") {
        document.location.href = "/";
    }
    else {
        name.textContent = username;
    }
}

function saveData() {
    let username = localStorage.getItem("lab1_tetris.username");
    let highscore = localStorage.getItem("lab1_tetris.hightscores");
    let table;
    if (highscore) {
        table = JSON.parse(localStorage.getItem("lab1_tetris.hightscores"));
    }
    else {
        table = [];
    }
    let score = Number(localStorage.getItem("lab1_tetris.score"));
    for (let i = 0; i < table.length; i++) {
        if (table[i][0] === username) {
            if (table[i][1] === localStorage.getItem("lab1_tetris.score")) {
                return;
            }
            else if (score >= Number(table[i][1])) {
                table[i][1] = localStorage.getItem("lab1_tetris.score");
                localStorage.setItem("lab1_tetris.hightscores", JSON.stringify(table));
                return;
            }
            else if (score < Number(table[i][1])) {
                return;
            }
        }
    }
    let element = [username, score];
    table.push(element);
    localStorage.setItem("lab1_tetris.hightscores", JSON.stringify(table));
}

function updateData() {
    let level = document.getElementById("level");
    let scores = document.getElementById("scores");
    let lines = document.getElementById("lines");
    level.textContent = localStorage.getItem("lab1_tetris.level");
    scores.textContent = localStorage.getItem("lab1_tetris.score");
    lines.textContent = localStorage.getItem("lab1_teris.line");
}

function store() {
    saveData();
    document.location.href = "/scores";
}