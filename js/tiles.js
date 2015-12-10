/*
 * File: tiles.js, created by Peter Welby 6 Dec. 2015
 * This script implements the tile selection logic.
 */

"use strict";

/**
 * Function: getRandomTileLetter
 * Returns a statistically correct selection of a letter within the tile distribution.
 * Idea inspired by a conversation with Alex Li -- use a for..in loop to go through the
 * associative array, and for each letter add as many as remain of that letter to an array.
 * Then pick from the array at a random index.
 * This method of picking remains statistically accurate even as tiles are removed from the
 * collection and put in play.
 * NOTE: This would be better implemented with the array outside this function so that
 * we don't have to iterate through EVERY remaining tile every time we want to get a new letter.
 */
var getRandomTileLetter = function() {
    var arrLetters = [], p, numRemaining, randIndex;

    for (p in ScrabbleTiles) {
        if (ScrabbleTiles.hasOwnProperty(p)) {
            numRemaining = ScrabbleTiles[p]["number-remaining"];
            while (numRemaining > 0) {
                arrLetters.push(p.toString());
                numRemaining--;
            }
        }
    }

    // no tiles left, so escape
    if (arrLetters.length === 0) {
        return false;
    }

    randIndex = Math.floor(Math.random() * arrLetters.length);

    return arrLetters[randIndex];
};


/**
 * Function: makeRandomTileDiv()
 * Choose a random tile from those remaining, construct a div from it, and return the div
 */
var makeRandomTileDiv = function() {
    var letter = getRandomTileLetter(), newDiv = $("<div></div>"),
        dragOptions = {
            distance: 4,
            revert: "invalid",
            revertDuration: 250
        };

    // no tiles left
    if (!letter) {
        return false;
    }

    ScrabbleTiles[letter]["number-remaining"]--;

    newDiv.addClass("TileDiv");
    newDiv.addClass("letter" + letter);

    if (letter === "_") {
        letter = "Blank";
    }

    newDiv.html("<img src='img/Scrabble_Tile_" + letter + ".jpg' class='TileImage' />");
    newDiv.draggable(dragOptions);
    return newDiv;
};
