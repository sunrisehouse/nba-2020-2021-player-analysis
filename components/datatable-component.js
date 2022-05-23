class DatatableComponent {
    constructor(element) {
        this.rootEle = element;
        this.data = [];
        this.labels = [];
    }

    setData(data, labels) {
        this.data = data;
        this.labels = labels;
    }

    setOnHeadClick = (onHeadClick) => {
        this.onHeadClick = onHeadClick;
    }

    setOnRowClick = (onRowClick) => {
        this.onRowClick = onRowClick;
    }

    render() {
        this.rootEle.innerHTML = `
        <div class="data-table-comp">
            <table>
                <thead>
                    <tr>
                        ${this.labels.map(l => `<th>${l}</th>`).join('')}
                    </tr>
                </thead>
                <tbody>
                    ${this.data.map(d =>
                        `<tr>${d.map(i => `<td>${i}</td>`).join('')}</tr>`
                    ).join('')}
                </tbody>
            </table>
        </div>
        `;

        const theadEle = this.rootEle.getElementsByTagName("thead")[0];
        const thEles = theadEle.getElementsByTagName("th");
        for (let i = 0; i < thEles.length; i++) {
            thEles[i].addEventListener("click", () => this.onRowClick(this.labels[i]));
        }

        const tbodyEle = this.rootEle.getElementsByTagName("tbody")[0];
        const trEles = tbodyEle.getElementsByTagName("tr");
        for (let i = 0; i < trEles.length; i++) {
            trEles[i].addEventListener("click", () => this.onRowClick(this.data[i], this.labels));
        }
    }
}

export default DatatableComponent;
