class BoxplotComponent {
    constructor(element) {
        this.margin = {top: 16, right: 50, bottom: 20, left: 40};
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
    setMiddleLine1 = (middleLineData1) => {
        this.middleLineData1 = middleLineData1;
    }

    setMiddleLine2 = (middleLineData2) => {
        this.middleLineData2 = middleLineData2;
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
            .on("mouseover", (e, d) => {
                tooltip.select(".tooltip-inner")
                    .html(`
                        <div class="stat-tooltip">
                            <h5 class="id">${d[0]}</h5>
                            min: ${Math.round(d[1].min*1000)/1000}<br />
                            max: ${Math.round(d[1].max*1000)/1000}<br />
                            median: ${Math.round(d[1].median*1000)/1000}<br />
                            q1: ${Math.round(d[1].q1*1000)/1000}<br />
                            q3: ${Math.round(d[1].q3*1000)/1000}<br />
                        </div>
                    `);
                Popper.createPopper(e.target, tooltip.node(), {
                    placement: 'top',
                    modifiers: [
                        {
                            name: 'arrow',
                            options: {
                                element: tooltip.select(".tooltip-arrow").node(),
                            },
                        },
                    ],
                });
                tooltip.style("display", "block");
            })
            .on("mouseout", (d) => {
                tooltip.style("display", "none");
            })
        
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
            .call(d3.legendColor().scale(this.zScale));
        
        const xAxisLabel = svg
            .append("text")
            .attr("transform", `translate(${this.margin.left + this.width + 12}, ${this.margin.top + this.height + 16})`)
            .attr("text-anchor", "start")
            .attr("font-size", "14px")
            .attr("font-weight", "bold")
            .text(`${this.xLabel}`);

        const yAxisLabel = svg
            .append("text")
            .attr("transform", `translate(${this.margin.left}, ${this.margin.top - 4})`)
            .attr("text-anchor", "end")
            .attr("font-size", "14px")
            .attr("font-weight", "bold")
            .text(`${this.yLabel}`);

        if (this.data.length > 0 && this.middleLineData1) {
            svg      
                .append("line")
                    .attr("x1", this.margin.left)
                    .attr("y1", this.yScale(this.middleLineData1.y))
                    .attr("x2", this.margin.left + this.width)
                    .attr("y2", this.yScale(this.middleLineData1.y))
                    .attr("stroke", this.middleLineData1.color)
                    .style("stroke-width", 3)
        }
        if (this.data.length > 0 && this.middleLineData2) {
            svg      
                .append("line")
                    .attr("x1", this.margin.left)
                    .attr("y1", this.yScale(this.middleLineData2.y))
                    .attr("x2", this.margin.left + this.width)
                    .attr("y2", this.yScale(this.middleLineData2.y))
                    .attr("stroke", this.middleLineData2.color)
                    .style("stroke-width", 3)
        }
    }
}

export default BoxplotComponent;
