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
 * MapVis object for HW3 of CS171
 * @param _parentElement -- the HTML or SVG element (D3 node) to which to attach the vis
 * @param _data -- the data array
 * @param _metaData -- the meta-data / data description object
 * @param _eventHandler -- the Eventhandling Object to emit data to (see Task 4)
 * @constructor
 */
var empty = true;
var margin = 75

MapVis = function(_parentElement, _data, _eventHandler) {
    // console.log("a;sldfjk")
    this.parentElement = _parentElement;
    this.data = _data;
    // console.log(_data)
    // console.log("hi", newData)
    // this.metaData = _metaData;
    this.eventHandler = _eventHandler;
    this.displayData = [];


    this.margin = {
            top: 100,
            right: 20,
            bottom: 100,
            left: 100
        },
        // this.width = getInnerWidth(this.parentElement) - this.margin.left - this.margin.right,

        // this.height = 400 - this.margin.top - this.margin.bottom;


    this.initVis();
}


/**
 * Method that sets up the SVG and the variables
 */
MapVis.prototype.initVis = function() {

    var that = this; 
    console.log("place")

    // TODO: modify this to append an svg element, not modify the current placeholder SVG element
    this.svg = this.parentElement.append("svg")
        .attr("width", 800)
        .attr("height", 800)
        .style("padding", "40px 0px 20px 5px")
        .append("g")
        .attr("id", "sample")

    // Create the Google Map…
          var map = new google.maps.Map(d3.select("#mapVis").node(), {
            zoom: 500,
            center: new google.maps.LatLng(42.358431, -71.059773),
            mapTypeId: google.maps.MapTypeId.TERRAIN,
          });

        



          // Load the station data. When the data comes back, create an overlay.
       
            var overlay = new google.maps.OverlayView();

            // Add the container when the overlay is added to the map.
            overlay.onAdd = function() {
              var layer = d3.select(this.getPanes().overlayMouseTarget).append("div")
                  .attr("class", "stations");

              // Draw each marker as a separate SVG element.
              // We could use a single SVG, but what size would it have?
              overlay.draw = function() {
                var projection = this.getProjection(),
                    padding = 10;

                    // console.log(that.data)

                var marker = layer.selectAll("svg")
                    .data(that.data["objects"])
                    .each(transform) // update existing markers
                    .enter().append("svg:svg")
                    .each(transform)
                    .attr("class", "marker")
                    .attr("id", function (d) {
                      return d.id;
                    })
                   

                // Add a circle.
                marker.append("svg:circle")
                    .attr("r", 5.5)
                    .attr("cx", padding)
                    .attr("cy", padding)
                      .on("click", function(d)
                      {
                          console.log("hi")
                      }); 
                    ;

                // Add a label.
                marker.append("svg:text")
                    .attr("x", padding + 7)
                    .attr("y", padding)
                    .attr("dy", ".31em")
                    .text(function(d) { return d.name; });

                function transform(d) {
                  d = new google.maps.LatLng(d.point.coordinates[1], d.point.coordinates[0]);
                  d = projection.fromLatLngToDivPixel(d);
                  return d3.select(this)
                      .style("left", (d.x - padding) + "px")
                      .style("top", (d.y - padding) + "px");


                }
              };
            };

            // Bind our overlay to the map…
            overlay.setMap(map)


          

    // this.x = d3.time.scale()
    //     .range([0, this.width]);

    // this.xAxis = d3.svg.axis()
    //     .scale(this.x)    


    // this.y = d3.scale.pow()
    //     .range([this.height, 0]);
  

    // this.yAxis = d3.svg.axis()
    //     .scale(this.y)
    //     .orient("left");

    // this.area = d3.svg.area()
    //     .interpolate("monotone")
    //     .x(function(d) {
    //         return that.x(d.time) + margin;
    //     })
    //     .y0(this.height)
    //     .y1(
    //         function(d) {
    //             return that.y(d.count);
    //         })


    // this.brush = d3.svg.brush()
    //     .on("brush", function() {
    //         empty = that.brush.empty()
    //         var extent = that.brush.extent();
    //         var min = extent[0];
    //         var max = extent[1];

    //         if (empty) {
    //             min = that.min
    //             max = that.max
    //         }

    //         $(that.eventHandler).trigger("selectionChanged", {
    //             "min_time": min,
    //             "max_time": max
    //         });


    //     });

    // this.svg.append("g")
    //     .attr("class", "x axis")
    //     .attr("transform", "translate(" + margin + "," + this.height + ")")

    // this.svg.append("g")
    //     .attr("class", "y axis")
    //     .attr("transform", "translate(" + margin + ", 0)")
    //     .append("text")
    //     .attr("transform", "rotate(-90)")    
    //     .attr("y", 7)
    //         .attr("dy", ".8em")
    //         .style("text-anchor", "end")


    // this.svg.append("g")
    //     .attr("class", "brush")
    //     .attr("transform", "translate(" + margin + ", 0)")


    // this.svg.append("clipPath")
    //     .attr("id", "clip")
    //     .append("rect")
    //     .attr("x", this.x(0))
    //     .attr("y", this.y(1))
    //     .attr("width", this.x(1) - this.x(0))
    //     .attr("height", this.y(0) - this.y(1));

    // this.zoom = d3.behavior.zoom()
    //     .x(that.x)
    //     .on("zoom", focus);


    // function focus() {
    //         that.svg.select(".x.axis").call(that.xAxis)
    //         that.svg.select("path.area").attr("d", that.area);
    //     }
 


    // // TODO: modify this to append an svg element, not modify the current placeholder SVG element
    // this.svg = this.parentElement.select("svg");

    // //TODO: implement the slider -- see example at http://bl.ocks.org/mbostock/6452972
    // this.addSlider(this.svg)

    // filter, aggregate, modify data
    this.wrangleData();

    var extent = d3.extent(this.displayData, function(d) {
        return d.time;
    })
    this.min = extent[0]
    this.max = extent[1]
        
    // this.updateVis();
}



/**
 * Method to wrangle the data. In this case it takes an options object
 */
MapVis.prototype.wrangleData = function() {

    // displayData should hold the data which is visualized
    // pretty simple in this case -- no modifications needed
    this.displayData = this.data;

}

/**
 * the drawing function - should use the D3 selection, enter, exit
 * @param _options -- only needed if different kinds of updates are needed
 */
// MapVis.prototype.updateVis = function() {

//     var that = this;
//     // TODO: implement update graphs (D3: update, enter, exit)
//     // updates scales


//     this.x.domain(d3.extent(this.displayData, function(d) {
//         return d.time;
//     }));
//     this.y.domain(d3.extent(this.displayData, function(d) {
//         return d.count;
//     }));

//     this.yAxis.scale(this.y)

//     // updates axis
//     this.svg.select(".x.axis")
//         .call(this.xAxis);

//     this.svg.select(".y.axis")
//         .call(this.yAxis)

//     // updates graph

//     var path = this.svg.selectAll(".area")
//         .data([this.displayData])

//     path.enter()
//         .append("path")
//         .attr("class", "area")
//         .attr("clip-path", "url(#clip)")


//     path
//         .transition()
//         .attr("d", this.area);

//     path.exit()
//         .remove();

//     d3.select("#zoom").on("change", function() {
//         if (d3.select(this).property("checked") == true) {
         
//             that.zoom.x(that.x)
//             that.svg.call(that.zoom)
//         }
//     })



//     this.brush.x(this.x);

//     this.svg.select(".brush")
//         .call(this.brush)
//         .selectAll("rect")
//             .attr("height", this.height);

//     // TODO: implement update graphs (D3: update, enter, exit)



// }

// /**
//  * Gets called by event handler and should create new aggregated data
//  * aggregation is done by the function "aggregate(filter)". Filter has to
//  * be defined here.
//  * @param selection
//  */
// MapVis.prototype.onSelectionChange = function(selectionStart, selectionEnd) {

//     // TODO: call wrangle function

//     this.wrangleData(function(d) {
//         return d.type == type;
//     });

//     this.updateVis();


// }


// /*
//  *
//  * ==================================
//  * From here on only HELPER functions
//  * ==================================
//  *
//  * */




// /**
//  * creates the y axis slider
//  * @param svg -- the svg element
//  */
// MapVis.prototype.addSlider = function(svg) {
   
//     var that = this;

//     // TODO: Think of what is domain and what is range for the y axis slider !!
//     var sliderScale = d3.scale.linear().domain([1, .1]).range([190, 0])

//     var sliderDragged = function() {
        
//         var value = Math.max(0, Math.min(190, d3.event.y));
     

//         var sliderValue = sliderScale.invert(value);

//         // TODO: do something here to deform the y scale
  

//         that.y.exponent(sliderValue)
//         d3.select(this)
//             .attr("y", function() {
//                 return sliderScale(sliderValue);
//             })

//         that.updateVis({});
//     }
//     var sliderDragBehaviour = d3.behavior.drag()
//         .on("drag", sliderDragged)

//     var sliderGroup = svg.append("g").attr({
//         class: "sliderGroup",
//         "transform": "translate(" + 0 + "," + 0 + ")"
//     })

//     sliderGroup.append("rect").attr({
//         class: "sliderBg",
//         x: 5,
//         width: 10,
//         height: 190
//     }).style({
//         fill: "lightgray"
//     })


//     sliderGroup.append("rect").attr({
//         "class": "sliderHandle",
//         y: 190,
//         width: 20,
//         height: 10,
//         rx: 2,
//         ry: 2
//     }).style({
//         fill: "#333333"
//     }).call(sliderDragBehaviour)


// }