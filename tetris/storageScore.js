var bestScoreName = 'Diego';
var bestScore = 100;

//divs score view : array[span]
var elementArrayBestScore = document.getElementsByClassName('tetrissBestScore');
var elementArrayBestScoreName = document.getElementsByClassName('tetrissBestScoreName');

// LOCAL STORAGE SCORE AND UPADATE SCORE HTML-DOM//
function askForConsent() {
    var consent = confirm("We would like to store your scores locally to enhance your gaming experience. Do you accept?");
    if (consent) {
        // Store the consent in localStorage
        localStorage.setItem('consentTetriss', 'accepted');
        localStorage.setItem('nameTetriss', bestScoreName);
        localStorage.setItem('scoreTetriss', bestScore);
    } else {
        // If the user declines consent, clear any stored data
        localStorage.removeItem('consentTetriss');
        localStorage.removeItem('nameTetriss');
        localStorage.removeItem('scoreTetriss');
    }
}

var storedConsent = localStorage.getItem('consentTetriss');
if (!storedConsent) {
    askForConsent();
    changeDomScoreSpan(bestScoreName, bestScore)
}else{
    changeDomScoreSpan(localStorage.getItem('nameTetriss'), localStorage.getItem('scoreTetriss'))
    bestScore = (localStorage.getItem('scoreTetriss'))
}

function changeDomScoreSpan(name, score){
    for (let index = 0; index < elementArrayBestScoreName.length; index++) {
        const element = elementArrayBestScoreName[index];
        element.textContent = name;
    }
    for (let index = 0; index < elementArrayBestScore.length; index++) {
        const element = elementArrayBestScore[index];
        element.textContent = score;
    }
}

// END GAME //
function isBestScore(){
    console.log("scoreActual", scoreActual)
    console.log("bestScore", bestScore)
    return (scoreActual > bestScore)
}

function gameOver() {
    var newName = "Diego";
    var newScore = "200";
    if (isBestScore()) {
        newName = askForName()
        newScore = scoreActual;
        changeDomScoreSpan(newName, newScore)
        if (!storedConsent) {
            localStorage.setItem('nameTetriss', newName);
            localStorage.setItem('scoreTetriss', newScore);
        }
        changeDomScoreSpan(newName, newScore)
        bestScoreName = newName;
        bestScore = newScore;
    }
    isEnd = true;
    displayMenuGameOver()
}
function askForName() {
    // Retrieve the stored name from localStorage
    var storedName = localStorage.getItem('name');
    // Prompt the player for their name with a default value
    var playerName = prompt('GG your score is best ever, please enter your name:', storedName || 'Player');
    // If the player cancels the prompt or enters nothing, use the stored name or a default value
    if (!playerName) {
        playerName = storedName || 'Player';
    }
    return playerName;
}

function displayMenuGameOver(){
    overlayGameOverMenu.style.display = 'flex';
    document.getElementById('score_actual_info_game_over').textContent = scoreActual;
    document.getElementById('lvl_actual_info_game_over').textContent = levelActualObject;
    document.getElementById('tetrissBestScore').textContent = bestScore;
    document.getElementById('tetrissBestScoreName').textContent = bestScoreName;
}
