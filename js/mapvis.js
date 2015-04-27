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
        this.wrangleData(null)
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
                padding = 50;
            //padding should be r/2 or something plausible
            // console.log(that.data)

            var marker = layer.selectAll("svg")
                .data(that.data["objects"])
                .each(transform) // update existing markers
                .enter().append("svg:svg")
                  .attr("width", 1000)
                  .attr("height", 1000)
                .each(transform)
                .attr("class", "marker")
                 .attr("id", function(d) {
                    return "svg-" +d.id;
                })
             

            // Add a circle.
            marker.append("circle")
                // .attr("r", 12)
                .attr("cx", padding)
                .attr("cy", padding)
                .attr("onclick", "alert('click')")
                .attr("onmouseover", "alert('mo')")
                .attr("stroke", "black")
                .on("click", function(d) {
                    console.log("hi")
                })
                   .attr("id", function(d) {
                    return "station-" +d.id;
                })

          that.displayData.forEach(function (k){

          d3.select("#station-"+k.station).attr("r", function(d){
            return k.departures/100
          })


        })


  that.displayData.forEach(function (k){

          // d3.select("#station-"+k.station).attr("opacity", function(d){
          //   // return k.percent_full
          // })
          d3.select("#station-"+k.station).attr("fill", function(d){
            console.log(k.percent_full)
            if(k.percent_full <= .2){
                console.log("less than .2")
                return "#FFFFFF"
            }
            else if(k.percent_full > .2 && k.percent_full<=.4){
                console.log(".2 to .4")
                return "#FFB5B5"
            }
            else if(k.percent_full > .4 && k.percent_full<=.6){
                console.log(".4 to .6")
                return "#FF5959"
            }
            else if(k.percent_full > .6 && k.percent_full<=.8){
                console.log(".6 to .8")
                return "#CF3A3A"
            }
            else {
                console.log(".8 to 1")
                return "#B80000"
            }

            // if(k.percent_full
            
          })


        })

            // Add a label.
            marker.append("svg:text")
                .attr("x", padding + 7)
                .attr("y", padding)
                .attr("dy", ".31em")
                .attr("onclick", "alert('click')")
                .text(function(d) {
                    return (d.name + "test");
                });


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


    // return;

    this.wrangleData(null);
    // console.log(that.displayData)
    //  that.displayData.forEach(function (k){

    //       // d3.select("#station-"+k.station).attr("opacity", function(d){
    //       //   // return k.percent_full
    //       // })
    //       d3.select("#station-"+k.station).attr("fill", function(d){
    //         console.log(k.percent_full)
    //         if(k.percent_full <= .2){
    //             console.log("less than .2")
    //             return "#FFFFFF"
    //         }
    //         else if(k.percent_full > .2 && k.percent_full<=.4){
    //             console.log(".2 to .4")
    //             return "#FFB5B5"
    //         }
    //         else if(k.percent_full > .4 && k.percent_full<=.6){
    //             console.log(".4 to .6")
    //             return "#FF5959"
    //         }
    //         else if(k.percent_full > .6 && k.percent_full<=.8){
    //             console.log(".6 to .8")
    //             return "#CF3A3A"
    //         }
    //         else {
    //             console.log(".8 to 1")
    //             return "#B80000"
    //         }

    //         // if(k.percent_full
            
    //       })


    //     })

    // var extent = d3.extent(that.displayData, function(d) {
    //     return d.time;
    // })
    // timeEnd= extent[0]
    // timeStart = extent[1]

    this.updateVis();
}



MapVis.prototype.updateVis = function() {

        var that = this;
        console.log(that.displayData)
        console.log('A;LSDKJF;LAKSDFJ')
            // Create the Google Map…

        that.displayData.forEach(function (k){

          d3.select("#station-"+k.station).attr("r", function(d){
            return k.departures/100
          })


        })


        // d3.select("#mapVis").node(), {
        //         zoom: 15,
        //         center: new google.maps.LatLng(42.358431, -71.059773),
        //         mapTypeId: google.maps.MapTypeId.TERRAIN,
        //     });

        that.displayData.forEach(function (k){

          // d3.select("#station-"+k.station).attr("opacity", function(d){
          //   // return k.percent_full
          // })
          d3.select("#station-"+k.station).attr("fill", function(d){
            // console.log(k.percent_full)
            if(k.percent_full <= .2){
                console.log("less than .2")
                return "#FFFFFF"
            }
            else if(k.percent_full > .2 && k.percent_full<=.4){
                console.log(".2 to .4")
                return "#FFB5B5"
            }
            else if(k.percent_full > .4 && k.percent_full<=.6){
                console.log(".4 to .6")
                return "#FF5959"
            }
            else if(k.percent_full > .6 && k.percent_full<=.8){
                console.log(".6 to .8")
                return "#CF3A3A"
            }
            else {
                console.log(".8 to 1")
                return "#B80000"
            }

            // if(k.percent_full
            
          })


        })

        // d3.selectAll("circle")
        //     .attr("r", function(d) {
        //         // console.log(d)
        //         that.displayData.forEach(function (k){
        //           // if (d)
        //           // {
        //              console.log(d)

        //             if (d.id == k.station)
        //             {
        //               // console.log ("HEY")
        //               return k.departures/10
        //             }
        //         // }
        //         })
        //         // return 18

                
        //     })
           
        // this.wrangleData();


    }
    /**
     * Method to wrangle the data. In this case it takes an options object
     */



MapVis.prototype.wrangleData = function(_filterFunction) {

    // var filt = function(d) {
    //     return d >= timeStart && d <= timeEnd
    // }
    // displayData should hold the data which is visualized
    // pretty simple in this case -- no modifications needed
    this.displayData = this.filterAndAggregate(_filterFunction);
    // console.log(this.displayData)


}

// MapVis.prototype.onStationChanged = function(_filterFunction) {
//     // console.log(this.data)
//     var that = this

//     // console.log("final res", res)
//     // console.log(this.displayData)
//     // return res;
//     // this.displaydata = []
//     console.log("meep")
//         // console.log(this.displayData)
//     this.wrangleData()
//     console.log(that.displayData)
//     // wrangleData()
//     this.updateVis();

// }

MapVis.prototype.onCheckboxChanged = function(_filterFunction) {
    // console.log(this.data)
    var that = this

    // console.log("final res", res)
    // console.log(this.displayData)
    // return res;
    // this.displaydata = []
    console.log("meep")
        // console.log(this.displayData)
    this.wrangleData()
    console.log(that.displayData)
    // wrangleData()
    this.updateVis();

}


MapVis.prototype.onSelectionChange = function(selection) {

  console.log("hIII")

    // TODO: call wrangle function
    // console.log(selection["max_time"])
    if (!selection.min_time || !selection.max_time)
    {
        selection.min_time = 0;
        selection.max_time = 24;
    }

    timeEnd = selection.max_time;
    timeStart = selection.min_time;
    // console.log(timeEnd)
// var this = that;
//     // }
//     console.log(this.data)
// console.log(this.data)
  var station_filter = function(d) {

        return d == selected_station
    }


var f = function(d) {

        return d >= timeStart && d <= timeEnd
    }
this.wrangleData(f, station_filter)
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
    var tripSummary = {
        "station": 0,
        "departures": 0,
        "percent_full": 0
    };



    if (d3.select("#weekday").property("checked") == true) {

        console.log("in weekday")
        var departures;
        var arrivals;
        var station;
        var capacity;
        var res = []


        stations.forEach(function(k) {
            departures = 0
            arrivals = 0

            for (j = 0; j < intervals_keys.length; j++) {

                that.tripdata.forEach(function(d) {

             
                    if (d.time == intervals_keys[j]) {
                        if (filter(d.time))

                        {
                           
                            d.stationdata.forEach(function(m) {

                                if (k == m.station) {

                                    arrivals += m.weekday.arrivals
                                    departures += m.weekday.departures
                                }


                            })
                        }

                    }
                })

              
                that.capacitydata.forEach(function(s)

                    {
                        // console.log(s)
                        if (s.stationid == k) {
                            capacity = s.capacity
                        }

                    }
                )




            }

            station = k
            percent_full = (arrivals - departures) / capacity

            var tripSummary = {
                "station": station,
                "departures": departures,
                "arrivals": arrivals,
                "percent_full": percent_full
            };

     


            res.push(tripSummary)
            // console.log(res)


        })




    }




    if (d3.select("#weekend").property("checked") == true) {
        console.log("in weekday")
        var departures;
        var arrivals;
        var station;
        var capacity;
        var res = []


        stations.forEach(function(k) {
            departures = 0
            arrivals = 0

            for (j = 0; j < intervals_keys.length; j++) {

                that.tripdata.forEach(function(d) {

            
                    if (d.time == intervals_keys[j]) {
                        if (filter(d.time))
   
                        {
                          

                            d.stationdata.forEach(function(m) {

                                if (k == m.station) {

                                    arrivals += m.weekend.arrivals
                                    departures += m.weekend.departures
                                }


                            })
                        }

                    }
                })

                that.capacitydata.forEach(function(s)

                    {
                        if (s.stationid == k) {
                            capacity = s.capacity
                        }

                    }
                )




            }

            station = k
            percent_full = (arrivals - departures) / capacity

            var tripSummary = {
                "station": station,
                "departures": departures,
                "arrivals": arrivals,
                "percent_full": percent_full
            };



            res.push(tripSummary)
            console.log(res)


        })




    }



    if ((d3.select("#weekend").property("checked") == true && d3.select("#weekday").property("checked") == true) ||
        (d3.select("#weekend").property("checked") == false && d3.select("#weekday").property("checked") == false)) {


        console.log("in weekday")
        var departures;
        var arrivals;
        var station;
        var capacity;
        var res = []


        stations.forEach(function(k) {
            departures = 0
            arrivals = 0

            for (j = 0; j < intervals_keys.length; j++) {

                that.tripdata.forEach(function(d) {

                    
                    if (d.time == intervals_keys[j]) {
                        if (filter(d.time))
                      
                        {
                      

                            d.stationdata.forEach(function(m) {

                                if (k == m.station) {

                          
                                    arrivals += m.weekend.arrivals
                                    departures += m.weekend.departures
                                    arrivals += m.weekday.arrivals
                                    departures += m.weekday.departures
                                }


                            })
                        }

                    }
                })

              
                that.capacitydata.forEach(function(s)

                    {
                        if (s.stationid == k) {
                            capacity = s.capacity
                        }

                    }
                )




            }

            station = k
            percent_full = (arrivals - departures) / capacity

            var tripSummary = {
                "station": station,
                "departures": departures,
                "arrivals": arrivals,
                "percent_full": percent_full
            };

            res.push(tripSummary)
            // console.log(res)


        })




    }
    this.displayData = res
    // console.log(this.displayData)
    return res;
    // console.log(res)
}

// }