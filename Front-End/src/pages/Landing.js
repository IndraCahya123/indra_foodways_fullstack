import { useEffect, useContext } from 'react';
import { useQuery } from 'react-query';
import { Container, Row, CardDeck } from 'react-bootstrap';

import { locToObj } from '../util/locationStringToObj';

import { CurrentLocationContext } from '../contexts/currentLocationContext';
import { UserContext } from '../contexts/userContext';

import { APIURL } from '../api/integration';

import TopLandingPage from '../components/TopLandingPage';
import RestaurantCard from '../components/Card/RestaurantCard';
import NearestRestaurantCard from '../components/Card/NearestRestaurantCard';

function LandingPage() {
    //get user location
    const [userData] = useContext(UserContext);
    const [locationContext, dispatchLocation] = useContext(CurrentLocationContext);
    console.log(locationContext);
    useEffect(async () => {
        if (userData?.user?.location == "") {
            await navigator.geolocation.getCurrentPosition(pos => {
                dispatchLocation({
                    type: "SET_MY_LOCATION",
                    payload: {
                        latitude: pos.coords.latitude,
                        longitude: pos.coords.longitude
                    }
                })
            }, err => {
                console.log(err);
            }, { enableHighAccuracy: true });
        } else {
            const locationStringToObj = locToObj(userData?.user?.location);
            dispatchLocation({
                type: "SET_MY_LOCATION",
                payload: {
                    latitude: locationStringToObj?.latitude,
                    longitude: locationStringToObj?.longitude
                }
            });
            console.log(locationStringToObj);
            console.log(userData?.user?.location);
        }
    }, []);

    const {
        data: partners,
        isFetching: fetch
    } = useQuery("partnersCache", async () => {
        const res = await APIURL.get("/partners")
        return res.data.data.users
    });
    return(
        <div>
            <TopLandingPage />
            <ContentLandingPage dataPartners={fetch ? null : partners} processFetch={fetch ? true : false} />
        </div>
    );
}

function ContentLandingPage(props){
    return(
        <div className="content">
            <Popular dataPartners={ props?.dataPartners } processFetch={props?.processFetch} />
            <NearYou dataPartners={ props?.dataPartners } processFetch={props?.processFetch} />
        </div>
    );
}

function Popular(props) {
    let data = [];
    
    //partners
    if (props?.processFetch)
        return null;
    for (let i = 0; i < props?.dataPartners?.length; i++) {
        data.push(props.dataPartners[i])
    }

    return(
        <Container style={{ margin: "50px auto 0", fontFamily: "Abhaya Libre", marginTop: 50 }}>
            <Row style={{ marginBottom: 20 }}>
                <h3>Popular Restaurant</h3>
            </Row>
            <Row>
                <CardDeck>
                    {
                        data.map(partner => <RestaurantCard logo={partner?.image} name={partner?.fullname} restId={partner?.id} />)
                    }
                </CardDeck>
            </Row>
        </Container>
    );
}

function NearYou(props) {
    //products
    let data = [];
    
    //partners
    if (props?.processFetch)
        return null;
    for (let i = 0; i < props?.dataPartners?.length; i++) {
        data.push(props.dataPartners[i])
    }
    return(
        <Container style={{ marginTop: 50, paddingBottom: 50 }}>
            <Row style={{ marginBottom: 20 }}>
                <h3 style={{ fontFamily: "Abhaya Libre" }}>Restaurant Near You</h3>
            </Row>
            <Row>
                <CardDeck>
                    {
                        data.map(partner => {
                            if (partner?.products) {
                                return <NearestRestaurantCard img={partner?.products?.image} name={partner?.products?.title} distance="0.6 KM" />
                            } else {
                                return null
                            }
                        })
                    }
                </CardDeck>    
            </Row>
        </Container>
    );
}

export default LandingPage;