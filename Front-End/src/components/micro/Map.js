import { useState, useContext, useEffect } from 'react';
import ReactMapGL, { Marker } from 'react-map-gl';
import axios from 'axios';

import { StatusBoxMapContext } from '../../contexts/statusBoxMapContext';

import CheckoutOrders from '../StatusBoxMap/CheckoutOrders';
import SetLocation from '../StatusBoxMap/SetLocation';
import WaitApproval from '../StatusBoxMap/WaitApproval';
import OnTheWay from '../StatusBoxMap/OnTheWay';

import LocationPin from '../../images/location_pin.png';

const Map = (props) => {
    const [state, dispatch] = useContext(StatusBoxMapContext);

    const [viewport, setViewPort] = useState({
        width: "100%",
        height: "70vh",
        zoom: 15,
    });

    const [newLocation, setNewLocation] = useState({
        latitude: props.longLat.latitude,
        longitude: props.longLat.longitude,
    });

    const [address, setAddress] = useState("");
    
    const myAdress = async (lat, long) => {
        await axios.get(`http://api.positionstack.com/v1/reverse?access_key=cfb5b411b150ee888fe2dcd72d3676a9&query=${lat},${long}`)
        .then(response => {
            setAddress(response.data.data[0].label);
        }).catch(error => {
            console.log(error);
        });
    }

    useEffect(() => {
        myAdress(newLocation.latitude, newLocation.longitude)
    }, []);
    
    const mapBoxToken = 'pk.eyJ1IjoiaW5kcmFjYiIsImEiOiJja20xazUzb3AwOHZrMnB1bDZxM2JqbmJqIn0.u18YM0U2ByjsLEDKjdnfLQ';
    
    if (state.setLocation == true) {
        return (
            <div>
                <ReactMapGL
                    {...newLocation}
                    {...viewport}
                    mapboxApiAccessToken={mapBoxToken}
                    onViewportChange={setViewPort}
                    mapStyle="mapbox://styles/mapbox/streets-v11"
                >
                        <>
                        <SetLocation locationName={address} newLocation={newLocation} />
                            <Marker latitude={newLocation.latitude} longitude={newLocation.longitude} draggable={true}
                                onDragEnd={(event) => {
                                    setNewLocation({
                                        latitude: event.lngLat[1],
                                        longitude: event.lngLat[0]
                                    })
                                    myAdress(event.lngLat[1], event.lngLat[0]);
                                }
                                }>
                                <img
                                    src={LocationPin}
                                    alt="https://www.freepik.com"
                                    width="24px"
                                    height="24px"
                                />
                            </Marker>
                        </>
                </ReactMapGL>
            </div>
        );
    } else if (state.checkoutOrderStatus == true) {
        return (
            <div>
                <ReactMapGL
                    {...newLocation}
                    {...viewport}
                    mapboxApiAccessToken={mapBoxToken}
                    onViewportChange={setViewPort}
                    mapStyle="mapbox://styles/mapbox/streets-v11"
                >
                    <CheckoutOrders totalPrice={props.totalPrice} locationName={address} orderLocation={newLocation} />
                    <Marker latitude={newLocation.latitude} longitude={newLocation.longitude}
                        draggable={true}
                        onDragEnd={(event) => {
                        setNewLocation({
                            latitude: event.lngLat[1],
                            longitude: event.lngLat[0]
                        })
                        myAdress(event.lngLat[1], event.lngLat[0]);
                    }
                    }>
                        <img
                            src={LocationPin}
                            alt="https://www.freepik.com"
                            width="24px"
                            height="24px"
                        />
                    </Marker>
                </ReactMapGL>
            </div>
        );
    } else if (props.status == "waiting Approval") {
        return (
            <div>
                <ReactMapGL
                    key={props.index}
                    latitude={props.longLat.latitude}
                    longitude={props.longLat.longitude}
                    {...viewport}
                    mapboxApiAccessToken={mapBoxToken}
                    onViewportChange={setViewPort}
                    mapStyle="mapbox://styles/mapbox/streets-v11"
                >
                    <WaitApproval locationName={props.longLat} />
                    <Marker latitude={props.longLat.latitude} longitude={props.longLat.longitude} >
                        <img
                            src={LocationPin}
                            alt="https://www.freepik.com"
                            width="24px"
                            height="24px"
                        />
                    </Marker>
                </ReactMapGL>
            </div>
        );
    } else if (props.status == "On The Way") {
        console.log("maps ontheway",props.longLat, props.index);
        return (
            <ReactMapGL
                    key={props.index}
                    latitude={props.longLat.latitude}
                    longitude={props.longLat.longitude}
                    {...viewport}
                    mapboxApiAccessToken={mapBoxToken}
                    onViewportChange={setViewPort}
                    mapStyle="mapbox://styles/mapbox/streets-v11"
                >
                    <OnTheWay transactionId={props.index} locationName={props.longLat}  refetch={props.refetch}/>
                    <Marker latitude={props.longLat.latitude} longitude={props.longLat.longitude} >
                        <img
                            src={LocationPin}
                            alt="https://www.freepik.com"
                            width="24px"
                            height="24px"
                        />
                    </Marker>
                </ReactMapGL>
        );
    } else {
        return (
            <ReactMapGL
                latitude={props.longLat.latitude}
                longitude={props.longLat.longitude}
                {...viewport}
                mapboxApiAccessToken={mapBoxToken}
                onViewportChange={setViewPort}
                mapStyle="mapbox://styles/mapbox/streets-v11"
            >
                <OnTheWay transactionId={props.index} locationName={props.longLat} refetch={props.refetch} />
                <Marker latitude={props.longLat.latitude} longitude={props.longLat.longitude} >
                    <img
                        src={LocationPin}
                        alt="https://www.freepik.com"
                        width="24px"
                        height="24px"
                    />
                </Marker>
            </ReactMapGL>
        );
    }
}

export default Map
