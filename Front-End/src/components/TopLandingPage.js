import React from 'react'
import Pizza from '../images/pizza.png';

function TopLandingPage() {
    return (
        <div style={{backgroundColor: "#FFC700"}}>
            <div className="top-wrapper d-flex" style={{ width: 995, padding: "120px 0 40px", margin: "0 auto" }}>
                <div className="top-text" style={{ marginTop: 55 }}>
                    <p style={{ fontFamily:  "'Abhaya Libre', serif", fontSize: 55}}>Are You Hungry ?</p>
                    <p style={{ fontFamily:  "'Abhaya Libre', serif", fontSize: 55}} >Express Home Delivery.</p>
                    <div className="top-text-secondary d-flex" style={{ marginTop: 28 }}>
                        <hr style={{ width: 150, height: 3, background: "black", marginTop: 7, marginRight: 26 }} />
                        <p style={{ width: 274, fontSize: 14, fontFamily: "'Nunito Sans', sans-serif", fontWeight: "400" }}>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
                    </div>
                </div>
                <div className="top-image" style={{ marginLeft: 26 }}>
                    <img
                        src={Pizza}
                        alt="Landing Page Logo"
                        width="400px"
                        height="400px"
                    />
                </div>
            </div>
        </div>
    );
}

export default TopLandingPage;
