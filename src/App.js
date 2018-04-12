import React, { Component } from "react";
import AppBar from 'material-ui/AppBar';
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import Content from './Content';


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

class App extends Component {

   render() {
      return (
        <MuiThemeProvider muiTheme={muiTheme2}>
            <AppBar title="The Savvy Investor" iconClassNameRight="muidocs-icon-navigation-expand-more"/>
            <Content />
        </MuiThemeProvider>

      );
   }
}

export default App;