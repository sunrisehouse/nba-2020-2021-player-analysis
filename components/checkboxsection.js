class CheckBoxSection {
    constructor(id, checkBoxeLabels) {
        this.rootEle = document.getElementById(id);
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
        this.checkBoxeLabels = checkBoxeLabels ? checkBoxeLabels : [];
    }
    
    render() {
        this.rootEle.innerHTML = `
        <div>
            <h3 style="${this.styles['h3']}">${this.rootEle.title}</h3>
            <ul style="${this.styles['ul']}">
                ${this.checkBoxeLabels.map((label) =>
                    `<li style="${this.styles['li']}"><label><input type="checkbox" name="position" value="${label}">${label}</label></li>`
                ).join('')}
            </ul>
        </div>
        `;
    }
}

window.customElements.define('check-box-section-comp', CheckBoxSection);
