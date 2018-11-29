import React from 'react';
import {Marker} from 'google-maps-react';
import PropTypes from 'prop-types';


/*
This class extends google-maps-react::Marker by adding two props events to the marker object:

  - onMarkerAdd: callback that is called when a new google.maps.Marker object is added to the map
  - onMarkerRemove: callback that is called when a new google.maps.Marker object is removed from the map
*/
class RefMarker extends Marker{
  componentDidUpdate(prevProps) {
    if ((this.props.map !== prevProps.map) ||
      (this.props.position !== prevProps.position) ||
      (this.props.icon !== prevProps.icon)) {
        this.unsetMarker()
        this.renderMarker();
    }
  }

  componentWillUnmount() {
    this.unsetMarker()
  }

  unsetMarker(){
    if (this.marker) {
      this.marker.setMap(null);
      if (this.props.onMarkerRemove){
        this.props.onMarkerRemove(this.marker)
      }
    }
  }

  renderMarker(){
    super.renderMarker();
    if (this.marker && this.props.onMarkerAdd && this.marker.map){
      this.props.onMarkerAdd(this.marker);
    }
  }
}


RefMarker.propTypes['onMarkerAdd'] = PropTypes.func;
RefMarker.propTypes['onMarkerRemove'] = PropTypes.func;

export default RefMarker;
