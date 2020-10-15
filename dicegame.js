/**
 *   @author Withey, Anna (witheya@student.ncmich.edu)
 *   @version 0.0.3
 *   @summary Pig 2 - Dice Game
 */

"use strict";
const PROMPT = require('readline-sync');

let player1 = '', player2 = '', currentPlayer = '', passivePlayer = '';
let p1Score = 0, p2Score = 0, currentScore = 0, passiveScore = 0;
const WINNINGCONDITION = 500;

function main() {
    welcomePlayers();
    gameSequence();
}

main();

function welcomePlayers() {
    let maxNameLength = 15, minNameLength = 1;
    console.log('\nWelcome to Pig 2 the dice game!');
    console.log('           __,---.__                    __,---.__\n' +
        '        ,-\'         `-.            __,-\'         `-.\n' +
        '      &/           `._\\ _\\        /_ /_,\'           \\&\n' +
        '      /               \'\'.         _,\'\'               \\\n' +
        '      |   ,             (")      (")            .    |\n' +
        '      |__,\'`-..--|__|--\'\'         ``--|__|--..-\'`.__|');
    tutorial();
    if (! player1) {
        player1 = String(PROMPT.question('\nPlease enter the name of Player 1: '));
        while (player1.length < minNameLength) {
            player1 = String(PROMPT.question('\nSorry the name you entered is too short. Please enter a different name for Player 1: '));
        }
        while (player1.length > maxNameLength) {
            player1 = String(PROMPT.question('\nSorry the name you entered is too long. Please enter a different name for Player 1: '));
        }
    }
    if (! player2) {
        player2 = String(PROMPT.question('\nPlease enter the name of Player 2: '));
        while (player2.length < minNameLength) {
            player2 = String(PROMPT.question('\nSorry the name you entered is too short. Please enter a different name for Player 2: '));
        }
        while (player2.length > maxNameLength) {
            player2 = String(PROMPT.question('\nSorry the name you entered is too long. Please enter a different name for Player 2: '));
        }
    }
    console.log('\nBeginning game for ' + player1 + ' VS ' + player2 + '...');
}

function tutorial() {
    console.log('\nTutorial:\n' +
        'The dice is rolled to determine who will play first. Each turn the player will \n' +
        'choose whether or not to play the round.\n' +
        'If their turn is skipped, the next player\'s turn will begin.\n' +
        'The player may roll as many timed as they want, however, if either of the dice is a 1,\n' +
        'no points are added to the player\'s overall score and their turn is over.\n' +
        'If BOTH the dice are 1\'s the player\'s entire score goes back to 0 and their turn is over.\n' +
        'If doubles are rolled, the score is doubled.\n' +
        'First player to 500 wins!');
}

function diceRoll() {
    let roll;
    roll = Math.floor((Math.random() * 6)) + 1
    console.log(roll);
    return roll;
}

function gameSequence() {
    let p1, p2;
    console.log('\nRolling dice to see who goes first...');
    p1 = diceRoll();
    p2 = diceRoll();
    console.log('\n' + player1 + '\'s roll: ' + p1 + '  VS  ' + player2 + '\'s roll: ' + p2)
    while (p1 === p2) {
        console.log('\nTie! Rolling again...');
        p1 = diceRoll();
        p2 = diceRoll();
    }
    if (p1 > p2){
        console.log(player1 + ' is the first Pig Player!')
        currentPlayer = player1;
        currentScore = p1Score;
        passivePlayer = player2;
        playerTurn();
    } else {
        console.log(player2 + ' is the first Pig Player!')
        currentPlayer = player2;
        currentScore = p2Score;
        passivePlayer = player1;
        playerTurn();
    }
}

function switchPlayer() {
    if (currentPlayer === player1) {
        p1Score = currentScore;
        currentPlayer = player2;
        passivePlayer = player1;
        passiveScore = p1Score;
        currentScore = p2Score;
    } else {
        p2Score = currentScore;
        currentPlayer = player1;
        passivePlayer = player2;
        passiveScore = p2Score;
        currentScore = p1Score;
    }
}

function restart() {
    switchPlayer();
    playerTurn();
}

function playerTurn() {
    let answer;
    let die1 = 0, die2 = 0, diceTotal = 0;
    let counter = 0;
    let winningScore, losingScore;

    while (p1Score < WINNINGCONDITION || p2Score < WINNINGCONDITION) {
        if (p1Score >= WINNINGCONDITION || p2Score >= WINNINGCONDITION) {
            console.log('\nGAME OVER');
            if (p1Score > p2Score) {
                winningScore = p1Score;
                losingScore = p2Score;
            } else if (p1Score === p2Score) {
                winningScore = p1Score;
                console.log('\nIt\'s a Tie!!! You both scored' + 'winningScore' + '!!!');
            } else {
                winningScore = p2Score;
                losingScore = p1Score;
            }
            console.log('\n' + passivePlayer + ' wins with a score of ' + winningScore + ' points!!!');
            break;
        }
        if (!answer || !/^[yYnN]$/.test(answer)) {
            answer = PROMPT.question('\n' + currentPlayer + ': Do you want to play this turn? (Y/N): ').toLowerCase();
            while (!/^[yYnN]$/.test(answer)) {
                answer = PROMPT.question('\n' + currentPlayer + ': Please enter only Y/N: ').toLowerCase();
            }
            if (answer === 'n') {
                console.log('\n' + currentPlayer + ' skipped their turn. ' + passivePlayer + '\'s turn to roll');
                restart();
                break;
            }
        }
        if (answer === 'y') {
            while (die1 !== 1 && die2 !== 1) {
                die1 = diceRoll();
                die2 = diceRoll();
                if (die1 === die2) {
                    diceTotal = 2 * (die1 + die2);
                    counter += diceTotal;
                    console.log('\nDoubles!!! Score has been doubled!')
                } else {
                    diceTotal = die1 + die2;
                    counter += diceTotal;
                }
                if (die1 === 1 || die2 === 1) {
                    counter = 0;
                    console.log(currentPlayer + ' rolled a 1! ' + currentPlayer + '\'s turn is over. Score has been discarded.');
                    console.log('\n' + currentPlayer + '\'s score: ' + currentScore + '   -   ' + passivePlayer + '\'s score: ' + passiveScore);
                    console.log('\n' + passivePlayer + '\'s turn to roll.');
                    restart();
                    break;
                }
                if (die1 === 1 && die2 === 1) {
                    counter = 0;
                    currentScore = 0;
                    console.log(currentPlayer + ' rolled two 1\'s! ' + currentPlayer + '\'s turn is over. Overall score has been reset.');
                    console.log('\n' + currentPlayer + '\'s score: ' + currentScore + '   -   ' + passivePlayer + '\'s score: ' + passiveScore);
                    console.log('\n' + passivePlayer + '\'s turn to roll.');
                    restart();
                    break;
                }
                console.log('\n' + currentPlayer + ': You rolled ' + diceTotal + '!');
                console.log('\n' + currentPlayer + ': Your score is now ' + (counter + currentScore) + '!');
                answer = PROMPT.question('\n' + currentPlayer + ': Do you want to roll again? (Y/N): ').toLowerCase();
                while (!/^[yYnN]$/.test(answer)) {
                    answer = PROMPT.question('\n' + currentPlayer + ': Please enter only Y/N: ').toLowerCase();
                }
                if (answer === 'n') {
                    currentScore += counter;
                    console.log('\n' + currentPlayer + ' ended their turn.')
                    console.log('\n' + currentPlayer + '\'s score: ' + currentScore + ' - ' + passivePlayer + '\'s score: ' + passiveScore)
                    console.log('\n' + passivePlayer + '\'s turn to roll.');
                    counter = 0;
                    restart();
                    break;
                }
            }
        }
    }
}