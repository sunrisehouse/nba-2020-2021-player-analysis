class BoxplotComponent {
    constructor(element) {
        this.margin = {top: 10, right: 100, bottom: 100, left: 40};
        this.width = 300 - this.margin.left - this.margin.right;
        this.height = 300 - this.margin.top - this.margin.bottom;
        this.handlers = {};
        this.rootEle = element;
    }

    setData(data, xLabel, yLabel) {
        this.data = data;
        this.xLabel = xLabel;
        this.yLabel = yLabel;
    }

    render() {
        this.rootEle.innerHTML = `
            <svg></svg>
            <div class="tooltip bs-tooltip-top show" id="boxplot-tooltip" role="tooltip" style="display:none">
                <div class="tooltip-arrow"></div>
                <div class="tooltip-inner">
                    Some tooltip text!
                </div>
            </div>
        `;
        
        const root = d3.select(this.rootEle);
        const svg = root.select("svg")
            .attr("width", this.width + this.margin.left + this.margin.right)
            .attr("height", this.height + this.margin.top + this.margin.bottom);
        const tooltip = root.select("#boxplot-tooltip")
        const container = svg.append("g")
            .attr("transform", `translate(${this.margin.left}, ${this.margin.top})`);

        this.xScale = d3.scaleBand()
            .range([0, this.width])
            .domain([...new Set(this.data.map(d => d.x))])
            .paddingInner(1)
            .paddingOuter(.5);
        this.yScale = d3.scaleLinear()
            .domain(d3.extent(this.data, d => d.y))
            .range([this.height, 0]);
        this.zScale = d3.scaleOrdinal()
            .range(d3.schemeCategory10)
            .domain([...new Set(this.data.map(d => d.x))])
        
        const sumstat = d3.rollup(this.data, v => {
            const q1 = d3.quantile(v.map(g => g.y).sort(d3.ascending),.25);
            const median = d3.quantile(v.map(g => g.y).sort(d3.ascending),.5);
            const q3 = d3.quantile(v.map(g => g.y).sort(d3.ascending),.75);
            const interQuantileRange = q3 - q1;
            const min = q1 - 1.5 * interQuantileRange > 0 ? q1 - 1.5 * interQuantileRange : 0;
            const max = q3 + 1.5 * interQuantileRange;
            return({q1: q1, median: median, q3: q3, interQuantileRange: interQuantileRange, min: min, max: max})
        }, d => d.x);

        const xAxis = svg.append("g")
            .attr("transform", `translate(${this.margin.left}, ${this.margin.top + this.height})`)
            .call(d3.axisBottom(this.xScale));
        const yAxis = svg.append("g")
            .attr("transform", `translate(${this.margin.left}, ${this.margin.top})`)
            .transition()
            .call(d3.axisLeft(this.yScale));

        // Show the main vertical line
        container
            .selectAll("vertLines")
            .data(sumstat)
            .enter()
            .append("line")
                .attr("x1", d => this.xScale(d[0]))
                .attr("y1", d => this.yScale(d[1].min))
                .attr("x2", d => this.xScale(d[0]))
                .attr("y2", d => this.yScale(d[1].max))
                .attr("stroke", "black")
                .style("width", 40)
                .transition()

        // rectangle for the main box
        const boxWidth = 20;
        container
            .selectAll("boxes")
            .data(sumstat)
            .enter()
            .append("rect")
                .attr("x", d => this.xScale(d[0])-boxWidth/2)
                .attr("y", d => this.yScale(d[1].q3))
                .attr("height", d => this.yScale(d[1].q1) - this.yScale(d[1].q3))
                .attr("width", boxWidth)
                .attr("stroke", "black")
                .attr("fill", d => this.zScale(d[0]))
        
        // Show the median
        container
            .selectAll("medianLines")
            .data(sumstat)
            .enter()
            .append("line")
                .attr("x1", d => this.xScale(d[0]) - boxWidth/2)
                .attr("y1", d => this.yScale(d[1].median))
                .attr("x2", d => this.xScale(d[0]) + boxWidth/2)
                .attr("y2", d => this.yScale(d[1].median))
                .attr("stroke", "black")
                .style("width", 80)

        const legend = svg.append("g")
            .style("display", "inline")
            .style("font-size", ".8em")
            .attr("transform", `translate(${this.width + this.margin.left + 10}, ${this.height / 2})`)
            .call(d3.legendColor().scale(this.zScale))
    }
}

export default BoxplotComponent;
