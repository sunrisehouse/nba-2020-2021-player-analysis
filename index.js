let data, brushedData, scatterplot, histogram, pc, dataTable;

function updateScatterplot() {
    let xVar = d3.select("input[type=radio][name=x-encoding]:checked").property("value");
    let yVar = d3.select("input[type=radio][name=y-encoding]:checked").property("value");
    let useColor = d3.select("#use-color").property("checked");
    scatterplot.update(xVar, yVar, "variety", useColor);
}

function updateHistogram() {
    histogram.update(brushedData && brushedData.length > 0 ? brushedData : data, "variety");
}

function updatePC() {
    pc.update(brushedData && brushedData.length > 0 ? brushedData : data, "variety");
}

function updateDataTable() {
    dataTable.update(brushedData && brushedData.length > 0 ? brushedData : data, data.columns)
}

const POSITION = ['PG', 'SG', 'SF', 'PF', 'C'];
const ATTRIBUTES = ['name', '3G', '2G']

new Header('header').render();
new CheckBoxSection('position-check-section', POSITION).render();

const selectOptions = ATTRIBUTES.map(name => ({ label: name, value: name }));
new SelectSection('hor-ver-select-section', selectOptions, selectOptions).render();

d3.csv("./data/nba2021_per_game.csv")
    .then(csvData => {
        csvData.forEach(d => {
            d["petal.length"] = +d["petal.length"];
            d["petal.width"] = +d["petal.width"];
            d["sepal.length"] = +d["sepal.length"];
            d["sepal.width"] = +d["sepal.width"];
        });

        data = csvData;

        scatterplot = new Scatterplot("#scatterplot", "#sc-tooltip", data);
        scatterplot.initialize();

        updateScatterplot();
        d3.selectAll("input[type=radio][name=x-encoding]").on("change", updateScatterplot);
        d3.selectAll("input[type=radio][name=y-encoding]").on("change", updateScatterplot);
        d3.selectAll("#use-color").on("change", updateScatterplot);

        scatterplot.on("brush", (brushedItems) => {
            brushedData = brushedItems;
            updateHistogram();
            updatePC();
            updateDataTable();
        });

        histogram = new Histogram("#histogram");
        histogram.initialize();

        updateHistogram();

        pc = new PC("#pc", data, ["petal.length", "petal.width", "sepal.length", "sepal.width"]);
        pc.initialize();

        updatePC();

        dataTable = new DataTable("#data-table");

        updateDataTable();
    })