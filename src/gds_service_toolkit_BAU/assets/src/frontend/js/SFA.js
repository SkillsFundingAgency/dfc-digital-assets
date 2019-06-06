(function ($) {
    $(function () {

    });

    // Profile page tabs/panels
    var panels = $('.profile-warning').hide(),
        tabs = $('.profile-warning-tabs').show();

    tabs.on('click', 'a', function (e) {
        var href = $(this).attr('href'),
            $parent = $(this).parent(),
            $target = $(href),
            visible = $target.is(':visible');

        // Remove the active class from the currently active tab and hide the
        // visible panels
        panels.hide();
        $('.active', tabs).removeClass('active');

        if (!visible) {
            $target.show();
            $(this).addClass('active');
        }

        // Stop the page from moving
        e.preventDefault();
    });

    // Set rel="external" for external links
    $('a').filter(function () {
        var internal = location.hostname,
            hostname = this.hostname,
            pattern = new RegExp(internal + "|gov.uk|#", "i");

        return hostname && !pattern.test(hostname);
    }).prop('rel', 'external');

    (function() 
    {
            // Get the current page
        var active = $('ul.pagination li.active'),
            // Get the next page link, if any
            next = active.next(),
            // Get the previous page link, if any
            prev = active.prev(),
            // Get the text of the total number of pages, e.g., 3
            totalPages = $('ul.pagination li:last-of-type a').text().replace('(current)', ''),
            // The text for this, e.g., 'of 3'
            ofCount = ' of ' + totalPages;

        // If there is a previous link, give it the .prev class
        if (prev.html()) {
            prev.addClass('prev');
        }

        // If there is a next link, give it the .next class
        if (next.html()) {
            next.addClass('next');
        }

        // Now remove any li items without the .prev or .next classes, so that we only have those remaining
        $('ul.pagination li').not('.next').not('.prev').remove();

        // Add 'Next page' and 'Previous page' divs
        $('ul.pagination li.next a').prepend('<div class="pagination-text">Next <span>page</span></div>').append(ofCount);
        $('ul.pagination li.prev a').prepend('<div class="pagination-text">Previous <span>page</span></div>').append(ofCount);
    })();

    //Fix autocomplete size issue if required
    if (typeof jQuery.ui !== 'undefined') {
        jQuery.ui.autocomplete.prototype._resizeMenu = function () {
            var ul = this.menu.element;
            ul.outerWidth(this.element.outerWidth());
        }
    }
}(jQuery))