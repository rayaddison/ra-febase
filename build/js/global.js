"use strict";
var $ = this.jQuery.noConflict(),
raBase;

/////////////////////////////////////////////
/////// Breakpoint Image replacement ////////
/////////////////////////////////////////////

// Set the image variables for the different breakpoints. See markup for the image sets.
var queries = [
    {
        context: 'break__3',
        callback: function() {
            $('img').each(function(index) {
                var break__3 = $(this).attr('src');
                $(this).attr('src', break__3);
            });
        }
    }, {
        context: 'break__0',
        callback: function() {
            $('img').each(function(index) {
                var break__0 = $(this).data('break__0');
                $(this).attr('src', break__0);
            });
        }
    }, {
        context: 'break__1',
        callback: function() {
            $('img').each(function(index) {
                var break__1 = $(this).data('break__1');
                $(this).attr('src', break__1);
            });
        }
    }, {
        context: 'break__2',
        callback: function() {
            $('img').each(function(index) {
                var break__2 = $(this).data('break__2');
                $(this).attr('src', break__2);
            });
        }
    }
];

MQ.init(queries);

if(raBase == undefined) {

    raBase = {
        Page: {
            segments: [],
            init: function() {
                raBase.Page.segments = window.location.href.split("/");

                $(".tableGapAnalysis td").each(function() {
                    if ($(this).text() == "No") $(this).css('background', '#FFA8A8');
                    if ($(this).text() == "Yes") $(this).css('background', '#BFFCBD');
                });

                ///////////////////////////////////////
                ////////// Behaviour resets ///////////
                ///////////////////////////////////////

                // Prevent # anchors jumping page to top

                $('a[href="#"]').click(function(e) {
                        e.preventDefault();
                });

                 // Remove the preload class from the body. This prevents CSS animations and should only apply on page load. */

                $("body").removeClass("preload");

                ///////////////////////////////////////
                ////////  Write JS below here /////////
                ///////////////////////////////////////

            }
        }
    };

}

raBase.Page.init();