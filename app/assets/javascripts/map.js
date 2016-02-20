$(function() {

  var w = 1300;
  var h = 700;

  var blueStates = [];
  var redStates = [];
  var blueEV = 0;
  var redEV = 0;
  var noEV = 538;

  var projection = d3.geo.albersUsa()
      .translate([w/2, h/2])
      .scale([1500]);

  var path = d3.geo.path()
      .projection(projection);

  var svg = d3.select(".map")
      .append("svg")
      .attr("width", w)
      .attr("height", h);

  d3.json("us-states.json", function(json) {
    svg.selectAll("path")
        .data(json.features)
        .enter()
        .append("path")
        .attr("d", path)
        .classed("neutral", true)
        .attr("id", "states")
        .on("click", click)
        .on("contextmenu", rightClick);
    svg.selectAll("text")
        .data(json.features)
        .enter()
        .append("text")
        .attr("transform", function(d) { return "translate(" + path.centroid(d) + ")"; })
        .attr("dy", ".5em")
        .attr("dx", "-.3em")
        .attr("class", "ev")
        .text(function(d) { return d.ev; });
  });

  function click(d) {
    if (this.classList == "neutral") {
      d3.select(this)
          .classed({"neutral": false, "blue": true});
      blueStates.push(d.properties.name);
      blueEV += d.ev;
      noEV -= d.ev;
    } else if (this.classList == "blue") {
      d3.select(this)
          .classed({"blue": false, "red": true});
      blueStates.splice($.inArray(d.properties.name, blueStates),1);
      blueEV -= d.ev;
      redStates.push(d.properties.name);
      redEV += d.ev;
    } else {
      d3.select(this)
          .classed({"red": false, "neutral": true});
      redStates.splice($.inArray(d.properties.name, redStates),1);
      redEV -= d.ev;
      noEV += d.ev;
    };
    $("#dems").text(blueEV);
    $("#reps").text(redEV);
    $("#unassigned").text(noEV);
  };

  function rightClick(d) {
    if (this.classList == "neutral") {
      d3.select(this)
      .classed({"neutral": false, "red": true});
      redStates.push(d.properties.name);
      redEV += d.ev;
      noEV -= d.ev;
    } else if (this.classList == "blue") {
      d3.select(this)
      .classed({"blue": false, "neutral": true});
      blueStates.splice($.inArray(d.properties.name, blueStates),1);
      blueEV -= d.ev;
      noEV += d.ev;
    } else {
      d3.select(this)
      .classed({"red": false, "blue": true});
      redStates.splice($.inArray(d.properties.name, redStates),1);
      redEV -= d.ev;
      blueStates.push(d.properties.name);
      blueEV += d.ev;
    };
    $("#dems").text(blueEV);
    $("#reps").text(redEV);
    $("#unassigned").text(noEV);
  };

})
