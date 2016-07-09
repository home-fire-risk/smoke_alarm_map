var data_url = "data/tabletracts.csv";
var selecter = d3.selectAll("#regionselect");
var data, data_main;
var formatInt = d3.format(',.0f');
var formatMoney = d3.format('$,.0f');
var formatPct = d3.format('%')

function dropdown() {
    //populate dropdown with region names
    var regions = d3.map();
    data_main.sort(function (a, b) {
        return d3.ascending(a.region, b.region);
    }).forEach(function (d) {
        regions.set(d.region, d);
    });

    selecter.selectAll("option")
        .data(regions.values())
        .enter().append("option")
        .attr("value", function (d) {
            return d.region;
        })
        .text(function (d) {
            return d.region;
        });
}


$(document).ready(function () {
    d3.csv(data_url, function (error, rows) {
        if (error) throw error;
        data_main = rows;

        dropdown();

        var table = $('#example').DataTable({
            data: data_main,
            "deferRender": true,
            "columns": [
                {
                    "data": "region",
                    "visible": false
                    },
                {
                    "data": "rank"
                    },
                {
                    "data": "risk",
                    "render": $.fn.dataTable.render.number(',', '.', 0)
                        /*"render": function (data) {
                            return formatInt(data);
                        }*/
                    },
                {
                    "data": "name_tract"
                    },
                {
                    "data": "county"
                    },
                {
                    "data": "households",
                    "render": $.fn.dataTable.render.number(',', '.', 0)
                        /*"render": function (data) {
                            return formatInt(data);
                        }*/
                    },
                {
                    "data": "medianinc_hh",
                    //"render": $.fn.dataTable.render.number(',', '.', 0, '$')
                    "render": function (data) {
                        return formatMoney(data);
                    }
                    },
                {
                    "data": "hispanic",
                    "render": function (data) {
                        return formatPct(data);
                    }
                    },
                {
                    "data": "white",
                    "render": function (data) {
                        return formatPct(data);
                    }
                    },
                {
                    "data": "black",
                    "render": function (data) {
                        return formatPct(data);
                    }
                    }, {
                    "data": "risk_1agg",
                    "render": $.fn.dataTable.render.number(',', '.', 0)
                        /*"render": function (data) {
                            return formatInt(data);
                        }*/
                    }, {
                    "data": "risk_2agg",
                    "render": $.fn.dataTable.render.number(',', '.', 0)
                        /*"render": function (data) {
                            return formatInt(data);
                        }*/
                    }, {
                    "data": "risk_3agg",
                    "render": $.fn.dataTable.render.number(',', '.', 0)
                        /*"render": function (data) {
                            return formatInt(data);
                        }*/
                    }],
            "order": [[0, "asc"]],
            "scrollY": "500px",
            "scrollCollapse": true,
            fixedHeader: {
                header: true,
                footer: false
            }
        }).columns(0).search("ARC of Alaska Region").draw();

        $('#regionselect').on('change', function () {
            //console.log($(this).val())
            table.columns(0).search(this.value).draw();
        });

    });
});