import HeaderComponent from '../components/header-component.js';
import CheckboxGroupComponent from '../components/checkbox-group-component.js';
import SelectComponent from '../components/select-component.js';
import ScatterplotComponent from '../components/scatterplot-component.js'
import BoxplotComponent from '../components/boxplot-component.js';
import RadarchartComponent from '../components/radarchart-component.js';
import DatatableComponent from '../components/datatable-component.js';

class MainPage {
    POSITION = ['PG', 'SG', 'SF', 'PF', 'C']
    ATTRIBUTES = ['Player', 'Pos', 'Age', 'Tm', 'G', 'GS', 'MP', 'FG', 'FGA', 'FG%', '3P', '3PA', '3P%', '2P', '2PA', '2P%', 'eFG%', 'FT', 'FTA', 'FT%', 'ORB', 'DRB', 'TRB', 'AST', 'STL', 'BLK', 'TOV', 'PF', 'PTS']

    constructor() {
        const headerEle = document.getElementById('header');
        const positionCheckGroupCompEle = document.getElementById('position-check-group-comp');
        const horizontalSelectCompEle = document.getElementById('horizontal-select-comp');
        const verticalSelectCompEle = document.getElementById('vertical-select-comp');
        const scatterplotCompEle = document.getElementById('scatterplot-comp');
        const boxplotCompEle = document.getElementById('boxplot-comp');
        const radarchartCompEle = document.getElementById('radarchart-comp');
        const datatableCompEle = document.getElementById('datatable-comp');

        const selectOptions = this.ATTRIBUTES.map((name) => ({ label: name, value: name }));

        this.headerComp = new HeaderComponent(
            headerEle,
            'NBA 2020-2021 Player Analysis',
        );
        this.checkboxComp = new CheckboxGroupComponent(
            positionCheckGroupCompEle,
            this.POSITION, this.POSITION.map((_, index) => index),
        );
        this.horizontalSelectComp = new SelectComponent(
            horizontalSelectCompEle,
            selectOptions,
        );
        this.verticalSelectComp = new SelectComponent(
            verticalSelectCompEle,
            selectOptions,
        );
        this.scatterplotComp = new ScatterplotComponent(
            scatterplotCompEle,
        );
        this.boxplotComp = new BoxplotComponent(
            boxplotCompEle,
        );
        this.radarchartComp = new RadarchartComponent(
            radarchartCompEle,
        );
        this.datatableComp = new DatatableComponent(
            datatableCompEle,
        );

        this.headerComp.render();
        this.checkboxComp.render();
        this.horizontalSelectComp.render();
        this.verticalSelectComp.render();
        this.loadData();
    }

    async loadData() {
        try {
            const data = await d3.csv("./data/nba2021_per_game.csv")
            const tempData = data
                .filter(d => this.POSITION.includes(d['Pos']))
                .map(d => ({ x: Number(d['3P']), y: Number(d['FG']), z: d['Pos'], id: d['Player'] }))
            this.scatterplotComp.on("brush", (d) => {
            });
            this.scatterplotComp.setData(
                tempData,
                'hell',
                'hi',
            );
            this.boxplotComp.setData(
                tempData.map(td => ({ x: td.z, y: td.y })),
                'hell2',
                'hi2',
            );
            this.radarchartComp.setData();
            this.datatableComp.setData([[1, 2, 3], [4, 5, 6]], ['a', 'b', 'c']);

            this.scatterplotComp.render();
            this.boxplotComp.render();
            this.radarchartComp.render();
            this.datatableComp.render();
        } catch (e) {
            console.log(e)
            alert("Data 를 불러들이는데 실패했습니다.");
            return;
        }
    }
}

export default MainPage;