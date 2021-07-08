"use strict";
$(function () {
    var checkboxes = '#filterCheckboxes input[type=checkbox]';
    var radioFilters = '#filterCheckboxes input[type=radio]';
    var optionSelect = $('#triageSelect');
    var pocSelect = $('#pocSelect');
    var clearFilters = $('#clearFilters');
    optionSelect.val($('#SelectedOption').val());
    setUpSinglePageSolution();
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
                        if (data.isHealthy && data.payload != null) {
                            options = JSON.parse(data.payload);
                            promise.resolve(options);
                        }
                    },
                    error: function () {
                        console.log('Error, Retrieving Triage Tool options');
                        promise.resolve(options);
                    }
                });
            }
            else {
                return promise.resolve(options);
            }
            return promise.promise();
        };
        return {
            getTriageData: getTriageData
        };
    }
    function setUpSinglePageSolution() {
        var optionData = triageOptions();
        $.when(optionData.getTriageData()).then(function (data) {
            generateHtml(data, true);
            return setUpSinglePageEvents();
        });
        function setUpSinglePageEvents() {
            $.each($(checkboxes), function (index, checkbox) {
                $(checkbox).on("click", function () {
                    updateData(false);
                });
            });
            $.each($(radioFilters), function (index, radio) {
                $(radio).on("click", function () {
                    updateData(false);
                });
            });
            optionSelect.on("change", function () {
                updateData(true);
            });
            pocSelect.on("change", function () {
                updateData(true);
            });
            clearFilters.on("click", function (e) {
                e.preventDefault();
                $.each($(checkboxes), function (index, value) {
                    var checkbox = $(value);
                    if (checkbox.prop('checked')) {
                        checkbox.prop('checked', false);
                    }
                });
                updateData(true);
            });
        }
        function updateData(allData) {
            $.when(optionData.getTriageData()).then(function (options) {
                generateHtml(options, allData);
            });
        }
        function generateHtml(options, allData) {
            var selectedOption = optionSelect.val();
            var option = getSelectedOptionData(selectedOption, options);
            if (option != null) {
                var selectedFilters_1 = getSelectedFilters();
                var pagesToShow_1 = [];
                var generatedPages_1 = [];
                var generatedFilters_1 = [];
                if (!allData && selectedFilters_1.length > 0) {
                    $.each(option.pages, function (index, page) {
                        if (shouldPageBeShown(page, selectedFilters_1)) {
                            pagesToShow_1.push(page);
                            generatedPages_1.push(generatePageItemHtml(page));
                        }
                    });
                    var selectedPoc = pocSelect.val();
                    switch (selectedPoc) {
                        case "filters":
                            $.each(option.filters, function (index, filter) {
                                if (shouldFilterBeShown(filter, pagesToShow_1)) {
                                    generatedFilters_1.push(generateFilterItemHtml(filter, selectedFilters_1));
                                }
                            });
                            updatePageAndFilters(generatedPages_1, option.title, selectedFilters_1, generatedFilters_1);
                            break;
                        case "disable":
                            $.each(option.filters, function (index, filter) {
                                var enable = shouldFilterBeShown(filter, pagesToShow_1);
                                generatedFilters_1.push(generateFilterItemHtml(filter, selectedFilters_1, enable));
                            });
                            updatePageAndFilters(generatedPages_1, option.title, selectedFilters_1, generatedFilters_1);
                            break;
                        default:
                            updatePageOnly(generatedPages_1, option.title, selectedFilters_1);
                    }
                    updateGtm(selectedFilters_1, generatedPages_1.length, selectedOption);
                }
                else {
                    $.each(option.pages, function (index, page) {
                        generatedPages_1.push(generatePageItemHtml(page));
                    });
                    $.each(option.filters, function (index, filter) {
                        generatedFilters_1.push(generateFilterItemHtml(filter, []));
                    });
                    updatePageAndFilters(generatedPages_1, option.title, selectedFilters_1, generatedFilters_1);
                    updateGtm(selectedFilters_1, generatedPages_1.length, selectedOption);
                }
            }
        }
        function updateGtm(selectedFilters, pageCount, selectedOption) {
            var filters = [];
            $.each(selectedFilters, function (index, filter) {
                filters.push(filter.title);
            });
            window.dataLayer.push({
                'event': 'resultsUpdate',
                'filters': filters.toString(),
                'optionstate': selectedOption,
                'Results': pageCount,
            });
        }
        function getSelectedOptionData(selectedOption, options) {
            var option = null;
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
                '<h3 class="govuk-heading-m">' +
                '<a class="govuk-link" href="' +
                page.link +
                '">' +
                page.title +
                '</a></h3><p class="govuk-body">' +
                page.summary +
                '</p></div></li>';
        }
        function generateFilterItemHtml(item, selectedFilters, enable) {
            if (enable === void 0) { enable = true; }
            if (pocSelect.val() === "radio") {
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
            var disabled = enable ? "" : " disabled";
            var checked = "";
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
            var filterSelectedString = "{replace} selected";
            var tag = "{replace}";
            var selectOptionText = $('#primaryFiltersSelectedValue');
            var filtersSelectedElement = $('#secondaryFiltersSelected1');
            filtersSelectedElement.text(filterSelectedString.replace(tag, selectedFilters.length.toString()));
            selectOptionText.text(optionTitle);
        }
        function updatePageArea(generatedPages) {
            var tag = "{replace}";
            var singleArticleString = "1 suggestion";
            var multipleArticleString = "{replace} suggestions";
            var totalArticles = $('#totalArticles');
            var pageResults = $('.results-list');
            if (generatedPages.length === 1) {
                totalArticles.text(singleArticleString);
            }
            else {
                totalArticles.text(multipleArticleString.replace(tag, generatedPages.length.toString()));
            }
            pageResults.html(generatedPages.toHtmlString());
        }
        function updateFilterArea(generatedFilters) {
            var selectedPoc = pocSelect.val();
            var filterHtml = $('#filterCheckboxes');
            var markup = "";
            if (selectedPoc === "radio") {
                markup = "<div class ='govuk-radios'>";
            }
            else {
                markup = "<div class ='govuk-checkboxes'>";
            }
            markup += generatedFilters.toHtmlString();
            markup += "</div>";
            filterHtml.html(markup);
            $.each($(checkboxes), function (index, checkbox) {
                $(checkbox).on("click", function () {
                    updateData(false);
                });
            });
            $.each($(radioFilters), function (index, radio) {
                $(radio).on("click", function () {
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
            $.each(selectedFilters, function (index, filter) {
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
            $.each(selectedFilters, function (index, filter) {
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
            $.each(pages, function (index, page) {
                $.each(page.filters, function (pfIndex, pageFilter) {
                    if (filter.url === pageFilter) {
                        filterFound = true;
                    }
                });
            });
            return filterFound;
        }
        Array.prototype.toHtmlString = function () {
            var result = "";
            $.each(this, function (index, item) {
                result = result + item;
            });
            return result;
        };
    }
});
