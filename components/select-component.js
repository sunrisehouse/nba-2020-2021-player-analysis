class SelectComponent {
    constructor(element, options, initialValue) {
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
        this.initialValue = initialValue;
    }

    setOnChange = (onChange) => {
        this.onChange = onChange;
    }

    getSelected = () => {
        const selectEle = this.rootEle.getElementsByClassName('select-comp-select')[0];
        return selectEle.options[selectEle.selectedIndex].value;
    }
    
    render() {
        this.rootEle.innerHTML = `
            <select class="select-comp-select" style="${this.styles['select']}" >
                ${this.options.map(({ label, value }) =>
                    `<option style="${this.styles['option']}" value="${value}" ${this.initialValue == value ? "selected" : ''}>${label}</option>`
                ).join('')}
            </select>
        `;

        const selectEles = this.rootEle.getElementsByClassName("select-comp-select");
        selectEles[0].addEventListener("change", this.onChange);
    }
}

export default SelectComponent;
