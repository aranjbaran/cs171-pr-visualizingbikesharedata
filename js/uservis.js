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

 var agelabels = ["16-35", "26-35", "36-45", "46-55", "56-65", "66-75"]
 var classes = ["female", "male", "female", "male", "female", "male", "female", "male", "female", "male", "female", "male"]

UserVis = function(_parentElement, _data, _eventHandler) {

  
    // console.log(_data)
    this.parentElement = _parentElement;
    this.data = _data;
    // console.log(this.data)
    // this.metaData = _metaData;
    this.eventHandler = _eventHandler;

    this.displayData = [];
    // this.displayData = _data;

    this.margin = {
            top: 100,
            right: 100,
            bottom: 100,
            left: 100
        },
  
    this.width = 500
    this.contentWidth = 450

    this.height = 400 - this.margin.top - this.margin.bottom;
    this.wrangleData(null)

    console.log(this.displayData)

    this.initVis();
}


/**
 * Method that sets up the SVG and the variables
 */
UserVis.prototype.initVis = function() {

    var that = this;



    //TODO: construct or select SVG
    this.svg = this.parentElement.append("svg")
        .attr("width", this.width + this.margin.left + this.margin.right)
        .attr("height", this.height + this.margin.top + this.margin.bottom)
        .append("g")
        .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");

    // //TODO: create axis and scales
    this.x = d3.scale.ordinal()
        .rangeBands([0, this.width], .7)
        .domain(d3.range(0, 6))

     this.xAxis = d3.svg.axis()
        .scale(this.x)

    this.y = d3.scale.linear()
        .range([this.height, 0]);


    this.yAxis = d3.svg.axis()
        .scale(this.y)
        .orient("left");

    this.z = d3.scale.linear()
        .range([0, this.height]);


   

    this.svg.append("g")
        .attr("class", "xAxis axis")
        // .attr("width", this.width)
        .attr("transform", "translate(0," + this.height + ")")
        .call(this.xAxis)
        .selectAll("text")
        .attr("transform", "rotate(45)")
        .style("text-anchor", "start")
        .text(function(d, i) {
            return agelabels[i];
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
UserVis.prototype.wrangleData = function(_filterFunction) {

    var filt = function(d) {
        return d >= timeStart && d <= timeEnd
    }


    // var stationfilt = function (d) 

    // here you filter to only have the selected one

    // then displaydata is gonna like _tripdata except that its gonna
    // have less points
    // (points that have been filtered out)
    this.displayData = this.filterAndAggregate(_filterFunction)



}



/**
 * the drawing function - should use the D3 selection, enter, exit
 */
UserVis.prototype.updateVis = function() {

    var that = this;

    this.svg.select(".yAxis")
        .call(that.yAxis)

    this.x.domain([0, this.displayData.length])

    this.y.domain(d3.extent(this.displayData, function(d) {
        return d;
    }))

    console.log(this.displayData)
    var hover = this.svg.selectAll(".hover")
        .data(this.displayData, function(d) {

            return d;
        });

    var hover_enter = hover.enter().append("g");


    hover_enter.append("rect")
        .attr("class", "newbar LightSlateGray")


    hover
        .attr("id", function(d, i) {
            return classes[i]
        })
        .attr("transform", function(d, i) {
            console.log(Math.floor(i / 2));
            return "translate(" + ((that.contentWidth/12) * (i) + (Math.floor(i / 2) * (that.width - that.contentWidth)/5)) + ", 0)";
        })
        .style("fill", function(d, i) {
            if(i%2 == 0 ){
                return "HotPink"
            }
            else{
                return "LightSlateGray"
            }
            
        })
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

    // //calculated using the avg function in this file, and then scaling with this.y
    // avg_heights = [135.48014388002247, 300, 358.33557955519785, 66.92398762162742, 91.53121481011112, 0, 35.19697864987982, 283.551485349336, 358.5135170436024, 
    // 100.1831104112729, 50.50041427393129, 75.15432423550904, 241.85897805593223, 235.10454644159972, 233.4724120577611, 149.86263171957086]

    

    hover.selectAll("rect")
        .attr("y", function(d) {
            // console.log(d)
            return that.y(d)
        })

        .attr("height", function(d) {
            return that.height - that.y(d)
        })
        .attr("z-index", 100000)


    hover_enter.append("rect")
        .attr("class", "newbar red")

    // avg = [0.07169285152634719, 0.018012260398631692, 0.030827826307264307, 0.0897041492204994, 0.08213520817929378, 0.11028930953419535, 0.1035082077280077, 0.023071661714052883, 0.030773094486062438, 0.07947397019427986, 0.09475587883645568, 0.08714181962013549, 0.03589586686104709, 0.041049365235427764, 0.038475492070020045, 0.06419303809828956]
    // avg_heights = []
    // for (i = 0; i < avg.length; i++)
    // {
    //   avg_heights[i] = this.y(avg[i])
    //   console.log(avg_heights)
    // }



    // hover.select(".red")
    //     .attr("y", function(d, i) {
    //         return avg_heights[i]
    //     })
    //     .attr("fill", "blue")
    //     .attr("height", function(d, i) {
    //             return that.height - avg_heights[i]
    //         })
    //     .attr("z-index", -100000)
    //     .transition(20)

    hover.selectAll("rect")
      .attr("width", this.contentWidth / (12))
          .attr("transform", function(d, i) {
              return "translate(0, 0)";
          })

    // hover.select(".blue")
    //     .attr("transform", function(d, i) {
    //         return "translate(20, 0)";
    //     })
    

    var bar_colors = ["LightSlateGray", "HotPink"]
    var bar_labels = ["Males", "Females"]

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
            var horz = that.width - legendRectSize;
            var vert = i * height - offset;
            return 'translate(' + horz + ',' + vert + ')';
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
UserVis.prototype.onSelectionChange = function(selection) {

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
  var f = function(d) {

        return d >= timeStart && d <= timeEnd
    }

    var station_filter = function(d) {

        return d == selected_station
    }

this.wrangleData(f, station_filter)
this.updateVis();

   

}

UserVis.prototype.onStationChange = function(selection) {
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
console.log(d)
        return d == selected_station
    }


var f = function(d) {

        return d >= timeStart && d <= timeEnd
    }
this.wrangleData(f, station_filter)
this.updateVis();

   

}


/*
 *
 * ==================================
 * From here on only HELPER functions
 * ==================================
 *
 * */


UserVis.prototype.doesLabelFit = function(datum, label) {
    var pixel_per_character = 6; // obviously a (rough) approximation
    return datum.prios.length * pixel_per_character < this.x(datum.count);
}

/**
 * The aggregate function that creates the counts for each age for a given filter.
 * @param _filter - A filter can be, e.g.,  a function that is only true for data of a given time range
 * @returns {Array|*}
 */

UserVis.prototype.onCheckboxChanged = function(_filterFunction) {
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


UserVis.prototype.filterAndAggregate = function(_filter, station_filter) {


    // Set filter to a function that accepts all items
    // ONLY if the parameter _filter is NOT null use this parameter
    var that = this;
// console.log(_filter)

  var that = this;
        
        var filter = function() {
            return true;
        }
        if (_filter != null) {
            filter = _filter;
        }

        var station_filter = function() {
            return true;
        }
        if (station_filter != null) {
            station_filter = station_filter;
        }


console.log(this.data)
// console.log(this.displayData)
    // return res;
   

// console.log(gender_final)

if (d3.select("#weekday").property("checked") == true) {
        // console.log("in weekday")
        var male16_35 = 0;
        var male26_35 = 0;
        var male36_45 = 0;
        var male46_55 = 0;
        var male56_65 = 0;
        var male66_75 = 0;

         var female16_35 = 0;
        var female26_35 = 0;
        var female36_45 = 0;
        var female46_55 = 0;
        var female56_65 = 0;
        var female66_75 = 0;


        
                for (j = 0; j < intervals_keys.length; j++) {
                    
                    // count = 0;
                    this.data.forEach(function(d) {
// console.log(d)
                    for (i = 0; i < stations.length; i++) {
                             if (d.time == intervals_keys[j])
                                {
                                    if (filter(d.time))
                                    {
                                        if (station_filter(d.station))
                                        {
                                            console.log(d.stationdata)
                                    // console.log(d.stationdata)
                                    d.stationdata.forEach(function (k) {
                                        // console.log(k.weekday.arrivals)
                                       male16_35 += k["16-25"].weekday.male
                                    female16_35 += k["16-25"].weekday.female
                                      male26_35 += k["26-35"].weekday.male
                                    female26_35 += k["26-35"].weekday.female
                                    male36_45 += k["36-45"].weekday.male
                                    female36_45 += k["36-45"].weekday.female
                                      male46_55 += k["46-55"].weekday.male
                                    female46_55 += k["46-55"].weekday.female
                                      male56_65 += k["56-65"].weekday.male
                                    female56_65 += k["56-65"].weekday.female
                                      male66_75 += k["66-75"].weekday.male
                                    female66_75 += k["66-75"].weekday.female
                                        })

                                    }
                                    
                                }
                            }
                        
                    }
                })
              

                }

            }

          if (d3.select("#weekend").property("checked") == true) {
       // console.log("in weekday")
        var male16_35 = 0;
        var male26_35 = 0;
        var male36_45 = 0;
        var male46_55 = 0;
        var male56_65 = 0;
        var male66_75 = 0;

         var female16_35 = 0;
        var female26_35 = 0;
        var female36_45 = 0;
        var female46_55 = 0;
        var female56_65 = 0;
        var female66_75 = 0;


        
                for (j = 0; j < intervals_keys.length; j++) {
                    
                    // count = 0;
                    this.data.forEach(function(d) {

                    for (i = 0; i < stations.length; i++) {
                             if (d.time == intervals_keys[j])
                                {
                                    if (filter(d.time))
                                    {
                                    // console.log(d.stationdata)
                                    d.stationdata.forEach(function (k) {
                                        // console.log(k.weekday.arrivals)
                                       male16_35 += k["16-25"].weekend.male
                                    female16_35 += k["16-25"].weekend.female
                                      male26_35 += k["26-35"].weekend.male
                                    female26_35 += k["26-35"].weekend.female
                                    male36_45 += k["36-45"].weekend.male
                                    female36_45 += k["36-45"].weekend.female
                                      male46_55 += k["46-55"].weekend.male
                                    female46_55 += k["46-55"].weekend.female
                                      male56_65 += k["56-65"].weekend.male
                                    female56_65 += k["56-65"].weekend.female
                                      male66_75 += k["66-75"].weekend.male
                                    female66_75 += k["66-75"].weekend.female


                                    })
                                    
                                }
                            }
                        
                    }
                })
                // user_final[0] = registered/(registered+casual)
                // user_final[1] = casual/ (registered+casual); 
                 // console.log(user_final);

                }
            }
              if ((d3.select("#weekend").property("checked") == true && d3.select("#weekday").property("checked") == true) || 
                (d3.select("#weekend").property("checked") == false && d3.select("#weekday").property("checked") == false)){


       var male16_35 = 0;
        var male26_35 = 0;
        var male36_45 = 0;
        var male46_55 = 0;
        var male56_65 = 0;
        var male66_75 = 0;

         var female16_35 = 0;
        var female26_35 = 0;
        var female36_45 = 0;
        var female46_55 = 0;
        var female56_65 = 0;
        var female66_75 = 0;


        
                for (j = 0; j < intervals_keys.length; j++) {
                    
                    // count = 0;
                    this.data.forEach(function(d) {

                    for (i = 0; i < stations.length; i++) {
                             if (d.time == intervals_keys[j])
                                {
                                    if (filter(d.time))
                                    {
                                    // console.log(d.stationdata)
                                    d.stationdata.forEach(function (k) {
                                        // console.log(k.weekday.arrivals)
                                       male16_35 += k["16-25"].weekend.male
                                       male16_35 += k["16-25"].weekday.male
                                    female16_35 += k["16-25"].weekend.female
                                     female16_35 += k["16-25"].weekday.female
                                      male26_35 += k["26-35"].weekend.male
                                       male26_35 += k["26-35"].weekday.male
                                    female26_35 += k["26-35"].weekend.female
                                       female26_35 += k["26-35"].weekday.female
                                    male36_45 += k["36-45"].weekend.male
                                     male36_45 += k["36-45"].weekday.male
                                    female36_45 += k["36-45"].weekend.female
                                       female36_45 += k["36-45"].weekday.female
                                      male46_55 += k["46-55"].weekend.male
                                        male46_55 += k["46-55"].weekday.male
                                    female46_55 += k["46-55"].weekend.female
                                     female46_55 += k["46-55"].weekday.female
                                      male56_65 += k["56-65"].weekend.male
                                      male56_65 += k["56-65"].weekday.male
                                    female56_65 += k["56-65"].weekend.female
                                      female56_65 += k["56-65"].weekday.female
                                      male66_75 += k["66-75"].weekend.male
                                         male66_75 += k["66-75"].weekday.male
                                    female66_75 += k["66-75"].weekend.female
                                      female66_75 += k["66-75"].weekday.female


                                    })
                                    
                                }
                            }
                        
                    }
                })
                // user_final[0] = registered/(registered+casual)
                // user_final[1] = casual/ (registered+casual); 
                 // console.log(user_final);

                }

            }
            // var res = user_final

            // var  res = {"female": [female16_35, female26_35, female36_45, female46_55, female56_65, female66_75], "male": [male16_35, male26_35, male36_45, male46_55, male56_65, male66_75]}
            
            var  res = [female16_35, male16_35, female26_35, male26_35, female36_45, male36_45, female46_55, male46_55, female56_65, male56_65, female66_75, male66_75]

            this.displayData = res
            console.log(res)
            return res;


}