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

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    // 3. Create a variable that holds the samples array. 
    samples = data.samples.map(samples => samples);
    
    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var filterSample = samples.filter(sampleObj => sampleObj.id == sample)[0];
    

    console.log(filterSample);
    //  5. Create a variable that holds the first sample in the array.
    

    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otu_ids = filterSample.otu_ids;
    var otu_labels = filterSample.otu_labels;
    var sample_values = filterSample.sample_values;
    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 

    var yticks = otu_ids.slice(0,10).map(otuID => `OTU ${otuID}`).reverse();
    console.log(yticks);
    // 8. Create the trace for the bar chart. 
    var barData = {
      x: sample_values.slice(0,10).reverse(),
      y: yticks,
      text:otu_labels.slice(0,10).reverse(),
      type: 'bar',
      orientation: 'h'
    };
    console.log(barData);
    // 9. Create the layout for the bar chart. 
    var barLayout = {
      title: 'top 10 Bacteria Found'
    };
    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot('bar', [barData], barLayout);
  });
};
// Bar and Bubble charts
// Create the buildCharts function.
function buildCharts(sample) {
  // Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    
    samples = data.samples.map(samples => samples);
    var filterSample = samples.filter(sampleObj => sampleObj.id == sample)[0];
    
    var otu_ids = filterSample.otu_ids;
    var otu_labels = filterSample.otu_labels;
    var sample_values = filterSample.sample_values;
    var xticks = otu_ids.slice(0,10).map(otuID => `OTU ${otuID}`).reverse();
    // 1. Create the trace for the bubble chart.
    var bubbleData = {
      x: xticks,
      y: sample_values.slice(0,10).reverse(),
      text: otu_labels.slice(0,10).reverse(),
      mode: 'markers',
      marker: {
        color: ['rgb(153,103,0)','rbg(0,102,0)','rgb(0,0,204)'],
        size: sample_values.slice(0,10).reverse()
      }
    };

    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title: "Common Bacteria Found",
      xaxis: {
        tickangle: 0,
        zeroline: false,
        title: "OTU ID"
    },
    yaxis: {
        zeroline: false,
        gridwidth: 1,
        title: "Sample Value"
    }
  }
    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot('bubble', [bubbleData], bubbleLayout) 
  });
};
// Create the buildChart function.
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
      title: 'top 10 Bacteria Found'
    };
    // Use Plotly to plot the bar data and layout.
    Plotly.newPlot('bar', [barData], barLayout);
    var xticks = otu_ids.slice(0,10).map(otuID => `OTU ${otuID}`).reverse();
    var bubbleData = {
      x: xticks,
      y: sample_values.slice(0,10).reverse(),
      text: otu_labels.slice(0,10).reverse(),
      mode: 'markers',
      marker: {
        color: xticks,
        size: sample_values.slice(0,10).reverse()
      }
    };

    var bubbleLayout = {
      title: "Common Bacteria Found",
      xaxis: {
        tickangle: 0,
        zeroline: false,
        title: "OTU ID"
    },
    yaxis: {
        zeroline: false,
        gridwidth: 1,
        title: "Sample Value"
    }
  }




    // Use Plotly to plot the bubble data and layout.
    Plotly.newPlot('bubble', [bubbleData], bubbleLayout);
   
    
    // 4. Create the trace for the gauge chart.
    var gaugeData = [
      { 
        value: wfreq,
        title: { text: "Wash Frequency"},
        type: "indicator",
        mode: "gauge+number",
       
        ]
      
     
  }
];
    
    // 5. Create the layout for the gauge chart.
    var gaugeLayout = { 
      axis: {range: [null, 9], ticks: 9},
      steps: [
        {range: [0,1], color : "red"},
        {range: [1,2], color : "red"},
        {range: [2,3], color : "orange"},
        {range: [3,4], color : "yellow"},
        {range: [4,5], color : "yellow"},
        {range: [5,6], color : "green"},
        {range: [6,7], color : "green"},
        {range: [7,8], color : "forestgreen"},
        {range: [8,9], color : "forestgreen"},
      ]
    };

    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot('gauge', gaugeData, gaugeLayout);
  });
}