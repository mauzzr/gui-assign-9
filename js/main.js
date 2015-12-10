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
            activate: function(event, ui) {
                //console.log("ACTIVATE fired on: " + $(this).attr("id"));
                //$(this).droppable("option", "deactivate", deactivateHandler);
                //$(this).droppable("option", "out", doNothing);
                //console.log($(this).droppable("option", "out"));
            },
            create: function(event, ui) {
                //$(this).data("isSource", false);
                //$(this).data("containedLetter", "");
            },
            deactivate: deactivateHandler,
            drop: function(event, ui) {
                var freeHandSlot = $(".handSlot").not(".occupied").first().addClass("occupied");
                if (!($(this).hasClass("occupied"))) {
                    // this square isn't occupied
                    $(this).addClass("occupied");
                    $(this).append(ui.draggable);
                    snapToMiddle(ui.draggable, $(this));
                } else {
                    // this slot is occupied, so revert the draggable to a free hand slot and set the occupied class
                    // on that slot. if no hand slots are free, send it to the jail
                    snapToMiddle(ui.draggable, freeHandSlot ? freeHandSlot : $("#pile"));
                    // notify the user
                    $("#message").html("You cannot place a tile on an occupied square.")
                        .animate({opacity: 0.0}, 1500, "linear",
                        function() {
                            $("#message").html("").css("opacity", 1.0);
                        });
                }
            },
            out: dropOutHandler,
            over: function (event, ui) {
                console.log($(this).attr("id") + " isSource: " + $(this).data("isSource"));
                if (!$(this).data("isSource")) {
                    console.log("we should be getting here");
                    $(this).off("dropout");
                }
            }
        },
        handDropOptions = {
            activate: function(event, ui) {
                console.log("ACTIVATE fired on: " + $(this).attr("id"));
                //$(this).droppable("option", "out", doNothing);
                //console.log($(this).droppable("option", "out"));
            },
            create: function(event, ui) {
                $(this).data("isSource", false);
            },
            deactivate: function(event, ui) {
                //console.log($(this).attr("id") + " isSource: " + $(this).data("isSource"));
                //if (($(this).data("isSource")) && !($(this).hasClass("occupied"))) {
                //    $(this).addClass("occupied");
                //}
                //$(this).droppable("option", "out", dropOutHandler);
            },
            drop: function(event, ui) {
                var freeHandSlot = $(".handSlot").not(".occupied").first().addClass("occupied");
                    // this square isn't occupied
                    $(this).append(ui.draggable);
                    snapToMiddle(ui.draggable, $(this));
                //var freeHandSlot = $(".handSlot").not(".occupied").first().addClass("occupied");
                //if ($(this).attr("class").indexOf("occupied") < 0) {
                    // this square isn't occupied
                //    $(this).addClass("occupied");
                //    snapToMiddle(ui.draggable, $(this));
                //} else {
                    // this slot is occupied, so revert the draggable to a free hand slot and set the occupied class
                    // on that slot. if no hand slots are free, send it to the jail
                //    snapToMiddle(ui.draggable, (freeHandSlot.length > 0) ? freeHandSlot : $("#jail"));
                    // notify the user
                //    $("#message").html("You cannot place a tile on an occupied square.")
                //        .animate({opacity: 0.0}, 1500, "linear",
                //        function() {
                //            $("#message").html("").css("opacity", 1.0);
                //        });
                //}
            },
            out: dropOutHandler,
            over: function (event, ui) {
                console.log($(this).attr("id") + " isSource: " + $(this).data("isSource"));
                if (!$(this).data("isSource")) {
                    console.log("we should be getting here");
                    $(this).off("dropout");
                }
            }
        };

    // initialize board droppables
    $(".boardSlot").droppable(boardDropOptions);

    // initialize hand slot droppables, then populate the hand
    $(".handSlot").droppable(handDropOptions);
    populateHand();

});

/**
 * The following event handlers have been pulled out as variables so that they can be dynamically swapped out
 * in order to maintain the proper state among the droppable slots
 */

var deactivateHandler = function (event, ui) {
    console.log($(this).attr("id") + " isSource: " + $(this).data("isSource"));
    if (($(this).data("isSource")) && !($(this).hasClass("occupied"))) {
        $(this).addClass("occupied");
    }
    $(this).droppable("option", "out", dropOutHandler);
}

var dropOutHandler = function (event, ui) {
    console.log("OUT fired on: " + $(this).attr("id"));
    $(this).data("isSource", true);
    $(this).removeClass("occupied");
    $(".ui-droppable").not(this).droppable("option", "out", jQuery.noop);
    $(this).droppable("option", "deactivate", jQuery.noop);
};

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
        if ($(this).find("div.ui-draggable").length === 1) {
            $(this).addClass("occupied");
        }
    });
};


/* This version does a nice animation, but not to the right destination:
 var snapToMiddle = function(dragger, target){
 var topMove = target.offset().top - dragger.offset().top + (target.outerHeight(true) - dragger.outerHeight(true)) / 2;
 var leftMove= target.offset().left - dragger.offset().left + (target.outerWidth(true) - dragger.outerWidth(true)) / 2;
 dragger.animate({top:topMove,left:leftMove},{duration:600,easing:'swing'});
 };
*/
