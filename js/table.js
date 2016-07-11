var data_url = "data/tabletracts.csv";
var selecter = d3.selectAll("#regionselect");
var data, data_main;

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

//function to format decimal proportions as percentages for display, but export raw data
jQuery.fn.dataTable.render.percent = function () {
    return function (data, type, row) {
        if (type == "export") {
            return data;
        } else {
            return Math.round(data * 100) + "%";
        }
    }
}

$(document).ready(function () {
    d3.csv(data_url, function (error, rows) {
        if (error) throw error;
        data_main = rows;

        dropdown();

        var table = $('#datatable').DataTable({
            data: data_main,
            "deferRender": true,
            "columns": [
                {
                    "data": "region",
                    "visible": false
                }, {
                    "data": "tract_geoid",
                    "visible": false
                }, {
                    "data": "rank",
                    "render": $.fn.dataTable.render.number(',', '.', 0)
                }, {
                    "data": "risk",
                    "render": $.fn.dataTable.render.number(',', '.', 0)
                }, {
                    "data": "name_tract"
                }, {
                    "data": "county"
                }, {
                    "data": "households",
                    "render": $.fn.dataTable.render.number(',', '.', 0)
                }, {
                    "data": "medianinc_hh",
                    "render": $.fn.dataTable.render.number(',', '.', 0, '$')
                }, {
                    "data": "hispanic",
                    "render": $.fn.dataTable.render.percent()
                }, {
                    "data": "white",
                    "render": $.fn.dataTable.render.percent()
                }, {
                    "data": "black",
                    "render": $.fn.dataTable.render.percent()
                }, {
                    "data": "risk_1agg",
                    "render": $.fn.dataTable.render.number(',', '.', 0)
                }, {
                    "data": "risk_2agg",
                    "render": $.fn.dataTable.render.number(',', '.', 0)
                }, {
                    "data": "risk_3agg",
                    "render": $.fn.dataTable.render.number(',', '.', 0)
                    }],
            "order": [[0, "asc"]],
            "scrollY": "500px",
            "scrollCollapse": true,
            "scrollX": true,
            "fixedHeader": {
                "header": true,
                "footer": false
            },
            dom: 'Bfrtip',
            buttons: ['copy', {
                "extend": "csv",
                "exportOptions": {
                    "orthogonal": "export"
                }
            }, {
                "extend": "excel",
                "exportOptions": {
                    "orthogonal": "export"
                }
                }, 'pdf', 'print']
        }).columns(0).search("ARC of Alaska Region").draw();

        //on changing the dropdown, filter table to that region
        $('#regionselect').on('change', function () {
            table.columns(0).search(this.value).draw();
        });

    });
});