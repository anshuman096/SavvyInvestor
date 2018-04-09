import React, { Component, Text } from "react";


class App extends Component {
   constructor(props) {
      super(props);
    this.state = {
    content: [],
    };
      
   };

   render() {
      return (
         <div className = "App">
            <Content />
         </div>
      );
   }
}


class Content extends React.Component {

   constructor(props) {
      super(props);
      this.state = {
    content: null,
    }
   }

componentWillMount() {
    console.log('LifeCycle: Component WILL MOUNT!')
    console.log('-- Component WILL UPDATE!');//
    var url = 'http://localhost:3001/api/company/GOOGL/daily_time_series'
    fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type':'application/json',
        },
    }).then( results => {
      console.log('RESULTS :' + results);
      return results.json();
    }).then (data => {
        let items = data.map((item) => {
            console.log("Process Item : " + item);
            return (
                <div className='item'>
                    <p>{item.date}</p>
                    <p>{item.closing}</p>
                </div>
            );
        });
        this.setState({content: items});
        console.log(data);
    });
}

   componentDidMount() {
      console.log('LifeCycle: Component DID MOUNT!')
   }
   componentWillReceiveProps(newProps) {    
      console.log('-- Component WILL RECIEVE PROPS!')
   }
   shouldComponentUpdate(newProps, newState) {
      return true;
   }
   async componentWillUpdate(nextProps, nextState) {
   }
   componentDidUpdate(prevProps, prevState) {
      console.log('-- Component DID UPDATE!')
   }
   componentWillUnmount() {
      console.log('-- Component WILL UNMOUNT!')
   }
   render() {
      console.log('-- Component render!')
      return (
         <div className='outer'>
            {this.state.content} 
         </div>
      );
   }
}
export default App;
