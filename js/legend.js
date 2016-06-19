function legend() {
    var lw = 25;
    
    var svg = d3.select("#legend").append("svg")
        .attr("width", lw * COLORS.length + 2)
        .attr("height", 60)
        .append("g");

    var legend = svg.selectAll("g.legend")
        .data(COLORS)
        .enter()
        .append("g")
        .attr("class", "legenditem");

    legend.append("rect")
        .attr("opacity", 0.5)
        .attr("fill", function (d, i) {
            return COLORS[i];
        })
        .attr("x", function (d, i) {
            return i * lw;
        })
        .attr("y", 15)
        .attr("width", lw)
        .attr("height", lw);

    svg.append("text")
        .attr("x", 0)
        .attr("y", 10)
        .attr("text-anchor", "start")
        .attr("class", "legend")
        .text("Least risk");

    svg.append("text")
        .attr("x", COLORS.length * lw)
        .attr("y", 10)
        .attr("text-anchor", "end")
        .attr("class", "legend")
        .text("Most risk")
}
legend();