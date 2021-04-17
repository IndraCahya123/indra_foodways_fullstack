import React from 'react'
import {Card} from 'react-bootstrap';

function NearestRestaurantCard(props) {
    return (
        <div>
            <Card>
                <Card.Body style={{padding: 5}}>
                    <img 
                        src={props?.img}
                        alt="Brand Logo"
                        width="100%"
                        height="172px"
                        style={{
                            backgroundSize: "cover",
                            backgroundPosition: "center center"
                        }}
                    />
                    <h6 style={{ fontFamily: "Abhaya Libre", marginTop: 20, marginLeft: 10, fontSize: 18 }}>{props?.name}</h6>
                    <p style={{ fontFamily: "Nunito Sans", marginTop: 3, marginLeft: 10, fontSize: 14 }}>{props?.distance}</p>
                </Card.Body>
            </Card>
        </div>
    )
}

export default NearestRestaurantCard
