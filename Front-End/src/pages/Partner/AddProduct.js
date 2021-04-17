import { useState } from 'react';
import { useMutation } from 'react-query';
import swal from 'sweetalert';
import { Form, Col } from 'react-bootstrap';

import { APIURL } from '../../api/integration';

import FileButton from '../../components/micro/FileButton';

function AddProduct() {
    const [form, setForm] = useState({
        productName: "",
        imgFile: null,
        price: 0
    });
    
    const { productName, imgFile, price } = form;
    
    const onChange = (e) => {
        const tempForm = { ...form };
        tempForm[e.target.name] =
            e.target.type === "file" ? e.target.files[0] : e.target.value;
        setForm(tempForm);
    };
    
    const onSubmit = (e) => {
        e.preventDefault();
        swal("Product added");
    }

    const addProduct = useMutation(async () => {
        const body = new FormData();
    
        body.append("title", productName);
        body.append("price", price)
        body.append("image", imgFile);
    
        const config = {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        };
    
        await APIURL.post("/product", body, config);
        
        setForm({
            productName: "",
            imgFile: null,
            price: 0
        })
    });

    return (
        <div className="form-container" style={{ width: "100%", height: "100vh" }}>
            <div className="form-wrapper d-flex flex-column" style={{ padding: "164px 0 0", margin: "0 auto", width: "80%" }} >
                <span style={{ fontFamily: "'Abhaya Libre'", fontSize: 36, fontWeight: "bold", margin: "0 0 30px 10px" }}>Add Product</span>
                <Form>
                    <Form.Row className="mb-3">
                        <Col md="9">
                            <Form.Control placeholder="Product Name" name="productName" value={productName} onChange={e => onChange(e)} />
                        </Col>
                        <Col>
                            <FileButton onChange={onChange} isEdit={false} />
                        </Col>
                    </Form.Row>
                    <Form.Row>
                        <Col>
                            <Form.Control placeholder="Product Price" value={price} name="price" type="number" onChange={e => onChange(e)}  />
                        </Col>
                    </Form.Row>
                    <Form.Row className="mt-5">
                        <Col md={{ span: 3, offset: 9 }}>
                            <button
                                type="button"
                                onClick={(e) => {
                                    addProduct.mutate();
                                    onSubmit(e);
                                }}
                                className="btn btn-dark"
                                style={{ width: "100%" }}
                                {...addProduct.isLoading ? "disabled" : null}>
                                    {addProduct.isLoading ? "wait..." : "Add Product"}
                                </button>
                        </Col>
                    </Form.Row>
                </Form>
                {addProduct.isError && <p variant="danger" className="mt-3">{ addProduct.error?.response?.data?.message }</p>}
            </div>
        </div>
    )
}

export default AddProduct
