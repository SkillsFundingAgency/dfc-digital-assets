(function ($, d3) {

    var employmentData = [];

    var rows = $('#employment-by-region-data tbody tr');
    rows.each(function (index, row) {
        employmentData.push({
            region: $('td[data-region]', row).data('region'),
            employed: $('td[data-employed]', row).data('employed')
        });
    });

    var employmentTitle = $('#employment-by-region-data .employment-title').text();

    var margin = { top: 20, right: 75, bottom: 30, left: 240 },
        width = 640 - margin.left - margin.right,
        height = (employmentData.length * 40) - margin.top - margin.bottom;

    var format = d3.format('0,000');

    var x = d3.scale.linear()
        .range([0, width]);

    var y = d3.scale.ordinal()
        .rangeRoundBands([0, height], 0.1);

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient('bottom');

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient('left');

    var chart = d3.select('#employment-by-region-chart .chart')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
      .append('g')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    chart.append('text')
        .attr('class', 'employment-title')
        .attr('x', 0)
        .attr('y', 0)
        .text(employmentTitle);

    x.domain([0, d3.max(employmentData, function (d) { return d.employed; })]);
    y.domain(employmentData.map(function (d) { return d.region; }));

    var bar = chart.selectAll('.bar')
        .data(employmentData)
        .enter().append('g')
        .attr('class', 'bar')
        .attr('transform', function (d, i) { return 'translate(0,' + y(d.region) + ')'; });

    bar.append('rect')
        .attr('class', 'hover-bg')
        .attr('x', -margin.left)
        .attr('width', '100%')
        .attr('height', y.rangeBand())

    bar.append('rect')
        .attr('class', 'employed')
        .attr('y', Math.floor(y.rangeBand() / 2 - 10))
        .attr('width', function (d) { return x(d.employed); })
        .attr('height', 20);

    bar.append('text')
        .attr('class', 'region')
        .attr('x', 10 - margin.left)
        .attr('y', y.rangeBand() / 2)
        .attr('dy', '.35em')
        .text(function (d) { return d.region; });

    bar.append('text')
        .attr('x', function (d) { return x(d.employed) + 3; })
        .attr('y', y.rangeBand() / 2)
        .attr('dy', '.35em')
        .text(function (d) { return format(d.employed); });

}(jQuery, d3))
