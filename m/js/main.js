var gCurrentItemId = 0;

function showItem(id) {
    if (id < 0) {
        id = 0;
    } else if (id >= gItems.length) {
        id = gItems.length - 1;
    }
    gCurrentItemId = id;
    if (gItems[id]) {
        item = gItems[id];
        if (item.type === 'video') {
            var html = $('<video src="../videos/' + item.file + '" controls preload="none"></video>');
        } else if (item.type === 'image') {
            var html = $('<img src="../photos/' + item.file + '" alt="" />');
        } else {
            var html = $('<p>-</p>');
        }
        $('#content').empty().append(html);
        $('#caption').empty().text(item.caption);
    }
}

$(document).ready(function() {

    // initialization
    (function() {
        var n = 0;
        var day = 0;
        var bg = 0;
        $.each(gItems, function() {
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
                    $('#navigatorContainer').hide();
                    showItem(n);
                };})(n));
                $('#navigator').append(thumb);
            }
            // navigator thumbnail
            if (n % 6 === 0 && this.type === 'image') {
                var thumb = $('<div class="itemThumb" style="background-image: url(\'/bg/' + bg + '.png\');"></div>')
                    .append('<img src="../photos/thumbs/' + this.file + '" alt="" />');
                thumb.click((function(n) { return function() {
                    $('#navigatorContainer').hide();
                    showItem(n);
                };})(n));
                $('#navigator').append(thumb);
            } else if (this.type === 'video') {
                var thumb = $('<div class="itemThumbVideo" style="background-image: url(\'/bg/' + bg + '.png\');"></div>')
                    .append('<i class="icon-facetime-video"></i> <span class="label">Video</span>');
                thumb.click((function(n) { return function() {
                    $('#navigatorContainer').hide();
                    showItem(n);
                };})(n));
                $('#navigator').append(thumb);
            }
            // next item
            ++n;
        });
        // page title
        document.title = gSettings.title;
    })();

    // buttons
    $('#buttonThumbs').click(function() {
        $('#navigatorContainer').show();
    });
    $('#buttonStart').click(function() {
        showItem(0);
    });
    $('#buttonNext').click(function() {
        showItem(gCurrentItemId + 1);
    });
    $('#buttonNextNext').click(function() {
        showItem(gCurrentItemId + 10);
    });
    $('#buttonPrev').click(function() {
        showItem(gCurrentItemId - 1);
    });
    $('#buttonPrevPrev').click(function() {
        showItem(gCurrentItemId - 10);
    });
    $('#buttonEnd').click(function() {
        showItem(gItems.length - 1);
    });
    $('#navigatorContainer').click(function() {
        $('#navigatorContainer').hide();
    });

    // first item
    showItem(0);
});
