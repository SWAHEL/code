// Load the data
d3.csv("data.csv").then(function(data) {
    // Parse the data
    data.forEach(function(d) {
        d.radius_mean = +d.radius_mean;
        d.texture_mean = +d.texture_mean;
        d.perimeter_mean = +d.perimeter_mean;
        d.area_mean = +d.area_mean;
        d.smoothness_mean = +d.smoothness_mean;
        d.compactness_mean = +d.compactness_mean;
        d.concavity_mean = +d.concavity_mean;
        d.concave_points_mean = +d.concave_points_mean;
        d.radius_worst = +d.radius_worst;
        d.texture_worst = +d.texture_worst;
        d.perimeter_worst = +d.perimeter_worst;
        d.area_worst = +d.area_worst;
        d.smoothness_worst = +d.smoothness_worst;
        d.compactness_worst = +d.compactness_worst;
        d.concavity_worst = +d.concavity_worst;
        d.concave_points_worst = +d.concave_points_worst;
        d.symmetry_worst = +d.symmetry_worst;
        d.fractal_dimension_worst = +d.fractal_dimension_worst;
        d.diagnosis = d.diagnosis === "M" ? 1 : 0;
    });

    const margin = { top: 20, right: 30, bottom: 40, left: 50 },
          width = 400 - margin.left - margin.right,
          height = 400 - margin.top - margin.bottom;

    const color = d3.scaleOrdinal()
                    .domain([0, 1])
                    .range(["#1f77b4", "#ff7f0e"]);

    const colorName = {
        0: "Benign",
        1: "Malignant"
    };

    // Create tooltip element
    const tooltip = d3.select("body").append("div")
                      .attr("class", "tooltip")
                      .style("opacity", 0);

    const pairs = [
        ["radius_mean", "texture_mean"],
        ["radius_mean", "perimeter_mean"],
        ["texture_mean", "perimeter_mean"]
    ];

    const createScatterPlot = (pair, containerId) => {
        const svg = d3.select(`#${containerId}`)
                      .append("svg")
                      .attr("width", width + margin.left + margin.right)
                      .attr("height", height + margin.top + margin.bottom)
                      .append("g")
                      .attr("transform", `translate(${margin.left},${margin.top})`);

        const x = d3.scaleLinear()
                    .domain([0, d3.max(data, d => d[pair[0]])])
                    .range([0, width]);

        svg.append("g")
           .attr("transform", `translate(0,${height})`)
           .call(d3.axisBottom(x));

        svg.append("text")
           .attr("transform", `translate(${width / 2}, ${height + margin.top + 20})`)
           .style("text-anchor", "middle")
           .text(pair[0]);

        const y = d3.scaleLinear()
                    .domain([0, d3.max(data, d => d[pair[1]])])
                    .range([height, 0]);

        svg.append("g")
           .call(d3.axisLeft(y));

        svg.append("text")
           .attr("transform", "rotate(-90)")
           .attr("y", -margin.left)
           .attr("x", -height / 2)
           .attr("dy", "1em")
           .style("text-anchor", "middle")
           .text(pair[1]);

        svg.append('g')
           .selectAll("circle")
           .data(data)
           .enter()
           .append("circle")
           .attr("cx", d => x(d[pair[0]]))
           .attr("cy", d => y(d[pair[1]]))
           .attr("r", 3)
           .style("fill", d => color(d.diagnosis))
           .attr("class", "pointer-cursor")
           .on("mouseover", function(event, d) {
               tooltip.transition()
                      .duration(200)
                      .style("opacity", .9);
               tooltip.html(colorName[d.diagnosis])
                      .style("left", (event.pageX + 5) + "px")
                      .style("top", (event.pageY - 28) + "px");
           })
           .on("mouseout", function(d) {
               tooltip.transition()
                      .duration(500)
                      .style("opacity", 0);
           });

        const legend = svg.selectAll(".legend")
                          .data(color.domain())
                          .enter().append("g")
                          .attr("class", "legend")
                          .attr("transform", (d, i) => `translate(0,${i * 20})`);

        legend.append("rect")
              .attr("x", width - 18)
              .attr("width", 18)
              .attr("height", 18)
              .style("fill", color);

        legend.append("text")
              .attr("x", width - 24)
              .attr("y", 9)
              .attr("dy", ".35em")
              .style("text-anchor", "end")
              .text(d => colorName[d]);
    };

    pairs.forEach((pair, i) => createScatterPlot(pair, `scatterPlot${i + 1}`));

    // Remove createDensityPlot for "area_mean" and add bar chart instead

    const svgBar = d3.select("#barChart")
                     .append("svg")
                     .attr("width", width + margin.left + margin.right)
                     .attr("height", height + margin.top + margin.bottom)
                     .append("g")
                     .attr("transform", `translate(${margin.left},${margin.top})`);

    const diagnosisCounts = d3.rollups(data, v => v.length, d => d.diagnosis);

    const xBar = d3.scaleBand()
                   .domain(diagnosisCounts.map(d => d[0]))
                   .range([0, width])
                   .padding(0.1);

    const yBar = d3.scaleLinear()
                   .domain([0, d3.max(diagnosisCounts, d => d[1])])
                   .range([height, 0]);

    svgBar.append("g")
          .attr("transform", `translate(0,${height})`)
          .call(d3.axisBottom(xBar).tickFormat(d => d === 0 ? "Benign" : "Malignant"));

    svgBar.append("g")
          .call(d3.axisLeft(yBar));

    svgBar.selectAll(".bar")
          .data(diagnosisCounts)
          .enter()
          .append("rect")
          .attr("class", "bar pointer-cursor")
          .attr("x", d => xBar(d[0]))
          .attr("y", d => yBar(d[1]))
          .attr("width", xBar.bandwidth())
          .attr("height", d => height - yBar(d[1]))
          .attr("fill", d => d[0] === 0 ? "#1f77b4" : "#ff7f0e")
          .on("mouseover", function(event, d) {
              tooltip.transition()
                     .duration(200)
                     .style("opacity", .9);
              tooltip.html(colorName[d[0]])
                     .style("left", (event.pageX + 5) + "px")
                     .style("top", (event.pageY - 28) + "px");
          })
          .on("mouseout", function(d) {
              tooltip.transition()
                     .duration(500)
                     .style("opacity", 0);
          });

    // Add axis labels
    svgBar.append("text")
          .attr("transform", `translate(${width / 2}, ${height + margin.top + 20})`)
          .style("text-anchor", "middle")
          .text("Diagnosis");

    svgBar.append("text")
          .attr("transform", "rotate(-90)")
          .attr("y", 0 - margin.left)
          .attr("x", 0 - (height / 2))
          .attr("dy", "1em")
          .style("text-anchor", "middle")
          .text("Count");

    // Legend
    const legendBar = svgBar.selectAll(".legend")
                            .data(color.domain())
                            .enter().append("g")
                            .attr("class", "legend")
                            .attr("transform", (d, i) => `translate(0,${i * 20})`);

    legendBar.append("rect")
             .attr("x", width - 18)
             .attr("width", 18)
             .attr("height", 18)
             .style("fill", color);

    legendBar.append("text")
             .attr("x", width - 24)
             .attr("y", 9)
             .attr("dy", ".35em")
             .style("text-anchor", "end")
             .text(d => colorName[d]);
});

// Kernel density estimation functions
function kernelDensityEstimator(kernel, X) {
    return function(V) {
        return X.map(function(x) {
            return [x, d3.mean(V, function(v) { return kernel(x - v); })];
        });
    };
}

function kernelEpanechnikov(k) {
    return function(v) {
        return Math.abs(v /= k) <= 1 ? .75 * (1 - v * v) / k : 0;
    };
}
