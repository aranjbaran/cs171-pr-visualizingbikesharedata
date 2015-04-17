/**
 * Created by Hendrik Strobelt (hendrik.strobelt.com) on 1/28/15.
 */
/**
 * Created by Hendrik Strobelt (hendrik.strobelt.com) on 1/28/15.
 */
/*
 *
 * ======================================================
 * We follow the vis template of init - wrangle - update
 * ======================================================
 *
 * */
/**
 * AgeVis object for HW3 of CS171
 * @param _parentElement -- the HTML or SVG element (D3 node) to which to attach the vis
 * @param _data -- the data array
 * @param _metaData -- the meta-data / data description object
 * @constructor
 */
var totalvotes;
var initialized = false;
var temp_totalvotes = [];
var avg = [];
var totals;
var avg_heights = []
avg = [0.07169285152634719, 0.018012260398631692, 0.030827826307264307, 0.0897041492204994, 0.08213520817929378, 0.11028930953419525, 0.1025082077280077, 0.023071661714052883, 0.030773094486062438, 0.07947397019427986, 0.09475587883645568, 0.08714181962012549, 0.03589586686104709, 0.041049365225427764, 0.038475492070020045, 0.06419303809828956]

BarVis = function(_parentElement, _data, _metaData) {

    this.parentElement = _parentElement;
    this.data = _data;
    this.metaData = _metaData;
    this.displayData = [];

    this.displayData = _data;

    this.width = 715
    this.height = 300

    // TODO: define all constants here
    this.margin = {
            top: 100,
            right: 90,
            bottom: 180,
            left: 90
        },

        this.initVis();


}


/**
 * Method that sets up the SVG and the variables
 */
BarVis.prototype.initVis = function() {

    var that = this;



    //TODO: construct or select SVG
    this.svg = this.parentElement.append("svg")
        .attr("width", this.width + this.margin.left + this.margin.right)
        .attr("height", this.height + this.margin.top + this.margin.bottom)
        .append("g")
        .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");

    // //TODO: create axis and scales
    this.x = d3.scale.ordinal()
        .rangeBands([0, this.width], .1)
        .domain(d3.range(0, 15.1))

     this.xAxis = d3.svg.axis()
        .scale(this.x)

    this.y = d3.scale.linear()
        .range([this.height, 0]);


    this.yAxis = d3.svg.axis()
        .scale(this.y)
        .orient("left");

    this.z = d3.scale.linear()
        .range([0, this.height]);


    this.wrangleData(null);

    this.svg.append("g")
        .attr("class", "xAxis axis")
        .attr("transform", "translate(0," + 300 + ")")
        .call(this.xAxis)
        .selectAll("text")
        .attr("transform", "rotate(45)")
        .style("text-anchor", "start")
        .text(function(d, i) {
            return prioritylabel[i];
        })


    this.y.domain([0, d3.max(this.displayData)]);
    this.yAxis.scale(this.y);



    this.svg.append("g")
        .attr("class", "yAxis axis")
        .attr("transform", "translate(0," + 0 + ")")
        .call(this.yAxis)
        .selectAll("text")

    this.svg.append("g").attr("class", "yAxis axis")

    this.updateVis();
}


/**
 * Method to wrangle the data. In this case it takes an options object
 * @param _filterFunction - a function that filters data or "null" if none
 */
BarVis.prototype.wrangleData = function(_filterFunction) {

    this.displayData = this.filterAndAggregate(_filterFunction);

}



/**
 * the drawing function - should use the D3 selection, enter, exit
 */
BarVis.prototype.updateVis = function() {

    var that = this;

    this.svg.select(".y.axis")
        .call(this.yAxis)

    this.x.domain([0, this.displayData.length])
    this.y.domain(d3.extent(this.displayData, function(d) {
        return d;
    }))


    var hover = this.svg.selectAll(".hover")
        .data(this.displayData, function(d) {

            return d;
        });

    var hover_enter = hover.enter().append("g");


    hover_enter.append("rect")
        .attr("class", "newbar blue")


    hover
        .attr("id", function(d, i) {
            return "hover" + i + ""
        })
        .attr("transform", function(d, i) {
            return "translate(" + 45 * i + ", 0)";
        })
        .style("fill", "red")
        .attr("class", function(d, i) {
            return "newbar hover hover" + i + ""
        })
    .on("mouseover", function(d) {
        d3.selectAll(".hover")
            .style("opacity", function(k) {
                return .1;
            })
        d3.selectAll('.' + this.id).style("opacity", 1)
    })
    .on("mouseout", function(d) {
        d3.selectAll(".hover")
            .style("opacity", function(k) {
                return 1;
            })
    })

    hover.exit().remove();

    //calculated using the avg function in this file, and then scaling with this.y
    avg_heights = [125.48014388002247, 300, 258.33557955519785, 66.92398762162742, 91.53121481011112, 0, 25.19697864987982, 283.551485349336, 258.5135170436024, 
    100.1831104112729, 50.50041427393129, 75.15432422550904, 241.85897805593223, 225.10454644159972, 233.4724120577611, 149.86263171957086]

    hover.selectAll("rect")
        .attr("y", function(d) {
            return that.y(d)
        })

        .attr("height", function(d) {
            return that.height - that.y(d)
        })
        .attr("z-index", 100000)


    hover_enter.append("rect")
        .attr("class", "newbar red")

    avg = [0.07169285152634719, 0.018012260398631692, 0.030827826307264307, 0.0897041492204994, 0.08213520817929378, 0.11028930953419525, 0.1025082077280077, 0.023071661714052883, 0.030773094486062438, 0.07947397019427986, 0.09475587883645568, 0.08714181962012549, 0.03589586686104709, 0.041049365225427764, 0.038475492070020045, 0.06419303809828956]
    // avg_heights = []
    // for (i = 0; i < avg.length; i++)
    // {
    //   avg_heights[i] = this.y(avg[i])
    //   console.log(avg_heights)
    // }



    hover.select(".red")
        .attr("y", function(d, i) {
            return avg_heights[i]
        })
        .attr("fill", "blue")
        .attr("height", function(d, i) {
                return that.height - avg_heights[i]
            })
        .attr("z-index", -100000)
        .transition(20)

    hover.selectAll("rect")
      .attr("width", 14)
          .attr("transform", function(d, i) {
              return "translate(0, 0)";
          })

    hover.select(".blue")
        .attr("transform", function(d, i) {
            return "translate(20, 0)";
        })
    

    var bar_colors = ["blue", "red"]
    var bar_labels = ["Overall Average", "Selected Time Span Avg"]

    var legendRectSize = 18;
    var legendSpacing = 4;

    var legend = this.svg.selectAll('.legend')
        .data(bar_colors)
        .enter()
        .append('g')
        .attr('class', 'legend')
        .attr('transform', function(d, i) {
            var height = legendRectSize + legendSpacing;
            var offset = height;
            var horz = 17 * legendRectSize + 30;
            var vert = i * height - offset;
            return 'translate(575,' + vert + ')';
        })
        .attr("id", function(d, i) {
            return bar_colors[i];
        })
        .on("mouseover", function(d) {
            d3.selectAll(".newbar " + this.id + "")
                .style("opacity", function(k) {
                    return 1;
                })
            d3.selectAll('.' + this.id).style("opacity", .1)
    
        })
        .on("mouseout", function(d) {
            d3.selectAll(".newbar")
                .style("opacity", function(k) {
                    return 1;
                })
        })

   
    legend.append('text')
        .attr('x', legendRectSize + legendSpacing)
        .attr('y', legendRectSize - legendSpacing)
        .text(function(d, i) {
            return bar_labels[i];
        })

   legend.append('rect')
          .attr('width', legendRectSize)
          .attr('height', legendRectSize)
          .style('fill', function(d, i) {
              return bar_colors[i];
          })

}




/**
 * Gets called by event handler and should create new aggregated data
 * aggregation is done by the function "aggregate(filter)". Filter has to
 * be defined here.
 * @param selection
 */
BarVis.prototype.onSelectionChange = function(selectionStart, selectionEnd) {

    // TODO: call wrangle function
    timeEnd = selectionStart.max_time;
    timeStart = selectionStart.min_time;


    var filt = function(d) {
        return d >= timeStart && d <= timeEnd
    }


    this.wrangleData(filt);

    this.updateVis();


}


/*
 *
 * ==================================
 * From here on only HELPER functions
 * ==================================
 *
 * */


BarVis.prototype.doesLabelFit = function(datum, label) {
    var pixel_per_character = 6; // obviously a (rough) approximation
    return datum.prios.length * pixel_per_character < this.x(datum.count);
}

/**
 * The aggregate function that creates the counts for each age for a given filter.
 * @param _filter - A filter can be, e.g.,  a function that is only true for data of a given time range
 * @returns {Array|*}
 */


BarVis.prototype.filterAndAggregate = function(_filter) {


    // Set filter to a function that accepts all items
    // ONLY if the parameter _filter is NOT null use this parameter
    var filter = function() {
        return true;
    }
    if (_filter != null) {
        filter = _filter;
    }

    var that = this;

    var res = d3.range(16).map(function() {
        return 0;
    });

    this.data.forEach(function(d) {
        if (filter(d.time)) {
           

            d.prios.forEach(function(c, i) {

                    res[i] += c;
                })
               
            var temp_totalvotes = []

            for (i = 0; i < 16; i++) {

                temp_totalvotes.push(res[i])
            }


            var tempsum = 0;



            for (i = 0; i < 16; i++) {

                tempsum += temp_totalvotes[i]
            }

            res = []

            for (i = 0; i < 16; i++) {

                res.push(temp_totalvotes[i] / tempsum)

            }


        }
        if (initialized == false) {

            calculate_avg(res)
        }

    })


    return res;


    res = d3.range(0, 16).map(function() {
            return 0;
        })

    var sum = 0;

    if (initialized == false) {
        totalvotes = res;
        for (i = 0; i < 16; i++) {
            sum += totalvotes[i]
        }
        console.log(sum)

        for (i = 0; i < 16; i++) {

            res.priosAvg[i] = totalvotes[i] / sum

        }
        console.log(res.priosAvg)

    }
    return res.priosAvg;

    initialized = true;


    // TODO: implement the function that filters the data and sums the values



}

// TODO: implement the function that filters the data and sums the values
function calculate_avg(value)

{
    avg = d3.range(0, 16).map(function() {
            return 0;
        })
    var sum = 0;


    {
        totalvotes = value;
        for (i = 0; i < 16; i++) {

            sum += totalvotes[i]
        }


        for (i = 0; i < 16; i++) {

            avg[i] = totalvotes[i] / sum

        }


    }
    initialized = true;
    return avg;



}