/**
 * Created by Hendrik Strobelt (hendrik.strobelt.com) on 1/28/15.
 */
//TODO: DO IT ! :) Look at PrioVis.js for a useful structure
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
PrioVis = function(_parentElement, _data, _metaData) {

    this.parentElement = _parentElement;
    this.data = _data;
    this.metaData = _metaData;
    this.displayData = [];

    this.displayData = _data;

    this.width = 715
    this.height = 300
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
PrioVis.prototype.initVis = function() {

    var that = this;

    this.svg = this.parentElement.append("svg")
        .attr("width", this.width + this.margin.left + this.margin.right)
        .attr("height", this.height + this.margin.top + this.margin.bottom)
        .append("g")
        .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");
   

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


    this.wrangleData(null);


    this.svg.append("g")
        .attr("class", "xAxis axis")
        .attr("transform", "translate(0," + 300 + ")")
        .call(this.xAxis)
        .selectAll("text")
        .text(function(d, i) {
            return prioritylabel[i];
        })
        .attr("transform", "rotate(45)")
        .style("text-anchor", "start")
    

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
PrioVis.prototype.wrangleData = function(_filterFunction) {

    // displayData should hold the data which is visualized
    this.displayData = this.filterAndAggregate(_filterFunction);

}



/**
 * the drawing function - should use the D3 selection, enter, exit
 */
PrioVis.prototype.updateVis = function() {

    var that = this;

    this.x.domain([0, this.displayData.length])

    this.y.domain([0, d3.max(this.displayData)])

    this.yAxis.scale(this.y)

    this.svg.select(".yAxis")
        .call(that.yAxis)

    var hover = this.svg.selectAll(".hover")
        .data(this.displayData, function(d) {

            return d;
        });

    var hover_enter = hover.enter().append("g");

    hover_enter.append("rect");
   

    hover
        .attr("class", "hover")
        .attr("class", function(d, i) {
            return "hover hover" + i + ""
        })

    .attr("id", function(d, i) {
            return "hover" + i + ""
        })
        .attr("transform", function(d, i) {
            return "translate(" + 45 * i + ", 0)";
        })
        .style("fill", function(d, i) {
            return color[i];
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


    hover_enter.append("text");

    hover.exit()
        .remove();

    // // Update all inner rects and texts (both update and enter sets)

    hover.selectAll("rect")
        .attr("y", function(d) {
            return that.y(d)
        })
        .attr("width", 40) 
        .attr("height", function(d) {
            return that.height - that.y(d)
        })

    .transition()

}




/**
 * Gets called by event handler and should create new aggregated data
 * aggregation is done by the function "aggregate(filter)". Filter has to
 * be defined here.
 * @param selection
 */
PrioVis.prototype.onSelectionChange = function(selectionStart, selectionEnd) {

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


PrioVis.prototype.doesLabelFit = function(datum, label) {
    var pixel_per_character = 6; // obviously a (rough) approximation
    return datum.prios.length * pixel_per_character < this.x(datum.count);
}

/**
 * The aggregate function that creates the counts for each age for a given filter.
 * @param _filter - A filter can be, e.g.,  a function that is only true for data of a given time range
 * @returns {Array|*}
 */
PrioVis.prototype.filterAndAggregate = function(_filter) {


    // Set filter to a function that accepts all items
    // ONLY if the parameter _filter is NOT null use this parameter
    var that = this;

    var filter = function() {
        return true;
    }
    if (_filter != null) {
        filter = _filter;
    }


    var res = d3.range(16).map(function() {
        return 0;
    });

    this.data.forEach(function(d) {
        if (filter(d.time)) {

            d.prios.forEach(function(c, i) {

                res[i] += c;
            })
        }

    })
    return res;

}
