var data_url = "data/tabletracts.csv";
var data, data_main;
var REGIONSELECT = "ARC of Alaska Region";
var selecter = d3.selectAll("#regionselect");
var formatInt = d3.format(',.0f');
var formatMoney = d3.format('$,.0f');
var formatPct = d3.format('%')

// column definitions
var columns = [
    {
        head: 'Rank',
        cl: 'center',
        html: function (d) {
            return formatInt(d.rank);
        }
        },
    {
        head: 'Risk',
        cl: 'center',
        html: function (d) {
            return formatInt(d.risk);
        }
        },
    {
        head: 'Tract',
        cl: 'left',
        html: function (d) {
            var name = d.name_tract;
            return name.substr(13)
        }
        },
    {
        head: 'County',
        cl: 'left',
        html: function (d) {
            return d.county;
        }
        },
    /*{
        head: 'Region',
        cl: 'left',
        html: function (d) {
            return d.region;
        }
        }, */
    {
        head: 'Households',
        cl: 'num',
        html: function (d) {
            return formatInt(d.households);
        }
        },
    {
        head: 'Median household income',
        cl: 'num',
        html: function (d) {
            return formatMoney(d.medianinc_hh);
        }
    },
    {
        head: 'Hispanic',
        cl: 'num',
        html: function (d) {
            return formatPct(d.hispanic);
        }
        },
    {
        head: 'White',
        cl: 'num',
        html: function (d) {
            return formatPct(d.white);
        }
        },
    {
        head: 'Black',
        cl: 'num',
        html: function (d) {
            return formatPct(d.black);
        }
        },
    /*{
        head: 'Median age',
        cl: 'num',
        html: function (d) {
            return formatInt(d.medianage);
        }
        },*/
    {
        head: 'Risk - no smoke alarm',
        cl: 'num',
        html: function (d) {
            return formatInt(d.risk_1agg);
        }
        },
    {
        head: 'Risk - home fire',
        cl: 'num',
        html: function (d) {
            return formatInt(d.risk_2agg);
        }
        },
    {
        head: 'Risk - fire-related injury',
        cl: 'num',
        html: function (d) {
            return formatInt(d.risk_3agg);
        }
        },
    ];

// create table
var tablediv = d3.select("#table");
var table = tablediv.append('table');


function changedata() {
    data = data_main.filter(function (d) {
        return d.region == REGIONSELECT;
    }).sort(function (a, b) {
        return d3.descending(a.risk, b.risk);
    });
}

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

    selecter.on("change", function () {
        REGIONSELECT = selecter.property("value");
        changedata();
        //remove the existing rows
        d3.select("tbody").remove();
        rows();
    });
}

function rows() {
    // create table body
    table.append('tbody')
        .selectAll('tr')
        .data(data).enter()
        .append('tr')
        .attr("id", function (d) {
            return d.tract_geoid;
        })
        .selectAll('td')
        .data(function (row, i) {
            return columns.map(function (c) {
                // compute cell values for this specific row
                var cell = {};
                d3.keys(c).forEach(function (k) {
                    cell[k] = typeof c[k] == 'function' ? c[k](row, i) : c[k];
                });
                return cell;
            });
        }).enter()
        .append('td')
        .html(function (d) {
            return d.html;
        })
        .attr('class', function (d) {
            return d.cl;
        })
        .attr("id", function (d) {
            return d.head;
        });
        /*.on("click", function (d) {
            console.log(this.parentNode.id);
            flyToTract(this.parentNode.id);
        })*/
}

function tableInit() {

    dropdown();
    changedata();

    // create table header
    var header = table.append('thead').append('tr')
        .selectAll('th')
        .data(columns).enter()
        .append('th')
        .attr('class', function (d) {
            return d.cl;
        })
        .attr("id", function (d) {
            return d.head;
        })
        .text(function (d) {
            return d.head;
        });

    rows();
}

d3.csv(data_url, function (error, rows) {
    if (error) throw error;
    data_main = rows;
    tableInit();
});