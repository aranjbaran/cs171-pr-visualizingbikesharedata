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
 * PieVis object for HW3 of CS171
 * @param _parentElement -- the HTML or SVG element (D3 node) to which to attach the vis
 * @param _data -- the data array
 * @param _metaData -- the meta-data / data description object
 * @param _eventHandler -- the Eventhandling Object to emit data to (see Task 4)
 * @constructor
 */

 var color = ["blue", "red"]

PieVis = function(_parentElement, _data, _eventHandler) {
    console.log(_data)
    this.parentElement = _parentElement;
    this.data = _data;
    // this.metaData = _metaData;
    this.eventHandler = _eventHandler;

    this.displayData = [];
    this.displayData = _data;

    this.margin = {
            top: 100,
            right: 100,
            bottom: 100,
            left: 100
        },
  
    this.width = 1500
     

    this.height = 400 - this.margin.top - this.margin.bottom;


    this.initVis();
}


/**
 * Method that sets up the SVG and the variables
 */
PieVis.prototype.initVis = function() {
    // console.log("gender", gender_final)

    var that = this; 
    // console.log("here", that.data)

    var pie = d3.layout.pie()

    pie(gender_final)
  console.log("example")



    var outerRadius = 250 / 2;
    var innerRadius = 0;
    var hover = d3.svg.arc()
        .innerRadius(innerRadius)
        .outerRadius(outerRadius);

    var svg = this.parentElement
        .append("svg")
        .attr("class", "firstsvg")
        .attr("width", 250)
        .attr("height", 500)
        .attr("transform", "translate(" + 700 + ", " + 700 + ")")

    var hovers = svg.selectAll("g.hover")
        .data(pie(gender_final))
        .enter()
        .append("g")
        .attr("class", function(d, i) {
            return "hover hover" + i + ""
        })
      .attr("transform", "translate(" + outerRadius + ", " + outerRadius + ")")

    var secondsvg = d3.select(".firstsvg").append("text")
        .text("Gender Percentages")
        .attr("class", "text")
        .attr("transform", "translate(" + 80 + ", " + 275 + ")")
        .style("fill", "black")

    hovers.append("path")
        .attr("fill", function(d, i) {
            return color[i]
        })
        .attr("d", hover);

    hovers.attr("id", function(d, i) {
            return "hover" + i + ""
        })
        .attr("class", function(d, i) {
            return "hover hover" + i + ""
        })

    hovers
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

    // this.wrangleData(null);

    // this.updateVis();

}



/**
 * Method to wrangle the data. In this case it takes an options object
 */
PieVis.prototype.wrangleData = function(_filterFunction) {

    this.displayData = this.filterAndAggregate(_filterFunction)

}

/**
 * the drawing function - should use the D3 selection, enter, exit
 * @param _options -- only needed if different kinds of updates are needed
 */
PieVis.prototype.updateVis = function() {

    var that = this; 
    var pie = d3.layout.pie()

    pie(user_final)


    var outerRadius = 250 / 2;
    var innerRadius = 0;
    var hover = d3.svg.arc()
        .innerRadius(innerRadius)
        .outerRadius(outerRadius);

    d3.selectAll(".pieBrushAvg").remove();

    var svg = this.parentElement
        .append("svg")
        .attr("class", "pieBrushAvg secondsvg")
        .attr("transform", "translate(" + 700 + ", " + 700 + ")")
         .attr("width", 600)
        .attr("height", 500)

    var hovers = svg.selectAll("g.hover")
        .data(pie(user_final))
        .enter()
        .append("g")
        .attr("class", function(d, i) {
            return "hover hover" + i
        })
        .attr("transform", "translate(" + outerRadius + ", " + outerRadius + ")")


    var secondsvg = d3.select(".secondsvg").append("text")
        .text("Selected Average")
        .attr("class", "text")
        .attr("transform", "translate(" + 80 + ", " + 275 + ")")
        .style("fill", "black")

    hovers.append("path")
        .attr("d", hover)

    hovers.attr("fill", function(d, i) {
        return color[i]
    })
      .attr("id", function(d, i) {
        return "hover" + i + ""
    })



    var spacing = 4.5;
    var legendrect = 17;
   

    var legend = svg.selectAll('.legend')
        .data(color)
        .enter()
        .append('g')
        .attr('class', 'legend')
        .attr('transform', function(d, i) {
            var height = legendrect + spacing;
            var offset = height;
            var x = 17 * legendrect + 30;
            var y = i * height - offset;
            return 'translate(' + x + ',' + y + ')';
        })
        .attr("id", function(d, i) {
            return "hover" + i + ""
        })
        .attr("class", function(d, i) {
            return "hover hover" + i + ""
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

    legend.append('rect')
        .attr('width', legendrect)
        .attr('height', legendrect)
        .style('fill', function(d, i) {
            return color[i];
        })
        .style('stroke', color);

    legend.append('text')
        .attr('x', legendrect + spacing)
        .attr('y', legendrect - spacing)
        .text(function(d, i) {
            return prioritylabel[i];
        })
       
    this.svg = this.parentElement.select("svg");


    //TODO: implement the slider -- see example at http://bl.ocks.org/mbostock/6452972
    
    this.wrangleData();

    var extent = d3.extent(this.displayData, function(d) {
        return d.time;
    })
    this.min = extent[0]
    this.max = extent[1]

     hovers
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
       

}
      


   

/**
 * Gets called by event handler and should create new aggregated data
 * aggregation is done by the function "aggregate(filter)". Filter has to
 * be defined here.
 * @param selection
 */

PieVis.prototype.onSelectionChange = function(selectionStart, selectionEnd) {

    // TODO: call wrangle function
    timeEnd = selectionStart.max_time;
    timeStart = selectionStart.min_time;
    // }

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


PieVis.prototype.filterAndAggregate = function(_filter) {


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
             


    }
  })


    return res;



}
