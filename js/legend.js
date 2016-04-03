var colors = d3.scale.quantize()
    .range(colorbrewer.OrRd[6]);

var legend = d3.select('#legend')
    .append('ul')
    .attr('class', 'list-inline')
    .attr('style', 'list-style-type:none');

var keys = legend.selectAll('li.key')
    .data(colors.range());

keys.enter().append('li')
    .attr('class', 'key')
    .style('border-left-color', String)
    .text(function (d) {
        var r = colors.invertExtent(d);
        //return formats.percent(r[0]);
    });

legend.selectAll('li.key').html('&nbsp;');
legend.select('li.key').html('&nbsp;&nbsp;&nbsp;&nbsp;Least&nbsp;Risk');
legend.select('li.key:last-of-type').html('&nbsp;&nbsp;&nbsp;&nbsp;Most&nbsp;Risk');