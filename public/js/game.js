var canvas = null;
var context = null;
var next = {
    x: 0,
    y: 0,
    blocks: [
    ]
};
const columns = 10;
const rows = 20;
var playing = false;
var lines = 0;
var scores = 0;
var interval;

//!Объект
var activeFigure = {
    x: 0,
    y: 0,
    blocks: [
    ]
};

const colors = {
    '1': 'LightSkyBlue',
    '2': 'LemonChiffon',
    '3': 'Violet',
    '4': 'LightGreen',
    '5': 'SandyBrown',
    '6': 'RoyalBlue',
    '7': 'LightCoral',
}

const points = {
    '1': 40,
    '2': 100,
    '3': 300,
    '4': 1200
}

function createPlayfield() {
    let field = [];
    for (let y = 0; y < 20; y++) {
        field[y] = [];
        for (let x = 0; x < 10; x++) {
            field[y][x] = 0;
        }
    }
    return field;
}

var playfield = createPlayfield();

function init() {
    canvas = document.getElementById('game__field');
    context = canvas.getContext('2d');
}

function createFigure() {
    const index = Math.floor(Math.random() * 7);
    const type = 'IJLOSZT'[index];
    let blocks = [];
    switch (type) {
        case 'I':
            blocks = [
                [0, 0, 0, 0],
                [1, 1, 1, 1],
                [0, 0, 0, 0],
                [0, 0, 0, 0]
            ];
            break;
        case 'J':
            blocks = [
                [2, 0, 0],
                [2, 2, 2],
                [0, 0, 0],
            ];
            break;
        case 'L':
            blocks = [
                [0, 0, 3],
                [3, 3, 3],
                [0, 0, 0],
            ];
            break;
        case 'O':
            blocks = [
                [0, 0, 0, 0],
                [0, 4, 4, 0],
                [0, 4, 4, 0],
                [0, 0, 0, 0]
            ];
            break;
        case 'S':
            blocks = [
                [0, 5, 5],
                [5, 5, 0],
                [0, 0, 0],
            ];
            break;
        case 'Z':
            blocks = [
                [6, 6, 0],
                [0, 6, 6],
                [0, 0, 0],
            ];
            break;
        case 'T':
            blocks = [
                [0, 7, 0],
                [7, 7, 7],
                [0, 0, 0],
            ];
            break;
        default:
            throw new Error("Нет такой фигуры");
    }
    let x = Math.floor((columns - blocks[0].length) / 2);
    let y = 0;
    return {
        x: x,
        y: y,
        blocks: blocks
    };
}

function getState(playfield) {
    const playfieldCopy = createPlayfield();
    for (let y = 0; y < playfield.length; y++) {
        playfieldCopy[y] = [];
        for (let x = 0; x < playfield[y].length; x++) {
            playfieldCopy[y][x] = playfield[y][x];
        }
    }
    for (let y = 0; y < activeFigure.blocks.length; y++) {
        for (let x = 0; x < activeFigure.blocks[y].length; x++) {
            if (activeFigure.blocks[y][x]) {
                playfieldCopy[activeFigure.y + y][activeFigure.x + x] = activeFigure.blocks[y][x];
            }
        }
    }
    return playfieldCopy;
}

function clearScreen() {
    context.clearRect(0, 0, canvas.width, canvas.height);
}

function drawPlayfield(playfield) {
    clearScreen();
    context.lineWidth = 2;
    context.strokeRect(0, 0, canvas.width, canvas.height);
    for (let y = 0; y < playfield.length; y++) {
        for (let x = 0; x < playfield[y].length; x++) {
            const block = playfield[y][x];
            if (block) {
                drawFigure(x * blockWidth, y * blockHeight, blockWidth, blockHeight, colors[block]);
            }
        }
    }
}

function drawFigure(x, y, width, height, color) {
    context.fillStyle = color;
    context.lineWidth = 2;

    context.fillRect(x, y, width, height);
    context.strokeRect(x, y, width, height);

}

function drawNext() {
    let nextFigure = document.getElementById('game__figure');
    let ctx = nextFigure.getContext('2d');
    ctx.clearRect(0, 0, nextFigure.width, nextFigure.height);
    ctx.lineWidth = 2;
    for (let y = 0; y < next.blocks.length; y++) {
        for (let x = 0; x < next.blocks[y].length; x++) {
            const block = next.blocks[y][x];
            if (block) {
                ctx.fillStyle = colors[block];
                ctx.fillRect(x * nextFigure.width / 4, y * nextFigure.height / 4, nextFigure.width / 4, nextFigure.height / 4);
                ctx.strokeRect(x * nextFigure.width / 4, y * nextFigure.height / 4, nextFigure.width / 4, nextFigure.height / 4);
            }
        }
    }
}

function fixFigure() {
    //!Реструктуризация
    const { y: figureY, x: figureX, blocks } = activeFigure;
    for (let y = 0; y < blocks.length; y++) {
        for (let x = 0; x < blocks[y].length; x++) {
            if (blocks[y][x]) {
                playfield[figureY + y][figureX + x] = blocks[y][x];
            }
        }
    }
}

function isOutOfField() {
    const { y: figureY, x: figureX, blocks } = activeFigure;
    for (let y = 0; y < blocks.length; y++) {
        for (let x = 0; x < blocks[y].length; x++) {
            if (blocks[y][x] &&
                ((playfield[figureY + y] === undefined || playfield[figureY + y][figureX + x] === undefined) ||
                    playfield[figureY + y][figureX + x])) {
                return true;
            }
        }
    }
    return false;
}

//!Управление
function moveLeft() {
    activeFigure.x -= 1;
    if (isOutOfField()) {
        activeFigure.x += 1;
    }
}

function moveRight() {
    activeFigure.x += 1;
    if (isOutOfField()) {
        activeFigure.x -= 1;
    }
}

function moveDown() {
    if (playing) {
        return;
    }
    activeFigure.y += 1;
    if (isOutOfField()) {
        activeFigure.y -= 1;
        fixFigure();
        const delLines = deleteLines();
        updateScores(delLines);
        updateFigures();
        drawNext();

    }
    if (isOutOfField()) {
        playing = true;
        store();
    }
}

function turnFigure() {
    turnBlocks();
    //Реализуем поворот против часой стрелки в случае столкновения
    if (isOutOfField()) {
        turnBlocks(false);
    }
}

//По умолчанию поворачиваем по часовой стрелке
function turnBlocks(flag = true) {
    const blocks = activeFigure.blocks;
    const lenght = blocks.length;
    //Количество циклов для поворота фигуры
    const x = Math.floor(lenght / 2);
    const y = lenght - 1;

    for (let i = 0; i < x; i++) {
        for (let j = i; j < y - i; j++) {
            //Сохраняем первую клетку
            const tmp = blocks[i][j];

            //По часовой
            if (flag) {
                //Ставим на ее место другую, поворот 90 градусов
                blocks[i][j] = blocks[y - j][i];
                blocks[y - j][i] = blocks[y - i][y - j];
                blocks[y - i][y - j] = blocks[j][y - i];
                blocks[j][y - i] = tmp;
            }
            //Против часовой
            else {
                blocks[i][j] = blocks[j][y - i];
                blocks[j][y - i] = blocks[y - i][y - j];
                blocks[y - i][y - j] = blocks[y - j][i];
                blocks[y - j][i] = tmp;
            }
        }
    }
}

function updateFigures() {
    activeFigure = next;
    next = createFigure();
}

function deleteLines() {
    let line = [];
    for (let y = rows - 1; y >= 0; y--) {
        let numBlocks = 0;
        for (let x = 0; x < columns; x++) {
            if (playfield[y][x]) {
                numBlocks += 1;
            }
        }
        if (numBlocks === 0) {
            break;
        }
        else if (numBlocks < columns) {
            continue;
        }
        else if (numBlocks === columns) {
            line.unshift(y);
        }
    }
    for (let index of line) {
        playfield.splice(index, 1);
        playfield.unshift(new Array(columns).fill(0));
    }
    return line.length;
}


function updateScores(deletedLines) {
    if (deletedLines > 0) {
        scores += points[deletedLines] * (getLevel() + 1);
        lines += deletedLines;
    }
    level = getLevel();
    console.log(level);
    clearInterval(interval);
    Timer();
    localStorage.setItem("lab1_teris.line", lines);
    localStorage.setItem("lab1_tetris.score", scores);
    localStorage.setItem("lab1_tetris.level", level);
    updateData();
}

//как только удаляем 5 линий, переходим на следующий уровень
function getLevel() {
    return Math.floor(lines * 0.2);
}


function Timer() {
    const speed = 1000 - getLevel() * 100;
    console.log(speed);
    interval = setInterval(() => {
        moveDown(),
            drawPlayfield(getState(playfield))
    }, speed > 0 ? speed : 100);
}

init();
var blockWidth = canvas.width / columns;
var blockHeight = canvas.height / rows;
next = createFigure();
updateFigures();
drawNext();
drawPlayfield(getState(playfield))
Timer();

//Управление с клавиатуры
document.addEventListener('keydown', (event) => {
    const keyName = event.key;
    console.log('Событие keydown: ' + keyName);
    if (keyName === 'A' || keyName === 'a' || keyName === 'ф' || keyName === 'Ф') {
        moveLeft();
        drawPlayfield(getState(playfield));
    }

    if (keyName === 'D' || keyName === 'd' || keyName === 'в' || keyName === 'В') {
        moveRight();
        drawPlayfield(getState(playfield));
    }

    if (keyName === 'S' || keyName === 's' || keyName === 'ы' || keyName === 'Ы') {
        moveDown();
        drawPlayfield(getState(playfield));
    }

    if (keyName === 'W' || keyName === 'w' || keyName === 'ц' || keyName === 'Ц') {
        turnFigure();
        drawPlayfield(getState(playfield));
    }
});
