class CheckboxGroupComponent {
    constructor(element, labels, initialValues) {
        this.rootEle = element;
        this.labels = labels;
        this.styles = {
            ul: `display: flex;`,
            li: `margin-right: 12px;`
        };
        this.initialValues = initialValues;
    }

    setOnChange = (onChange) => {
        this.onChange = onChange;
    }

    getChecked = () => {
        const checkedList = [];
        const inputEles = this.rootEle.getElementsByClassName("checkbox-group-comp-input");
        for (let i = 0; i < inputEles.length; i++) {
            if (inputEles[i].checked) {
                checkedList.push(inputEles[i].value);
            }
        }
        return checkedList;
    }
    
    render = () => {
        console.log(this.initialValues.includes('PG'))
        this.rootEle.innerHTML = `
            <ul style="${this.styles['ul']}">
                ${this.labels.map((label) =>
                    `<li style="${this.styles['li']}">
                        <label>
                        <input class="checkbox-group-comp-input"
                            type="checkbox"
                            value="${label}"
                            ${this.initialValues.includes(label) ? "checked" : ""}
                        >
                            ${label}
                        </label>
                    </li>`
                ).join('')}
            </ul>
        `;

        const inputEles = this.rootEle.getElementsByClassName("checkbox-group-comp-input");
        for (let i = 0; i < inputEles.length; i++) {
            inputEles[i].addEventListener("change", this.onChange);
        }
    }
}

export default CheckboxGroupComponent;
