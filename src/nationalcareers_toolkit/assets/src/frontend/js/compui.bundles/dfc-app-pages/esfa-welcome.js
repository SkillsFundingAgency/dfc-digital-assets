(function(){
    if(window.location.pathname.toLowerCase() === '/esfa-welcome'){
        GOVUK.cookie("esfawelcome", "active", { days: 365 });
        window.location = "/";
    }
})();