$(document).ready(function () {

    var checkboxes = '#filterCheckboxes input[type=checkbox]';
    var optionSelect = $('#triageSelect');
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

        optionSelect.change(function () {
            optionForm.submit();
        });

        clearFilters.click(function (e) {
            e.preventDefault();
            window.location = '/triagetool/' + optionSelect.val();
        });
    }

    function triageOptions() {
        let options = [];

        const getTriageData = function () {
            var promise = jQuery.Deferred();
            if (options.length < 1) {

                const apiCall = {
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
            getTriageData
        }
    }

    function setUpSinglePageSolution() {

        const optionData = triageOptions();

        $.when(optionData.getTriageData()).then(
            function (data) {
                if (data.length < 1) {
                    return setUpPageRefreshSolution();
                }
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

            optionSelect.change(function () {
                updateData(true);
            });

            clearFilters.click(function (e) {
                e.preventDefault();
                updateData(true);
            });
        }

        function updateData(allData) {
            $.when(optionData.getTriageData()).then(
                function (options) {
                    generateHtml(options, allData);
                }
            );
        }
        
        function generateHtml(options, allData) {
            const selectedOption = optionSelect.val();
            const option = getSelectedOptionData(selectedOption, options);
            const selectedFilters = getSelectedFilters();
            var generatedPages = [];
            var generatedFilters = [];

            if (!allData && selectedFilters.length > 0) {
                $.each(option.pages,
                    function (index, page) {
                        if (shouldPageBeShown(page, selectedFilters)) {
                            generatedPages.push(generatePageItemHtml(page));
                        }
                    });
                updatePageOnly(generatedPages, option.title, selectedFilters);
            } else {
                $.each(option.pages,
                    function (index, page) {
                        generatedPages.push(generatePageItemHtml(page));
                    });
                $.each(option.filters, function(index, filter) {
                    generatedFilters.push(generateFilterItemHtml(filter, []));
                });
                updatePageAndFilters(generatedPages, option.title, selectedFilters, generatedFilters);  
            }
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
            const filters = [];

            $.each($(checkboxes), function (index, value) {
                const checkbox = $(value);
                if (checkbox.prop('checked')) {
                    filters.push({
                        url: checkbox.val(),
                        title: $(checkbox.prop("labels")).prop("innerText"),
                        selected: checkbox.prop('checked')
                    });
                }
            });

            return filters;
        }

        function generatePageItemHtml(page) {
            return '<li class="dfc-code-search-resultitem info-card" id="' +
                page.title +
                '" style="display: list - item; ">' +
                '<div class="info - card - content">' +
                '<h3 class="govuk - heading - m">' +
                '<a class="govuk - link" href="' +
                page.link +
                '">' +
                page.title +
                '</a></h3><p class="govuk - body">' +
                page.summary +
                '</p></div></li>';
        }

        function generateFilterItemHtml(item, selectedFilters) {

            var checked = false;

            $.each(selectedFilters, function(index, filter) {
                if (checked === "checked") {
                    return false;
                }
                if (filter.url === item.url) {
                    checked = "checked";
                };
            });

            return '<div class="govuk-checkboxes__item">' +
                '<input class="govuk-checkboxes__input" id="item.Title" type="checkbox" value="' +
                item.url +
                '" name="Filters"' +
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

            const filterSelectedString = "{replace} selected";
            const tag = "{replace}";

            filtersSelectedElement.text(filterSelectedString.replace(tag, selectedFilters.length));
            selectOptionText.text(optionTitle);
        }

        function updatePageArea(generatedPages) {
            var pageResults = $('.results-list');
            const tag = "{replace}";

            const totalArticles = $('#totalArticles');
            const singleArticleString = "1 suggestion";
            const multipleArticleString = "{replace} suggestions";

            switch (generatedPages.length) {
            case 1:
                totalArticles.text(singleArticleString);

                break;
            default:

                totalArticles.text(multipleArticleString.replace(tag,generatedPages.length));

                break;
            }

            
            pageResults.html(generatedPages.toHtmlString());
        }

        function updateFilterArea(generatedFilters) {
            var filtersSelectedElement = $('#secondaryFiltersSelected1');
            var filterHtml = $('#filterCheckboxes');
            const filterSelectedString = "{replace} selected";
            const tag = "{replace}";
            filterHtml.html(generatedFilters.toHtmlString());
            $.each($(checkboxes),
                function (index, checkbox) {
                    $(checkbox).click(function () {
                        updateData(false);
                    });
                });

        }

        function shouldPageBeShown(page, selectedFilters) {

            var filterFound = false;

            $.each(selectedFilters,
                function(index, filter) {

                    $.each(page.filters, function(pfIndex, pageFilter) {
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
                function(index, item) {
                    string = string + item;
                });


            return string;
        }
    }
});