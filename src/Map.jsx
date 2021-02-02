import React from 'react';
import './Map.css';
import { MapContainer as LeafletMap, TileLayer } from "react-leaflet";
import { showDataOnMap } from "./util";

const Map = ({ countries, casesType , Center, Zoom }) => {
    return (
        <>
            <div className="map">
                <LeafletMap center={Center} zoom={Zoom}>
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                  />
                {showDataOnMap(countries,casesType)}
                </LeafletMap>
            </div>
        </>
    );
}

export default Map;