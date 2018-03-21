
function Bar_plot(){
	var chart = dc.barChart("#test");
	d3.csv("https://raw.githubusercontent.com/dc-js/dc.js/master/web/examples/morley.csv", function(error, experiments) {

  	experiments.forEach(function(x) {
    	x.Speed = +x.Speed;
  	});

  	var ndx                 = crossfilter(experiments),
    runDimension        = ndx.dimension(function(d) {return +d.Run;}),
    speedSumGroup       = runDimension.group().reduceSum(function(d) {return d.Speed * d.Run / 1000;});

  	chart
    	.width(650)
    	.height(260)
    	.x(d3.scale.linear().domain([6,20]))
    	.brushOn(false)
    	.yAxisLabel("This is the Y Axis!")
    	.dimension(runDimension)
    	.group(speedSumGroup)
    	.on('renderlet', function(chart) {
        chart.selectAll('rect').on("click", function(d) {
            console.log("click!", d);
        });
    });
    chart.render();
});
};





function Line_plot(){
	var chart = dc.lineChart("#test_1");
d3.csv("https://raw.githubusercontent.com/dc-js/dc.js/master/web/examples/morley.csv", function(error, experiments) {

  experiments.forEach(function(x) {
    x.Speed = +x.Speed;
  });

  var ndx                 = crossfilter(experiments),
      runDimension        = ndx.dimension(function(d) {return +d.Run;}),
      speedSumGroup       = runDimension.group().reduceSum(function(d) {return d.Speed * d.Run / 1000;});

  chart
    .width(650)
    .height(260)
    .x(d3.scale.linear().domain([0,20]))
    .interpolate('step-before')
    .renderArea(true)
    .brushOn(false)
    .renderDataPoints(true)
    .clipPadding(10)
    .yAxisLabel("This is the Y Axis!")
    .dimension(runDimension)
    .group(speedSumGroup);

  chart.render();

});
};

function Pie_plot(){
			var chart = dc.pieChart("#test_2");
		d3.csv("https://raw.githubusercontent.com/dc-js/dc.js/master/web/examples/morley.csv", function(error, experiments) {

		  var ndx           = crossfilter(experiments),
		      runDimension  = ndx.dimension(function(d) {return "run-"+d.Run;})
		      speedSumGroup = runDimension.group().reduceSum(function(d) {return d.Speed * d.Run;});

		  chart
		    .width(230)
		    .height(210)
		    .slicesCap(4)
		    .innerRadius(50)
		    .dimension(runDimension)
		    .group(speedSumGroup)
		    //.legend(dc.legend())
		    // workaround for #703: not enough data is accessible through .label() to display percentages
		    .on('pretransition', function(chart) {
		        chart.selectAll('text.pie-slice').text(function(d) {
		            return d.data.key + ' ' + dc.utils.printSingleValue((d.endAngle - d.startAngle) / (2*Math.PI) * 100) + '%';
		        })
		    });

		  chart.render();
		});
};



function Area_plot(){
	var chart = dc.lineChart("#test_3");
      d3.csv("https://raw.githubusercontent.com/dc-js/dc.js/master/web/examples/morley.csv", function(error, experiments) {

          experiments.forEach(function(x) {
              x.Speed = +x.Speed;
          });

          var ndx                 = crossfilter(experiments),
              runDimension        = ndx.dimension(function(d) {return +d.Run;}),
              speedSumGroup       = runDimension.group().reduce(function(p, v) {
                  p[v.Expt] = (p[v.Expt] || 0) + v.Speed;
                  return p;
              }, function(p, v) {
                  p[v.Expt] = (p[v.Expt] || 0) - v.Speed;
                  return p;
              }, function() {
                  return {};
              });

          function sel_stack(i) {
              return function(d) {
                  return d.value[i];
              };
          }

          chart
              .width(250)
              .height(210)
              .x(d3.scale.linear().domain([1,20]))
              .margins({left: 50, top: 10, right: 10, bottom: 20})
              .renderArea(true)
              .brushOn(false)
              .renderDataPoints(true)
              .clipPadding(10)
              .yAxisLabel("This is the Y Axis!")
              .dimension(runDimension)
              .group(speedSumGroup, "1", sel_stack('1'));

          for(var i = 2; i<6; ++i)
              chart.stack(speedSumGroup, ''+i, sel_stack(i));
          chart.render();

      });
};



function Heat_plot(){
		var chart = dc.heatMap("#test_4");
	d3.csv("https://raw.githubusercontent.com/dc-js/dc.js/master/web/examples/morley.csv", function(error, experiments) {

	  var ndx    = crossfilter(experiments),
	      runDim = ndx.dimension(function(d) { return [+d.Run, +d.Expt]; }),
	      runGroup = runDim.group().reduceSum(function(d) { return +d.Speed; });

	  chart
	    .width(60 * 10 + 70)
	    .height(60 * 3 + 30)
	    .dimension(runDim)
	    .group(runGroup)
	    .keyAccessor(function(d) { return +d.key[0]; })
	    .valueAccessor(function(d) { return +d.key[1]; })
	    .colorAccessor(function(d) { return +d.value; })
	    .title(function(d) {
	        return "Run:   " + d.key[0] + "\n" +
	               "Expt:  " + d.key[1] + "\n" +
	               "Speed: " + (299000 + d.value) + " km/s";})
	    .colors(["#ffffd9","#edf8b1","#c7e9b4","#7fcdbb","#41b6c4","#1d91c0","#225ea8","#253494","#081d58"])
	    .calculateColorDomain();

	  chart.render();
	});
};


function Spark_plot(){

	var barChart = dc.barChart("#bartest");
  var lineChart = dc.lineChart("#linetest");
  d3.csv("https://raw.githubusercontent.com/dc-js/dc.js/master/web/examples/morley.csv", function(error, experiments) {

      experiments.forEach(function(x) {
          x.Speed = +x.Speed;
      });

      var ndx                 = crossfilter(experiments),
          runDimension        = ndx.dimension(function(d) {return +d.Run;}),
          runDimension2        = ndx.dimension(function(d) {return +d.Run;}),
          speedSumGroup       = runDimension.group().reduceSum(function(d) {return d.Speed * d.Run / 1000;}),
          speedSumGroup2       = runDimension2.group().reduceSum(function(d) {return d.Speed * d.Run / 1000;});

      barChart
          .width(100)
          .height(210)
          .margins({left: 0, top: 0, right: 0, bottom: 0})
          .x(d3.scale.linear().domain([6,20]))
          .brushOn(true)
          .dimension(runDimension)
          .group(speedSumGroup);
      lineChart
          .width(100)
          .height(210)
          .margins({left: 0, top: 0, right: 0, bottom: 0})
          .x(d3.scale.linear().domain([6,20]))
          .brushOn(true)
          .dimension(runDimension2)
          .group(speedSumGroup2);
      dc.renderAll();
  });

};




