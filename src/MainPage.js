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
import {GridList, GridTile} from 'material-ui/GridList';

import { ListGroup, ListGroupItem } from 'react-bootstrap';


var LineChart = require("react-chartjs").Line;




export default class MainPage extends Component {

    constructor(props) {

        super(props);


        var signUpContent = 
                    <div style = {{width: 300,
                            height: 200, backgroundColor: 'clear', float:'left', border: 'solid'}}>
                        <h4> Sign in Here </h4>
                            <dl>
                                <dt style = {{paddingBottom: 10}}>
                                    <label>
                                        User :
                                        <input type="text" name="name" />
                                    </label>
                                </dt>

                                

                                <dt style = {{paddingBottom: 5}}>
                                    <label>
                                        Pass :
                                        <input type="text" name="name" />
                                      </label>
                                </dt>
                                <dt>
                                    <input type="submit" value="Submit" />
                                </dt>

                            </dl>

                        </div>


        this.state = {
            

            signUp: signUpContent,
            errorText: '',
        }

   }

    

    // Function that is called right before render.
    componentWillMount() {
        
    
    }


    signUpToggle = () =>{

        console.log("Reaches _signUpToggle")

        var signUpContent2 = 
                    <div style = {{width: 300,
                            height: 200, backgroundColor: 'clear', float:'left', border: 'solid'}}>
                        <h4> Sign up Here: </h4>
                            <dl>
                                <dt style = {{paddingBottom: 10}}>
                                    <label>
                                        User :
                                        <input type="text" name="name" />
                                    </label>
                                </dt>

                                

                                <dt style = {{paddingBottom: 5}}>
                                    <label>
                                        Pass :
                                        <input type="text" name="name" />
                                      </label>
                                </dt>
                                <dt style = {{paddingBottom: 5}}>
                                    <label>
                                        Pass :
                                        <input type="text" name="name" />
                                      </label>
                                </dt>
                                <dt>
                                    <input type="submit" value="Submit" />
                                </dt>

                            </dl>

                        </div>


        this.setState({
            

            signUp: signUpContent2,
            errorText: '',
        }); 


    }
    

   render() {
      console.log('MainPage render!')
      if(this.state.isLoading === true)
        return(
            <div></div>
        );
//
        return (
            <div className='outer' style = {mainStyles.root}>
                
            	

            	<div style = {mainStyles.centerBox}>
                    <h1 style = {mainStyles.bigText}>Welcome to the Savvy Investor</h1>
                    <div style = {mainStyles.smallBox}>
                        
                        {this.state.signUp}

                        <div style = {{width: 150,
                            height: 200, 
                            backgroundColor: 'clear', float:'right',}}>
                            <h4> Sign up Here </h4>
                            <button type="button" style = {{borderRadius: 20, backgroundColor: 'blue', width: 120, height: 80, color: 'white'}} onClick={this.signUpToggle}>Sign up</button>

                        </div>
                    </div>

            	</div>

               	

            </div>
      );
   }
}


let imgUrl = 'https://i.pinimg.com/originals/72/b7/a2/72b7a2e0391479928ac37d46ec7576c7.jpg'

const mainStyles = {

  root: {
    backgroundImage: 'url('+ imgUrl+ ')',
    backgroundSize: 'cover',
    overflow: 'hidden',
    backgroundColor: 'green',
    width: 1500,
    height: 1000,
    opacity: 1,
    },

    centerBox: {

        backgroundColor: 'black',
        width: 800,
        height: 500,
        
        
        marginTop: 100,
        display: 'block',
        marginLeft: 'auto',
        marginRight: 'auto',

        borderRadius: 30,

        paddingTop: 50,
        color: 'white',

        opacity: 0.8,




    },

    smallBox: {
        width: 500,
        height: 250, 
        backgroundColor: 'clear', 
        textAlign: 'center', 
        marginLeft: '20%', 
        marginRight: '20%',
        paddingTop: '3%',
        paddingBottom: '3%',

    },

  bigText: {

        textAlign: 'center',
        opacity: 1,
        color: 'white',
        marginTop: 50,


    }

  

};
