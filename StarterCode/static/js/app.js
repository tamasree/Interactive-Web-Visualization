// updating ids in dropdown menu

d3.json("data/samples.json").then((data) => {
    //printinb data
    console.log(data);

    let ids = data.names

    // adding ids in the dropdown menu
    d3.select("#selDataset").selectAll('option')
        .data(ids)
        .enter()
        .append('option')
        .text((d) => { return d; })
        .attr("value", function (d) { return d; });
});

//calling option change function when selecting id from dropdown menu
d3.select("#selDataset").selectAll("option").on("change", () => {
    //console.log(d3.event.target.value);
    optionChanged(d3.select(this).text)
});

function optionChanged(selectedID) {

    //console.log(selectedID);

    d3.json("data/samples.json").then((data) => {


        // Display the sample metadata, i.e., an individual's demographic information

        const idMeta = data.metadata.find(item => (item.id == selectedID));

        //console.log(idMeta);
        //console.log(typeof (idMeta));

        // iterating through idMeta and adding data to paragraph element

        let idmetadata = Object.entries(idMeta)

        // clearing html of id sample_metadata for  updating with new value
        d3.select("#sample-metadata").html("");

        // updating information in paragraph elements 
        d3.select("#sample-metadata").selectAll("p")
            .data(idmetadata)
            .enter()
            .append('p')
            .text((item) => { return `${item[0]}:${item[1]}` })



        // bar graph

        const sample = data.samples.find(item => (item.id == selectedID));

        //console.log(sample);

        let xdata = sample.sample_values.slice(0, 10).reverse()

        let ydata = sample.otu_ids.slice(0, 10).reverse()

        let otulabels = sample.otu_labels.slice(0, 10).reverse()


        let traceData = [{
            x: xdata,
            y: ydata.map((item) => ` OTU  ${item}`),
            type: 'bar',
            orientation: "h",
            text: otulabels

        }];

        let layout = {
            title: 'Top 10 Operational Taxonomic Units (OTU)/Individual',
            xaxis: { title: 'Number of Samples Collected' },
            yaxis: { title: 'OTU ID' }
        };

        // Plot using Plotly
        Plotly.newPlot('bar', traceData, layout, { responsive: true });


        //bubble chart

        let xValues = sample.otu_ids;
        let yValues = sample.sample_values
        let labels = sample.otu_labels




        var trace1 = {
            x: xValues,
            y: yValues,
            mode: 'markers',
            text: labels,
            marker: {
                color: xValues,
                size: yValues
            }
        };

        var data1 = [trace1];

        var layout1 = {
            title: '<b>Bubble Chart For Each Sample</b>',
            xaxis: { title: 'OTU ID' },
            yaxis: { title: 'Number of Samples Collected' },
            showlegend: false,
            height: 600,
            width: 1200

        };

        Plotly.newPlot('bubble', data1, layout1);

        // BONUS: GAUGE CHART

        const washFreq = idMeta.wfreq;

        const guageData = [
            {
                domain: { x: [0, 1], y: [0, 1] },
                value: washFreq,
                title: { text: "<b>Belly Button Washing Frequency </b><br> (Scrubs Per Week)" },
                type: "indicator",
                mode: "gauge+number",
                gauge: {
                    axis: { range: [0, 9] },
                    bar: { color: "#f2e9e4" },
                    steps: [
                        { range: [0, 1], color: '#e9ffdb' },
                        { range: [1, 2], color: '#d0f0c0' },
                        { range: [2, 3], color: '#98fb98' },
                        { range: [3, 4], color: '#90ee90' },
                        { range: [4, 5], color: '#00fa9a' },
                        { range: [5, 6], color: '#32cd32' },
                        { range: [6, 7], color: '#3cb371' },
                        { range: [7, 8], color: '#2e8b57' },
                        { range: [8, 9], color: '#008000' }

                    ],
                    threshold: {
                        value: washFreq
                    }
                }
            }
        ];
        const gaugeLayout = {
            width: 600,
            height: 400,
            margin: { t: 0, b: 0 },
        };

        // Plot using Plotly
        Plotly.newPlot('gauge', guageData, gaugeLayout);


    });
};

// Initial test starts at ID 940
optionChanged(940);






