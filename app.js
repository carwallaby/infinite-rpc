// page element variables
var choiceButtons = document.getElementsByClassName('choice'),
    submitButton = document.getElementById('submit'),
    displayedScores = document.getElementsByClassName('score-display'),
    outcomeText = document.getElementById('outcome');

// user variables
var userScores = {
    totalGames: 0,
    totalWins: 0,
    currentStreak: 0,
    highScore: 0
};
var userChoice = null;

function animateOutcome(outcome) {
    // blink the outcome text green so it is obvious a turn happened, in case user got same result
    outcomeText.classList.add(outcome);
    setTimeout(function() {
        outcomeText.classList.remove(outcome);
    }, 500);
}

function animateHighScore() {
    var highScore = document.getElementsByClassName('high-score')[0];
    highScore.classList.add('activated');
    setTimeout(function() {
        highScore.classList.remove('activated');
    }, 500);
}

function selectChoice(element) {
    // store user's choice
    var choice = element.dataset.choice;
    element.classList.add('selected');

    // update current choice
    if (choice !== userChoice) {
        userChoice = choice;
        Array.prototype.forEach.call(choiceButtons, function(el, i) {
            if (el !== element) {
                // remove selected class from other choices
                el.classList.remove('selected');
            }
        });
    }
}

function getComputerChoice() {
    var randomChoice = Math.floor(Math.random() * 3) + 1;
    if (randomChoice === 3) {
        return 'rock';
    } else if (randomChoice === 2) {
        return 'paper';
    } else {
        return 'scissors';
    }
}

function resetGame() {
    // disable submit button
    submitButton.classList.add('disabled');
    submitButton.removeEventListener('click', playGame);
    // remove current choice
    userChoice = null;
    Array.prototype.forEach.call(choiceButtons, function(el, i) {
        el.classList.remove('selected');
    });
}

function updateScores() {
    // make sure each displayed score is updated when changed
    Array.prototype.forEach.call(displayedScores, function(el, i) {
        var displayedScore = parseInt(el.innerHTML);
        var scoreType = el.dataset.scoreType;
        if (displayedScore !== userScores[scoreType]) {
            el.innerHTML = userScores[scoreType];
        }
    });
}

function calculateWinner(choice1, choice2) {
    // returns winner if game is not a tie
    if (choice1 === choice2) {
        return;
    }
    var winner;
    if (choice1 === 'rock') {
        // paper beats rock, rock beats scissors
        winner = (choice2 === 'paper') ? choice2 : choice1;
    } else if (choice1 === 'paper') {
        // scissors beats paper, paper beats rock
        winner = (choice2 === 'scissors') ? choice2 : choice1;
    } else {
        // rock beats scissors, scissors beats paper
        winner = (choice2 === 'rock') ? choice2 : choice1;
    }
    return winner;
}

function playGame() {
    // tally each game
    userScores['totalGames']++;
    var computerChoice = getComputerChoice();
    // it's a tie, so don't change any other counters
    if (userChoice === computerChoice) {
        outcomeText.innerHTML = 'it\'s a tie! you both picked ' + userChoice + '.';
        animateOutcome('tie');
    } else {
        var winner = calculateWinner(userChoice, computerChoice);
        if (userChoice === winner) {
            outcomeText.innerHTML = 'you win! ' + userChoice + ' beats ' + computerChoice + '!';
            // update win counts
            userScores['totalWins']++;
            userScores['currentStreak']++;
            // update high score if streak has surpassed
            if (userScores['currentStreak'] > userScores['highScore']) {
                userScores['highScore'] = userScores['currentStreak'];
                animateHighScore();
            }
            animateOutcome('win');
        } else {
            outcomeText.innerHTML = 'you lose :( ' + computerChoice + ' beats ' + userChoice + '.';
            // reset winning streak
            userScores['currentStreak'] = 0;
            animateOutcome('lose');
        }
    }
    updateScores();
    resetGame();
}

// add selected class to clicked choices
Array.prototype.forEach.call(choiceButtons, function(el, i) {
    el.addEventListener('click', function(e) {
        selectChoice(el);
        if (submitButton.classList.contains('disabled')) {
            // enable submit button since user has made a choice
            submitButton.classList.remove('disabled');
            submitButton.addEventListener('click', playGame);
        }
    });
});
