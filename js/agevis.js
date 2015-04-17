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
AgeVis = function(_parentElement, _data, _metaData) {
    this.parentElement = _parentElement;
    this.data = _data;
    this.metaData = _metaData;
    this.displayData = [];

    this.margin = {
            top: 20,
            right: 0,
            bottom: 30,
            left: 30
        },
        this.width = getInnerWidth(this.parentElement) - this.margin.left - this.margin.right,
        this.height = 300 - this.margin.top - this.margin.bottom;

    this.initVis();

}


/**
 * Method that sets up the SVG and the variables
 */
AgeVis.prototype.initVis = function() {

    var that = this;

    this.svg = this.parentElement.append("svg")
        .attr("width", this.width + this.margin.left + this.margin.right)
        .attr("height", this.height + this.margin.top + this.margin.bottom)
        .append("g")
        .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");

    this.y = d3.scale.linear()
        .range([this.height, 0]);

    this.x = d3.scale.linear()
        .range([0, this.width]);

    this.yAxis = d3.svg.axis()
        .scale(this.y)
        .orient("left");

    this.xAxis = d3.svg.axis()
        .scale(this.x)
        .ticks(5)
        .orient("bottom");


    this.svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + this.height + ")")

    this.svg.append("g")
        .attr("class", "y axis")
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")


    this.area = d3.svg.area()
        .interpolate("monotone")
        .x(function(d) {
            return that.x(d);
        })
        .y0(this.height)
        .y1(function(d, i) {
            return that.y(i);
        });

   
    this.wrangleData(null);

    // call the update method
    this.updateVis();
}


/**
 * Method to wrangle the data. In this case it takes an options object
 * @param _filterFunction - a function that filters data or "null" if none
 */
AgeVis.prototype.wrangleData = function(_filterFunction) {

    // displayData should hold the data which is visualized
    this.displayData = this.filterAndAggregate(_filterFunction);

}



/**
 * the drawing function - should use the D3 selection, enter, exit
 */
AgeVis.prototype.updateVis = function() {

    this.x.domain(d3.extent(this.displayData))

    this.y.domain([0, 100]);

    // updates axis
    this.svg.select(".x.axis")
        .call(this.xAxis);

    this.svg.select(".y.axis")
        .call(this.yAxis)


    var path = this.svg.selectAll(".area")
        .data([this.displayData])

    path.enter()
        .append("path")
        .attr("class", "area");

    path
        .transition()
        .attr("d", this.area);

    path.exit()
        .remove();


}


/**
 * Gets called by event handler and should create new aggregated data
 * aggregation is done by the function "aggregate(filter)". Filter has to
 * be defined here.
 * @param selection
 */
AgeVis.prototype.onSelectionChange = function(selectionStart, selectionEnd) {


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



/**
 * The aggregate function that creates the counts for each age for a given filter.
 * @param _filter - A filter can be, e.g.,  a function that is only true for data of a given time range
 * @returns {Array|*}
 */
AgeVis.prototype.filterAndAggregate = function(_filter) {

        var that = this;
        
        var filter = function() {
            return true;
        }
        if (_filter != null) {
            filter = _filter;
        }


        var res = d3.range(101).map(function() {
            return 0;
        });

        this.data.forEach(function(d) {

            if (filter(d.time)) {

                d.ages.forEach(function(c, i) {
                      if (c === undefined) {
                        return;
                      }
                    if (isNaN(c)) {
                        return;
                    }
                  
                    else {
                        res[i] += c;
                    }

                })
            }

        })
   
        return res;

    }