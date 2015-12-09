/*
 * File: main.js, created by Peter Welby 6 Dec. 2015
 * This script initializes the UI, board and player hand for play.
 */

"use strict";

/**
 * Function: populateHand()
 * Adds a random tile from those remaining to any unoccupied slots in the player's hand, as dictated by
 * the presence or absence of the class "occupied" on the hand slot's div.
 *
 */

var populateHand = function() {
    $(".handSlot").each(function(index) {
        var me = $(this);
        if (me.attr("class").indexOf("occupied") < 0) {
            me.append(makeRandomTileDiv());
            me.addClass("occupied");
        }
    });
};

$(document).ready(function(){
    var boardDropOptions = {
            drop: function(event, ui) {
                var myDraggable = ui.draggable;
                if ($(this).attr("class").indexOf("occupied") < 0) {
                    // this square isn't occupied
                    $(this).addClass("occupied");
                    snapToMiddle(ui.draggable, $(this));
                } else {
                    // this square is occupied, so revert the draggable to a free hand slot and set the occupied class
                    // on that slot
                    // NOTE: The jQuery method chain passed here is fairly neat
                    snapToMiddle(ui.draggable, $(".handSlot").not(".occupied").first().addClass("occupied"));
                    // notify the user
                    $("#message").html("You cannot place a tile on an occupied square.")
                        .animate({opacity: 0.0}, 1500, "linear",
                        function() {
                            $("#message").html("").css("opacity", 1.0);
                        });
                }
            },
            out: function(event, ui) {
                $(this).removeClass("occupied");
            }
        },
        handDropOptions = {
            drop: function(event, ui) {
                $(this).addClass("occupied");
                snapToMiddle(ui.draggable, $(this));
            },
            out: function(event, ui) {
                $(this).removeClass("occupied");
            }
        };

    // initialize board droppables
    $(".boardSlot").each(function(index) {
        $(this).droppable(boardDropOptions);
    });

    // initialize hand slot droppables, then populate the hand
    $(".handSlot").each(function(index) {
        $(this).droppable(handDropOptions);
    });
    populateHand();

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

/* This version does a nice animation, but not to the right destination:
 var snapToMiddle = function(dragger, target){
 var topMove = target.offset().top - dragger.offset().top + (target.outerHeight(true) - dragger.outerHeight(true)) / 2;
 var leftMove= target.offset().left - dragger.offset().left + (target.outerWidth(true) - dragger.outerWidth(true)) / 2;
 dragger.animate({top:topMove,left:leftMove},{duration:600,easing:'swing'});
 };
*/
