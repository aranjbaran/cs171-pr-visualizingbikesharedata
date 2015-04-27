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
 * CountVis object for HW3 of CS171
 * @param _parentElement -- the HTML or SVG element (D3 node) to which to attach the vis
 * @param _data -- the data array
 * @param _metaData -- the meta-data / data description object
 * @param _eventHandler -- the Eventhandling Object to emit data to (see Task 4)
 * @constructor
 */
var empty = true;
var margin = 75

CountVis = function(_parentElement, _data, _eventHandler) {
    // console.log("a;sldfjk")
    this.parentElement = _parentElement;
    // console.log(_data)
    this.data = 
    // [{ "time": 0, "count": 25}
    //         ,

    //         { "time": 01, "count": 25}
    //         ,
    //           { "time": 4.25, "count": 35},

    //            { "time": 8, "count": 28}
    //         ,
    //           { "time": 12, "count": 68},
    //            { "time": 15, "count": 48}
    //         ,
    //           { "time": 18, "count": 3},

    //            { "time": 20, "count": 25}
    //         ,
    //           { "time": 24, "count": 16}
    //           // ,
    //           // ,
    //         //     { "time": "2013-03-01T07:00:00", "count": 27}
    //     ]
    _data;
    // this.metaData = _metaData;
    this.eventHandler = _eventHandler;
    this.displayData = [];

    // console.log("here")
    this.margin = {
            top: 100,
            right: 20,
            bottom: 100,
            left: 100
        },
        this.width = 600 - this.margin.left - this.margin.right,

        this.height = 200;


    this.initVis();
}


/**
 * Method that sets up the SVG and the variables
 */
CountVis.prototype.initVis = function() {

    var that = this; 

    // TODO: modify this to append an svg element, not modify the current placeholder SVG element
    this.svg = this.parentElement.append("svg")
        .attr("width", this.width + this.margin.left + this.margin.right)
        .attr("height", this.height + this.margin.top + this.margin.bottom)
        .style("padding", "40px 0px 20px 5px")
        .append("g")

    this.x = d3.scale.linear()

    // this.x = d3.time.scale()
    //     //
        .range([0, this.width])
        // .rangePoints()
        // .ticks(d3.time.minute, 15)
        // .ticks(d3.time.minute, 15)
        
    //this.x.tickFormat(d3.time.format("%H:%m"))
    this.xAxis = d3.svg.axis()
    //      .scale(x)
    // .orient("bottom")
    // .tickFormat(d3.time.format("%H"));
        .scale(this.x)
        .ticks(24)
        // .tickValues([6, 12, 6])
        // .ticks(d3.time.minutes, )
        // .tickFormat(d3.time.format("%H:%m"))



    this.y = d3.scale.pow()
        .range([this.height, 0]);
  

    this.yAxis = d3.svg.axis()
        .scale(this.y)
        .orient("left");

// console.log("hi")
    this.area = d3.svg.area()
        .interpolate("monotone")
        .x(function(d) {
            // console.log(that.x(d.time))
            return that.x(d.time) 
            + margin;
        })
        .y0(this.height)
        .y1(
            function(d) {
                // console.log(that.y(d.count))
                return that.y(d.count);
            })


    this.brush = d3.svg.brush()
        .on("brush", function() {
            empty = that.brush.empty()
            var extent = that.brush.extent();
            var min = extent[0];
            var max = extent[1];
            // console.log(min)
            // console.log(max)

            if (empty) {
                min = that.min
                max = that.max
            }

            $(that.eventHandler).trigger("selectionChanged", {
                "min_time": min,
                "max_time": max
            });


        });

    this.svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(" + margin + "," + this.height + ")")

    this.svg.append("g")
        .attr("class", "y axis")
        .attr("transform", "translate(" + margin + ", 0)")
        .append("text")
        .attr("transform", "rotate(-90)")    
        .attr("y", 7)
            .attr("dy", ".8em")
            .style("text-anchor", "end")


    this.svg.append("g")
        .attr("class", "brush")
        .attr("transform", "translate(" + margin + ", 0)")


    this.svg.append("clipPath")
        .attr("id", "clip")
        .append("rect")
        .attr("x", this.x(0))
        .attr("y", this.y(1))
        .attr("width", this.x(1) - this.x(0) + margin)
        .attr("height", this.y(0) - this.y(1));

    this.zoom = d3.behavior.zoom()
        .x(that.x)
        .on("zoom", focus);


    function focus() {
            that.svg.select(".x.axis").call(that.xAxis)
            that.svg.select("path.area").attr("d", that.area);
        }
 


    // TODO: modify this to append an svg element, not modify the current placeholder SVG element
    this.svg = this.parentElement.select("svg");

    //TODO: implement the slider -- see example at http://bl.ocks.org/mbostock/6452972
    this.addSlider(this.svg)

    // filter, aggregate, modify data
    this.wrangleData();

    var extent = d3.extent(this.displayData, function(d) {
        return d.time;
    })
    this.min = extent[0]
    this.max = extent[1]
        
    this.updateVis();
}



/**
 * Method to wrangle the data. In this case it takes an options object
 */
CountVis.prototype.wrangleData = function() {

    // displayData should hold the data which is visualized
    // pretty simple in this case -- no modifications needed
    this.displayData = this.data;

}

/**
 * the drawing function - should use the D3 selection, enter, exit
 * @param _options -- only needed if different kinds of updates are needed
 */
CountVis.prototype.updateVis = function() {
    // console.log("yo")
    var that = this;
    // TODO: implement update graphs (D3: update, enter, exit)
    // updates scales


    // this.x.domain(d3.extent(this.displayData, function(d) {
    //     return d.time;
    // }));
    // var poo = new Date("2013-03-01T01:10:00")
    // undefined
    // poo
    // Thu Feb 28 2013 20:10:00 GMT-0500 (EST)
    // console.log(that.data)
    // for (var prop in that.data) {
    //       console.log("o." + prop + " = " + that.data[prop]);
    //     }
     // foo = [new Date("2013-03-01T05:00:00Z"),  new Date("2013-03-02T05:00:00Z")]
    this.x.domain([0,23.99])

    this.y.domain(d3.extent(this.displayData, function(d) {
        return d.count;
    }));

    this.yAxis.scale(this.y)

    // updates axis
    this.svg.select(".x.axis")
        .call(this.xAxis);

    this.svg.select(".y.axis")
        .call(this.yAxis)

    // updates graph

    var path = this.svg.selectAll(".area")
        .data([this.displayData])

    path.enter()
        .append("path")
        .attr("class", "area")
        .attr("clip-path", "url(#clip)")


    path
        .transition()
        .attr("d", this.area);

    path.exit()
        .remove();




    this.brush.x(this.x);

    this.svg.select(".brush")
        .call(this.brush)
        .selectAll("rect")
            .attr("height", this.height);

    // TODO: implement update graphs (D3: update, enter, exit)



}

/**
 * Gets called by event handler and should create new aggregated data
 * aggregation is done by the function "aggregate(filter)". Filter has to
 * be defined here.
 * @param selection
 */
CountVis.prototype.onSelectionChange = function(day) {

    // TODO: call wrangle function
    // console.log(min)
    //  console.log(max)
    // console.log('HEREEE')
    // this.wrangleData(function(d) {
    //     return d.type == type;
    // });

    // this.updateVis();


}


/*
 *
 * ==================================
 * From here on only HELPER functions
 * ==================================
 *
 * */




/**
 * creates the y axis slider
 * @param svg -- the svg element
 */
CountVis.prototype.addSlider = function(svg) {
   
    var that = this;

    // TODO: Think of what is domain and what is range for the y axis slider !!
    var sliderScale = d3.scale.linear().domain([1, .1]).range([190, 0])

    var sliderDragged = function() {
        
        var value = Math.max(0, Math.min(190, d3.event.y));
     

        var sliderValue = sliderScale.invert(value);

        // TODO: do something here to deform the y scale
  

        that.y.exponent(sliderValue)
        d3.select(this)
            .attr("y", function() {
                return sliderScale(sliderValue);
            })

        that.updateVis({});
    }
    var sliderDragBehaviour = d3.behavior.drag()
        .on("drag", sliderDragged)

    var sliderGroup = svg.append("g").attr({
        class: "sliderGroup",
        "transform": "translate(" + 0 + "," + 0 + ")"
    })

    sliderGroup.append("rect").attr({
        class: "sliderBg",
        x: 5,
        width: 10,
        height: 190
    }).style({
        fill: "lightgray"
    })


    sliderGroup.append("rect").attr({
        "class": "sliderHandle",
        y: 190,
        width: 20,
        height: 10,
        rx: 2,
        ry: 2
    }).style({
        fill: "#333333"
    }).call(sliderDragBehaviour)


}

CountVis.prototype.convert_decimal = function(d) {
                var value = []
                

                for (var i = 0; i < d.length; i++) {

                    value[i] = d[i]

                }

                var hour = 0; 
                for (var j = 0; value[j] != "."; j++)
                {
                    hour++

                }
                var decimal;
                if (hour == 1)
                {
                   
                    // for (var k = 0; k < value.length - 2; k++)
                    // {
                    //     decimal[k] = value[k+2]
                    // }
                      decimal = Number(+ value[2] + "" + value[3] )

                }
                else if (hour == 2) 
                {

                     decimal = Number(+ value[3] + "" + value[4] )
                 }

                var minutes = decimal * 60
                var time; 

                if (hour == 2)
                {

                     time = +value[0] + "" + value[1] + "" + decimal[0]+"" +decimal[1]
                }

                else if (hour.length = 1)
              {

                     time = +value[0] + "" + decimal[0]+"" +decimal[1]
                }
 

                return time;
            }


