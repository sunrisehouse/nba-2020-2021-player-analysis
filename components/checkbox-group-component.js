class CheckboxGroupComponent {
    constructor(element, labels) {
        this.rootEle = element;
        this.labels = labels;
        this.styles = {
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
            <ul style="${this.styles['ul']}">
                ${this.labels.map((label, ) =>
                    `<li style="${this.styles['li']}"><label><input type="checkbox" name="position" value="${label}">${label}</label></li>`
                ).join('')}
            </ul>
        `;
    }
}

export default CheckboxGroupComponent;
