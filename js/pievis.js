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

 var color = ["YellowGreen", "OrangeRed"]

PieVis = function(_parentElement, _data, _eventHandler) {
    // console.log(_data)
    this.parentElement = _parentElement;
    this.data = _data;
    // console.log(this.data)
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
    

    this.wrangleData(null);

    this.updateVis();

}



/**
 * Method to wrangle the data. In this case it takes an options object
 */
PieVis.prototype.wrangleData = function(_filterFunction) {

    var filt = function(d) {
        return d >= timeStart && d <= timeEnd
    }


    // here you filter to only have the selected one

    // then displaydata is gonna like _tripdata except that its gonna
    // have less points
    // (points that have been filtered out)
    this.displayData = this.filterAndAggregate(_filterFunction)



}

PieVis.prototype.onCheckboxChanged = function(_filterFunction) {
// console.log(this.data)
   
             // console.log("final res", res)
             // console.log(this.displayData)
             // return res;
             this.displaydata = []
             // console.log(this.displayData)
             this.wrangleData()

            // wrangleData()
            this.updateVis();

        }

/**
 * the drawing function - should use the D3 selection, enter, exit
 * @param _options -- only needed if different kinds of updates are needed
 */
PieVis.prototype.updateVis = function() {

    var that = this; 
    var pie = d3.layout.pie()

    pie(this.displayData)

    // console.log(user_final)

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
        .data(pie(this.displayData))
        .enter()
        .append("g")
        .attr("class", function(d, i) {
            return "hover hover" + i
        })
        .attr("transform", "translate(" + outerRadius + ", " + outerRadius + ")")


    var secondsvg = d3.select(".secondsvg").append("text")
        .text("User Percentage")
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
            var y = i * height + offset;
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

    var labels = ["Registered", "Casual"]

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
            return labels[i];
        })
       
    this.svg = this.parentElement.select("svg");



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

  

    var extent = d3.extent(that.displayData, function(d) {
        return d.time;
    })
    timeEnd= 00
    timeStart = 24
       
         this.wrangleData()

}
      


   

/**
 * Gets called by event handler and should create new aggregated data
 * aggregation is done by the function "aggregate(filter)". Filter has to
 * be defined here.
 * @param selection
 */

PieVis.prototype.onSelectionChange = function(selection) {

    // TODO: call wrangle function
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
    var f = function(d) {

        return d >= timeStart && d <= timeEnd
    }

this.wrangleData(f)
if(this.displayData[0] && this.displayData[1]){
    this.updateVis();
}


   

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
    var tripSummary ={male: 0,
female: 0,
casual: 0,
registered: 0};
var user_final= [0, 0]


// console.log(gender_final)

if (d3.select("#weekday").property("checked") == true) {
        // console.log("in weekday")
        var registered = 0;
        var casual = 0;
         var res = []
        
                for (j = 0; j < intervals_keys.length; j++) {
                    
                    count = 0;
                    this.data.forEach(function(d) {

                    for (i = 0; i < stations.length; i++) {
                             if (d.time == intervals_keys[j])
                                {
                                    if (filter(d.time))
                                    {
                                    // console.log(d.stationdata)
                                    d.stationdata.forEach(function (k) {
                                        // console.log(k.weekday.arrivals)
                                       registered += k.usertype.weekday.registered
                                       casual += k.usertype.weekday.casual


                                    })
                                    
                                }
                            }
                        
                    }
                })
                user_final[0] = registered/(registered+casual)
                user_final[1] = casual/ (registered+casual); 
                 // console.log(user_final);

                }

            }

          if (d3.select("#weekend").property("checked") == true) {
       //      console.log("in weekend")
       // console.log("in weekday")
        var registered = 0;
        var casual = 0;
         var res = []
        
                for (j = 0; j < intervals_keys.length; j++) {
                    
                    count = 0;
                    this.data.forEach(function(d) {

                    for (i = 0; i < stations.length; i++) {
                             if (d.time == intervals_keys[j])
                                {
                                    if (filter(d.time))
                                    {
                                    // console.log(d.stationdata)
                                    d.stationdata.forEach(function (k) {
                                        // console.log(k.weekday.arrivals)
                                       registered += k.usertype.weekday.registered
                                       casual += k.usertype.weekday.casual


                                    })
                                    
                                }
                            }
                        
                    }
                })
               user_final[0] = registered/(registered+casual)
                user_final[1] = casual/ (registered+casual); 
                 // console.log(user_final);

                }
            }
              if ((d3.select("#weekend").property("checked") == true && d3.select("#weekday").property("checked") == true) || 
                (d3.select("#weekend").property("checked") == false && d3.select("#weekday").property("checked") == false)){


                 // console.log("in weekday")
        var registered = 0;
        var casual = 0;
         var res = []
        
                for (j = 0; j < intervals_keys.length; j++) {
                    
                    count = 0;
                    this.data.forEach(function(d) {

                    for (i = 0; i < stations.length; i++) {
                             if (d.time == intervals_keys[j])
                                {
                                    if (filter(d.time))
                                    {
                                    // console.log(d.stationdata)
                                    d.stationdata.forEach(function (k) {
                                        // console.log(k.weekday.arrivals)
                                       registered += k.usertype.weekday.registered
                                       registered +=k.usertype.weekend.registered
                                       casual += k.usertype.weekday.casual
                                       casual += k.usertype.weekend.casual


                                    })
                                    
                                }
                            }
                        
                    }
                })
              user_final[0] = registered/(registered+casual)
                user_final[1] = casual/ (registered+casual); 
                 // console.log(user_final);

                }

            }
            var res = user_final
            this.displayData = res
            console.log(res)
            return res;

// this.data["records"].forEach(function(d) {


//                             if (d["gender"] == "Male") {
//                                tripSummary.male ++
//                             }
//                             // console.log(tripSummary.male)
//                             if (d["gender"] == "Female") {
//                                 tripSummary.female++
//                             }

//                             if (d["subsc_type"] == "Registered") {
//                                 tripSummary.registered++
//                             }
//                             if (d["subsc_type"] == "Casual") {
//                                 tripSummary.casual++
//                             }
                            

//                         })

//                             female_percent = (tripSummary.female / (tripSummary.male + tripSummary.female))
//                             // console.log(female_percent)
//                             male_percent = 1 - female_percent
//                             registered_percent = (tripSummary.registered / (tripSummary.registered + tripSummary.casual))
//                             casual_percent = 1 - registered_percent
// // console.log("trip summary", tripSummary)
//                         // console.log(gender_final[0])
//                         user_final[0] = casual_percent;
//                         user_final[1] = registered_percent;
//                         return user_final;




}
