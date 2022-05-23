class ScatterplotSectionComponent {
    constructor(element) {
        this.margin = {top: 10, right: 100, bottom: 30, left: 40};
        this.width = 300 - this.margin.left - this.margin.right;
        this.height = 300 - this.margin.top - this.margin.bottom;
        this.handlers = {};

        element.innerHTML = `
            <svg></svg>
            <div class="tooltip bs-tooltip-top show" id="sc-tooltip" role="tooltip" style="display:none">
                <div class="tooltip-arrow"></div>
                <div class="tooltip-inner">
                    Some tooltip text!
                </div>
            </div>
        `;
        
        this.root = d3.select(element);
        this.svg = this.root.select("svg");
        this.tooltip = this.root.select("#sc-tooltip")
        this.container = this.svg.append("g");
        this.xAxis = this.svg.append("g");
        this.yAxis = this.svg.append("g");
        this.legend = this.svg.append("g");

        this.xScale = d3.scaleLinear();
        this.yScale = d3.scaleLinear();
        this.zScale = d3.scaleOrdinal().range(d3.schemeCategory10)
        this.svg
            .attr("width", this.width + this.margin.left + this.margin.right)
            .attr("height", this.height + this.margin.top + this.margin.bottom);
        this.container.attr("transform", `translate(${this.margin.left}, ${this.margin.top})`);
        this.brush = d3.brush()
            .extent([[0, 0], [this.width, this.height]])
            .on("start brush", (event) => {
                this.brushCircles(event);
            })
        this.container.call(this.brush);
    }

    setData(data, xLabel, yLabel) {
        this.data = data;
        this.xScale.domain(d3.extent(this.data, d => d.x)).range([0, this.width]);
        this.yScale.domain(d3.extent(this.data, d => d.y)).range([this.height, 0]);
        this.zScale.domain([...new Set(this.data.map(d => d.z))])
        this.xLabel = xLabel;
        this.yLabel = yLabel;
    }

    render() {
        this.circles = this.container.selectAll("circle")
            .data(this.data)
            .join("circle")
            .on("mouseover", (e, d) => {
                this.tooltip.select(".tooltip-inner")
                    .html(`${this.xLabel}: ${d.x}<br />${this.yLabel}: ${d.y}`);

                Popper.createPopper(e.target, this.tooltip.node(), {
                    placement: 'top',
                    modifiers: [
                        {
                            name: 'arrow',
                            options: {
                                element: this.tooltip.select(".tooltip-arrow").node(),
                            },
                        },
                    ],
                });

                this.tooltip.style("display", "block");
            })
            .on("mouseout", (d) => {
                this.tooltip.style("display", "none");
            });

        this.circles
            .transition()
            .attr("cx", d => this.xScale(d.x))
            .attr("cy", d => this.yScale(d.y))
            .attr("fill", d => this.zScale(d.z))
            .attr("r", 3)

        this.xAxis
            .attr("transform", `translate(${this.margin.left}, ${this.margin.top + this.height})`)
            .transition()
            .call(d3.axisBottom(this.xScale));

        this.yAxis
            .attr("transform", `translate(${this.margin.left}, ${this.margin.top})`)
            .transition()
            .call(d3.axisLeft(this.yScale));

        this.legend
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
