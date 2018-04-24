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
            errorText: '',
        }

   }


   setToContentPage = () => {

      console.log("Reaches setToContentPage")
      

      this.setState({
        currPage: <Content />,
      });


    };



   render() {
      return (
        <MuiThemeProvider muiTheme={muiTheme2}>
            <AppBar title="The Savvy Investor" iconClassNameRight="muidocs-icon-navigation-expand-more"/>
            <button type="button" style = {{borderRadius: 20, backgroundColor: 'blue', width: 120, height: 40, color: 'white'}} onClick={this.setToContentPage}>Preview</button>

            {this.state.currPage}
        </MuiThemeProvider>

      );
   }
}

export default App;
