interface Window {
    dataLayer: any[];
}

interface Array<T> {
    toHtmlString(): string;
}

$(function (): void {
    interface TriageToolOption {
        title: string;
        filters: TriageToolFilter[];
        pages: TriageToolPage[];
        selectedFilters: string[];
        sharedContent: string;
    }

    interface TriageToolFilter {
        url: string;
        title: string;
        selected: boolean;
    }

    interface TriageToolPage {
        uri: string;
        summary: string;
        filters: string[];
        link: string;
        title: string;
    }

    interface AjaxRequestModel {
        url: string;
        path: string;
        method: string;
    }

    interface AjaxResponseModel {
        status: number;
        statusMessage: string;
        isHealthy: boolean;
        offlineHtml: string;
        payload: string;
    }

    const checkboxes: string = '#filterCheckboxes input[type=checkbox]';
    const radioFilters: string = '#filterCheckboxes input[type=radio]';
    const optionSelect = $('#triageSelect');
    const pocSelect = $('#pocSelect');
    const clearFilters = $('#clearFilters');

    optionSelect.val($('#SelectedOption').val() as string);
    setUpSinglePageSolution();

    function triageOptions() {
        let options: TriageToolOption[] = [];

        const getTriageData = function () {
            let promise = jQuery.Deferred();
            if (options.length < 1) {
                const apiCall: AjaxRequestModel = {
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
                    success: function (data: AjaxResponseModel) {
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
            } else {
                return promise.resolve(options);
            }
            return promise.promise();
        }

        return {
            getTriageData
        }
    }

    function setUpSinglePageSolution(): void {
        const optionData = triageOptions();

        $.when(optionData.getTriageData()).then(
            function (data: TriageToolOption[]) {
                generateHtml(data, true);
                return setUpSinglePageEvents();
            }
        );

        function setUpSinglePageEvents(): void {
            $.each($(checkboxes),
                function (index, checkbox) {
                    $(checkbox).on("click", function () {
                        updateData(false);
                    });
                });

            $.each($(radioFilters),
                function (index, radio) {
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
                    const checkbox = $(value);
                    if (checkbox.prop('checked')) {
                        checkbox.prop('checked', false);
                    }
                });
                updateData(true);
            });
        }

        function updateData(allData: boolean): void {
            $.when(optionData.getTriageData()).then(
                function (options) {
                    generateHtml(options, allData);
                }
            );
        }

        function generateHtml(options: TriageToolOption[], allData: boolean): void {
            const selectedOption = optionSelect.val() as string;
            const option = getSelectedOptionData(selectedOption, options);
            if (option != null) {
                const selectedFilters = getSelectedFilters();
                let pagesToShow: TriageToolPage[] = [];
                let generatedPages: string[] = [];
                let generatedFilters: string[] = [];

                if (!allData && selectedFilters.length > 0) {
                    $.each(option.pages,
                        function (index, page) {
                            if (shouldPageBeShown(page, selectedFilters)) {
                                pagesToShow.push(page);
                                generatedPages.push(generatePageItemHtml(page));
                            }
                        });

                    const selectedPoc = pocSelect.val() as string;

                    switch (selectedPoc) {
                        case "filters":
                            $.each(option.filters, function (index, filter) {
                                if (shouldFilterBeShown(filter, pagesToShow)) {
                                    generatedFilters.push(generateFilterItemHtml(filter, selectedFilters));
                                }
                            });
                            updatePageAndFilters(generatedPages, option.title, selectedFilters, generatedFilters);
                            break;
                        case "disable":
                            $.each(option.filters, function (index, filter) {
                                const enable = shouldFilterBeShown(filter, pagesToShow);
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
                        generatedFilters.push(generateFilterItemHtml(filter, []));
                    });
                    updatePageAndFilters(generatedPages, option.title, selectedFilters, generatedFilters);
                    updateGtm(selectedFilters, generatedPages.length, selectedOption)
                }
            }
        }

        function updateGtm(selectedFilters: TriageToolFilter[], pageCount: number, selectedOption: string): void {

            const filters: string[] = [];
            $.each(selectedFilters, function (index, filter) {
                filters.push(filter.title);
            });

            window.dataLayer.push({
                'event': 'resultsUpdate',
                'filters': filters.toString(),
                'optionstate': selectedOption,
                'Results': pageCount,
            })
        }

        function getSelectedOptionData(selectedOption: string, options: TriageToolOption[]): TriageToolOption | null {
            let option: TriageToolOption | null = null;

            $.each(options, function (index, value) {
                if (value.title === selectedOption) {
                    option = value;
                }
            });

            return option;
        }

        function getSelectedFilters(): TriageToolFilter[] {
            const filters: TriageToolFilter[] = [];

            $.each($(checkboxes), function (index, value) {
                const checkbox = $(value);
                if (checkbox.prop('checked')) {
                    filters.push({
                        url: checkbox.val() as string,
                        title: $(checkbox.prop("labels")).prop("innerText"),
                        selected: checkbox.prop('checked')
                    });
                }
            });

            $.each($(radioFilters), function (index, value) {
                const radioButton = $(value);
                if (radioButton.prop('checked')) {
                    filters.push({
                        url: radioButton.val() as string,
                        title: $(radioButton.prop("labels")).prop("innerText"),
                        selected: radioButton.prop('checked')
                    });
                }
            });

            return filters;
        }

        function generatePageItemHtml(page: TriageToolPage): string {
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

        function generateFilterItemHtml(item: TriageToolFilter, selectedFilters: TriageToolFilter[], enable = true): string {
            if (pocSelect.val() as string === "radio") {
                return generateFilterRadioButtonHtml(item, selectedFilters);
            }
            return generateFilterCheckboxHtml(item, selectedFilters, enable);
        }

        function generateFilterRadioButtonHtml(item: TriageToolFilter, selectedFilters: TriageToolFilter[]): string {
            let checked: string = "";

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

        function generateFilterCheckboxHtml(item: TriageToolFilter, selectedFilters: TriageToolFilter[], enable: boolean): string {
            const disabled: string = enable ? "" : " disabled";
            let checked: string = "";

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

        function updatePageAndFilters(generatedPages: string[], optionTitle: string, selectedFilters: TriageToolFilter[], generatedFilters: string[]): void {
            updateSharedDetails(selectedFilters, optionTitle);
            updatePageArea(generatedPages);
            updateFilterArea(generatedFilters);
        }

        function updatePageOnly(generatedPages: string[], optionTitle: string, selectedFilters: TriageToolFilter[]): void {
            updateSharedDetails(selectedFilters, optionTitle);
            updatePageArea(generatedPages);
        }

        function updateSharedDetails(selectedFilters: TriageToolFilter[], optionTitle: string): void {
            const filterSelectedString: string = "{replace} selected";
            const tag: string = "{replace}";
            const selectOptionText = $('#primaryFiltersSelectedValue');
            const filtersSelectedElement = $('#secondaryFiltersSelected1');

            filtersSelectedElement.text(filterSelectedString.replace(tag, selectedFilters.length.toString()));
            selectOptionText.text(optionTitle);
        }

        function updatePageArea(generatedPages: string[]): void {
            const tag: string = "{replace}";
            const singleArticleString: string = "1 suggestion";
            const multipleArticleString: string = "{replace} suggestions";
            const totalArticles = $('#totalArticles');
            let pageResults = $('.results-list');

            if (generatedPages.length === 1) {
                totalArticles.text(singleArticleString);
            } else {
                totalArticles.text(multipleArticleString.replace(tag, generatedPages.length.toString()));
            }

            pageResults.html(generatedPages.toHtmlString());
        }

        function updateFilterArea(generatedFilters: string[]): void {
            const selectedPoc = pocSelect.val() as string;
            const filterHtml = $('#filterCheckboxes');
            let markup: string = "";

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
                    $(checkbox).on("click", function () {
                        updateData(false);
                    });
                });

            $.each($(radioFilters),
                function (index, radio) {
                    $(radio).on("click", function () {
                        updateData(false);
                    });
                });
        }

        function shouldPageBeShown(page: TriageToolPage, selectedFilters: TriageToolFilter[]): boolean {
            const selectedPoc = pocSelect.val() as string;

            switch (selectedPoc) {
                case "union":
                case "radio":
                    return shouldPageBeShownUnion(page, selectedFilters);
                default:
                    return shouldPageBeShownIntersection(page, selectedFilters);
            }
        }

        function shouldPageBeShownUnion(page: TriageToolPage, selectedFilters: TriageToolFilter[]): boolean {
            let filterFound: boolean = false;

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

        function shouldPageBeShownIntersection(page: TriageToolPage, selectedFilters: TriageToolFilter[]): boolean {
            let filterCount: number = 0;

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

        function shouldFilterBeShown(filter: TriageToolFilter, pages: TriageToolPage[]): boolean {
            let filterFound: boolean = false;

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

        Array.prototype.toHtmlString = function (): string {
            let result: string = "";
            $.each(this,
                function (index, item) {
                    result = result + item;
                });

            return result;
        }
    }
});
