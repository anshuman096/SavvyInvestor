import React, { Component } from "react";
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';
import {Tabs, Tab} from 'material-ui/Tabs';
import {
    Table,
    TableBody,
    TableHeader,
    TableHeaderColumn,
    TableRow,
    TableRowColumn,
} from 'material-ui/Table';
import {GridList} from 'material-ui/GridList';
        
import {ComposedChart, Line, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend} from 'recharts';

// Receieved help from:
// http://www.material-ui.com/#/components/grid-list


//var LineChart = require("react-chartjs").Line;



/**
 * The main class which gets data from the node server and interacts with backend.
 *
 * @author: Anshuman Dikhit, Curran Bhatia
 */
export default class Content extends Component {

    constructor(props) {
        super(props);
        this.state = {
            tableContent: null,
            chartData: null,
            newsContent: null,
            isLoading: true,
            name : 'DJI',
            activeTab: 'table',
            dataType: 'interday',
            errorText: '',
        }
   }

   /**
    * Function called by componentWillMount. Takes company name as parameter
    * This function makes a ReST api call to the node server, and collecs the
    * JSON object from the server. Manipulates JSON object to split chartData and
    * tableView Data into 2 separate objects and creates their HTML code to be stored inside
    * this.state
    *
    * @name: The NASDAQ symbol of the company
    */
    _loadData(name, dataType) {
        var url = 'http://localhost:3001/api/company/' + name + '/' + dataType;
        fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type':'application/json',
            },
        }).then(results => {
            if(results.ok === false) {
                console.log('reached here');
                this.setState({errorText: 'Invalid Symbol'});
                return;
            } else 
                return results.json();
        }).then (data => {
            var chartData = {};
            chartData["labels"] = data["labels"];
            chartData["datasets"] = data["datasets"];
            var tableView = data["tableView"];
            let items = tableView.map((item) => {
                //console.log("Process Item : " + JSON.stringify(item));
                return (
                    <TableRow>
                        <TableRowColumn>{item.date}</TableRowColumn>
                        <TableRowColumn>{item.opening}</TableRowColumn>
                        <TableRowColumn>{item.closing}</TableRowColumn>
                        <TableRowColumn>{item.average}</TableRowColumn>
                    </TableRow>
                );

            });
            var tabContent = 
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHeaderColumn>Date</TableHeaderColumn>
                            <TableHeaderColumn>Opening Value</TableHeaderColumn>
                            <TableHeaderColumn>Closing Value</TableHeaderColumn>
                            <TableHeaderColumn>Moving Average</TableHeaderColumn>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {items}
                    </TableBody>
                </Table>
            //
            var xData = data["datasets"];
            var chContent =
            <div className='item'>
                <ComposedChart width={1400} height={600} data={xData}
                margin={{top: 20, right: 20, bottom: 40, left: 40}}>
                    <CartesianGrid stroke='#f5f5f5'/>
                    <XAxis dataKey="name" angle="330" />
                    <YAxis domain={['dataMin', 'dataMax']} />
                    <YAxis scale="log" />
                    <Tooltip />
                    <Legend verticalAlign="top" height={36}/>
                    <Area type='monotone' dataKey='Opening Values' fillOpacity={0.1} fill='#66cccc' stroke='#66cccc'/>
                    <Area type='monotone' dataKey='Closing Values' fillOpacity={0.1} fill='#78bddd' stroke='#78bddd'/>
                    <Line type='monotone' dataKey='Average Value' fill='#413ea0' strokeDasharray="5 5" />
                </ComposedChart>
            </div>

            // var chContent = 
            //     <div className='item'>
            //         <LineChart data = {chartData} options = {chartOptions} width = '1400' height = '600'/>
            //     </div>
            //
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

    _loadCoinData() {
        var url = 'http://localhost:3001/api/coin/btc';
        fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type':'application/json',
            },
        }).then(results => {
            if(results.ok === false) {
                console.log('reached here');
                this.setState({errorText: 'Invalid Symbol'});
                return;
            } else 
                return results.json();
        }).then (data => {
            
            try{
                var keys = Object.keys(data['time data'])
                var coinData = {};
                coinData['time data'] = data['time data']
                var currPrice = data['time data'][keys[0]]['1a. price (USD)'];
                var nameContent = <h1> {currPrice}</h1> 
                //
                this.setState({ btcContent: nameContent,});
            }
            catch(error) {
            }
        });

        var url2 = 'http://localhost:3001/api/coin/eth';
        fetch(url2, {
            method: 'GET',
            headers: {
                'Content-Type':'application/json',
            },
        }).then(results => {
            if(results.ok === false) {
                console.log('reached here');
                this.setState({errorText: 'Invalid Symbol'});
                return;
            } else 
                return results.json();
        }).then (data => {
            try{
                var keys = Object.keys(data['time data'])
                var coinData = {};
                coinData['time data'] = data['time data']
                var currPrice = data['time data'][keys[0]]['1a. price (USD)'];
                var nameContent = <h1> {currPrice}</h1> 
                //
                this.setState({ ethContent: nameContent,});
            }
            catch(error) {
            }

        });

        var url3 = 'http://localhost:3001/api/coin/ltc';
        fetch(url3, {
            method: 'GET',
            headers: {
                'Content-Type':'application/json',
            },
        }).then(results => {
            if(results.ok === false) {
                console.log('reached here');
                this.setState({errorText: 'Invalid Symbol'});
                return;
            } else 
                return results.json();
        }).then (data => {
            
            try{
                var keys = Object.keys(data['time data'])
            
                var coinData = {};
                coinData['time data'] = data['time data']

                var currPrice = data['time data'][keys[0]]['1a. price (USD)'];
                console.log(data['time data'][keys[0]]['1a. price (USD)']);

                var nameContent = <h1> {currPrice}</h1> 
                this.setState({ ltcContent: nameContent,});
            }
            catch(error) {
            }
//
        }).catch(function() {
            console.log('error');
        });
         

   }

   _loadNewsData(name) {
        var url1 = 'http://localhost:3001/api/news/' + name;
        fetch(url1, {
            method: 'GET',
            headers: {
                'Content-Type':'application/json',
            },
        }).then(results => {
            if(results.ok === false) {
                console.log('reached here');
                this.setState({errorText: 'Invalid Symbol'});
                return;
            } else 
                return results.json();
        }).then (data => {
            
            console.log("Reached NEWS data");
            console.log(data['articles'][0]);
            console.log("Reached NEWS data");
            var currHeadline = data['articles'][0];
            

            var ret = 
                <ul>
                    <h4><a href={data['articles'][0].url}>{data['articles'][0].title}</a></h4>
                    <h4><a href={data['articles'][1].url}>{data['articles'][1].title}</a></h4>
                    <h4><a href={data['articles'][2].url}>{data['articles'][2].title}</a></h4>
                    <h4><a href={data['articles'][3].url}>{data['articles'][3].title}</a></h4>
                </ul>
//   
            this.setState({ 
                newsContent: ret,
            });
        }).catch(function() {
            console.log('error');
        });
   }




   //Helper function to change data when stock symbol is changed
    handleNameChange = (name, value) => {
        console.log("name : " + name + " value : " + value);
        this.setState({name: value});
    };

    handleDataTypeChange = (dataType, text) => {
        this.setState({dataType: text});
    };

    // Function that is called right before render.
    componentWillMount() {
        console.log('LifeCycle: Component WILL MOUNT!')
        console.log('-- Component WILL UPDATE!');//
        this._loadData(this.state.name, this.state.dataType);
        this._loadCoinData();
        this._loadNewsData(this.state.name);
    
    }

    //caller function for _loadData
    loadData = (event) => {
        console.log("Load Data for " + this.state.name);
        this._loadData(this.state.name, this.state.dataType);  
        this._loadNewsData(this.state.name);  
    }

    //tab change handler used to change tab value
    handleTabChange = (value) => {
        this.setState({
            activeTab: value,
        });     
    }

   render() {
      console.log('-- Component render!')
      if(this.state.isLoading === true)
        return(
            <div></div>
        );
//
        return (
            <div className='outer'>
                <h1> Stock Markets </h1>
                <TextField
                    floatingLabelText="Stock Symbol"
                    value={this.state.name}
                    errorText={this.state.errorText}
                    onChange={(name,value) => {this.handleNameChange(name, value)}}
                />
                <TextField
                    floatingLabelText="Data Type"
                    value={this.state.dataType}
                    errorText={this.state.errorText}
                    onChange={(dataType, text) => {this.handleDataTypeChange(dataType, text)}}
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
                    <Tab label="News" value="news">
                        <div className = 'companyNews'>
                            {this.state.newsContent}
                        </div>
                    </Tab>
                </Tabs>


                <h1> Coin Markets </h1>

                <GridList
                  style={styles.gridList, styles.root}
                >


                    <div style = {styles.coolBox}>
                        <h1> BTC </h1>
                        {this.state.btcContent}
                        <h2> Dollar per BTC </h2>

                    </div>
                    <div style = {styles.coolBox}>
                        <h1> ETH </h1>
                        {this.state.ethContent}
                        <h2> Dollar per ETH </h2>

                    </div>
                    <div style = {styles.coolBox}>
                        <h1> LTC </h1>
                        {this.state.ltcContent}
                        <h2> Dollar per LTC </h2>

                    </div>

                </GridList>
            </div>
      );
   }
}

const styles = {

  feed: {
    backgroundColor: 'white',

    display: 'flex',
    flexWrap: 'nowrap',
    justifyContent: 'center',
    height: 500,
    paddingLeft: '8%',
    paddingRight: '8%',


    },

  newsBox: {
    height: 400,
    //borderStyle: 'dotted',
    //borderColor: 'red',
    borderRadius: '20px',

    paddingLeft: '30px',
    paddingRight: '30px',
    paddingTop: '40px',
    backgroundColor: 'blue',
    color:'white',
    opacity: 0.8,


  },

  root: {
    backgroundColor: 'DeepSkyBlue',

    display: 'flex',
    flexWrap: 'nowrap',
    justifyContent: 'center',
    alignItems: 'center',
    height: 500,
    paddingLeft: '8%',
    paddingRight: '8%',

  },
  gridList: {

    


    

  },
   coolBox: {
    width: 200,
    height: 200,
    //borderStyle: 'dotted',
    //borderColor: 'red',
    borderRadius: '20px',

    paddingLeft: '30px',
    paddingRight: '30px',
    paddingTop: '40px',
    backgroundColor: 'black',
    color:'white',
    opacity: 0.8,



  },

};

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
    pointHitDetectionRadius : 2,

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



