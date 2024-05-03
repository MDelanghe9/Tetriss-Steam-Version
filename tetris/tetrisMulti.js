/*             */
/* INIT CANVAS */
/*             */
// récupération des différentes div
const divGridGame = document.getElementById('down-side');
const divForPieceNextP1 = document.getElementById('next-piece-indicator1');
const divForPieceNextP2 = document.getElementById('next-piece-indicator2');

const canvas = document.createElement('canvas');
const canvasForPieceNextP1 = document.createElement('canvas');
const canvasForPieceNextP2 = document.createElement('canvas');

var CELL_SIZE = null;
var CELL_SIZE_GAME = null;

// ALI c'est ici pour la taille des canvas
if (window.matchMedia("(max-width: 500px)").matches) {
    //alert("telephone vue")
    CELL_SIZE = 15;
    CELL_SIZE_GAME = 23;
} else {
    CELL_SIZE = 25;
    CELL_SIZE_GAME = 35;
}
canvas.width = CELL_SIZE_GAME *10;
canvas.height = CELL_SIZE_GAME *20;
canvasForPieceNextP1.width = CELL_SIZE *4;
canvasForPieceNextP1.height = CELL_SIZE *2;
canvasForPieceNextP2.width = CELL_SIZE *4;
canvasForPieceNextP2.height = CELL_SIZE *2;

const ctx = canvas.getContext('2d');
const ctxNextPiece1 = canvasForPieceNextP1.getContext('2d');

const ctxNextPiece2 = canvasForPieceNextP2.getContext('2d');
divGridGame.appendChild(canvas);
divForPieceNextP1.appendChild(canvasForPieceNextP1);
divForPieceNextP2.appendChild(canvasForPieceNextP2);

const scoreDiv = document.getElementById('actual-score');
const levelDiv = document.getElementById('actual-level');
const nextlevelDiv = document.getElementById('next-level');

const ROWS = 20;
const COLS = 10;
// Ali ici pour la taille des cellules
 // 30 pour next-pieces
var Player1  = { id:1, color:'Purple', currentX:1, currentY:0, currentPiece:null, nextPiece:null,  }
var Player2 = { id:2, color:'Green', currentX:6, currentY:0, currentPiece:null, nextPiece:null,  }

// test image

// Créez une nouvelle instance d'objet Image
var img = new Image();
// Spécifiez le chemin de l'image à charger
img.src = '/css/brick.jpg';
img.onload = function() {return true}

/*                  */
/* CONFIG VARIABLES */
/*                  */
var gameOnPause = false
MOVE_DELAY = 20
var scoreActual = 0;
var isEnd = false
var counter = 0;
var lastMoveTime = 0;
var lastMoveTime2 = 0;
var gridOfGame = [[]];
var modeGhost = true;
var indexForDifficuly = 0;

const tetrissScalingLevels = [
    { level: 0, score: 0,    gameSpeed: 100, target:2, gain:100},
    { level: 1, score: 40,   gameSpeed: 95,  target:4, gain:150},
    { level: 2, score: 100,  gameSpeed: 90,  target:5, gain:200},
    { level: 3, score: 300,  gameSpeed: 80,  target:5, gain:300},
    { level: 4, score: 1000, gameSpeed: 70,  target:6, gain:400},
    { level: 5, score: 1900, gameSpeed: 60,  target:6, gain:500},
    { level: 6, score: 3000, gameSpeed: 50,  target:7, gain:600},
    { level: 7, score: 4400, gameSpeed: 40 , target:7, gain:800},
    { level: 8, score: 6500, gameSpeed: 30 , target:8, gain:900},
    { level: 9, score: 7000, gameSpeed: 20 , target:8, gain:1000},
]
const Colors = [
    {
        name: 'Purple',
        gradient: [
            "rgba(235,214,255,1)",
            "rgba(212,169,255,1)",
            "rgba(190,123,255,1)",
            "rgba(168,77,255,1)",
            "rgba(146,31,255,1)",
            "rgba(123,0,255,1)",
            "rgba(101,0,204,1)",
        ],
    },
    {
        name: 'Green',
        gradient: [
            "rgba(0,255,0,1)",
            "rgba(51,204,51,1)",
            "rgba(102,153,102,1)",
            "rgba(37, 139, 93)",
            "rgba(15, 221, 149)",
            "rgba(98, 189, 118)",
            "rgba(4, 75, 24)",
        ]
    },
    {
        name: 'Yellow',
        gradient: [
            "rgba(255, 255, 0, 1)",
            "rgba(255, 255, 51, 1)",
            "rgba(255, 255, 102, 1)",
            "rgba(255, 255, 153, 1)",
            "rgba(255, 255, 204, 1)",
            "rgba(255, 255, 255, 1)",
            "rgba(255, 255, 85, 1)"
        ]
    },
]
const LineShape = [
    {
        name: 'LineY',
        shape: [
            [0, 1],
            [0, 1],
            [0, 1],
            [0, 1],
        ]
    },
]
const Pieces = [
    {
        name: 'Line',
        shape: [
            [0, 0, 0, 0],
            [1, 1, 1, 1],
        ]
    },
    {
        name: 'J',
        shape: [
            [1, 0, 0],
            [1, 1, 1],
            [0, 0, 0]
        ]
    },
    {
        name: 'L',
        shape: [
            [0, 0, 1],
            [1, 1, 1],
            [0, 0, 0]
        ]
    },
    {
        name: 'Square',
        shape: [
            [1, 1],
            [1, 1]
        ]
    },
    
    {
        name: 'S',
        shape: [
            [0, 1, 1],
            [1, 1, 0],
            [0, 0, 0]
        ]
    },
    {
        name: 'T',
        shape: [
            [0, 1, 0],
            [1, 1, 1],
            [0, 0, 0]
        ]
    },
    {
        name: 'Z',
        shape: [
            [1, 1, 0],
            [0, 1, 1],
            [0, 0, 0]
        ]
    }
];
var levelActualObject = tetrissScalingLevels[0];
var actualGoal = tetrissScalingLevels[0].target;
var gameSpeed = tetrissScalingLevels[0].gameSpeed;
var somePlayerHitGrid = false;
/*                                                   */
/* FONCTIONS EN RAPPORT AUX GRILLES ET CANVAS RELATIF */
/*                                                   */
// Fonction qui dessine le CANVA de la grille de jeu
function drawGrid(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}
// Fonction qui dessine le CANVA de la grille de la prochaine piéce du joueur X
function drawNextPieceGrid(player){
    pieceShape = player.nextPiece.shape;
    var color = findColor(player)
    color = findColorForNextPiece(player)
    for (let r = 0; r < pieceShape.length; r++) {
        for (let c = 0; c < pieceShape[r].length; c++) {
            if (player.id == 1) {
                if (pieceShape[r][c]) {
                    ctxNextPiece1.drawImage(img, (c*CELL_SIZE), (r*CELL_SIZE), CELL_SIZE, CELL_SIZE);
/*
                    ctxNextPiece1.fillStyle = color;
                    ctxNextPiece1.fillRect(c * (CELL_SIZE), r * (CELL_SIZE), (CELL_SIZE), (CELL_SIZE));
                    ctxNextPiece1.strokeStyle = "white";
                    ctxNextPiece1.strokeRect(c * (CELL_SIZE), r * (CELL_SIZE), (CELL_SIZE), (CELL_SIZE));
                    */
                }
            }else{
                if (pieceShape[r][c]) {
                    ctxNextPiece2.fillStyle = color;
                    ctxNextPiece2.fillRect(c * (CELL_SIZE), r * (CELL_SIZE), (CELL_SIZE), (CELL_SIZE));
                    ctxNextPiece2.strokeStyle = "white";
                    ctxNextPiece2.strokeRect(c * (CELL_SIZE), r * (CELL_SIZE), (CELL_SIZE), (CELL_SIZE));
                }
            }
        }
    }
}
// Fonction qui redessine le CANVA de la grille de jeu lorsqu'un joueur y ajoute une pièce
function updateGrid(){
    for (let row = 0; row < gridOfGame.length; row++) {
        for (let col = 0; col < gridOfGame[row].length; col++) {
            if (gridOfGame[row][col] != 0) {
                let color = new String(gridOfGame[row][col]);
                gridOfGame[row][col] = color;
                ctx.fillStyle = color;
                ctx.fillRect((col) * CELL_SIZE_GAME, (row) * CELL_SIZE_GAME, CELL_SIZE_GAME, CELL_SIZE_GAME);
            }
        }
    }
}
//Fonction qui redessine le CANVA de la grille de la prochaine pièce du joueur quand la future pièce change
function updateNextGrid(player){
    if (player.id == 1) {
        ctxNextPiece1.clearRect(0, 0, canvasForPieceNextP1.width, canvasForPieceNextP1.height);
        // Ali si tu veux que la grille de la next pièce soit visible, c'est le commentaire en dessous qui définit ça
        /*
        ctxNextPiece1.strokeStyle = 'red';
        for (let row = 0; row < 4; row++) {
            for (let col = 0; col < 4; col++) {
                ctxNextPiece1.strokeRect(col * (CELL_SIZE/2), row * (CELL_SIZE/2), (CELL_SIZE/2), (CELL_SIZE/2));
            }
        }
        */
    }else{
        ctxNextPiece2.clearRect(0, 0, canvasForPieceNextP2.width, canvasForPieceNextP2.height);
        /*ctxNextPiece2.strokeStyle = 'red';        // Ali si tu veux que la grille de la next pièce soit visible, c'est le commentaire en dessous qui définit ça
        for (let row = 0; row < 4; row++) {
            for (let col = 0; col < 4; col++) {
                ctxNextPiece2.strokeRect(col * (CELL_SIZE/2), row * (CELL_SIZE/2), (CELL_SIZE/2), (CELL_SIZE/2));
            }
        }
        */
    }
}
// Fonction qui redessine le CANVA de la grille de jeu lorsqu'un joueur compléte une ligne
function clearGridLine(){
    for (let row = 0; row < gridOfGame.length; row++) {
        for (let col = 0; col < gridOfGame[row].length; col++) {
            if (gridOfGame[row][col] != 0) {
                let color = new String(gridOfGame[row][col]);
                ctx.fillStyle = color;
                ctx.fillRect((col) * CELL_SIZE_GAME, (row) * CELL_SIZE_GAME, CELL_SIZE_GAME, CELL_SIZE_GAME);
            }else{
                /*
                ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
                ctx.fillRect((col) * CELL_SIZE_GAME, (row) * CELL_SIZE_GAME, CELL_SIZE_GAME, CELL_SIZE_GAME);
                ctx.strokeStyle = "blue";
                */
                ctx.clearRect((col) * CELL_SIZE_GAME, (row) * CELL_SIZE_GAME, CELL_SIZE_GAME, CELL_SIZE_GAME);
            }
        }
    }
}
// Efface la div où les futures pièces à jouer sont dessinées
function initNextPieceGrid(){
    ctxNextPiece1.clearRect(0, 0, canvasForPieceNextP1.width, canvasForPieceNextP1.height);
    ctxNextPiece2.clearRect(0, 0, canvasForPieceNextP2.width, canvasForPieceNextP2.height);
}
// Fonction qui ajoute la pièce du joueur à la grille du jeu
function addToGrid(player){
    for (let row = 0; row < player.currentPiece.shape.length; row++) {
        for (let col = 0; col < player.currentPiece.shape[row].length; col++) {
            if (player.currentPiece.shape[row][col] == 1) {
                gridOfGame[player.currentY + row][ player.currentX + col] = findColor(player);
                /*
                ctx.fillStyle = gridOfGame[player.currentY + row][player.currentX + col];
                ctx.fillRect((player.currentY + row ) * CELL_SIZE, (player.currentX + col ) * CELL_SIZE, CELL_SIZE, CELL_SIZE);
                */
            }
        }
    }
}
// Fonction qui test si une ligne est complétée lors du placement d'une pièce sur la grille de jeu
function testCompletationLigne(){
    var ligneCompletedRow = []
    for (let row = 0; row < gridOfGame.length; row++) {
        var nbrOfSquareDrawed = COLS
        for (let col = 0; col < gridOfGame[row].length; col++) {
            if (gridOfGame[row][col] === 0) {
                nbrOfSquareDrawed--;
            }
        }
        if (nbrOfSquareDrawed == COLS) {
            ligneCompletedRow.push(row)
        }
    }
    // Si on a au moins une ligne complétée, on appelle la fonction qui va descendre la grille et ensuite, on incrémente le score.
    if (ligneCompletedRow.length > 0) {
        ligneCompletSoundEffect.play();
        shiftRows(ligneCompletedRow)
        clearGridLine()
        scoreUp(ligneCompletedRow.length)
        lvlChangeDom(ligneCompletedRow.length)
    }
}
// Fonction qui fait disparaître du tableau de la grille de jeu la ligne complétée (elle ne s'occupe pas du CANVA de la grille de jeu)
function shiftRows(nbrLigneTargetArray) {
    var numCols = gridOfGame[0].length;
    for (let count = 0; count < nbrLigneTargetArray.length; count++) {
        var newGrid = [];
        var nbrLigneTarget = nbrLigneTargetArray[count]
        for (let i = 0; i < gridOfGame.length; i++) {
            if (i === 0) {
                newGrid.push(new Array(numCols).fill(0)); // Ajoute une ligne vide pour les lignes avant la ligne spécifiée
            }else if (i < nbrLigneTarget+1) {
                newGrid.push(gridOfGame[i - 1]); // Décale les lignes après la ligne spécifiée
            }else if (i > nbrLigneTarget) {
                newGrid.push(gridOfGame[i]); // Décale les lignes après la ligne spécifiée
            }
        }
        gridOfGame = newGrid;
    }
    return true;
}

/*                                                      */
/* FONCTIONS EN RAPPORT AUX PIECES ET AUX CANVAS RELATIF */
/*                                                      */
// Fonction permettant de trouver la couleur de la pièce en fonction du tableau de couleur choisi par le joueur
function findColor(player){
    if (player.currentPiece.name != "LineY") {
        var index = Pieces.findIndex(item => item.name === player.currentPiece.name);
    }else{
        var index = 0;
    }
    let colorOfPlayer = Colors.find(item => item.name === player.color);
    return (colorOfPlayer.gradient[index])
}
function findColorForNextPiece(player){
    if (player.nextPiece.name != "LineY") {
        var index = Pieces.findIndex(item => item.name === player.nextPiece.name);
    }else{
        var index = 0;
    }
    let colorOfPlayer = Colors.find(item => item.name === player.color);
    return (colorOfPlayer.gradient[index])
}
// Fonction qui dessine une pièce en fonction de la couleur du joueur
function drawPiece(ctx, player) {
    var row = player.currentY;
    var col = player.currentX;
    pieceShape = player.currentPiece.shape;
    var color = findColor(player)
    if (modeGhost == true) {
      //  ajouter ici l'activation de l'effet transparent pour le mod ghost, soit par un array de couleur différente incluant la transparence ou en ajout à la volé par modification du text couleur récupere par findcolor()
    }
    for (let r = 0; r < pieceShape.length; r++) {
        for (let c = 0; c < pieceShape[r].length; c++) {
            if (pieceShape[r][c]) {
                ctx.fillStyle = color;
                ctx.fillRect((col + c) * CELL_SIZE_GAME, (row + r) * CELL_SIZE_GAME, CELL_SIZE_GAME, CELL_SIZE_GAME);
                // "transparent n'existe pas mais cela empeche le fait de faire re-apparaitre les lignes rouges de la grille"
                ctx.strokeStyle = "transparent";
                ctx.strokeRect((col + c) * CELL_SIZE_GAME, (row + r) * CELL_SIZE_GAME, CELL_SIZE_GAME, CELL_SIZE_GAME);
            }
        }
    }
}
// Fonction qui efface une pièce
function clearPiece(ctx, player) {
    let row = player.currentY;
    let col = player.currentX;
    let pieceShape = player.currentPiece.shape;
    for (let r = 0; r < pieceShape.length; r++) {
      for (let c = 0; c < pieceShape[r].length; c++) {
        if (pieceShape[r][c]) {
          ctx.clearRect((col + c) * CELL_SIZE_GAME, (row + r) * CELL_SIZE_GAME, CELL_SIZE_GAME, CELL_SIZE_GAME);
          ctx.strokeRect((col + c) * CELL_SIZE_GAME, (row + r) * CELL_SIZE_GAME, CELL_SIZE_GAME, CELL_SIZE_GAME);
        }
      }
    }
}
// Fonction qui déplace la pièce en fonction de la direction choisie, si la fonction test de collision ne détecte pas de collision
function movePiece(direction, player, anotherPlayer){
    const returnTestingCollision = collisionTest(direction, player, anotherPlayer)
    // "hit" == colide with the botom of grid or placed piece, "notAllowed" == colide with another piece of player or the side of the grid, "empty" == no colide at all, "playerTouched" colide with another piece of player
    if (returnTestingCollision === "empty") {
        if (direction === "down") {
            player.currentY++;
        }else if(direction === "right") {
            player.currentX++;
        }else if(direction === "left") {
            player.currentX--;
        }
    }else if(returnTestingCollision === "notAllowed"){
        // nothing change
    }else if(returnTestingCollision === "playerTouched"){
        // nothing change
    }else if(returnTestingCollision === "hit"){
        if (player.id == 1) {//si p1 à placé une pièce on test si p2 partage une position avec la pièce de p1
            if (testAnotherPlayerPosition(Player2, Player1)) {
                addToGrid(Player2, Player1)
                restartPiece(Player2, Player1)
                updateNextGrid(Player2, Player1)
                drawNextPieceGrid(Player2, Player1)
            }
        }else{// à l'inverse on test la pièce de p1
            if (testAnotherPlayerPosition(Player1, Player2)) {
                addToGrid(Player1, Player2)
                restartPiece(Player1, Player2)
                updateNextGrid(Player1, Player2)
                drawNextPieceGrid(Player1, Player2)
            }
        }
        addToGrid(player)
        updateGrid()
        restartPiece(player)
        updateNextGrid(player)
        drawNextPieceGrid(player)
        if(testEndGame()){gameOver()}
    }
}

// Ici, nous vérifions toutes les positions (x, y) occupées par le joueur qui place sa pièce sur la grille, et nous vérifions si l'autre joueur a au moins une partie de sa pièce qui occupe le même emplacement. Si c'est le cas, nous renvoyons true ; sinon, false.
function testAnotherPlayerPosition(theTestedPlayer, thePlacedPlayer){
    var pieceOfthePlacedPlayer = thePlacedPlayer.currentPiece;
    var actualYthePlacedPlayer = thePlacedPlayer.currentY;
    var actualXthePlacedPlayer = thePlacedPlayer.currentX;

    var pieceOftheTestedPlayer = theTestedPlayer.currentPiece;
    var actualYtheTestedPlayer = theTestedPlayer.currentY;
    var actualXtheTestedPlayer = theTestedPlayer.currentX;

    for (let indexYthePlacedPlayer = 0; indexYthePlacedPlayer < pieceOfthePlacedPlayer.shape.length; indexYthePlacedPlayer++) {
        for (let indexXthePlacedPlayer = 0; indexXthePlacedPlayer < pieceOfthePlacedPlayer.shape[indexYthePlacedPlayer].length; indexXthePlacedPlayer++) {
            if (pieceOfthePlacedPlayer.shape[indexYthePlacedPlayer][indexXthePlacedPlayer] == 1) {//si c'est un index réelement occupé sur la grille shape de la pièce
                let yPlacedPlayer = indexYthePlacedPlayer + actualYthePlacedPlayer;
                let xPlacedPlayer = indexXthePlacedPlayer + actualXthePlacedPlayer;
                for (let indexYtheTestedPlayer = 0; indexYtheTestedPlayer < pieceOftheTestedPlayer.shape.length; indexYtheTestedPlayer++) {
                    for (let indexXtheTestedPlayer = 0; indexXtheTestedPlayer < pieceOftheTestedPlayer.shape[indexYtheTestedPlayer].length; indexXtheTestedPlayer++) {
                        if (pieceOftheTestedPlayer.shape[indexYtheTestedPlayer][indexXtheTestedPlayer] == 1) {
                            let yTestedPlayer = indexYtheTestedPlayer + actualYtheTestedPlayer;
                            let xTestedPlayer = indexXtheTestedPlayer + actualXtheTestedPlayer;
                            if (yPlacedPlayer === yTestedPlayer && xPlacedPlayer == xTestedPlayer) {
                                console.log("hit")
                                return true;
                            }
                        }
                    }
                }
            }
        }
    }
    return false;
}


// Fonction qui empêche le joueur de sortir sa pièce de la grille du jeu en prenant bien en compte la taille de la pièce actuelle en plus de la position du joueur
function moveIfOutOfGrid(player){
    var piece = player.currentPiece
    console.log(player.currentX)

    var maxLength = 0;
    for (let index = 0; index < piece.shape.length; index++) {
        var currentTest = 0;
        for (let index2 = 0; index2 < piece.shape[index].length; index2++) {
            if (piece.shape[index][index2] == 1) {
                currentTest = index2
            }
        }
        if (currentTest > maxLength) {
            maxLength = currentTest;
        }
    }
    var minX = 4;
    for (let index = 0; index < piece.shape.length; index++) {
        var currentTest = 0;
        for (let index2 = 0; index2 < piece.shape[index].length; index2++) {
            if (piece.shape[index][index2] == 1) {
                currentTest = index2
            }
        }
        if (currentTest < minX) {
            minX = currentTest;
        }
    }
    if (maxLength + player.currentX > (COLS - 1)) {
        let excess = ((maxLength + player.currentX) - (COLS - 1))
        player.currentX = player.currentX - excess;
    }else if(player.currentX < 0 ){
        player.currentX=0;
    }
    return true;
}
// Fonction qui fait tourner la pièce du joueur.
function rotatePiece(player, anotherPlayer) {
    // On crée une nouvelle pièce pivotée
    var piece = player.currentPiece
    var piece2 = anotherPlayer.currentPiece
    var newPiece = {
      name: piece.name,
      shape: []
    };
    if (piece.name == "Line") {
        newPiece = LineShape[0];
    }else if(piece.name == "LineY") {
        let index = Pieces.findIndex(item => item.name === "Line");
        newPiece = Pieces[index];
    }else{
        const size = piece.shape.length;
        for (let i = 0; i < size; i++) {
            newPiece.shape.push([]);
        }
        for (let row = 0; row < size; row++) {
            for (let col = 0; col < size; col++) {
                newPiece.shape[col][size - 1 - row] = piece.shape[row][col];
            }
        }
    }
    // test si la piece apres rotation est dans des cases libres
    // + test si mode ghost activé, la piece n'est pas non plus superposée à celle de l'autre joueur
    for (let indexY = 0; indexY < newPiece.shape.length; indexY++) {
        for (let indexX = 0; indexX < newPiece.shape[indexY].length; indexX++) {
            if (newPiece.shape[indexY][indexX] !== 0) {
                if (typeof (gridOfGame[player.currentY + indexY]) !== 'undefined') {
                    if (typeof (gridOfGame[player.currentY + indexY][player.currentX + indexX]) !== 'undefined') {
                        placeTested = gridOfGame[player.currentY + indexY][player.currentX + indexX]
                        if (placeTested !== 0) {return player.currentPiece;}
                    }else{return player.currentPiece;}
                }else{return player.currentPiece;} 
                if (modeGhost === false) {
                    for (let indexYAnotherPlayer = 0; indexYAnotherPlayer < piece2.shape.length; indexYAnotherPlayer++) {
                        for (let indexXAnotherPlayer = 0; indexXAnotherPlayer < piece2.shape[indexYAnotherPlayer].length; indexXAnotherPlayer++) {
                            if (piece2.shape[indexYAnotherPlayer][indexXAnotherPlayer] !== 0) {
                                if ((player.currentY + indexY  == anotherPlayer.currentY + indexYAnotherPlayer) && (player.currentX + indexX == anotherPlayer.currentX + indexXAnotherPlayer)) {return player.currentPiece;}
                            }
                        }
                    }
                }   
            }
        }
    }
    return newPiece;
}
// Fonction qui fait repartir la pièce du joueur depuis le haut de la grille du jeu
function restartPiece(player){
    if (player.id == 2) {
        player.currentX = 6;
    }else{
        player.currentX = 1;
    }
    player.currentY = 0;
    player.currentPiece = player.nextPiece;

    /* for test*/
    player.nextPiece = Pieces[Math.floor(Math.random()*Pieces.length)];
}
// Function qui test la collision d'une pièce en prenant en compte le déplacement de celle-ci et la position de l'autre joueur
function collisionTest(direction, player, anotherPlayer) {
    const piece = player.currentPiece;
    const piece2 = anotherPlayer.currentPiece;
    let potentialChangingForX = 0;
    let potentialChangingForY = 0;
    if (direction == "down") {
        potentialChangingForY = 1;
    }else if(direction == "left"){
        potentialChangingForX = (-1);
    }else if(direction == "right"){
        potentialChangingForX = 1;
    }
    // #---> : X
    // |
    // V ; Y
    for (let indexY = 0; indexY < piece.shape.length; indexY++) {
        for (let indexX = 0; indexX < piece.shape[indexY].length; indexX++) {
            // On verifie que la coordonée [Y-X] du tableau de la piece contient de la couleur, sinon se n'est pas la peine de tester la collision
            if (piece.shape[indexY][indexX] !== 0) {
                if (typeof (gridOfGame[player.currentY + indexY + potentialChangingForY ]) !== 'undefined') {
                    if ((gridOfGame[player.currentY + indexY + potentialChangingForY ][ player.currentX + indexX + potentialChangingForX]) !== 0) {
                        if (direction == "down") {
                            somePlayerHitGrid = true;
                            return "hit";
                        }else{
                            return "notAllowed";
                        }
                    }
                    if (modeGhost === false) {
                        for (let indexYAnotherPlayer = 0; indexYAnotherPlayer < piece2.shape.length; indexYAnotherPlayer++) {
                            for (let indexXAnotherPlayer = 0; indexXAnotherPlayer < piece2.shape[indexYAnotherPlayer].length; indexXAnotherPlayer++) {
                                if (piece2.shape[indexYAnotherPlayer][indexXAnotherPlayer] !== 0) {
                                    if ((player.currentY + indexY + potentialChangingForY  == anotherPlayer.currentY + indexYAnotherPlayer) && (player.currentX + indexX + potentialChangingForX == anotherPlayer.currentX + indexXAnotherPlayer)) {
                                        return "playerTouched";
                                    }
                                }
                            }
                        }
                    }
                }else{
                    somePlayerHitGrid = true;
                    return "hit";
                }
            }
        }
    }
    return "empty";
}

/*                                              */
/* FONCTION EN RAPPORT AU SCORE ET HTML RELATIF */
/*                                              */

// Fonction qui change le score, lorsqu'une ligne est complétée en fonction du LVL de difficulté actuel et du nombre de lignes complétée en même temps
function scoreUp(countLigneFull){
    var newscore = scoreActual + (levelActualObject.gain)
    //si plusieur lignes sont complétées d'un coup un bonus de points est accordé
    if      (countLigneFull == 2) {newscore = newscore + (levelActualObject.gain * 2,5)}
    else if (countLigneFull == 3) {newscore = newscore + (levelActualObject.gain * 3,8) }
    else if (countLigneFull == 4) {newscore = newscore + (levelActualObject.gain * 5,5)}
    else if (countLigneFull == 5) {newscore = newscore + (levelActualObject.gain * 7)}
    else if (countLigneFull == 6) {newscore = newscore + (levelActualObject.gain * 9)}
    else if (countLigneFull == 7) {newscore = newscore + (levelActualObject.gain * 11)}
    newscore =  Math.ceil(newscore)
    scoreDiv.textContent = newscore;
    scoreActual = newscore;
    return true;
}

// Fonction qui s'occupe de changer le lvl (et son affichage) après une ligne complétée si le palier est atteint
function lvlChangeDom(countLigneFull) {
    //si on est déjà au niveau max on met juste à jour le DOM avec des chiffres négatifs
    console.log("actualGoal",actualGoal)
    if ( tetrissScalingLevels.length === (levelActualObject.level+1)) {
        actualGoal -= countLigneFull;
        nextlevelDiv.textContent= "[-"+actualGoal+']';
        return true;
    }else{
        actualGoal -= countLigneFull;
        if (actualGoal <= 0) {//palier atteint ou dépassé
            console.log("palier atteint")
            levelActualObject = tetrissScalingLevels[levelActualObject.level + 1]
            actualGoal = levelActualObject.target;
            //change DOM
            levelDiv.textContent = levelActualObject.level;
            gameSpeed = levelActualObject.gameSpeed;
        }
        nextlevelDiv.textContent= actualGoal;
    }
    console.log("actualGoal",actualGoal)
    return true;
}

// Fonction qui vérifie que lorsque une pièce est placée que celle-ci ne touche pas la ligne 0 de la grille du jeu
function testEndGame() {
    for (let col = 0; col < gridOfGame[0].length; col++) {
        if (gridOfGame[0][col] !== 0) {
            console.log("END GAME OVER")
            return true;
        }
    }
}


/*               */
/* FONCTIONS MAIN */
/*               */
// La fonction principale du jeu qui attend qu'une touche soit appuyée pour changer la pièce du joueur dans une direction et alors redessinée celle-ci sur la grille du jeu. Cette fonction est récursive du moment que le jeu n'est pas terminé.
var gamelauched = false
function gameLoop() {
    if (gameOnPause) {
        return;
    }
    if (isEnd) {
        document.removeEventListener('keyup', handleKeyPress);
        gamelauched = false
        return true;
    }
    drawPiece(ctx, Player1);
    drawPiece(ctx, Player2);
    counter++;
    if (counter === gameSpeed) {
        clearPiece(ctx, Player1);
        clearPiece(ctx, Player2);
        movePiece("down" , Player1, Player2);
        movePiece("down" , Player2, Player1);
        counter = 0;
    }
    if (somePlayerHitGrid) {
        somePlayerHitGrid = false;
        if (placedSoundEffect.duration > 0 && !placedSoundEffect.paused) {
            placedSoundEffect.pause();
            placedSoundEffect.currentTime = 0;
        }
        placedSoundEffect.play();
        testCompletationLigne()
    }
    if (gamelauched == false) {
        document.addEventListener('keyup', handleKeyPress);
        gamelauched = true;
    }
    if (!isEnd) {
        requestAnimationFrame(gameLoop);
    }
}
function handleKeyPress(event) {
    const now = Date.now(); // temps actuel en millisecondes
    switch (event.keyCode) {
        case 37: // arrow left
            if (now - lastMoveTime < MOVE_DELAY) {return;}
            lastMoveTime = now;
            clearPiece(ctx, Player2);
            movePiece("left", Player2, Player1);
            break;
        case 39: // arrow right
            if (now - lastMoveTime < MOVE_DELAY) {return;}
            lastMoveTime = now;
            clearPiece(ctx, Player2);
            movePiece("right", Player2, Player1);
            break;
        case 38: // flèche haut
            if (now - lastMoveTime < MOVE_DELAY) {return;}
            lastMoveTime = now;
            clearPiece(ctx, Player2);
            Player2.currentPiece = rotatePiece(Player2, Player1);
            moveIfOutOfGrid(Player2)
            break;
        case 40: // flèche bas
            if (now - lastMoveTime < MOVE_DELAY) {return;}
            lastMoveTime = now;
            clearPiece(ctx, Player2);
            movePiece("down", Player2, Player1);
            break;
        case 81: // Q Left
            if (now - lastMoveTime2 < MOVE_DELAY) {return;}
            lastMoveTime2 = now;
            clearPiece(ctx, Player1);
            movePiece("left", Player1, Player2);
            break;
        case 90: // Z Rotate
        if (now - lastMoveTime2 < MOVE_DELAY) {return;}
            lastMoveTime2 = now;
            clearPiece(ctx, Player1);
            Player1.currentPiece = rotatePiece(Player1, Player2);
            moveIfOutOfGrid(Player1)
            break;
        case 83: // S Down
            if (now - lastMoveTime2 < MOVE_DELAY) {return;}
            lastMoveTime2 = now;
            clearPiece(ctx, Player1);
            movePiece("down", Player1, Player2);
            break;
        case 68: // D Right
            if (now - lastMoveTime2 < MOVE_DELAY) {return;}
            lastMoveTime2 = now;
            clearPiece(ctx, Player1);
            movePiece("right", Player1, Player2);
            break;
      }
}

function initGrid(){
    for (let row = 0; row < ROWS; row++) {
        gridOfGame[row] = [];
        for (let col = 0; col < COLS; col++) {
            gridOfGame[row][col] = 0;
        }
    }
}
function initConfig(){
    Player1.currentX = 1;
    Player1.currentY = 0;
    Player2.currentX = 6;
    Player2.currentY = 0;

    Player1.currentPiece = Pieces[Math.floor(Math.random()*Pieces.length)];
    Player1.nextPiece = Pieces[Math.floor(Math.random()*Pieces.length)];
    Player2.currentPiece = Pieces[Math.floor(Math.random()*Pieces.length)];
    Player2.nextPiece = Pieces[Math.floor(Math.random()*Pieces.length)];

    let index = Pieces.findIndex(item => item.name === "Line");
    Player1.currentPiece = Pieces[index];
    /*
    index = Pieces.findIndex(item => item.name === "S");
    Player2.currentPiece = Pieces[index];
    */
}
function startGame(){
    //  Si le jeu est relancé, il faut remettre certaines variables à leurs valeurs par défaut.
    if (isEnd) {
        isEnd = false;
        counter = 0;
        lastMoveTime = 0;
        lastMoveTime2 = 0;
        gridOfGame = [[]];
        scoreActual = 0;
        lastMoveTime = 0;
        lastMoveTime2 = 0;
    }
    if (indexForDifficuly == 0) {
        levelActualObject = tetrissScalingLevels[0];
    } else if (indexForDifficuly == 1) {
        levelActualObject = tetrissScalingLevels[4];
    } else{
        levelActualObject = tetrissScalingLevels[8];
    }
        console.log(levelActualObject)
        gameSpeed = levelActualObject.gameSpeed;  
    actualGoal = levelActualObject.target
    scoreDiv.textContent = "00";
    levelDiv.textContent = levelActualObject.level;
    nextlevelDiv.textContent = levelActualObject.target;
    initConfig()
    initGrid();
    initNextPieceGrid()
    drawNextPieceGrid(Player1)
    drawNextPieceGrid(Player2)
    drawGrid();
    gameLoop();
    return true;
}

// HTML DOM VARIABLE //
const gameW = document.getElementById('game-container');
gameW.style.display = "none";
const menuW = document.getElementById('menu-container');
const overlayMenu = document.getElementById('overlay');
const overlayGameOverMenu = document.getElementById('overlayGameOver');
const soloBtn = document.getElementById("soloBtn");
const multiBtn = document.getElementById("multiBtn");
const btnColorJ1 = document.getElementById("selectedColorJ1");
const btnColorJ2 = document.getElementById("selectedColorJ2");
const startBtn = document.getElementById("startBtn");
const modeGhostBtn = document.getElementById('btnGhost');
const menuBtn = document.getElementById('menuBtn');
const menuBtnS = document.getElementById('menuBtnS');

btnColorJ1.innerHTML = Player1.color;
btnColorJ2.innerHTML = Player2.color;
btnColorJ1.className = Player1.color;
btnColorJ2.className = Player2.color;

// CHANGE GOST MOD PART //
const ledGhost = document.getElementById('colorGhost');
modeGhostBtn.addEventListener("click", function() {
    if (modeGhost) {
        // ALI a ajouté les leds ici :
        modeGhost = false;
        ledGhost.classList.remove("ezColor")
        console.log("modeGhost OFF")
    }else{
        modeGhost = true;
        ledGhost.classList.add("ezColor")
        console.log("modeGhost ON")
    }
});

// ICI leds pour le bouton difficulté : //
const btnDiff = document.getElementById("btnDiff")
const ledDiff = document.getElementById("colorDiff");
btnDiff.addEventListener("click", function() {
    changeDiff()
});
function changeDiff(){
    if (indexForDifficuly == 0){
        console.log("ez");
        indexForDifficuly++;
        ledDiff.classList.remove('hardColor');
        ledDiff.classList.add("ezColor");
    }
    else if (indexForDifficuly == 1){
        indexForDifficuly++;
        console.log("med");
        ledDiff.classList.remove('ezColor');
        ledDiff.classList.add('medColor');
    }
    else if (indexForDifficuly == 2){
        indexForDifficuly = 0;
        console.log("hard");
        ledDiff.classList.remove('medColor');
        ledDiff.classList.add('hardColor');
    }
}

// RETURN MENU BTN
menuBtn.addEventListener("click", function() {
    togglePauseMenu();
});
// RETURN MENU BTN smartphone
menuBtnS.addEventListener("click", function() {
    menuW.style.display = "block";
    gameW.style.display = "none";
    isEnd = true;
});

// CHANGE COLOR PLAYER PART //
var actualColorInArrayindex1 = 0
var actualColorInArrayindex2 = 1
btnColorJ1.addEventListener("click", function() {
    changeColor(1)
});
btnColorJ2.addEventListener("click", function() {
    changeColor(2)
});
function changeColor(index)
{
    if (index == 1) {
        actualColorInArrayindex1++;
        var color = Colors[actualColorInArrayindex1]
        if (color == null) {
            actualColorInArrayindex1 = -1;
            changeColor(1)
        }else{
            if (actualColorInArrayindex1 != actualColorInArrayindex2) {
                Player1.color = color.name
                btnColorJ1.innerHTML = color.name;
                btnColorJ1.className = color.name;
            }else{
                changeColor(1)
            }
        }
    }else{
        actualColorInArrayindex2++;
        var color = Colors[actualColorInArrayindex2]
        if (color == null) {
            actualColorInArrayindex2 = -1;
            changeColor(2)
        }else{
            if (actualColorInArrayindex1 != actualColorInArrayindex2) {
                Player2.color = color.name
                btnColorJ2.innerHTML = color.name;
                btnColorJ2.className = color.name;
            }else{
                changeColor(2)
            }
        }
    }
}

// START BTN ACTION //
startBtn.addEventListener("click", function() {
    menuW.style.display = "none";
    gameW.style.display = "flex";

    startGame()
});

/* --- SOUND PART START --- */
const placedSoundEffect = document.getElementById('placedSoundEffect');
const ligneCompletSoundEffect = document.getElementById('ligneCompletSoundEffect');
const backgroundMusic = document.getElementById('backgroundMusic');

const volumeMusicUp = document.getElementById("volumeMusicUp");
const volumeMusicDown = document.getElementById("volumeMusicDown");
const volumeEffectUp = document.getElementById("volumeEffectUp");
const volumeEffectDown = document.getElementById("volumeEffectDown");
const volumeMusicActual = document.getElementById("volumeMusicActual");
const volumeEffectActual = document.getElementById("volumeEffectActual");
const playMusicButton = document.getElementById("playMusicButton");
const playMusicButtonMenu = document.getElementById("playMusicButtonMenu");
const musicIsPlayed = document.getElementById("musicIsPlayed");
const musicIsPlayedMenu = document.getElementById("musicIsPlayedMenu");

var volumeMusic = 5;
var volumeEffect = 5;
var musicPlayBool = false;
backgroundMusic.volume = 0.5;
placedSoundEffect.volume = 0.5;
ligneCompletSoundEffect.volume = 0.5;

volumeMusicUp.addEventListener("click", function() {
    if (volumeMusic <10) {
        volumeMusic = volumeMusic +1; 
        volumeMusicActual.innerHTML=volumeMusic;
        backgroundMusic.volume += 0.1; // Augmente le volume de 0.1 (10%)
    }
});
volumeMusicDown.addEventListener("click", function() {
    if (volumeMusic >0) {
        volumeMusic = volumeMusic -1; 
        volumeMusicActual.innerHTML=volumeMusic;
        backgroundMusic.volume -= 0.1; // Diminue le volume de 0.1 (10%)
    }
});
volumeEffectUp.addEventListener("click", function() {
    if (volumeEffect <10) {
        volumeEffect = volumeEffect +1; 
        volumeEffectActual.innerHTML=volumeEffect;
        placedSoundEffect.volume += 0.1;
        ligneCompletSoundEffect.volume += 0.1;
        if (placedSoundEffect.duration > 0 && !placedSoundEffect.paused) {
            placedSoundEffect.pause();
            placedSoundEffect.currentTime = 0; // Remettre la lecture au début du son
        }
        placedSoundEffect.play();
    }
});
volumeEffectDown.addEventListener("click", function() {
    if (volumeEffect >0) {
        volumeEffect = volumeEffect -1; 
        volumeEffectActual.innerHTML=volumeEffect;
        placedSoundEffect.volume -= 0.1;
        ligneCompletSoundEffect.volume -= 0.1;
        if (placedSoundEffect.duration > 0 && !placedSoundEffect.paused) {
            placedSoundEffect.pause();
            placedSoundEffect.currentTime = 0; // Remettre la lecture au début du son
        }
        placedSoundEffect.play();
    }
});

function turnMusicOnOff(){
    if (musicPlayBool) {
        musicPlayBool = false;
        backgroundMusic.pause()
        musicIsPlayed.innerHTML="OFF"
        musicIsPlayedMenu.innerHTML="OFF"
    }else{
        musicPlayBool = true;
        backgroundMusic.play()
        console.log("Son en cours de lecture.");
        musicIsPlayed.innerHTML="ON"
        musicIsPlayedMenu.innerHTML="ON"
    }
}
playMusicButton.addEventListener("click", () => {turnMusicOnOff()});
playMusicButtonMenu.addEventListener("click", () => {turnMusicOnOff()});
/* --- SOUND PART END --- */

// --- Détection des clics sur le pad graphique en mode vue de téléphone < 500px PART START --- //
document.getElementsByClassName('leftPad')[1].addEventListener("click", () => {handleKeyPress(object = {keyCode: 37})});
document.getElementsByClassName('rightPad')[1].addEventListener("click", () => {handleKeyPress(object = {keyCode: 39})});
document.getElementsByClassName('upPad')[1].addEventListener("click", () => {handleKeyPress(object = {keyCode: 38})});
document.getElementsByClassName('downPad')[1].addEventListener("click", () => {handleKeyPress(object = {keyCode: 40})});

document.getElementsByClassName('leftPad')[0].addEventListener("click", () => {handleKeyPress(object = {keyCode: 81})});
document.getElementsByClassName('rightPad')[0].addEventListener("click", () => {handleKeyPress(object = {keyCode: 68})});
document.getElementsByClassName('upPad')[0].addEventListener("click", () => {handleKeyPress(object = {keyCode: 90})});
document.getElementsByClassName('downPad')[0].addEventListener("click", () => {handleKeyPress(object = {keyCode: 83})});
// --- Détection des clics sur le pad graphique en mode vue de téléphone < 500px PART END --- //


// --- Menu Pause PART START --- //
document.addEventListener('keydown', function (event) {
    if (isEnd == false) {
        if (event.key === 'Escape') {
            togglePauseMenu();
        }
    }
});

document.getElementById('continueBtn').addEventListener('click', function () {
    gameOnPause = false;
    gameLoop()
    overlayMenu.style.display = (overlayMenu.style.display === 'flex') ? 'none' : 'flex';
});

function exit() {
    overlayMenu.style.display = 'none';
    overlayGameOverMenu.style.display = 'none';
    menuW.style.display = "block";
    gameW.style.display = "none";
    isEnd = true;
    gameOnPause = false;
}
document.getElementById('exitBtn').addEventListener('click', function () {
    exit();
});

function togglePauseMenu() {
    if (gameOnPause == false) {
        gameOnPause = true
    }else{
        gameOnPause = false;
        gameLoop()
    }
    overlayMenu.style.display = (overlayMenu.style.display === 'flex') ? 'none' : 'flex';
}