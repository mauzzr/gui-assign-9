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
 * "bag".
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
            distance: 10,
            revert: "invalid",
            revertDuration: 250
        };

    ScrabbleTiles[letter]["number-remaining"]--;

    if (letter === "_") {
        letter = "Blank";
    }

    newDiv.html("<img src='img/Scrabble_Tile_" + letter + ".jpg' class='TileImage' />");
    newDiv.addClass("TileDiv");
    newDiv.draggable(dragOptions);
    return newDiv;
};
