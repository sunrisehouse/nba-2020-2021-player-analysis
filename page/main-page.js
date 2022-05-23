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
    CATEGORICAL_ATTRIBUTES = ['Player', 'Pos', 'Tm']
    
    COMPARED_ATTRS = ['3P%', '2P%', 'AST', 'TRB', 'PTS']
    selectedHorAttr = '3P';
    selectedVerAttr = '2P';
    isLeftTurn = true;

    constructor() {
        const headerEle = document.getElementById('header');
        const positionCheckGroupCompEle = document.getElementById('position-check-group-comp');
        const horizontalSelectCompEle = document.getElementById('horizontal-select-comp');
        const verticalSelectCompEle = document.getElementById('vertical-select-comp');
        const scatterplotCompEle = document.getElementById('scatterplot-comp');
        const boxplotCompEle = document.getElementById('boxplot-comp');
        const leftRadarchartCompEle = document.getElementById('left-radarchart-comp');
        const rightRadarchartCompEle = document.getElementById('right-radarchart-comp');
        const datatableCompEle = document.getElementById('datatable-comp');
        this.leftPlayerNameEle = document.getElementById('left-player-name');
        this.rightPlayerNameEle = document.getElementById('right-player-name');

        const selectOptions = this.ATTRIBUTES.filter(attr => !this.CATEGORICAL_ATTRIBUTES.includes(attr)).map((name) => ({ label: name, value: name }));

        this.headerComp = new HeaderComponent(
            headerEle,
            'NBA 2020-2021 Player Analysis',
        );
        this.checkboxGroupComp = new CheckboxGroupComponent(
            positionCheckGroupCompEle,
            this.POSITION,
            this.POSITION,
        );
        this.checkboxGroupComp.setOnChange(this.onChangePosition);
        this.horizontalSelectComp = new SelectComponent(
            horizontalSelectCompEle,
            selectOptions,
            this.selectedHorAttr,
        );
        this.horizontalSelectComp.setOnChange(this.onChangeHorVerSelect);
        this.verticalSelectComp = new SelectComponent(
            verticalSelectCompEle,
            selectOptions,
            this.selectedVerAttr,
        );
        this.verticalSelectComp.setOnChange(this.onChangeHorVerSelect);
        this.scatterplotComp = new ScatterplotComponent(
            scatterplotCompEle,
        );
        this.scatterplotComp.on("brush", this.onBrushScatterPlot);
        this.boxplotComp = new BoxplotComponent(
            boxplotCompEle,
        );
        this.leftRadarchartComp = new RadarchartComponent(
            leftRadarchartCompEle,
        );
        this.leftRadarchartComp.setColor("rgba(140, 192, 222, 0.9)");
        this.rightRadarchartComp = new RadarchartComponent(
            rightRadarchartCompEle,
        );
        if (window.innerWidth < 1000) {
            this.leftRadarchartComp.setSize(24, 50);
            this.rightRadarchartComp.setSize(24, 50);
        }
        this.rightRadarchartComp.setColor("rgba(244, 191, 191, 0.9)");
        this.datatableComp = new DatatableComponent(
            datatableCompEle,
        );
        this.datatableComp.setOnHeadClick(() => {});
        this.datatableComp.setOnRowClick(this.onDataTableRowClick);

        this.headerComp.render();
        this.checkboxGroupComp.render();
        this.horizontalSelectComp.render();
        this.verticalSelectComp.render();
        this.loadData();
    }

    loadData = async () => {
        try {
            this.data = await d3.csv("./data/nba2021_per_game.csv");

            this.onDataLoaded();
        } catch (e) {
            console.log(e)
            alert("Data 를 불러들이는데 실패했습니다.");
            return;
        }
    }

    onDataLoaded = () => {
        this.getAttrNormDistributionValueFuncs = this.COMPARED_ATTRS.map(attr => {
            const mean = this.data.reduce((acc, cur) => acc + Number(cur[attr]), 0) / this.data.length;
            const variance = this.data.reduce((acc, cur) => acc + Math.pow(Number(cur[attr]) - mean, 2), 0) / this.data.length;
            console.log(mean, variance)
            return this.makeNomalDistribution(mean, Math.sqrt(variance));
        })

        this.filteredData = this.data
            .filter(d => this.POSITION.includes(d['Pos']));
        
        const scpData = this.makeScpData(this.filteredData);
        this.renderScatterPlot(scpData, this.selectedHorAttr, this.selectedVerAttr);

        const bpData = this.makeBpData(scpData);
        this.renderBoxPlot(bpData, this.selectedHorAttr, this.selectedVerAttr);

        const dtLabels = this.makeDtLabels(this.filteredData);
        const dtData = this.makeDtData(this.filteredData);
        this.renderDataTable(dtData, dtLabels);
        this.rendarRadarChart([], true);
        this.rendarRadarChart([], false);
    }

    onChangePosition = () => {
        const checkedPosList = this.checkboxGroupComp.getChecked();
        this.filteredData = this.data
            .filter(d => checkedPosList.includes(d['Pos']));

        const scpData = this.makeScpData(this.filteredData);
        this.renderScatterPlot(scpData, this.selectedHorAttr, this.selectedVerAttr);

        const bpData = this.makeBpData(scpData);
        this.renderBoxPlot(bpData, this.selectedHorAttr, this.selectedVerAttr);

        const dtLabels = this.makeDtLabels(this.filteredData);
        const dtData = this.makeDtData(this.filteredData);
        this.renderDataTable(dtData, dtLabels);
    }

    onChangeHorVerSelect = () => {
        this.selectedHorAttr = this.horizontalSelectComp.getSelected();
        this.selectedVerAttr = this.verticalSelectComp.getSelected();
        const scpData = this.makeScpData(this.filteredData);
        this.renderScatterPlot(scpData, this.selectedHorAttr, this.selectedVerAttr);

        const bpData = this.makeBpData(scpData);
        this.renderBoxPlot(bpData, this.selectedHorAttr, this.selectedVerAttr);
    }

    onBrushScatterPlot = (d) => {

    }

    onDataTableRowClick = (d, labels) => {
        const data = this.COMPARED_ATTRS.map((attr) => Number(d[labels.findIndex(l => l == attr)]))
            .map((item, idx) => this.getAttrNormDistributionValueFuncs[idx](item));
        this.rendarRadarChart(data, this.isLeftTurn);
        if (this.isLeftTurn) {
            this.leftPlayerNameEle.innerText = d[0];
        } else {
            this.rightPlayerNameEle.innerText = d[0];
        }
        this.isLeftTurn = !this.isLeftTurn;
    }

    makeScpData = d => d.map(d => ({ x: Number(d[this.selectedHorAttr]), y: Number(d[this.selectedVerAttr]), z: d['Pos'], id: d['Player'] }));
    makeBpData = scpData => scpData.map(td => ({ x: td.z, y: td.y }));
    makeDtLabels = d => d.length > 0 ? Object.keys(d[0]) : [];
    makeDtData = d => d.map(d => Object.values(d));

    renderScatterPlot = (data, horAttr, verAttr) => {
        this.scatterplotComp.setData(
            data,
            horAttr,
            verAttr,
        );
        this.scatterplotComp.render();
    }
    
    renderBoxPlot = (data, horAttr, verAttr) => {
        this.boxplotComp.setData(
            data,
            horAttr,
            verAttr,
        );
        this.boxplotComp.render();
    };

    renderDataTable = (data, labels) => {
        this.datatableComp.setData(data, labels);
        this.datatableComp.render();
    }

    rendarRadarChart = (data, isLeft) => {
        if (isLeft) {
            this.leftRadarchartComp.setData(data, this.COMPARED_ATTRS);
            this.leftRadarchartComp.render();
        } else {
            this.rightRadarchartComp.setData(data, this.COMPARED_ATTRS);
            this.rightRadarchartComp.render();
        }
    }

    makeNomalDistribution = (m, std) => (x) => {
        var x = (x - m) / std
        var t = 1 / (1 + .2315419 * Math.abs(x))
        var d =.3989423 * Math.exp( -x * x / 2)
        var prob = d * t * (.3193815 + t * ( -.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))))
        if( x > 0 ) prob = 1 - prob
        return prob
    }
}

export default MainPage;