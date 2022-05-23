class SelectComponent {
    constructor(element, options) {
        this.rootEle = element;
        this.options = options;
        this.styles = {
            select: `
                display: flex;
            `,
            option: `
                margin-right: 12px;
            `
        };
    }
    
    render() {
        this.rootEle.innerHTML = `
            <select style="${this.styles['select']}">
                ${this.options.map(({ label, value }) =>
                    `<option style="${this.styles['option']}" value="${value}">${label}</option>`
                ).join('')}
            </select>
        `;
    }
}

export default SelectComponent;
