import React, { Component } from "react";
import AppBar from 'material-ui/AppBar';
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import Content from './Content';
import MainPage from './MainPage';



import {
  cyan500, cyan700,
  pinkA200,
  grey100, grey300, grey400, grey900,
  white, darkBlack, fullBlack,
} from 'material-ui/styles/colors';


const muiTheme2 = getMuiTheme({
  palette: {
    textColor: darkBlack,
    primary1Color: grey900,

  },
  appBar: {
    height: 50,
  },
});




//add a home screen
class App extends Component {

  constructor(props) {

        super(props);



        this.state = {
            

            currPage: <MainPage />,
            userVal: 'na',
            passVal: 'none',
            currLog: <div> </div>,
            logoutButton: '',
            errorText: '',
        }

   }


   setToContentPage = () => {

      console.log("Reaches setToContentPage")
      

      this.setState({
        currPage: <Content />,
      });


    };

    setToMainPage = () => {

      console.log("Reaches setToMainPage")
      

      this.setState({
        currPage: <MainPage />,
      });


    };


    updateUserValue = (userV) => {


      this.setState({
        userVal: userV.target.value,
      });

    };

    updatePassValue = (passV) => {


      this.setState({
        passVal: passV.target.value,
      });

    };

    

    setCurrentAcc = (userA, passA) => {


      var url1 = 'http://localhost:3001/api/current/add/' + userA + '+'+ passA ;
        fetch(url1, {
            method: 'GET',
            headers: {
                'Content-Type':'application/json',
            },
        }).then(results => {
            if(results.ok === false) {
                console.log('reached add account to current session');

                return;
            } else 
                return results.json();
        }).then (data => {
            
            console.log("Done")

          

            


        }).catch(function() {
            console.log('error IN  ACCOUNT');
        });

    };

    loginToPage = () => {

        console.log("Current User val is")
        console.log(this.state.userVal)
        console.log(this.state.passVal)




        var url1 = 'http://localhost:3001/api/account/check/' + this.state.userVal + '+'+ this.state.passVal ;
        fetch(url1, {
            method: 'GET',
            headers: {
                'Content-Type':'application/json',
            },
        }).then(results => {
            if(results.ok === false) {
                console.log('reached RESULTS IN  ACCOUNT');

                return;
            } else 
                return results.json();
        }).then (data => {
            
            console.log(data['answer'][0]['username'])
            console.log("Successfully authenticated")

          
            this.setCurrentAcc(this.state.userVal, this.state.passVal);
            this.setToContentPage();
            this.logoutButtonAppear();
            


        }).catch(function() {
            console.log('error IN  ACCOUNT');
        });


   

    };

    logoutCommand = () => {

        var url1 = 'http://localhost:3001/api/current/logout/' + this.state.userVal + '+'+ this.state.passVal ;
        fetch(url1, {
            method: 'GET',
            headers: {
                'Content-Type':'application/json',
            },
        }).then(results => {
            if(results.ok === false) {
                console.log('reached logout account to current session');

                return;
            } else 
                return results.json();
        }).then (data => {
            
            console.log("Done")

          
            this.setToMainPage();

            


        }).catch(function() {
            console.log('error IN  ACCOUNT');
        });



    };

    loginSlider = () => {

      var log = 

        this.setState({
          currLog: log,
        });


    };

    logoutButtonAppear = () => {

      var log =  <button type="button" style = {{paddingRight:20, borderRadius: 20, backgroundColor: 'red', width: 120, height: 28, color: 'white'}} onClick={this.logoutCommand}>Logout</button>


        this.setState({
          logoutButton: log,
        });


    };








   render() {
      return (
        <MuiThemeProvider muiTheme={muiTheme2}>
            <AppBar title="The Savvy Investor" iconClassNameRight="muidocs-icon-navigation-expand-more"/>
            <div style = {{padding:20}}>

              <button type="button" style = {{paddingRight:20, borderRadius: 20, backgroundColor: 'blue', width: 120, height: 28, color: 'white'}} onClick={this.setToContentPage}>Preview</button>
              <label style = {{paddingRight: 30}}>
                  User :
                  <input value={this.state.userVal} onChange={this.updateUserValue} type="text" name="name" />
              </label>
              <label style = {{paddingRight: 30}}>
                  Pass :
                  <input value={this.state.passVal} onChange={this.updatePassValue} type="text" name="name" />
              </label>
              <button type="button" style = {{ borderRadius: 20, backgroundColor: 'red', width: 120, height: 28, color: 'white'}} onClick={this.loginToPage}>Login</button>
            
              {this.state.logoutButton}
            </div>

            
            {this.state.currPage}
        </MuiThemeProvider>

      );
   }
}

export default App;
