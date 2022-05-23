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
        const positionCheckSectionEle = document.getElementById('position-check-section');
        const horVerSelectSectionEle = document.getElementById('hor-ver-select-section');
        const scatterplotSectionEle = document.getElementById('scatterplot-section');
        const boxplotSectionEle = document.getElementById('boxplot-section');
        const radarchartSectionEle = document.getElementById('radarchart-section');
        const datatableSectionEle = document.getElementById('datatable-section');

        const selectOptions = this.ATTRIBUTES.map((name) => ({ label: name, value: name }));

        this.headerComp = new HeaderComponent(
            headerEle,
            'NBA 2020-2021 Player Analysis',
        );
        this.checkboxSectionComp = new CheckboxGroupComponent(
            positionCheckSectionEle,
            'Position', this.POSITION,
            this.POSITION.map((_, index) => index),
        );
        this.selectSectionComp = new SelectComponent(
            horVerSelectSectionEle,
            'Horizontal', selectOptions, 'Vertical', selectOptions,
        );
        this.scatterplotSectionComp = new ScatterplotComponent(
            scatterplotSectionEle,
        );
        this.boxplotSectionComp = new BoxplotComponent(
            boxplotSectionEle,
        );
        this.radarchartSectionComp = new RadarchartComponent(
            radarchartSectionEle,
        );
        this.datatableSectionComp = new DatatableComponent(
            datatableSectionEle,
        );

        this.headerComp.render();
        this.checkboxSectionComp.render();
        this.selectSectionComp.render();
        this.loadData();
    }

    async loadData() {
        try {
            const data = await d3.csv("./data/nba2021_per_game.csv")
            const tempData = data
                .filter(d => this.POSITION.includes(d['Pos']))
                .map(d => ({ x: Number(d['3P']), y: Number(d['FG']), z: d['Pos'], id: d['Player'] }))
            this.scatterplotSectionComp.on("brush", (d) => {
            });
            this.scatterplotSectionComp.setData(
                tempData,
                'hell',
                'hi',
            );
            this.boxplotSectionComp.setData(
                tempData.map(td => ({ x: td.z, y: td.y })),
                'hell2',
                'hi2',
            );
            this.radarchartSectionComp.setData();
            this.datatableSectionComp.setData([[1, 2, 3], [4, 5, 6]], ['a', 'b', 'c']);

            this.scatterplotSectionComp.render();
            this.boxplotSectionComp.render();
            this.radarchartSectionComp.render();
            this.datatableSectionComp.render();
        } catch (e) {
            console.log(e)
            alert("Data 를 불러들이는데 실패했습니다.");
            return;
        }
    }
}

export default MainPage;