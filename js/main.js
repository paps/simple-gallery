var gScrollTarget = 0;

function scroll(id) {
    if (id < 0) {
        id = 0;
    } else if (id >= gItems.length) {
        id = gItems.length - 1;
    }
    if (gItems[id]) {
        $.smoothScroll({
            scrollElement: $('#scroller'),
            scrollTarget: '#item' + id,
            offset: -50,
            speed: 80
        });
    }
}

function showNavigator() {
    $('#navigatorContainer').show('fade');
}

function hideNavigator() {
    $('#navigatorContainer').hide('fade');
}

function getCurrentId() {
    return Math.round($("#scroller").scrollTop() / 1050);
}

$(document).ready(function() {

    // initialization
    (function() {
        var n = 0;
        var day = 0;
        var bg = 0;
        $.each(gItems, function() {
            // item in main page
            var itemDiv = $('<div></div>').attr('id', 'item' + n);
            $('#scroller')
                .append($('<div class="item"></div>')
                    .append($('<div class="caption"></div>').text(this.caption))
                    .append(itemDiv));
            this.div = itemDiv;
            // navigator day title
            if (day !== this.day) {
                day = this.day;
                if (bg >= 2) {
                    bg = 0;
                } else {
                    ++bg;
                }
                var thumb = $('<div class="itemThumbTitle" style="background-image: url(\'/bg/' + bg + '.png\');"></div>')
                    .append('<i class="icon-folder-open"></i>')
                    .append(' ')
                    .append($('<span class="badge badge-warning"></span>').text('n°' + this.day));
                thumb.click((function(n) { return function() {
                    hideNavigator();
                    scroll(n);
                };})(n));
                thumb.attr('title', this.caption);
                $('#navigator').append(thumb);
            }
            // navigator thumbnail
            if (n % 6 === 0 && this.type === 'image') {
                var thumb = $('<div class="itemThumb" style="background-image: url(\'/bg/' + bg + '.png\');"></div>')
                    .append('<img src="photos/thumbs/' + this.file + '" alt="" />');
                thumb.click((function(n) { return function() {
                    hideNavigator();
                    scroll(n);
                };})(n));
                thumb.attr('title', this.caption);
                $('#navigator').append(thumb);
            } else if (this.type === 'video') {
                var thumb = $('<div class="itemThumbVideo" style="background-image: url(\'/bg/' + bg + '.png\');"></div>')
                    .append('<i class="icon-facetime-video"></i> <span class="label">Video</span>');
                thumb.click((function(n) { return function() {
                    hideNavigator();
                    scroll(n);
                };})(n));
                thumb.attr('title', this.caption);
                $('#navigator').append(thumb);
            }
            // next item
            ++n;
        });
        // page title
        document.title = gSettings.title;
    })();

    // buttons
    $(document).keyup(function(e) {
        if (e.keyCode === 27) { // esc
            $('#navigatorContainer').hide();
        } else if (e.keyCode === 74) { // j
            scroll(++gScrollTarget);
        } else if (e.keyCode === 75) { // k
            scroll(--gScrollTarget);
        }
    });
    $('#buttonThumbs').click(function() {
        showNavigator();
    });
    $('#buttonStart').click(function() {
        gScrollTarget = 0;
        scroll(gScrollTarget);
    });
    $('#buttonNext').click(function() {
        scroll(++gScrollTarget);
    });
    $('#buttonNextNext').click(function() {
        gScrollTarget += 10;
        scroll(gScrollTarget);
    });
    $('#buttonPrev').click(function() {
        scroll(--gScrollTarget);
    });
    $('#buttonPrevPrev').click(function() {
        gScrollTarget -= 10;
        scroll(gScrollTarget);
    });
    $('#buttonEnd').click(function() {
        gScrollTarget = gItems.length - 1;
        scroll(gScrollTarget);
    });
    $('#navigatorContainer').click(function() {
        hideNavigator();
    });

    // scrolling detection & item display
    (function() {
        var oldItemIds = [];
        var oldPos;
        var moved = false;
        var display = function() {
            var pos = getCurrentId();
            if (pos != oldPos) {
                moved = true;
            } else if (moved) {
                var itemIds = [];
                for (var i = pos - 5; i <= pos + 5; ++i) {
                    if (gItems[i]) {
                        itemIds.push(i);
                    }
                }
                for (var i in itemIds) {
                    id = itemIds[i];
                    var item = gItems[id];
                    if (item) {
                        if ($.inArray(id, oldItemIds) < 0) {
                            setTimeout((function(id, item) {
                                return function() {
                                    if (item.type === 'video') {
                                        var video = $('<video src="videos/' + item.file + '" controls preload="none"></video>');
                                        item.div.empty().append(video);
                                    } else if (item.type === 'image') {
                                        item.div.empty().append('<img src="photos/' + item.file + '" alt="" />');
                                    } else {
                                        item.div.empty();
                                    }
                                }
                            })(id, item), Math.abs(pos - id) * 200);
                        }
                    }
                }
                for (var i in oldItemIds) {
                    var id = oldItemIds[i];
                    if ($.inArray(id, itemIds) < 0) {
                        gItems[id].div.empty();
                    }
                }
                oldItemIds = itemIds;
                moved = false;
                gScrollTarget = pos;
            }
            oldPos = pos;
            setTimeout(display, 350);
        };
        display();
    })();

    // shortcut help
    setTimeout(function() {
        $('#shortcutPrev').hide('slow');
        $('#shortcutNext').hide('slow');
    }, 5000);
});
