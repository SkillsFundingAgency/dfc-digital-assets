﻿(function($) {
    $(document).ready(function() {

        var searchBoxIdFields = $('[data-sf-role="searchTextBoxId"]');

        for (var i = 0; i < searchBoxIdFields.length; i++) {
            var searchBoxIdField = $(searchBoxIdFields[i]);
            var controlServerData = {
                disableSuggestions: $.parseJSON(searchBoxIdField.siblings('[data-sf-role="disableSuggestions"]').first()
                    .val()),
                minSuggestionLength: searchBoxIdField.siblings('[data-sf-role="minSuggestionLength"]').first().val(),
                suggestionsRoute: searchBoxIdField.siblings('[data-sf-role="suggestionsRoute"]').first().val(),
                searchTextBoxSelector: searchBoxIdField.val(),
                searchButtonSelector: searchBoxIdField.siblings('[data-sf-role="searchButtonId"]').first().val()
            };
            featherCourseSearchBoxWidget(controlServerData);
        }

        function featherCourseSearchBoxWidget(serverData) {
            var searchTextBox = $(serverData.searchTextBoxSelector),
                searchButton = $(serverData.searchButtonSelector);

            searchTextBox.keypress(keypressHandler);

            /* Initialization */
            if (!serverData.disableSuggestions) {
                searchTextBox.keyup(keyupHandler);

                try {
                    //JC: Fix for width of search suggestion box
                    $.ui.autocomplete.prototype._resizeMenu = function() {
                        var ul = this.menu.element;
                        ul.outerWidth(this.element.outerWidth());
                    }

                    searchTextBox.autocomplete({
                        source: [],
                        messages:
                        {
                            noResults: '',
                            results: function() {}
                        },
                        select: function(event, ui) {
                            searchTextBox.val(ui.item.value);

                        },
                    }).autocomplete("widget").addClass("sf-autocomplete");
                } catch (e) {
                    alert(e);
                    // Fixes jQuery bug, causing IE7 to throw error "script3 member not found".
                    // The try/catch can be removed when the bug is fixed.
                }
            }

            /* Event handlers */
            function keypressHandler(e) {
                if (!e)
                    e = window.event;

                var keyCode = null;
                if (e.keyCode) {
                    keyCode = e.keyCode;
                } else {
                    keyCode = e.charCode;
                }

                if (keyCode == 13) {
                    navigateToResults(e);
                }
            }

            function suggestionsSuccessHandler(result, args) {
                
                var dataSource = result.Suggestions;
                // Get the focused element:
                var focused = document.activeElement;
                if (focused.id === "GetSearchCourseListRequest_ProviderKeyword"
                    || focused.id === "CurrentSearchRequest_ProviderKeyword") {
                    searchTextBox.autocomplete('option', 'source', dataSource);

                    searchTextBox.autocomplete("search", searchTextBox.val().trim());
                }
            }

            function keyupHandler(e) {

                if (e.keyCode != 38 && // up arrow
                    e.keyCode != 40 && // down arrow
                    e.keyCode != 27) { // esc
                    // When the auto complete menu is shown, only this event is detected
                    if (e.keyCode == 13) {
                        // when enter is pressed
                        navigateToResults(e);
                    }

                    var request = {};
                    var searchText = searchTextBox.val().trim();
                    if (searchText.length >= serverData.minSuggestionLength) {
                        request.IndexName = serverData.indexCatalogue;
                        request.SuggestionFields = serverData.suggestionFields;
                        request.Text = searchText;
                        request.Language = serverData.language;

                        $.ajax({
                            type: "GET",
                            url: serverData.suggestionsRoute,
                            dataType: 'json',
                            data: request,
                            success: suggestionsSuccessHandler
                        });
                    }
                }
            }

            /* Helper methods */
            function navigateToResults(e) {
                if (!e)
                    e = window.event;

                if (e.stopPropagation) {
                    e.stopPropagation();
                } else {
                    e.cancelBubble = true;
                }
                if (e.preventDefault) {
                    e.preventDefault();
                } else {
                    e.returnValue = false;
                }

                var query = searchTextBox.val();

                if (query && query.trim() && serverData.indexCatalogue) {
                    sendSentence(query);
                    window.location = getLocation();
                }
            }

            function getLocation() {
                var query = searchTextBox.val().trim();

                var separator = (serverData.resultsUrl.indexOf("?") == -1) ? "?" : "&";

                var catalogueParam = separator + "indexCatalogue=" + encodeURIComponent(serverData.indexCatalogue),
                    searchQueryParam = "&searchQuery=" + encodeURIComponent(query),
                    wordsModeParam = "&wordsMode=" + serverData.wordsMode;

                var url = serverData.resultsUrl + catalogueParam + searchQueryParam + wordsModeParam;

                return url;
            }

            function sendSentence(query) {
                if (window.DataIntelligenceSubmitScript) {
                    DataIntelligenceSubmitScript._client.sentenceClient.writeSentence({
                        predicate: "Search for",
                        object: query,
                        objectMetadata: [
                            {
                                'K': 'PageUrl',
                                'V': location.href
                            }
                        ]
                    });
                }
            }
        }
    });
}(jQuery));