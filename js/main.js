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
    $(".handSlot").each(function(index) {
        var me = $(this), newDiv = makeRandomTileDiv();
        if (!($(this).hasClass("occupied")) && newDiv) {
            me.append(newDiv);
            me.addClass("occupied");
        } else {
            // We're out of tiles, so tell the player
            $("#message").html("Out of tiles!");
        }
    });
};

// Most of the actual "game" will happen in here -- updating will be handled by jQuery's provided event handlers
$(document).ready(function(){
    var boardDropOptions = {
            create: function(event, ui) {
                $(this).data("containedLetter", "");
            },
            drop: function(event, ui) {
                //var freeHandSlot = $(".handSlot").not(".occupied").first().addClass("occupied");
                $(this).addClass("occupied");
                $(this).append(ui.draggable);
                snapToMiddle(ui.draggable, $(this));

                // Once we drop a draggable into a slot, it shouldn't accept any others
                $(this).droppable("option", "accept", ui.draggable);

                // Update board state
                updateOccupiedState();
                updateContainedLetters();

            },
            out: function(event, ui) {
                $(this).droppable("option", "accept", ".ui-draggable");
            }
        },
        handDropOptions = {
            create: function(event, ui) {
            },
            drop: function(event, ui) {
                var freeHandSlot = $(".handSlot").not(".occupied").first().addClass("occupied");
                    // this square isn't occupied
                    $(this).append(ui.draggable);
                    snapToMiddle(ui.draggable, $(this));
            }
        };


    // initialize board droppables
    $(".boardSlot").droppable(boardDropOptions);

    // initialize hand slot droppables, then populate the hand
    $(".handSlot").droppable(handDropOptions);

    populateHand();
    updateOccupiedState();
    updateContainedLetters();

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
            $(this).addClass("occupied");
        } else {
            $(this).removeClass("occupied");
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

        letterIndex = $(this).attr("class").indexOf("letter") + 6;
        letter = $(this).attr("class")[letterIndex];

        $(this).data("occupiedLetter", letter);
    });
};

/**
 * Function: updateScore(): updates the score using the current set of occupied board tiles
 */
var updateScore = function() {

};