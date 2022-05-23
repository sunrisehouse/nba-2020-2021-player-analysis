class RadarchartComponent {
	constructor(element) {
		this.margin = 54;
		this.radius = 140;
		this.handlers = {};
		this.rootEle = element;
	}
  
	setData(data, label) {
		this.data = data;
		this.label = label;
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
		const axisColor = "#aaaaaa";
		const root = d3.select(this.rootEle);
		const svg = root.select("svg")
			.attr("width", (this.margin + this.radius) * 2)
			.attr("height", (this.margin + this.radius) * 2);
		const container = svg.append("g")
		this.scale = d3.scaleLinear().domain([0, 1]).range([0, this.radius]);
		const center = this.margin + this.radius;
		const theta = 2 * Math.PI / this.label.length;

		container
			.selectAll("axis")
			.data(this.label)
			.enter()
			.append("line")
				.attr("stroke", axisColor)
				.style("width", 80)
				.attr("x1", _ => center)
                .attr("y1", _ => center)
                .attr("x2", (_, l_idx) => center + this.scale(1)  * Math.cos(-Math.PI/2 + theta * l_idx))
                .attr("y2", (_, l_idx) => center + this.scale(1)  * Math.sin(-Math.PI/2 + theta * l_idx));

		const webCount = 4;
		for (let web_idx = 0; web_idx < webCount; web_idx++) {
			container
				.selectAll("web")
				.data(this.label)
				.enter()
				.append("line")
					.attr("stroke", axisColor)
					.style("width", 80)
					.attr("x1", (_, l_idx) => center + this.scale((web_idx + 1) / webCount) * Math.cos(-Math.PI/2 + theta * l_idx))
					.attr("y1", (_, l_idx) => center + this.scale((web_idx + 1) / webCount) * Math.sin(-Math.PI/2 + theta * l_idx))
					.attr("x2", (_, l_idx) => center + this.scale((web_idx + 1) / webCount) * Math.cos(-Math.PI/2 + theta * (l_idx + 1)))
					.attr("y2", (_, l_idx) => center + this.scale((web_idx + 1) / webCount) * Math.sin(-Math.PI/2 + theta * (l_idx + 1)))
		}

		container
			.selectAll("label")
			.data(this.label)
			.enter()
			.append("text")
				.attr("font-size", 12)
				.attr("font-weight", "bold")
				.style("text-anchor", (_, d_idx) => {
					if (d_idx === 0 || d_idx === this.label.length / 2) {
						return "middle";
					} else if (d_idx < (this.label.length / 2)) {
						return "start";
					} else if (d_idx > (this.label.length / 2)) {
						return "end";
					}
				})
				.text((_, d_idx) => this.label[d_idx])
				.attr("x", (_, d_idx) => center + this.scale(1.1)  * Math.cos(-Math.PI/2 + theta * d_idx))
				.attr("y", (_, d_idx) => center + this.scale(1.1)  * Math.sin(-Math.PI/2 + theta * d_idx));
		
				if (this.data.length > 0) {
			container
				.append("polygon")
					.attr("points", this.data.reduce((acc, d, d_idx) => acc + `${center + this.scale(d) * Math.cos(-Math.PI/2 + theta * d_idx)},${center + this.scale(d) * Math.sin(-Math.PI/2 + theta * d_idx)} `, ""))
					.attr("style", "fill:rgba(255, 0, 0, 0.4);stroke:purple;stroke-width:1")
		}


	}
  }
  
  export default RadarchartComponent;
  