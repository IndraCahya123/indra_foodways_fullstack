import { useContext, useState, useEffect } from 'react';
import { useQuery, useMutation } from 'react-query';
import { useHistory } from 'react-router-dom';
import swal from 'sweetalert';
import axios from 'axios';
import { Form, Col, } from 'react-bootstrap';

import { ModalContext } from '../contexts/modalContext';
import { StatusBoxMapContext } from '../contexts/statusBoxMapContext';
import { CurrentLocationContext } from '../contexts/currentLocationContext';
import { UserContext } from '../contexts/userContext';

import { APIURL } from '../api/integration';

import { locToObj } from '../util/locationStringToObj';

import ModalMaps from '../components/Modal/ModalMaps';
import FileButton from '../components/micro/FileButton';

import MapsIcon from '../images/maps.png';

const EditProfile = (props) => {
    const history = useHistory();
    const [stateMaps, dispatchMaps] = useContext(ModalContext);
    const [states, dispatchStatus] = useContext(StatusBoxMapContext);
    const [currentLocation, setNewLocation] = useContext(CurrentLocationContext);
    const [editUser, resetAfterEdit] = useContext(UserContext);

    
    const [loc, setNewLoc] = useState("");

    const [formEdit, setFormEdit] = useState({
        id: "",
        fullname: "",
        email: "",
        phone: "",
        location: ``,
        imgFile: null,
    });

    const [loadMap, setLoadMap] = useState(true);
    const [loadData, setData] = useState(true);

    //get user data
    const getUserData = async () => {
        const res = await APIURL.get("/user");

        const data = res.data.data;
        
        setFormEdit({
            ...formEdit,
            id: data.user.id,
            fullname: data.user.fullname,
            email: data.user.email,
            phone: data.user.phone,
            location: data.user.location,
            imgFile: data.user.image
        });

        if (data.user.location == "") {
            await navigator.geolocation.getCurrentPosition(pos => {
                setNewLocation({
                    type: "SET_MY_LOCATION",
                    payload: {
                        latitude: pos.coords.latitude,
                        longitude: pos.coords.longitude
                    }
                });
                setNewLoc(`${pos.coords.latitude},${pos.coords.longitude}`);
                myAdress(pos.coords.latitude, pos.coords.longitude);
            }, err => {
                console.log(err);
            }, { enableHighAccuracy: true });
        } else {
            setNewLoc(data.user.location);
            const setInitialLoc = locToObj(data.user.location);
            myAdress(setInitialLoc.latitude, setInitialLoc.longitude);
        }
        setData(false);
    }

    
    //handle map
    const [address, setAddress] = useState("");
    
    const myAdress = async (lat, long) => {
        await axios.get(`http://api.positionstack.com/v1/reverse?access_key=cfb5b411b150ee888fe2dcd72d3676a9&query=${lat},${long}`)
            .then(response => {
                setAddress(response.data.data[0].label);
                setNewLoc(`${lat},${long}`);
                setLoadMap(false);
            }).catch(error => {
                console.log(error);
            });
    }

    console.log(loc);

    useEffect(() => {
        getUserData();
    }, []);

    if (currentLocation.setNew == true) {
        myAdress(currentLocation.latitude, currentLocation.longitude);
        setNewLocation({
            type: "SUCCESS_SET_NEW_LOCATION"
        })
    }

    //handle edit

    const onChange = (e) => {
        const tempForm = { ...formEdit };
        tempForm[e.target.name] =
            e.target.type === "file" ? e.target.files[0] : e.target.value;
        setFormEdit(tempForm);
    };
    
    const onSubmit = () => {
        editProfile.mutate();
        if (editProfile.isError) {
            swal("There's error", "error")
        } else {
            swal("Profile Updated").then(() => {
                resetAfterEdit({
                    type: "IS_EDITED",
                    payload: formEdit
                })
                history.push("/profile");
            });
        }
    }

    const editProfile = useMutation(async () => {
        const body = new FormData();
    
        body.append("fullname", formEdit.fullname);
        body.append("location", loc);
        body.append("email", formEdit.email);
        body.append("phone", formEdit.phone);
        body.append("image", formEdit.imgFile);
    
        const config = {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        };
    
        await APIURL.patch(`/user/${formEdit.id}`, body, config);
    });

    return (
        <div className="form-container" style={{ width: "100%", height: "100vh", paddingTop: 120 }}>
            <div style={{ width: "80%", margin: "0 auto" }}>
                <p>Edit Profile</p>
                <Form>
                    <Form.Row className="mb-3">
                        <Col md="9">
                            <Form.Control type="text" name="fullname" value={loadData ? "load..." : formEdit.fullname} placeholder="Name" onChange={e => onChange(e)} />
                        </Col>
                        <Col md="3">
                            <FileButton isEdit={true} onChange={onChange} />
                        </Col>
                    </Form.Row>
                    <Form.Row className="mb-3">
                        <Col>
                            <Form.Control type="email" value={loadData ? "load..." : formEdit.email} name="email" placeholder="Email" onChange={e => onChange(e)} />
                        </Col>
                    </Form.Row>
                    <Form.Row className="mb-3">
                        <Col>
                            <Form.Control type="text" name="phone" value={loadData ? "load..." : formEdit.phone} placeholder="Phone Number" onChange={e => onChange(e)} />
                        </Col>
                    </Form.Row>
                    <Form.Row className="mb-3">
                        <Col md="9">
                            <Form.Control type="text" name="address" placeholder="Set Location" value={ loadMap ? "load..." : address } disabled/>
                        </Col>
                        <Col md="3">
                            <button type="button" className="btn btn-dark w-100"
                                onClick={() => {
                                    dispatchMaps({ type: "SHOW_MAP" });
                                    dispatchStatus({ type: "SET_LOCATION_BUTTON" })
                                }}
                            >Select On Map <img src={MapsIcon} alt="Select Location Icon" /> </button>
                        </Col>
                    </Form.Row>
                    <Form.Row className="mt-5">
                        <Col md={{ span: "4", offset: "8" }}>
                            <div className="d-flex justify-content-end">
                                <button type="button" onClick={() => onSubmit() } className="btn btn-dark" style={{ width: "80%" }}>Save</button>
                            </div>
                        </Col>
                    </Form.Row>
                </Form>
                {editProfile.isError && <p variant="danger" className="mt-3">{ editProfile.error?.response?.data?.message }</p>}
            </div>
            <ModalMaps longLat={locToObj(loc)} partnerLoc={{latitude: 0, longitude: 0}} />
        </div>
    )
}

export default EditProfile

