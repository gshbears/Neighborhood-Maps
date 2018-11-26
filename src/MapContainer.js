import React, { Component } from 'react'
import { Map, GoogleApiWrapper, Marker, InfoWindow } from 'google-maps-react'
import PropTypes from 'prop-types'


let mapStyles = {
  width: '100%',
  height: '600px'
}

class MapContainer extends Component {

  static propTypes =  {
    showingVenues: PropTypes.array.isRequired
  }

  state = {
    showingInfoWindow: false,
    activeMarker: {},
    selectedPlace: {},
    selectedVenue: {},
    selectedAddress: ''
  }

 /* The set Stykes pageOffset is to send the window size to google for returned map size minus header and footer */
  setStyles = (pageOffset) => {
    mapStyles = {
      width: '100%',
      height: (window.innerHeight - pageOffset - 30) +'px'
    }
  }

  onMarkerClick =(props, marker, e)=>{
    const selVenue = this.props.showingVenues.filter((venue) => props.name === venue.venue.name)
  
    this.setState({
      selectedPlace: props,
      activeMarker: marker,
      showingInfoWindow: true,
      selectedVenue:this.getAddress(selVenue[0].venue.location)
    })
  };

  onMapClicked = (props) => {
    if (this.state.showingInfoWindow) {
      this.setState({
        showingInfoWindow: false,
        activeMarker: null
      })
    }
  };

  getAddress(adressArr){
    if(typeof(adressArr.address) !==undefined){
      this.setState({selectedAddress:adressArr.address})
    }else{
      this.setState({selectedAddress:''})
    }
  }

  render() {
    const { pageHeight, showingVenues } = this.props
    this.setStyles(pageHeight)

    return (
      <div className="map-canvas" >
        <Map
          google={this.props.google}
          mapTypeControl={false}
          zoom={12}
          style={mapStyles}
          initialCenter={{
          lat: 29.7030,
          lng: -98.1245,
          }}
          >
          {showingVenues.map(venue => {
           return <Marker key={venue.venue.id}
                position={venue.venue.location}
                title={venue.venue.name}
                name={venue.venue.name}
                animation={ this.props.google.maps.Animation.DROP}
                onClick={this.onMarkerClick}
                />
          })}
          <InfoWindow
               marker={this.state.activeMarker}
               visible={this.state.showingInfoWindow}>
                 <div className="infoWindow">
                   <h3>{this.state.selectedPlace.name}</h3>
                   <div className="infoAddress">{this.state.selectedAddress}</div>
                   <img className="fourSquareInfo" alt="Powered by FourSquare" src={require('./img/powered-by-foursquare-blue.png')} />
                 </div>
             </InfoWindow>
        </Map>
      </div>
    )
  }
}

export default GoogleApiWrapper({
   apiKey: 'AIzaSyBZINlyxCG1_AvzpxX9nN2iDkSuDzHxIRc'
})(MapContainer)
