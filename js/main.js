/*
 * File: main.js, created by Peter Welby 6 Dec. 2015
 * This script initializes the UI, board and player hand for play.
 */

"use strict";

/**
 * Function: populateHand()
 * Adds a random tile from those remaining to any unoccupied slots in the player's hand, as dictated by
 * the presence or absence of the class "occupied" on the hand slot's div. If no tiles remain,
 * an error message is displayed instead.
 *
 */
var populateHand = function() {
    var i,
        freeSlots = $(".handSlot").not(".occupied"),
        newDiv = makeRandomTileDiv();

    // newDiv === false if there aren't any tiles left
    if (!newDiv) {
        $("#message").html("No tiles left! Reset the board.");
        return;
    }

    if (freeSlots.length === 0) {
        $("#message").html("Your hand is full!").animate({opacity: 0}, 1500, "linear", function() {
            $("#message").html("").css("opacity", 1.0);
        });
    } else {
        for (i = 0; i < freeSlots.length; i++) {
            $(freeSlots[i]).append(newDiv);
            newDiv = makeRandomTileDiv();
        }
    }
};

/**
 * Function: resetBoard()
 * Removes all draggables from the DOM, and returns the game board to its original state.
 */
var resetBoard = function() {
    var p;
    // reset our associative tile array
    for (p in ScrabbleTiles) {
        if (ScrabbleTiles.hasOwnProperty(p)) {
            ScrabbleTiles[p]["number-remaining"] = ScrabbleTiles[p]["original-distribution"];
        }
    }

    // Clear the board and correct the occupied state for populateHand()
    $(".ui-draggable").remove();
    updateOccupiedState();

    // Populate the hand
    populateHand();

    // Refresh the board state
    updateOccupiedState();
    updateContainedLetters();
    updateScore();

    $("#message").html("");
};

// Most of the actual "game" will happen in here -- updating will be handled by jQuery's provided event handlers
$(document).ready(function(){
    var boardDropOptions = {
            create: function(event, ui) {
                $(this).data("containedLetter", "");
            },
            drop: function(event, ui) {
                $(this).append(ui.draggable);
                snapToMiddle(ui.draggable, $(this));

                // Update board state
                updateOccupiedState();
                updateContainedLetters();
                updateScore();

            }
            //out: function(event, ui) {
            //    $(this).droppable("option", "accept", ".ui-draggable");
            //}
        },
        handDropOptions = {
            drop: function(event, ui) {
                $(this).append(ui.draggable);
                snapToMiddle(ui.draggable, $(this));

                // Update board state
                updateOccupiedState();
                updateContainedLetters();
                updateScore();

            }
            //out: function(event, ui) {
            //    $(this).droppable("option", "accept", ".ui-draggable");
            //}
        };

    $("#refill").on("click", function(){
        populateHand();
        updateOccupiedState();
    });
    $("#reset").on("click", resetBoard);

    // initialize board droppables
    $(".boardSlot").droppable(boardDropOptions);

    // initialize hand slot droppables
    $(".handSlot").droppable(handDropOptions);

    // initialize board state
    populateHand();
    updateOccupiedState();
    updateContainedLetters();
    updateScore();

});

/**
 * Function: snapToMiddle(dragger, target)
 * Found on StackOverflow:
 * http://stackoverflow.com/questions/11388679/how-do-i-force-jquery-to-center-an-element-when-it-is-dragged-to-and-snapped-to
 * Helper function to allow snapping to the center of the target droppable, to be set as the drop event handler
 * on the board droppables.
 */
var snapToMiddle = function(dragger, target){
    var offset = target.offset();
    var topMove = (target.outerHeight(true) - dragger.outerHeight(true)) / 2;
    var leftMove= (target.outerWidth(true) - dragger.outerWidth(true)) / 2;
    dragger.offset({ top: topMove + offset.top, left: leftMove + offset.left })
};

/**
 * Function: updateOccupiedState(): Update the occupied state for all droppables
 */
var updateOccupiedState = function() {
    $(".ui-droppable").each(function(index) {
        if ($(this).find("div.ui-draggable").length > 0) {
            // add occupied class for the functions relying on board state
            $(this).addClass("occupied");
            // set this occupied slot to only accept its child
            $(this).droppable("option", "accept", $(this).find("div.ui-draggable"))
        } else {
            // no longer occupied
            $(this).removeClass("occupied");
            // set this slot to accept any tile
            $(this).droppable("option", "accept", ".ui-draggable");
        }
    });
};

/**
 * Function: updateContainedLetters(): Get the contained letter for each occupied board slot, and set
 * that property accordingly for score tallying
 */
var updateContainedLetters = function() {
    $(".boardSlot.occupied").each(function(index) {
        var letterIndex, letter;

        letterIndex = $(this).find("div.ui-draggable").attr("class").indexOf("letter") + 6;
        letter = $(this).find("div.ui-draggable").attr("class")[letterIndex];

        $(this).data("containedLetter", letter);
    });
};

/**
 * Function: updateScore(): updates the score using the current set of occupied board tiles
 */
var updateScore = function() {
    var numScore = 0, i;
    $(".boardSlot.occupied").each(function() {

        if ($(this).hasClass("boardDoubleLetter")) {
            numScore += $(this).data("containedLetter") ? (2 * ScrabbleTiles[$(this).data("containedLetter")]["value"]) : 0;
        } else {
            // a bit over-defensive, but just in case there isn't a letter, don't tack on any score
            numScore += $(this).data("containedLetter") ? ScrabbleTiles[$(this).data("containedLetter")]["value"] : 0;
        }
    });

    // NOTE: Per the scrabble rules, multiple WORD bonus tiles will stack. So for each used TRIPLE WORD SCORE tile,
    // we triple the score. This will be fixed later with proper word-based score detection
    for (i = 0; i < $(".occupied.boardTripleWord").length; i++) {
        numScore *= 3;
    }

    $("#scoreArea p").html(numScore);
};