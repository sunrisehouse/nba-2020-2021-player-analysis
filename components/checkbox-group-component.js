class CheckboxGroupComponent {
    constructor(element, title, labels) {
        this.rootEle = element;
        this.title = title;
        this.labels = labels;
        this.styles = {
            h3: `
                font-size: 20px;
            `,
            ul: `
                display: flex;
            `,
            li: `
                margin-right: 12px;
            `
        };
    }
    
    render() {
        this.rootEle.innerHTML = `
        <div>
            <h3 style="${this.styles['h3']}">${this.title}</h3>
            <ul style="${this.styles['ul']}">
                ${this.labels.map((label, ) =>
                    `<li style="${this.styles['li']}"><label><input type="checkbox" name="position" value="${label}">${label}</label></li>`
                ).join('')}
            </ul>
        </div>
        `;
    }
}

export default CheckboxGroupComponent;
