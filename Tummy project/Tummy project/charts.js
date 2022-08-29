function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
};
// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

function buildCharts(sample) {
  // Use d3.json to load the samples.json file 
  d3.json("samples.json").then((data) => {
    console.log(data);

    // Create a variable that holds the samples array. 
    samples = data.samples.map(samples => samples);
    var metadata = data.metadata;
    // Create a variable that filters the samples for the object with the desired sample number.
    var filterSample = samples.filter(sampleObj => sampleObj.id == sample)[0];
    // 1. Create a variable that filters the metadata array for the object with the desired sample number.
    var resultArray = metadata.filter(metaObj => metaObj.id == sample)[0];
    // Create a variable that holds the first sample in the array.
  

    // 2. Create a variable that holds the first sample in the metadata array.
    

    // Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otu_ids = filterSample.otu_ids;
    var otu_labels = filterSample.otu_labels;
    var sample_values = filterSample.sample_values;

    // 3. Create a variable that holds the washing frequency.
   var wfreq = resultArray.wfreq
   console.log(wfreq);
    // Create the yticks for the bar chart.
    var yticks = otu_ids.slice(0,10).map(otuID => `OTU ${otuID}`).reverse();
    
    var barData = {
      x: sample_values.slice(0,10).reverse(),
      y: yticks,
      text:otu_labels.slice(0,10).reverse(),
      type: 'bar',
      orientation: 'h'
    };
   
    var barLayout = {
      title: 'Top 10 Bacteria Found',
      titlefont: {
        size: 36
      },
      paper_bgcolor:'rgb(176, 196, 222)',
      plot_bgcolor: 'rgb(220, 220, 220)'
    };
    // Use Plotly to plot the bar data and layout.
    Plotly.newPlot('bar', [barData], barLayout);
    
    //bubble chart
    var xticks = otu_ids.slice(0, 10);

    var yticks = sample_values.slice(0, 10);

    var labels = otu_labels.slice(0, 10);
    
    var bubbleData = {
      x: xticks,
      y: yticks,
      text: labels,
      
      mode: 'markers',
      marker: {
        color: xticks,
        size: yticks,
        colorscale: "YlGnBu"
      }
    };

    var bubbleLayout = {
      title: "Common Bacteria Found Per Sample",
      titlefont: {
        size: 36
      },
      paper_bgcolor:'rgb(176, 196, 222)',
      plot_bgcolor: 'rgb(220, 220, 220)',
      xaxis: {
        tickangle: 0,
        zeroline: true,
        title: "OTU ID"
    },
    yaxis: {
        zeroline: true,
        gridwidth: 1,
        title: "Sample Value"
    }
    
  }
    // Use Plotly to plot the bubble data and layout.
    Plotly.newPlot('bubble', [bubbleData], bubbleLayout);
   
    // 4. Create the trace for the gauge chart.
    var gaugeData = [
      {
        domain: { x: [0, 1], y: [0, 1] },
      
        title: { text: "Belly Button Washing Frequency <br> Scrubs per Week" },
        titlefont: {
          size: 36
        },
        type: "indicator",
        mode: "gauge+number",
        value: wfreq,
        
      
        gauge: {
          axis: { range: [null, 9], ticks: 9},
          bar: {color: "black"},
          steps: [
            { range: [0, 1], color: "red" },
            { range: [1, 2], color: "red" },
            { range: [2, 3], color: "orange" },
            { range: [3, 4], color: "orange" },
            { range: [4, 5], color: "yellow" },
            { range: [5, 6], color: "yellow" },
            { range: [6, 7], color: "green" },
            { range: [7, 8], color: "green" },
            { range: [8, 9], color: "darkgreen" }
          ],
          threshold: {
            line: { color: "red", width: 3 },
            thickness: 0.75,
            value: wfreq

          }
        }
      }
    ];
    
    var gaugeLayout = { width: 600,  
      height: 450, 
      margin: { t: 0, b: 0 }, 
      paper_bgcolor:'rgb(176, 196, 222)',
      plot_bgcolor: 'rgb(240, 248, 260)'
    };
    Plotly.newPlot('gauge', gaugeData, gaugeLayout);
  });
}