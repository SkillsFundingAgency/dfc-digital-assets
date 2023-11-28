$(document).ready(function () {
    var checkboxes = '#filterCheckboxes input[type=checkbox]';
    var radioFilters = '#filterCheckboxes input[type=radio]';
    var optionSelect = $('#triageSelect');
    var pocSelect = $('#pocSelect');
    var filterForm = $("#TriageToolFilters");
    var optionForm = $('#triage-search-form');
    var clearFilters = $('#clearFilters');

    optionSelect.val($('#SelectedOption').val());
    setUpSinglePageSolution();

    function setUpPageRefreshSolution() {
        $.each($(checkboxes),
            function (index, checkbox) {
                $(checkbox).click(function () {
                    filterForm.submit();
                });
            });

        $.each($(radioFilters),
            function (index, radioFilter) {
                $(radioFilter).click(function () {
                    filterForm.submit();
                });
            });

        optionSelect.change(function () {
            optionForm.submit();
        });

        clearFilters.click(function (e) {
            e.preventDefault();
            window.location = '/triagetool/' + optionSelect.val();
        });
    }

    function triageOptions() {
        var options = [];

        var getTriageData = function () {
            var promise = jQuery.Deferred();
            if (options.length < 1) {

                var apiCall = {
                    url: '/api/Ajax/Action',
                    path: 'triagetool',
                    method: 'Ajax'
                };

                $.ajax({
                    type: "GET",
                    url: apiCall.url,
                    contentType: "application/json",
                    dataType: "json",
                    data: { path: apiCall.path, method: apiCall.method },
                    success: function (data) {
                        if (data.isHealthy === true && data.payload != null) {
                            options = JSON.parse(data.payload);
                            promise.resolve(options);
                        }
                    },
                    failure: function () {
                        console.log('Failure, Retrieving Triage Tool options');
                        promise.resolve(options);
                    },
                    error: function () {
                        console.log('Error, Retrieving Triage Tool options');
                        promise.resolve(options);
                    }
                });
            } else {
                return promise.resolve(options);
            }
            return promise.promise();
        }

        return {
            getTriageData: getTriageData
        };
    }

    function setUpSinglePageSolution() {
        var optionData = triageOptions();

        $.when(optionData.getTriageData()).then(
            function (data) {
                if (data.length < 1) {
                    return setUpPageRefreshSolution();
                }
                generateHtml(data, true);
                return setUpSinglePageEvents();
            }
        );

        function setUpSinglePageEvents() {
            $.each($(checkboxes),
                function (index, checkbox) {
                    $(checkbox).click(function () {
                        updateData(false);
                    });
                });

            $.each($(radioFilters),
                function (index, radio) {
                    $(radio).click(function () {
                        updateData(false);
                    });
                });

            optionSelect.change(function () {
                updateData(true);
            });
            
            optionSelect.on('keydown',function(event){
                if (event.key === 'ArrowUp' || event.key === 'ArrowDown' || event.key ==='ArrowLeft'|| event.key ==='ArrowRight' ) {
                    event.preventDefault();
                }
            });

            pocSelect.change(function () {
                updateData(true);
            });

            clearFilters.click(function (e) {
                e.preventDefault();
                $.each($(checkboxes), function (index, value) {
                    var checkbox = $(value);
                    if (checkbox.prop('checked')) {
                        checkbox.prop('checked', false);
                    };
                });
                updateData(true);
            });
        }

        function updateData(allData) {
            $.when(optionData.getTriageData()).then(
                function (options) {
                    generateHtml(options, allData);
                }
            );

            if (allData) {
                var updatedUrl = "/triagetool/" + optionSelect.val();
                window.history.pushState({ path: updatedUrl }, '', updatedUrl);
            }
        }

        function generateHtml(options, allData) {
            var selectedOption = optionSelect.val();
            var option = getSelectedOptionData(selectedOption, options);
            var selectedFilters = getSelectedFilters();
            var pagesToShow = [];
            var generatedPages = [];
            var generatedFilters = [];

            if (!allData && selectedFilters.length > 0) {
                $.each(option.pages,
                    function (index, page) {
                        if (shouldPageBeShown(page, selectedFilters)) {
                            pagesToShow.push(page);
                            generatedPages.push(generatePageItemHtml(page));
                        }
                    });

                var selectedPoc = pocSelect.val();

                switch (selectedPoc) {
                    case "filters":
                        $.each(option.filters, function (index, filter) {
                            if (shouldFilterBeShown(filter, pagesToShow)) {
                                generatedFilters.push(generateFilterItemHtml(filter, selectedFilters, true));
                            }
                        });
                        updatePageAndFilters(generatedPages, option.title, selectedFilters, generatedFilters);
                        break;
                    case "disable":
                        $.each(option.filters, function (index, filter) {
                            var enable = shouldFilterBeShown(filter, pagesToShow);
                            generatedFilters.push(generateFilterItemHtml(filter, selectedFilters, enable));
                        });
                        updatePageAndFilters(generatedPages, option.title, selectedFilters, generatedFilters);
                        break;
                    default:
                        updatePageOnly(generatedPages, option.title, selectedFilters);
                }
                updateGtm(selectedFilters, generatedPages.length, selectedOption)
            } else {
                $.each(option.pages,
                    function (index, page) {
                        generatedPages.push(generatePageItemHtml(page));
                    });
                $.each(option.filters, function (index, filter) {
                    generatedFilters.push(generateFilterItemHtml(filter, [], true));
                });
                updatePageAndFilters(generatedPages, option.title, selectedFilters, generatedFilters);
                updateGtm(selectedFilters, generatedPages.length, selectedOption)
            }
        }

        function updateGtm(selectedFilters, pageCount, selectedOption) {
            var filters = [];

            $.each(selectedFilters, function (index, filter) {
                filters.push(filter.title);
            });

            dataLayer.push({
                'event': 'resultsUpdate',
                'filters': filters.toString(),
                'optionstate': selectedOption,
                'Results': pageCount,
            })
        }

        function getSelectedOptionData(selectedOption, options) {
            var option;

            $.each(options, function (index, value) {
                if (value.title === selectedOption) {
                    option = value;
                }
            });

            return option;
        }

        function getSelectedFilters() {
            var filters = [];

            $.each($(checkboxes), function (index, value) {
                var checkbox = $(value);
                if (checkbox.prop('checked')) {
                    filters.push({
                        url: checkbox.val(),
                        title: $(checkbox.prop("labels")).prop("innerText"),
                        selected: checkbox.prop('checked')
                    });
                }
            });

            $.each($(radioFilters), function (index, value) {
                var radioButton = $(value);
                if (radioButton.prop('checked')) {
                    filters.push({
                        url: radioButton.val(),
                        title: $(radioButton.prop("labels")).prop("innerText"),
                        selected: radioButton.prop('checked')
                    });
                }
            });

            return filters;
        }

        function generatePageItemHtml(page) {
            return '<li class="dfc-code-search-resultitem triage-search-result-item info-card" id="' +
                page.title +
                '">' +
                '<div class="info-card-content">' +
                '<h2 class="govuk-heading-m">' +
                '<a class="govuk-link" href="' +
                page.link +
                '">' +
                page.title +
                '</a></h2>' +
                page.summary +
                '</div></li>';
        }

        function generateFilterItemHtml(item, selectedFilters, enable) {
            if (pocSelect.val() == "radio") {
                return generateFilterRadioButtonHtml(item, selectedFilters);
            }
            return generateFilterCheckboxHtml(item, selectedFilters, enable);
        }

        function generateFilterRadioButtonHtml(item, selectedFilters) {
            var checked = "";

            $.each(selectedFilters, function (index, filter) {
                if (filter.url === item.url) {
                    checked = " checked";
                }
            });

            return '<div class="govuk-radios__item">' +
                '<input class="govuk-radios__input" id="' + item.title + '" type="radio" value="' +
                item.url +
                '" name="Filters"' +
                checked +
                '>' +
                '<label class="govuk-label govuk-radios__label" for="' +
                item.title +
                '">' +
                item.title +
                '</label></div>';
        }

        function generateFilterCheckboxHtml(item, selectedFilters, enable) {
            var checked = "";
            var disabled = enable ? "" : " disabled";

            $.each(selectedFilters, function (index, filter) {
                if (filter.url === item.url) {
                    checked = " checked";
                }
            });

            return '<div class="govuk-checkboxes__item">' +
                '<input class="govuk-checkboxes__input" id="' + item.title + '" type="checkbox" value="' +
                item.url +
                '" name="Filters"' +
                checked + disabled +
                '>' +
                '<label class="govuk-label govuk-checkboxes__label" for="' +
                item.title +
                '">' +
                item.title +
                '</label></div>';
        }

        function updatePageAndFilters(generatedPages, optionTitle, selectedFilters, generatedFilters) {
            updateSharedDetails(selectedFilters, optionTitle);
            updatePageArea(generatedPages);
            updateFilterArea(generatedFilters);
        }

        function updatePageOnly(generatedPages, optionTitle, selectedFilters) {
            updateSharedDetails(selectedFilters, optionTitle);
            updatePageArea(generatedPages);
        }

        function updateSharedDetails(selectedFilters, optionTitle) {
            var selectOptionText = $('#primaryFiltersSelectedValue');
            var filtersSelectedElement = $('#secondaryFiltersSelected1');

            var filterSelectedString = "{replace} selected";
            var tag = "{replace}";

            filtersSelectedElement.text(filterSelectedString.replace(tag, selectedFilters.length));
            selectOptionText.text(optionTitle);
        }

        function updatePageArea(generatedPages) {
            var pageResults = $('.results-list');
            var tag = "{replace}";

            var totalArticles = $('#totalArticles');
            var singleArticleString = "1 suggestion";
            var multipleArticleString = "{replace} suggestions";

            switch (generatedPages.length) {
                case 1:
                    totalArticles.text(singleArticleString);

                    break;
                default:

                    totalArticles.text(multipleArticleString.replace(tag, generatedPages.length));

                    break;
            }


            pageResults.html(generatedPages.toHtmlString());
        }

        function updateFilterArea(generatedFilters) {
            var selectedPoc = pocSelect.val();
            var filterHtml = $('#filterCheckboxes');
            var markup = "";

            if (selectedPoc === "radio") {
                markup = "<div class ='govuk-radios'>"
            } else {
                markup = "<div class ='govuk-checkboxes'>"
            }
            markup += generatedFilters.toHtmlString();
            markup += "</div>";
            filterHtml.html(markup);
            $.each($(checkboxes),
                function (index, checkbox) {
                    $(checkbox).click(function () {
                        updateData(false);
                    });
                });

            $.each($(radioFilters),
                function (index, radio) {
                    $(radio).click(function () {
                        updateData(false);
                    });
                });
        }

        function shouldPageBeShown(page, selectedFilters) {
            var selectedPoc = pocSelect.val();

            switch (selectedPoc) {
                case "union":
                case "radio":
                    return shouldPageBeShownUnion(page, selectedFilters);
                default:
                    return shouldPageBeShownIntersection(page, selectedFilters);
            }
        }

        function shouldPageBeShownUnion(page, selectedFilters) {
            var filterFound = false;

            $.each(selectedFilters,
                function (index, filter) {

                    $.each(page.filters, function (pfIndex, pageFilter) {
                        if (filter.url === pageFilter) {
                            filterFound = true;
                        }
                    });

                });

            return filterFound;
        }

        function shouldPageBeShownIntersection(page, selectedFilters) {
            var filterCount = 0;

            $.each(selectedFilters,
                function (index, filter) {

                    $.each(page.filters, function (pfIndex, pageFilter) {
                        if (filter.url === pageFilter) {
                            filterCount++;
                        }
                    });

                });

            return filterCount == selectedFilters.length;
        }

        function shouldFilterBeShown(filter, pages) {
            var filterFound = false;

            $.each(pages,
                function (index, page) {

                    $.each(page.filters, function (pfIndex, pageFilter) {
                        if (filter.url === pageFilter) {
                            filterFound = true;
                        }
                    });

                });

            return filterFound;
        }

        Array.prototype.toHtmlString = function () {
            var string = "";
            $.each(this,
                function (index, item) {
                    string = string + item;
                });


            return string;
        }
    }
});