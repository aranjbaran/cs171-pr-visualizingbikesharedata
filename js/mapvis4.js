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


MapVis = function(_parentElement, _data, _tripdata, _capacitydata, _eventHandler) {
    // console.log("a;sldfjk")
    this.parentElement = _parentElement;
    this.data = _data;
    this.capacitydata = _capacitydata;
    this.tripdata = _tripdata
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

    // Create the Google Map…
        console.log("CREATING MAP");
          var map = new google.maps.Map(d3.select("#mapVis").node(), {
            zoom: 15,
            center: new google.maps.LatLng(42.358431, -71.059773),
            mapTypeId: google.maps.MapTypeId.TERRAIN,
          });
        



          // Load the station data. When the data comes back, create an overlay.
       
            var overlay = new google.maps.OverlayView();

            // Add the container when the overlay is added to the map.
            overlay.onAdd = function() {
                // console.log("hello")
              var layer = d3.select(this.getPanes().overlayMouseTarget).append("div")
                  .attr("class", "stations");

              // Draw each marker as a separate SVG element.
              // We could use a single SVG, but what size would it have?
              overlay.draw = function() {
                var projection = this.getProjection(),
                    padding = 30;
//padding should be r/2 or something plausible
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
                marker.append("circle")
                    .attr("r", 12)
                    .attr("cx", padding)
                    .attr("cy", padding)
                    .attr("onclick", "alert('click')")
                     .attr("onmouseover", "alert('mo')")
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
                     .attr("onclick", "alert('click')")
                    .text(function(d) { return (d.name + "test"); });
                    // .attr("r", function (d){

                    //     stationcapacity.forEach(function (k)

                    //           if (k.id == d.id)
                    //           {

                                
                    //           }

                    //       )


                    // })


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


            return;
          
    this.wrangleData(null);

    // var extent = d3.extent(that.displayData, function(d) {
    //     return d.time;
    // })
    // timeEnd= extent[0]
    // timeStart = extent[1]
        
    this.updateVis();
}



MapVis.prototype.updateVis = function() {

    var that = this; 

    console.log('hi')
    // Create the Google Map…
  
     d3.selectAll("circle")
      // .attr("r", function (d) { console.log(d)})
       // marker.append("circle")
       //              .attr("r", 12)
       //              .attr("cx", padding)
       //              .attr("cy", padding)
       //              .attr("onclick", "alert('click')")
       //               .attr("onmouseover", "alert('mo')")
       //                .on("click", function(d)
       //                {
       //                    console.log("hi")
       //                }); 
       //              ;
          
    this.wrangleData(null);

    // var extent = d3.extent(that.displayData, function(d) {
    //     return d.time;
    // })
    // timeEnd= extent[0]
    // timeStart = extent[1]
        
    // this.updateVis();
}
/**
 * Method to wrangle the data. In this case it takes an options object
 */


// MapVis.prototype.updateVis = function() {

//     // d3.selectAll(".marker")

//     that.displayData =[{"station": 1, "departures": 25,
//             "percent_full": 15}]



//      var marker = layer.selectAll("svg")
//                     .data(that.displayData])



//     d3.selectAll(".marker")
//        .attr("r", function (d){

//           return displayData

//        }

// }

MapVis.prototype.wrangleData = function(_filterFunction) {

    // var filt = function(d) {
    //     return d >= timeStart && d <= timeEnd
    // }
    // displayData should hold the data which is visualized
    // pretty simple in this case -- no modifications needed
    this.displayData = this.filterAndAggregate(_filterFunction);


}


MapVis.prototype.onCheckboxChanged = function(_filterFunction) {
// console.log(this.data)
   
             // console.log("final res", res)
             // console.log(this.displayData)
             // return res;
             // this.displaydata = []
             console.log("meep")
             // console.log(this.displayData)
             this.wrangleData()

            // wrangleData()
            this.updateVis();

        }


MapVis.prototype.onSelectionChange = function(selectionStart, selectionEnd) {

  // return;
    timeEnd = selectionStart.max_time;
    timeStart = selectionStart.min_time;


    var filt = function(d) {
        return d >= timeStart && d <= timeEnd
    }


    this.wrangleData(filt);


    this.updateVis();


}

MapVis.prototype.filterAndAggregate = function(_filter) {
  console.log("hiii")

     var that = this;
// console.log(_filter)

  var that = this;
        
        var filter = function() {
            return true;
        }
        if (_filter != null) {
            filter = _filter;
        }


// console.log(this.data)
// console.log(this.displayData)
    // return res;
    var tripSummary ={"station": 0, "departures": 0,
"percent_full": 0};



// var user_final= [0, 0]


// console.log(gender_final)

if (d3.select("#weekday").property("checked") == true) {
       
   console.log("in weekday")
        var departures ;
        var arrivals ;
        var station;
        var capacity;
         var res = []


              stations.forEach(function (k){
                departures = 0
                  arrivals = 0
        
                for (j = 0; j < intervals_keys.length; j++) {
                  
                    that.tripdata.forEach(function(d) {

                    // for (i = 0; i < stations.length; i++) {
                             if (d.time == intervals_keys[j])
                                {
                                    if (filter(d.time))
                                    {
                                    // console.log(d.stationdata)
                                    d.stationdata.forEach(function (m) {
                                      if (k == d.stationdata.station)
                                      {

                                        // console.log(k.weekday.arrivals)
                                      arrivals += m.weekday.arrivals
                                        departures += m.weekday.departures
                                      }


                                    })
                                    
                                }
                            }
                        
                    // }
                })

                    // console.log(departures)

                     // var capacity;
                  that.capacitydata.forEach(function (s)

                    {
                        if (s.stationid== k)
                        {
                            capacity = s.capacity
                        }

                    }
                        )

                  

                    }

                      station = k
                     percent_full = (capacity + arrivals/30 - departures/30 )/capacity

                      var tripSummary ={"station": station, "departures": departures, "arrivals": arrivals,
            "percent_full": percent_full};

                    // console.log("departures here", departures)
                    console.log(tripSummary)
           

                res.push(tripSummary)
                console.log(res)


                })

                


            }






       //    if (d3.select("#weekend").property("checked") == true) {
       //      console.log("in weekend")
       // console.log("in weekday")
       //  var registered = 0;
       //  var casual = 0;
       //   var res = []
        
       //          for (j = 0; j < intervals_keys.length; j++) {
                    
       //              count = 0;
       //              this.data.forEach(function(d) {

       //              for (i = 0; i < stations.length; i++) {
       //                       if (d.time == intervals_keys[j])
       //                          {
       //                              if (filter(d.time))
       //                              {
       //                              // console.log(d.stationdata)
       //                              d.stationdata.forEach(function (k) {
       //                                  // console.log(k.weekday.arrivals)
       //                                 registered += k.usertype.weekday.registered
       //                                 casual += k.usertype.weekday.casual


       //                              })
                                    
       //                          }
       //                      }
                        
       //              }
       //          })
       //         user_final[0] = registered/(registered+casual)
       //          user_final[1] = casual/ (registered+casual); 
       //           console.log(user_final);

       //          }
       //      }
       //        if ((d3.select("#weekend").property("checked") == true && d3.select("#weekday").property("checked") == true) || 
       //          (d3.select("#weekend").property("checked") == false && d3.select("#weekday").property("checked") == false)){


       //           console.log("in weekday")
       //  var registered = 0;
       //  var casual = 0;
       //   var res = []
        
       //          for (j = 0; j < intervals_keys.length; j++) {
                    
       //              count = 0;
       //              this.data.forEach(function(d) {

       //              for (i = 0; i < stations.length; i++) {
       //                       if (d.time == intervals_keys[j])
       //                          {
       //                              if (filter(d.time))
       //                              {
       //                              // console.log(d.stationdata)
       //                              d.stationdata.forEach(function (k) {
       //                                  // console.log(k.weekday.arrivals)
       //                                 registered += k.usertype.weekday.registered
       //                                 registered +=k.usertype.weekend.registered
       //                                 casual += k.usertype.weekday.casual
       //                                 casual += k.usertype.weekend.casual


       //                              })
                                    
       //                          }
       //                      }
                        
       //              }
       //          })
       //        user_final[0] = registered/(registered+casual)
       //          user_final[1] = casual/ (registered+casual); 
       //           console.log(user_final);

       //          }

       //      }
       //      var res = user_final
       //      this.displayData = res
            return res;


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