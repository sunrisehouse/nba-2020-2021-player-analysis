class Header {
    constructor(id) {
        this.rootEle = document.getElementById(id);
        this.styles = {
            header: `
                width: 100%;
                height: var(--header-height);
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 0 16px;
                background-color: #ffffff;
                box-sizing: border-box;
            `,
            h1: `
                font-size:24px;
            `,
        };
    }
    render() {
        this.rootEle.innerHTML = `
        <div style="${this.styles['header']}">
            <h1 style="${this.styles['h1']}">${this.rootEle.title}</h1>
        </div>
        `
    }
}

window.customElements.define('header-comp', Header);
