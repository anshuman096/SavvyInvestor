import React, { Component } from "react";
import AppBar from 'material-ui/AppBar';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import Content from './Content';


class App extends Component {

   render() {
      return (
        <MuiThemeProvider>
            <AppBar title="Savvy Investor" iconClassNameRight="muidocs-icon-navigation-expand-more"/>
            <Content />
        </MuiThemeProvider>
      );
   }
}

export default App;