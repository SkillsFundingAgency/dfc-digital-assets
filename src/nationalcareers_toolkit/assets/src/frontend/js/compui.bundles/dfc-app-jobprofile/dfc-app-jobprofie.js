$(document).ready(function () {

    // This file contains the script needed to be added to the site
    var elements = document.getElementsByClassName('govuk-accordion__icon')

    //Variables Match the current loadout of the Job Profiles pages. Curent Date: 2024.02.26 Last Updated: 2024.03.26 
    var ids = ["jp-accordion-Icon_how-to-become", "jp-accordion-Icon_what-it-takes", "jp-accordion-Icon_what-youll-do", "jp-accordion-Icon_career-path-and-progression", "jp-accordion-Icon_current-opportunities"]

    // Needed to itterate through each element with the selected class name and add the ID needed
    for (var i = 0; i < elements.length; i++) {
        elements[i].id = (i < ids.length) ? ids[i] : "AccordionIcon";
    };

})//end of document.ready()