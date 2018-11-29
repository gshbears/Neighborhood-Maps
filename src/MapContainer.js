import React, { Component } from 'react'
import { Map, GoogleApiWrapper, Marker, InfoWindow } from 'google-maps-react'
import PropTypes from 'prop-types'


let mapStyles = {
  width: '100%',
  height: '600px'
}

let initalVenue = ''
let listMatch = false

class MapContainer extends Component {
  static propTypes =  {
    showingVenues:  PropTypes.array.isRequired,
    selectVenueID: PropTypes.string.isRequired
  }


  state = {
    showingInfoWindow: false,
    activeMarker: {},
    selectedVenue: {},
    selectedAddress: '',
    thisScreenSelection: false,
    markerObjects: [],
    selectedAnimation: '2',
    focusedVenue: '',
    windowPosition: {
    lat: 29.7030,
    lng: -98.1245,
    }
  }

 /* The set Stykes pageOffset is to send the window size to google for returned map size minus header and footer */
  setStyles = (pageOffset) => {
    mapStyles = {
      width: '100%',
      height: (window.innerHeight - pageOffset - 30) +'px'
    }
  }
  setInitialVenuw = (selectVenue)=> {
    initalVenue = selectVenue
  }

  onMarkerClick =(props, marker, e)=>{
    const selVenue = this.props.showingVenues.filter((venue) => props.name === venue.venue.name)

    this.setState({
      activeMarker: marker,
      showingInfoWindow: true,
      selectedVenue:this.getAddress(selVenue[0].venue.location),
      selectedAnimation: '0',
      markerObjects:{},
      focusedVenue: selVenue[0].venue.name
    })
  };

  onMapClicked = (props) => {
    if (this.state.showingInfoWindow) {
      this.setState({
        showingInfoWindow: false,
        activeMarker: null,
        focusedVenue: ''
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

  shouldComponentUpdate(nextProps, nextState){
    return listMatch
  }

  componentWillReceiveProps(nextProps) {
  //   this is check if list sent a selected venue a match found during rendering
      listMatch = true
      this.setMarkerRef = (ref) => {
          if (ref){
              if (ref.marker.name){
                  if(ref.marker.name === initalVenue){

                        const selVenue = nextProps.showingVenues.filter((venue) =>  ref.marker.name === venue.venue.name)
                      //  setting the list marker for animation and infowindow
                        this.setState({
                          selectedPlace: nextProps,
                          activeMarker:  ref.marker,
                          showingInfoWindow: true,
                          selectedVenue:this.getAddress(selVenue[0].venue.location),
                          focusedVenue: initalVenue,
                          windowPosition: (selVenue[0].venue.location)
                        })
                        listMatch = true
                  }else if(initalVenue===''){
                    this.setState({
                      showingInfoWindow: false
                    })
                    listMatch = true
                  }
              }
          }
      }
  }

// icon animation for various states of the window 1= bounce, 2 = drop and 0 = no animation
  getAnimation(venue){
    if (this.props.menuOpen){
        if(initalVenue === venue){
            return '1'
        }else if(initalVenue  === ''){
            return '2'
        }
    }else {
      if(this.state.focusedVenue  === venue && this.state.showingInfoWindow === true){
          return '1'
      }else if(this.state.focusedVenue  !== '' && this.state.showingInfoWindow === true ){
          return '0'
      }else if(this.state.focusedVenue  !== '' && this.state.showingInfoWindow === false ){
          return '0'
      }else{
          return '2'
      }
    }
  }

  render() {
    const { pageHeight, showingVenues, selectVenueID } = this.props
  //  console.log(selectVenueID)
    this.setStyles(pageHeight)
    this.setInitialVenuw(selectVenueID)

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
           return <Marker ref={this.setMarkerRef}
                key={venue.venue.id}
                position={venue.venue.location}
                title={venue.venue.name}
                name={venue.venue.name}
                animation={this.getAnimation(venue.venue.name)}
                onClick={this.onMarkerClick}
                icon={{ path:'M 0,0 C -2,-20 -10,-22 -10,-30 A 10,10 0 1,1 10,-30 C 10,-22 2,-20 0,0 z',
                        strokeColor: '#021B79',
                        fillColor: "#0575E6",
                        strokeWeight: 1,
                        fillOpacity: 1,
                        scale: 1
                      }}
                />
          })}

          <InfoWindow
             marker={this.state.activeMarker}
             position={this.state.windowPosition}
             options={{pixelOffset: new this.props.google.maps.Size(0,-20)}}
             visible={this.state.showingInfoWindow}>
               <div className="infoWindow" >
                 <h3>{this.state.activeMarker.name}</h3>
                 <div className="infoAddress">{this.state.selectedAddress}</div>
                 <img className="fourSquareInfo" alt="Powered by FourSquare" src={require('./img/powered-by-foursquare-blue.png')} />
               </div>
           </InfoWindow>
        </Map>
      </div>
    )
  }
}
/*
* First error handler listens for any promise or unhandledrejection errors due to network issues
* second error handler handles the errors caused by incorrect authentication by bad api key
*/
window.addEventListener("unhandledrejection", function (event) {
  alert("Google Map Error - Network issue with retriving requested map!");
});
window.gm_authFailure = function() {
  alert("Google Map Error = Authentication Failed! Check your API Key")
}

export default GoogleApiWrapper({
   apiKey: 'AIzaSyBZINlyxCG1_AvzpxX9nN2iDkSuDzHxIRc'
})(MapContainer)
