
      //Width and height
      var topMargin = 20;
      var bottomMargin = 20;
      var leftMargin = 40;
      var rightMargin = 40;
      var w_dots = 700;
      var h_dots = 300;
      var red = "#EF3E23";
      var blue = "#00BFF3";
      var fullData;

      //for wordpress
      var mobilePhone_dots = 460;
      var mobilePhone = 600;
      var xPosMouse;
      var yPosMouse;


    //starting set
    var randomSet = [3382,2849,2052,2585,1562,562,4845,485,986,1784,3539,1502,4309,682,2923,257,4790,1953,919,3384,112,2331,2855,3043,2918,4657,3325,3782,3152,827,3451,1262,4974,2157,3417,3647,2088,4832,3199,672,4944,4403,2624,1329,3839,4783,2806,4703,2503,3716,324,4066,3634,3420,4313,1293,1314,3051,2908,3085,391,508,4041,3442,1149,2385,182,3579,3567,1867,2647,1657,3746,3239,3172,890,4530,2196,3298,3602,110,1816,2896,1547,3062,1119,791,990,833,2774,3116,4422,3221,904,4341,1609,3681,1866,1479,4946]

  //bringing in full data (1000 simulations)
    d3.csv("simFullData.csv", function(data) {
        

  //converting measures 
      data.forEach(function(d) {
        d.SimpleCanidate = d.SimpleCanidate;
        d.SimNum= +d.SimNum;
        d.WinningMargin = +d.WinningMargin;
        d.WinnerStateWins = d.WinnerStateWins;
      });

      fullData = data //assingning to global variable for later update

  //filter data to matching random 100 simulations 
      simData = data.filter(function(d,i){ return randomSet.indexOf(d.SimNum) >= 0 })

  //add 1-100 rowNum for plot ying axis
      var i = 1;
      while (i <= 100) {
         simData.forEach(function(d) {
              d.rowNum = i;
              i++;
         });
      }

  //count wins by trump, count wins by biden
      TrumpWins = simData.filter(function(d,i){ return d.SimpleCanidate == "Trump"}).length
      BidenWins = simData.filter(function(d,i){ return d.SimpleCanidate == "Biden"}).length

  //creating svg for Text section
      var svgText = d3.select("#dot_Text")
          .append("svg")
          .attr("width", w_dots)
          .attr("height", 50);

    //creating left text   
      svgText.selectAll("class","leftText")
        .data(simData.filter(function(d,i){ return d.rowNum == 1}))
        .enter()
        .append("text")
        .attr("x",10)
        .attr("y",25)
        .text(function(d){
            return "TRUMP WINS";
          })
        .style("fill",red)
        .style("font-family","Arial Black")
        .style("font-size",18)

    //creating right text   
      svgText.selectAll("class","rightText")
        .data(simData.filter(function(d,i){ return d.rowNum == 1}))
        .enter()
        .append("text")
        .attr("x",w_dots-130)
        .attr("y",25)
        .text(function(d){
            return "BIDEN WINS";
          })
        .style("fill",blue)
        .style("font-family","Arial Black")
        .style("font-size",18)

    //showing left results
      svgText.selectAll("class","leftResults")
        .data(simData.filter(function(d,i){ return d.rowNum == 1}))
        .enter()
        .append("text")
        .attr("x",10)
        .attr("y",50)
        .attr("id","leftResults") // for refrence when updating
        .text(function(d){
            return TrumpWins + " IN 100";
          })
        .style("fill",red)
        .style("font-family","Arial Black")
        .style("font-size",25)
        .style("opacity", 0)
        //delaying 
        .transition()
        .duration(1)
        .delay(3200) //waiting until dots are all showing
        .style("opacity",1)

    //showing right results
      svgText.selectAll("class","rightResults")
        .data(simData.filter(function(d,i){ return d.rowNum == 1}))
        .enter()
        .append("text")
        .attr("x",w_dots-135)
        .attr("y",50)
        .attr("id","rightResults") // for refrence when updating
        .text(function(d){
            return BidenWins + " IN 100";
          })
        .style("fill",blue)
        .style("font-family","Arial Black")
        .style("font-size",25)
        .style("opacity", 0)
        //delaying 
        .transition()
        .duration(1)
        .delay(3200) //waiting until dots are all showing
        .style("opacity",1)

 
//creating chart 

    //defining scales
        var xScale = d3.scaleLinear()
          .domain([-100,100]) //input is -100 to 100 
          .range([leftMargin,w_dots-rightMargin]) //plot output along whole width of svg

        var yScale = d3.scaleLinear()
          .domain([0,100]) //1 to 100 rows
          .range([topMargin,h_dots-bottomMargin*3]) 


    //creating SVG
        var dotSvg = d3.select("#dot_myChart")
            .append("svg")
            .attr("width", w_dots)
            .attr("height",h_dots);


    //creating axes
        //left two lines
        xAxisLeft = dotSvg.append("g")
          .attr("class","xAxisLeft")
          .call(d3.axisBottom()
            .scale(xScale)
            .tickValues([-100,-50])
            .tickFormat((d,i) => ['+100 ELECTORAL VOTE MARGIN','+50'][i]) //edit labels
            .tickSize(h_dots-75) //tick length
            .tickSizeOuter(0) //remove outside border ticks
          )
          .attr("transform","translate("+0+","+20+")"); //start further down
        xAxisLeft.selectAll(".tick text") //edit text format
         .attr("font-size","12")
         .attr("fill",red)
         .call(wrap, 50); //uses wrap function to wrap text 
        xAxisLeft.selectAll(".tick line") //edit line format
         .attr("stroke",red)
         .attr("stroke-width","1");
        xAxisLeft.select(".domain") 
         .attr("visibility","hidden"); //remove horizontal line

        //right two lines
        xAxisRight = dotSvg.append("g")
          .attr("class","xAxisRight")
          .call(d3.axisBottom()
            .scale(xScale)
            .tickValues([50,100])
            .tickFormat((d,i) => ['+50','+100'][i]) //edit labels
            .tickSize(h_dots-75)
            .tickSizeOuter(0) //remove outside border ticks
          )
          .attr("transform","translate("+0+","+20+")");
        xAxisRight.selectAll(".tick text") //edit text format
         .attr("font-size","12")
         .attr("fill",blue);
        xAxisRight.selectAll(".tick line") //edit line format
         .attr("stroke",blue)
         .attr("stroke-width","1");
        xAxisRight.select(".domain") //remove horizontal line
         .attr("visibility","hidden");

        //center line
        xAxisCenter = dotSvg.append("g")
          .attr("class","xAxisCenter")
          .call(d3.axisBottom()
            .scale(xScale)
            .tickValues([0])
            .tickFormat((d,i) => ['TIE'][i]) //edit labels
            .tickSize(h_dots-bottomMargin)
            .tickSizeOuter(0) //remove outside border ticks
          )
        xAxisCenter.selectAll(".tick text") //edit text format
         .attr("font-size","15")
         .attr("fill","Black");
        xAxisCenter.selectAll(".tick line") //edit line format
         .attr("stroke","Black")
         .attr("stroke-width","2");
        xAxisCenter.select(".domain") //remove horizontal line
         .attr("visibility","hidden");


    //creating dots
        dotSvg.selectAll("dots")
            .data(simData)
            .enter()
            .append("circle")
            .attr("id","dots") //for updating later
            .attr("cx",function(d){
              return xScale(d.WinningMargin);
            })
            .attr("cy",function(d){
              return yScale(d.rowNum);
            })
            .attr("r",7)
            .attr("fill",function(d){
              if(d.WinningMargin < 0){
                return red;
              } else if(d.WinningMargin == 0) {
                return "#B8BABC";
              } else {
                return blue;
              }
            })
            .attr("stroke","white") 
            .attr("opacity",0) //clear until populating 

            
    //creating tooltip
          dotSvg.selectAll("circle")
            .on("mouseover", function(d) {
              
              if(screen.width <= mobilePhone) {
                //no mobile tooltips 
              }
              else {

                //change the color of the circle
                d3.select(this)
                  .style("opacity", 0.75)

                //determine Dot_Tooltip title
                d3.select("#Dot_tooltip")
                  .style("left", (d3.select(this).attr("cx")) + "px")    
                  .style("top", (d3.select(this).attr("cy")) + "px")
                  .select("#Dot_tooltipTitle")
                    .text(function(){
                       if (d.WinningMargin == 0) {
                          return "Trump and Biden Tie";
                        } else {
                          return d.SimpleCanidate + " Wins by " + Math.abs(d.WinningMargin) + " Electoral Votes"
                        }
                    })

                //determine tooltip Value
                  d3.select("#Dot_tooltip")
                  .style("left", (d3.select(this).attr("cx")) + "px")    
                  .style("top", (d3.select(this).attr("cy")) + "px")
                  .select("#value")
                  .text(function(){
                       if (d.WinningMargin == 0) {
                          return "269 Electoral Votes Each";
                        } else {
                          return "Swing States Won: " + d.WinnerStateWins
                        }
                    })

                //Show the Map_tooltip
                d3.select("#Dot_tooltip").classed("hidden", false);
              }
            })
            .on("mouseout", function() {
                
              //Hide the Map_tooltip
              d3.select(this)
                  .style("opacity", 100)
              d3.select("#Dot_tooltip").classed("hidden", true);

            })

    //filling in dots slowly
        dotSvg.selectAll("circle")
            .transition()
            .delay(function(d,i){ return i * 30 })
            .duration(100)
            .style("opacity",1)

     }) //end of csv 

    //function to update data and chart
      function updateData(){

          //generating an arry of 100 random, unique numbers between 1 and 1000
            var randomSet = [...new Set(d3.range(100).map(function() {
                return Math.round(Math.random()*1000)
            }))];
            while (randomSet.length < 100) {
                var randomSet = [...new Set(randomSet.concat([...new Set(d3.range(100-randomSet.length).map(function() {
                    return Math.round(Math.random()*1000)
                }))]))];
            }

            simData = fullData.filter(function(d,i){ return randomSet.indexOf(d.SimNum) >= 0 })

        //add 1-100 rowNum for plot ying axis
            var i = 1;
            while (i <= 100) {
               simData.forEach(function(d) {
                    d.rowNum = i;
                    i++;
               });
            }

        //count wins by trump, count wins by biden
            TrumpWins = simData.filter(function(d,i){ return d.SimpleCanidate == "Trump"}).length
            BidenWins = simData.filter(function(d,i){ return d.SimpleCanidate == "Biden"}).length

          //updating left results
            d3.selectAll("#leftResults")
              .style("opacity",0)
              .text(function(d){
                  return TrumpWins + " IN 100"; //new results
                })
              //delaying 
              .transition()
              .duration(1)
              .delay(3200) //waiting until dots are all showing
              .style("opacity",1)


          //updating right results
            d3.selectAll("#rightResults")
              .style("opacity",0)
              .text(function(d){
                  return BidenWins + " IN 100"; //new results
                })
              //delaying 
              .transition()
              .duration(1)
              .delay(3200) //waiting until dots are all showing
              .style("opacity",1)


          //defining scales
            var xScale = d3.scaleLinear()
              .domain([-150,150]) //input is -100 to 100 
              .range([leftMargin,w_dots-rightMargin]) //plot output along whole width of svg

            var yScale = d3.scaleLinear()
              .domain([0,100]) //1 to 100 rows
              .range([topMargin,h_dots-bottomMargin*3]) 


          //updating dots
            d3.selectAll("circle")
              .data(simData) 
              .style("opacity",0)
              .transition()
              .duration(1)
              .attr("cx",function(d){
                return xScale(d.WinningMargin);
              })
              .attr("cy",function(d){
                return yScale(d.rowNum);
              })
              .attr("r",7)
              .attr("fill",function(d){
                if(d.WinningMargin < 0){
                  return red;
                } else if(d.WinningMargin == 0) {
                  return "#B8BABC"; //gray
                } else {
                  return blue;
                }
              })
              .transition()
              .delay(function(d,i){ return i * 30 })
              .duration(100)
              .style("opacity",1)



      } //end of update function



    //function to wrap text in labels
      function wrap(text, width) {
        text.each(function() {
          var text = d3.select(this),
              words = text.text().split(/\s+/).reverse(),
              word,
              line = [],
              lineNumber = 0,
              lineHeight = 1.1, // ems
              y = text.attr("y"),
              dy = parseFloat(text.attr("dy")),
              tspan = text.text(null).append("tspan").attr("x", 0).attr("y", y).attr("dy", dy + "em");
          while (word = words.pop()) {
            line.push(word);
            tspan.text(line.join(" "));
            if (tspan.node().getComputedTextLength() > width) {
              line.pop();
              tspan.text(line.join(" "));
              line = [word];
              tspan = text.append("tspan").attr("x", 0).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
            }
          }
        });
      } //end of wrap function 
      