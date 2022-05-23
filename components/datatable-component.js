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

    render() {
        this.rootEle.innerHTML = `
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
        `;
    }
}

export default DatatableComponent;
