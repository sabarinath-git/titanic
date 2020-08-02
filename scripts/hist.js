
function draw_hist() {
				// variable for tooltip 
				var divTooltip = d3.select("div.tooltip")
				//set the perimeters
				var margin = {top: 50, right: 30, bottom: 50, left: 40};	
				//var width = document.getElementById('vizcont').clientWidth;
				var width = document.getElementById('pageContain').clientWidth -margin.left - margin.right ;
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
				  //console.log(d3.max(data, function(d) { return +d.Age; }));
				  var x = d3.scaleLinear()
						  //.domain([0, d3.max(data, function(d) { return +d.Age; })])	
					  	  .domain([0, d3.max(data, function(d) { return +d.Age; })+1])
						  .range([0, width]);
				  svg.append("g")
					  .attr("transform", "translate(0," + height + ")")
					  .call(d3.axisBottom(x))
					  .style("font", "14px 'Calibri'");

				  // define y axis: 
				  var y = d3.scaleLinear()
					  .range([height, 0]);
				  var yAxis = svg.append("g");

				  // this function builds the graph based on choice of bin
				  function update(nBin) {

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
								.call(d3.axisLeft(y))
								.style("font", "14px 'Calibri'");

							// Join the rect with the bins data
							var u = svg.selectAll("rect")
								.data(bins)

							// Manage the existing bars and eventually the new ones:
							u.enter()
								.append("rect") // Add a new rect for each new elements
								.attr("class", "bar")
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
								// setting up tooltip and interactivity		
								.on("mouseover", function(d) {
									divTooltip.style("left", d3.event.pageX + 10 + "px")
									divTooltip.style("top", d3.event.pageY - 25 + "px")
									divTooltip.style("display", "inline-block")
									divTooltip.style("opacity", "0.9");
									var x2 = d3.event.pageX,
										y2 = d3.event.pageY;
									var elements = document.querySelectorAll(":hover");
									var l = elements.length - 1;
									var elementData = elements[l].__data__;
									var binStart;
									var binPCnum = (elementData.length / 714)*100;
									var binPcr = Math.round(binPCnum );
									
									if (elementData["x0"] ==0 ) {binStart = 0} else {binStart = elementData["x0"]+1};
									divTooltip.html("Bin" + " ["+ binStart + " - " + elementData["x1"] + "]" + "<br>" + "Count of Passengers: "+elementData.length + 
																"<br>" + "Perc of Passengers:" + binPCnum.toFixed(2) + "%");
									//console.log(elementData["x0"])		
									d3.select(this)
										.style("fill", "#F56C4E")	
								})
								.on("mouseout", function(d) { // Listener to handle mouseover event
									divTooltip.style("display", "none")
									d3.select(this)
										.attr('class', 'bar')
										.style("fill", "steelblue")							
										;
									})

							// If less bar in the new histogram, I delete the ones not in use anymore
							u.exit()
							.remove()

					} // End of update(nBin)


				  // Initialize with 11 bins
				  update(11)


				  // Listen to the button -> update if user change it
				  d3.select("#nBin").on("input", function() {
					update(+this.value);
				  });



	

				var ga   = svg.append("g")
				//.transition() 
				//.duration(1000)
				.attr("transform", "translate(" + margin.left + "," + margin.top + ")")

				//children
				ga
				.append("line")
				.attr("x1", -20)
				.attr("y1", 190)
				.attr("x2", 15)
				.attr("y2", 150)
				.attr("stroke", "darkgrey")
				.style("stroke-width", "1px")
				.style("stroke-dasharray", "5,3")					

				ga.append("circle")
				.attr("cx", 15)
				.attr("cy", 150)						  
				.attr("r",5)
				.style("fill", "darkgrey")	
				
				ga.append("foreignObject")
				.attr("width", 200)
				.attr("height", 50)
				.attr("x",25)
				.attr("y",95)
				.append("xhtml:body")
				.style("font", "14px 'Calibri'")
				.style("color", "grey")
				.html("Children - 9% <br> (62 out of Total 714 Passengers)")				
				
				//young adult  
				ga
				.append("line")
				.attr("x1", 375)
				.attr("y1", 10)
				.attr("x2", 410)
				.attr("y2", -30)				
				//.attr("x2", 425)
				//.attr("y2", -30)
				.attr("stroke", "darkgrey")
				.style("stroke-width", "1px")
				.style("stroke-dasharray", "5,3")				

				ga.append("circle")
				.attr("cx", 410)
				.attr("cy", -30)						  
				.attr("r",5)
				.style("fill", "darkgrey")	

				ga.append("foreignObject")
				.attr("width", 200)
				.attr("height", 50)
				.attr("x",420)
				.attr("y",-45)
				.append("xhtml:body")
				.style("font", "14px 'Calibri'")
				.style("color", "grey")
				.html("Young adult - 31% <br> (220 out of Total 714 Passengers)")				

				// Elderly 
				ga
				.append("line")
				.attr("x1", 930)
				.attr("y1", 280)
				.attr("x2", 965)
				.attr("y2", 245)				
				//.attr("x2", 425)
				//.attr("y2", -30)
				.attr("stroke", "darkgrey")
				.style("stroke-width", "1px")
				.style("stroke-dasharray", "5,3")					 

				ga.append("circle")
				.attr("cx", 965)
				.attr("cy", 245)						  
				.attr("r",5)
				.style("fill", "darkgrey")		
				
				ga.append("foreignObject")
				.attr("width", 200)
				.attr("height", 50)
				.attr("x",975)
				.attr("y",230)
				.append("xhtml:body")
				.style("font", "14px 'Calibri'")
				.style("color", "grey")
				.html("Elderly - 1% <br> (6 out of Total 714 <br> Passengers)")						

				}) // end of d3.csv




				
	}