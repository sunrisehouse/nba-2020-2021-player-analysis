class ScatterplotSectionComponent {
    constructor(element) {
        this.margin = {top: 10, right: 100, bottom: 30, left: 40};
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
            <div class="tooltip bs-tooltip-top show" id="sc-tooltip" role="tooltip" style="display:none">
                <div class="tooltip-arrow"></div>
                <div class="tooltip-inner">
                    Some tooltip text!
                </div>
            </div>
        `;
        
        const root = d3.select(this.rootEle);
        const svg = root.select("svg");
        const tooltip = root.select("#sc-tooltip")
        const container = svg.append("g");
        const xAxis = svg.append("g");
        const yAxis = svg.append("g");
        const legend = svg.append("g");
        const brush = d3.brush()
            .extent([[0, 0], [this.width, this.height]])
            .on("start brush", (event) => {
                this.brushCircles(event);
            })

        this.xScale = d3.scaleLinear()
            .domain(d3.extent(this.data, d => d.x))
            .range([0, this.width]);
        this.yScale = d3.scaleLinear()
            .domain(d3.extent(this.data, d => d.y))
            .range([this.height, 0]);
        this.zScale = d3.scaleOrdinal()
            .range(d3.schemeCategory10)
            .domain([...new Set(this.data.map(d => d.z))]);
        svg
            .attr("width", this.width + this.margin.left + this.margin.right)
            .attr("height", this.height + this.margin.top + this.margin.bottom);
        container.attr("transform", `translate(${this.margin.left}, ${this.margin.top})`);
        
        container.call(brush);

        this.circles = container.selectAll("circle")
            .data(this.data)
            .join("circle")
            .on("mouseover", (e, d) => {
                tooltip.select(".tooltip-inner")
                    .html(`${this.xLabel}: ${d.x}<br />${this.yLabel}: ${d.y}`);
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
            });

        this.circles
            .transition()
            .attr("cx", d => this.xScale(d.x))
            .attr("cy", d => this.yScale(d.y))
            .attr("fill", d => this.zScale(d.z))
            .attr("r", 3)

        xAxis
            .attr("transform", `translate(${this.margin.left}, ${this.margin.top + this.height})`)
            .transition()
            .call(d3.axisBottom(this.xScale));

        yAxis
            .attr("transform", `translate(${this.margin.left}, ${this.margin.top})`)
            .transition()
            .call(d3.axisLeft(this.yScale));

        legend
            .style("display", "inline")
            .style("font-size", ".8em")
            .attr("transform", `translate(${this.width + this.margin.left + 10}, ${this.height / 2})`)
            .call(d3.legendColor().scale(this.zScale))
    }

    isBrushed(d, selection) {
        let [[x0, y0], [x1, y1]] = selection; // destructuring assignment
        let x = this.xScale(d.x);
        let y = this.yScale(d.y);

        return x0 <= x && x <= x1 && y0 <= y && y <= y1;
    }

    // this method will be called each time the brush is updated.
    brushCircles(event) {
        let selection = event.selection;

        this.circles.classed("brushed", d => this.isBrushed(d, selection));

        if (this.handlers.brush)
            this.handlers.brush(this.data.filter(d => this.isBrushed(d, selection)));
    }

    on(eventType, handler) {
        this.handlers[eventType] = handler;
    }
}

export default ScatterplotSectionComponent;
