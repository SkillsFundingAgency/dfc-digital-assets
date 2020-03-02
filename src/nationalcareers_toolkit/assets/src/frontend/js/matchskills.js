var allChecked=false;
$('#selectSkillsGovukLinkSkillSelectToggle').click(function(e) {
    allChecked = !allChecked;
    e.preventDefault();
    $("input:checkbox").prop('checked', allChecked);
    var selectAll = 'Select all';
    $(this).text($(this).text().includes(selectAll) ? 'Clear all' : selectAll);
});