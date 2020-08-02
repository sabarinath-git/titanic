
function draw_hist() {
				// variable for tooltip 
				var divTooltip = d3.select("div.tooltip")
				//set the perimeters
				var margin = {top: 50, right: 30, bottom: 50, left: 40};	
				var width = document.getElementById('vizcont').clientWidth;
				var height = width / 3.236;
				
								
				// Add svg under the div with set perimeters
				var svg = d3.select("#vizcont")
						.append("svg")
						.attr("width", width + margin.left + margin.right)
						.attr("height", height + margin.top + margin.bottom)
						.append("g")
							.attr("transform",
								"translate(" + margin.left + "," + margin.top + ")");

				// read the data from CSV				
				d3.csv("../data/titanic_pyage_nn.csv", function(data) {

				  // define x axis: scale and draw:
				  var x = d3.scaleLinear()
					  	  .domain([0, d3.max(data, function(d) { return +d.Age; })])
						  .range([0, width]);
				  svg.append("g")
					  .attr("transform", "translate(0," + height + ")")
					  .call(d3.axisBottom(x));

				  // define y axis: 
				  var y = d3.scaleLinear()
					  .range([height, 0]);
				  var yAxis = svg.append("g");

                  var nBin = 10;  

							// set the parameters for the histogram
							var histogram = d3.histogram()
								.value(function(d) { return d.Age; })  
								.domain(x.domain()) 
								.thresholds(x.ticks(nBin)); 

							// get the bins from above function
							var bins = histogram(data);		  

							// update the y axis using the domain based on the bins
							y.domain([0, d3.max(bins, function(d) { return d.length; })]);   // d3.hist has to be called before the Y axis obviously
							yAxis
								.transition()
								.duration(1000)
								.call(d3.axisLeft(y));

							// Join the rect with the bins data
							var u = svg.selectAll("rect")
								.data(bins)

							// Manage the existing bars and eventually the new ones:
							u.enter()
                                .append("rect") // Add a new rect for each new elements
                                .attr('class', 'bar')
								.merge(u) // get the already existing elements as well
								.transition() // and apply changes to all of them
								.duration(1000)
									.attr("x", 1)
									.attr("transform", function(d) { return "translate(" + x(d.x0) + "," + y(d.length) + ")"; })
									//.attr("width", function(d) { console.log(x(d.x1) - x(d.x0) -1); return x(d.x1) - x(d.x0) -1 ; })
									.attr("width", function(d) { 
										//console.log(x(d.x1) - x(d.x0) ); 
										var res;
										if (x(d.x1) - x(d.x0) -1 > 0 )
													{res = x(d.x1) - x(d.x0) -1} else {
														res = x(d.x1) - x(d.x0) 
													}  
											return res; })
									.attr("height", function(d) { return height - y(d.length); })
                                    .style("fill", "steelblue")
                                .selection()
                                .on("mouseover", function(d) {
									//console.log("Hi")
									divTooltip.style("left", d3.event.pageX + 10 + "px")
									divTooltip.style("top", d3.event.pageY - 25 + "px")
									divTooltip.style("display", "inline-block")
									divTooltip.style("opacity", "0.9");
									var x2 = d3.event.pageX,
										y2 = d3.event.pageY;
									var elements = document.querySelectorAll(":hover");
									var l = elements.length - 1;
									var elementData = elements[l].__data__;
									divTooltip.html("Bin" + " ["+ elementData["x0"] + " - " + elementData["x1"] + "]" + "<br>" + "Count of Passengers: "+elementData.length);
									//console.log(elementData["x0"])									

                                })
								.on("mouseout", function(d) { // Listener to handle mouseover event
									divTooltip.style("display", "none")
									d3.select(this).attr('class', 'bar');
									})
                                


				    })
				
	}