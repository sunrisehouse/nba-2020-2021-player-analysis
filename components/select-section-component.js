class SelectSectionComponent {
    constructor(element, title1, option1_list, title2, option2_list) {
        this.rootEle = element;
        this.title1 = title1;
        this.option1_list = option1_list;
        this.title2 = title2;
        this.option2_list = option2_list;
        this.styles = {
            h3: `
                font-size: 20px;
            `,
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
        <div>
            <h3 style="${this.styles['h3']}">${this.title1}</h3>
            <select style="${this.styles['select']}">
                ${this.option1_list.map(({ label, value }) =>
                    `<option style="${this.styles['option']}" value="${value}">${label}</option>`
                ).join('')}
            </select>
            <h3 style="${this.styles['h3']}">${this.title2}</h3>
            <select style="${this.styles['select']}">
                ${this.option2_list.map(({ label, value }) =>
                    `<option style="${this.styles['option']}" value="${value}">${label}</option>`
                ).join('')}
            </select>
        </div>
        `;
    }
}

export default SelectSectionComponent;
