$('#selectSkillsGovukLinkSkillSelectToggle').click(function(e) {
    
    e.preventDefault();
    $("input:checkbox").prop('checked', function(i, current) { return !current; });
    var selectAll = 'Select all';
    $(this).text($(this).text().includes(selectAll) ? 'Clear all' : selectAll);

});
