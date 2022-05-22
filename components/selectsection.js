class SelectSection {
    constructor(id, select1Options, select2Options) {
        this.rootEle = document.getElementById(id);
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
        this.select1Options = select1Options ? select1Options : [];
        this.select2Options = select2Options ? select2Options : [];
        this.title1 = this.rootEle.getAttribute('title1');
        this.title2 = this.rootEle.getAttribute('title2');
    }
    
    render() {
        this.rootEle.innerHTML = `
        <div>
            <h3 style="${this.styles['h3']}">${this.title1}</h3>
            <select style="${this.styles['select']}">
                ${this.select1Options.map(({ label, value }) =>
                    `<option style="${this.styles['option']}" value="${value}">${label}</option>`
                ).join('')}
            </select>
            <h3 style="${this.styles['h3']}">${this.title2}</h3>
            <select style="${this.styles['select']}">
                ${this.select2Options.map(({ label, value }) =>
                    `<option style="${this.styles['option']}" value="${value}">${label}</option>`
                ).join('')}
            </select>
        </div>
        `;
    }
}

window.customElements.define('select-section-comp', SelectSection);
