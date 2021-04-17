import { useState, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { useMutation } from 'react-query';
import { Modal, Form, Button } from 'react-bootstrap';
import swal from 'sweetalert';

import { UserContext } from '../../contexts/userContext';
import { ModalContext } from '../../contexts/modalContext';

import { APIURL, setAuthToken } from '../../api/integration';

function ModalLogin() {
    const [stateModalContext, dispatchModal] = useContext(ModalContext);
    const [stateUserContext, dispatchUser] = useContext(UserContext);

    const history = useHistory();

    const changeToRegister = () => {
        dispatchModal({
            type: "CHANGE_TO_REGISTER"
        });
    }

    const [formValues, setFormValues] = useState({
        email: '',
        password: ''
    });

    const handleFormLoginChange = event => {
        const {name, value} = event.target;
        setFormValues({
            ...formValues,
            [name]: value
        });
    }

    //get user with react query
    const userLogin = useMutation("userLoginCache",
        async () => {
            const header = {
                headers: {
                "Content-Type": "application/json",
                },
            };
        
            const body = JSON.stringify({
                email : formValues.email,
                password : formValues.password,
            });

            const response = await APIURL.post("/login", body, header);

            handleLoginSubmit(response)
        }
    )

    const closeModal = () => dispatchModal({ type: "CLOSE_LOGIN" });

    const handleLoginSubmit = (res) => {
        dispatchUser({
            type: "LOGIN",
            payload: res.data.data
        });
        closeModal();
        
        setAuthToken(res.data.data.user.token);

        if (res.data.data.user.role == "partner") {
            history.push("/partner");
            dispatchUser({ type: "IS_LOGGED" });
        } else {
            history.push("/");
            dispatchUser({ type: "IS_LOGGED" });
        }
    }
    
    return (
        <Modal
            show={stateModalContext.showedLogin}
            onHide={
                () =>
                    dispatchModal({
                    type: "CLOSE_LOGIN"
                })
            }
            size="sm"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Body>
                <Modal.Title id="contained-modal-title-vcenter" className="mb-4" style={{ color: "#FFC700", fontFamily: "'Abhaya Libre'", fontWeight: "900", fontSize: 36, letterSpacing: 2 }}>
                    Login
                </Modal.Title>
                {userLogin.isError && <p className="text-danger mb-2">{ userLogin.error?.response?.data?.message }</p> }
                <Form>
                    <Form.Group controlId="emailLogin">
                        <Form.Control type="email" name="email" placeholder="Enter Your Email" value={formValues.email} onChange={handleFormLoginChange} />
                    </Form.Group>
                    <Form.Group controlId="passwordLogin">
                        <Form.Control type="password" name="password" placeholder="Enter Your Password" value={formValues.password} onChange={handleFormLoginChange} />
                    </Form.Group>
                    <Button variant="dark" onClick={() =>
                        userLogin.mutate()
                    } style={{ width: "100%", marginTop: 20 }}>
                        {userLogin.isLoading ? "Wait.." : "Login"}
                    </Button>
                </Form>
                <p style={{ color: "#B1B1B1", fontFamily: "'Nunito Sans'", textAlign: "center", marginTop: 10, marginBottom: 0 }}>Don't Have an Account ? Click <span style={{ fontWeight: "Bolder", cursor: "pointer" }} onClick={changeToRegister}>Here</span></p>
            </Modal.Body>
        </Modal>
    );
}

export default ModalLogin
