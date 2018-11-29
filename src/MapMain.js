import React, { PureComponent } from 'react'
import MapContainer from './MapContainer'
import PropTypes from 'prop-types'
import { slide as Menu } from 'react-burger-menu'
import escapeRegExp from 'escape-string-regexp'


class MapMain extends PureComponent {

  static propTypes =  {
    venues: PropTypes.array.isRequired
  }
  state = {
    menuOpen: false,
    showingVenues: [],
    query: '',
    selectedVenueID: '',
    tabIndexValue: -1
  }

  // This keeps your state in sync with the opening/closing of the menu
  // via the default means, e.g. clicking the X, pressing the ESC key etc.
  handleStateChange (state) {
    let tabindex
    if (state.isOpen=== true){
      tabindex = "0";
    }else{
      tabindex = "-1";
    }
    this.setState({
      menuOpen: state.isOpen,
      tabIndexValue: tabindex
    })
  }
  // This can be used to close the menu, e.g. when a user clicks a menu item
  closeMenu () {
    this.setState({
      menuOpen: false,
      tabIndexValue: "-1"
    })
  }
  // This can be used to toggle the menu, e.g. when using a custom icon
  // Tip: You probably want to hide either/both default icons if using a custom icon
  // See https://github.com/negomi/react-burger-menu#custom-icons
  toggleMenu () {



    this.setState({
      menuOpen: !this.state.menuOpen,
      tabIndexValue: !this.state.tabIndexValue
    })
  }

  searchQuery = (query) => {
      this.setState({
        query:query,
        selectedVenueID: ''
      })
   }

   selectVenue = (selectedVenueID) => {
     this.setState({selectedVenueID:selectedVenueID})
     //console.log(selectedVenueID)
   }

  render() {
    const { query, selectedVenueID } = this.state
    const { venues, pageHeight } = this.props

    let showingVenues
    if (query){
      const match = new RegExp(escapeRegExp(query), 'i');
      showingVenues = venues.filter((venue) => match.test(venue.venue.name));
    }else{
      showingVenues = venues;
    }

    return (

      <div>
        <div>
          <Menu
            isOpen={this.state.menuOpen}
            onStateChange={(state) => this.handleStateChange(state)}
            disableCloseOnEsc
          >
            <div className="search-venues-input-wrapper" role="listbox" aria-label="Select Venues" tabIndex={this.state.tabIndexValue}>
              <img className="fourSquare" alt="Powered by fourSquare" src={require('./img/powered-by-foursquare-white.png')} />
              <input className="search-venues" type="text" placeholder="Search Venues"
                aria-label="Search" tabIndex={this.state.tabIndexValue}
                onChange={(event) => { this.searchQuery(event.target.value)}}
                />
            </div>
            {showingVenues.map(venue => {
              return <div className="menu-item" key={venue.venue.id} >
                          <div tabIndex={this.state.tabIndexValue} aria-label={venue.venue.name} onFocus={()=>{this.selectVenue(venue.venue.name)}} >{venue.venue.name}</div>
                     </div>
            })}
          </Menu>

        </div>
          <header className="App-header">
            <h1 className="App-title"  >Welcome to New Braunfels</h1>
          </header>
          <div className="map-canvas" aria-label="Street Map" role="application" tabIndex="-1">
            <MapContainer
              pageHeight = {pageHeight}
              showingVenues = {showingVenues}
              selectVenueID={selectedVenueID}
              menuOpen = {this.state.menuOpen}
             />
          </div>
          <footer className="App-footer">
            By Paul Christenson
          </footer>
      </div>
    )

  }
}

export default MapMain;
