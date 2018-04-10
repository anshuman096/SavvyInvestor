import React, { Component, Text } from "react";
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';
import AppBar from 'material-ui/AppBar';
import {Tabs, Tab} from 'material-ui/Tabs';
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
var LineChart = require("react-chartjs").Line;


class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: 'MSFT'
        };
    };

   render() {
      return (
        <MuiThemeProvider>
            <div className = "App">
                <Content />
            </div>
        </MuiThemeProvider>
      );
   }
}


class Content extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            tableContent: null,
            chartData: null,
            isLoading: true,
            name : 'MSFT',
            activeTab: 'table',
            errorText: '',
        }
   }

    _loadData(name) {
        var url = 'http://localhost:3001/api/company/' + name + '/daily_time_series';
        fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type':'application/json',
            },
        }).then( results => {
            if(results.ok === false)
                this.setState({errorText: 'Invalid Symbol'});
            else 
                return results.json();
        }).then (data => {
            var chartData = {};
            chartData["labels"] = data["labels"];
            chartData["datasets"] = data["datasets"];
            var tableView = data["tableView"];
            let items = tableView.map((item) => {
                console.log("Process Item : " + JSON.stringify(item));
                return (
                    <TableRow>
                        <TableRowColumn>{item.date}</TableRowColumn>
                        <TableRowColumn>{item.closing}</TableRowColumn>
                    </TableRow>
                );

            });
            var tabContent = 
                <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHeaderColumn>Date</TableHeaderColumn>
                        <TableHeaderColumn>Closing Value</TableHeaderColumn>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                        {items}
                    </TableBody>
                </Table>
            var chContent = 
                <div className='item'>
                    <LineChart data = {chartData} options = {chartOptions} width = '1200' height = '800'/>
                </div>
            this.setState({
                tableContent: tabContent,
                chartData: chContent,
                isLoading: false,
                errorText: ''
            });
            return;
        }).catch(function() {
            console.log('error');
        });

   }

    handleChange = (name, value) => {
        console.log("name : " + name + " value : " + value);
        this.setState({name: value});
    };

    componentWillMount() {
        console.log('LifeCycle: Component WILL MOUNT!')
        console.log('-- Component WILL UPDATE!');//
        this._loadData(this.state.name);
    
    }

    loadData = (event) => {
        console.log("Load Data for " + this.state.name);
        this._loadData(this.state.name);    
    }

    handleTabChange = (value) => {
        this.setState({
            activeTab: value,
        });     
    }

   // componentDidMount() {
   //    console.log('LifeCycle: Component DID MOUNT!')
   // }
   // componentWillReceiveProps(newProps) {    
   //    console.log('-- Component WILL RECIEVE PROPS!')
   // }
   // shouldComponentUpdate(newProps, newState) {
   //    return true;
   // }
   // async componentWillUpdate(nextProps, nextState) {
   // }
   // componentDidUpdate(prevProps, prevState) {
   //    console.log('-- Component DID UPDATE!')
   // }
   // componentWillUnmount() {
   //    console.log('-- Component WILL UNMOUNT!')
   // }
   render() {
      console.log('-- Component render!')
      if(this.state.isLoading === true)
        return(
            <div></div>
        );

      return (
         <div className='outer'>
            <AppBar
                title="SavvyInvestor"
                iconClassNameRight="muidocs-icon-navigation-expand-more"
            />
            <TextField
                floatingLabelText="Stock Symbol"
                value={this.state.name}
                errorText={this.state.errorText}
                onChange={(name,value) => {this.handleChange(name, value)}}
            />
            <FlatButton 
                label="Lookup" primary={true}
                onClick={(event) => {this.loadData(event)}}
            />
            <Tabs
                value={this.state.activeTab}
                onChange={this.handleTabChange}
            > 
                <Tab label="Chart" value="chart">
                    <div className = 'companyChart'>
                        {this.state.chartData}
                    </div>
                </Tab>
                <Tab label="Table" value="table">
                    <div className='companyTable'>
                        {this.state.tableContent}
                    </div>
                </Tab>
            </Tabs>
         </div>
      );
   }
}

const chartOptions = {

    ///Boolean - Whether grid lines are shown across the chart
    scaleShowGridLines : true,

    //String - Colour of the grid lines
    scaleGridLineColor : "rgba(0,0,0,.05)",

    //Number - Width of the grid lines
    scaleGridLineWidth : 1,

    //Boolean - Whether to show horizontal lines (except X axis)
    scaleShowHorizontalLines: true,

    //Boolean - Whether to show vertical lines (except Y axis)
    scaleShowVerticalLines: true,

    //Boolean - Whether the line is curved between points
    bezierCurve : true,

    //Number - Tension of the bezier curve between points
    bezierCurveTension : 0.4,

    //Boolean - Whether to show a dot for each point
    pointDot : true,

    //Number - Radius of each point dot in pixels
    pointDotRadius : 4,

    //Number - Pixel width of point dot stroke
    pointDotStrokeWidth : 1,

    //Number - amount extra to add to the radius to cater for hit detection outside the drawn point
    pointHitDetectionRadius : 5,

    //Boolean - Whether to show a stroke for datasets
    datasetStroke : true,

    //Number - Pixel width of dataset stroke
    datasetStrokeWidth : 2,

    //Boolean - Whether to fill the dataset with a colour
    datasetFill : true,
    //{% raw %}
    //String - A legend template
    legendTemplate : "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<datasets.length; i++){%><li><span style=\"background-color:<%=datasets[i].strokeColor%>\"><%if(datasets[i].label){%><%=datasets[i].label%><%}%></span></li><%}%></ul>",
    // {% endraw %}

    //Boolean - Whether to horizontally center the label and point dot inside the grid
    offsetGridLines : false
};
export default App;
