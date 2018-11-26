import React, { Component } from 'react';
import { Route } from 'react-router-dom'
import './App.css';
import MapMain from './MapMain'
import * as VenuesAPI from './VenuesAPI'


class App extends Component {
  state = {
  venues: [],
  pageHeight: "0"
  }
  /*  need to get foursquare venues */

  async componentDidMount() {

    const venues =  await VenuesAPI.getAllVenues()

    if ( typeof (venues[0].venue) === 'undefined') {
      alert("Oops, Could not retrive Foursquare data. Possible conection and/or credential issue.")
      this.setState({
        venues : [],
        pageHeight : document.documentElement.offsetHeight
      });
    }else{
      this.setState({
        venues : venues,
        pageHeight : document.documentElement.offsetHeight
      });
    }
  }
  render() {
    return (
      <div className="App">
        <Route exact path='/' render={() =>(
          <MapMain
            venues={this.state.venues}
            pageHeight = {this.state.pageHeight}
            />
        )}/>
      </div>
    );
  }
}

export default App;
