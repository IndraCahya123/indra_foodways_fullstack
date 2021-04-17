import { useContext, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useQuery, useMutation } from 'react-query';
import { Table } from 'react-bootstrap';
import swal from 'sweetalert';

import { APIURL } from '../../api/integration';

import { UserContext } from '../../contexts/userContext';
import { CurrentLocationContext } from '../../contexts/currentLocationContext';

import OkStat from '../../images/ok.png';
import Waiting from '../../images/chronometer.png';
import CancelStat from '../../images/cancel.png';

function PartnerLogged() {
    const history = useHistory();
    
    const [stateUser, dispatch] = useContext(UserContext);

    const partnerId = stateUser?.user?.id;

    //get user location
    const [locationContext, dispatchLocation] = useContext(CurrentLocationContext);
    useEffect(async () => {
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
    }, []);

    if (!stateUser.loginStatus) {
        dispatch({ type: "AUTH_ERROR" })
        history.push("/")
    }
    console.log(stateUser);
    const {
        data: transactions,
        isFetching: load,
        refetch
    } = useQuery("getMyTransactionCache", async () => {
        const res = await APIURL.get(`/transactions/${partnerId}`);
        return res.data.data
    });
    return (
        <div className="landing-container w-100" style={{ height: "100vh", paddingTop: 100 }}>
            <div className="table-wrapper" style={{
                width: "80%",
                margin: "0 auto",
                padding: 20
            }}>
                <p style={{ fontFamily: "'Abhaya Libre'", fontSize: 34, marginBottom: 30 }}>Order Transaction</p>
                {
                    transactions?.transactions.length == 0 ? <p>No Transaction</p> :
                        <Table variant="dark" striped bordered hover className="w-100">
                        <thead>
                            <tr>
                                <th>No</th>
                                <th>Customer</th>
                                <th>Total</th>
                                <th>Product</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {transactions?.transactions.map((transaction, index) => {
                                return (
                                    <tr>
                                        <td>{ index + 1 }</td>
                                        <td>{ transaction.customer.fullname }</td>
                                        <td>{ transaction.total }</td>
                                        <td>{
                                            transaction.orders.map(order => order.title)
                                        }</td>
                                        <td><Action transactionId={transaction.id} status={transaction.status} loading={load} refetch={refetch} /></td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </Table>
                }
            </div>
        </div>
    )
}

const Action = (props) => {
    const updateTransaction = useMutation(async (statusBtn) => {
        const config = {
            headers: {
                "Content-Type": "application/json",
            },
        };

        let statusChange = "";

        if (statusBtn == "accept") {
            statusChange += "On The Way"
        } else if (statusBtn == "decline") {
            statusChange += "Cancelled"
        } else {
            return null;
        }

        const body = JSON.stringify({
            status: statusChange
        })

        await APIURL.patch(`/transaction/${props.transactionId}`, body, config);

        successUpdate(statusBtn);
    });

    const successUpdate = (status) => {
        if (updateTransaction.isError) {
            swal("Something Wrong", "Maaf transaksi belum bisa diproses", "warning");
        } else {
            if (status == "accept") {
                swal("Transaction Accepted", "Silahkan untuk menyiapkan pesanan yang sudah di pesan", "success").then(() => props.refetch());
            } else {
                swal("Transaction Declined", "Transaksi telah dibatalkan", "success").then(() => props.refetch());
            }
        }
    }

    switch (props.status) {
        case "waiting Approval":
            return (
                <>
                    <button type="button" onClick={async () => updateTransaction.mutate("decline")} className="btn-sm btn-danger">decline</button>
                    <button type="button" onClick={async () => updateTransaction.mutate("accept")} className="btn-sm btn-success">accept</button>
                </>
            );
        case "On The Way":
            return (
                <>
                    {props.loading ? "Load.." :
                        <img
                            width="20px"
                            height="20px"
                            src={Waiting}
                            alt="on the way"
                        />
                    }
                </>
            )
        case "Finished":
            return (
                <>
                    {props.loading ? "Load.." :
                        <img
                            width="20px"
                            height="20px"
                            src={OkStat}
                            alt="on the way"
                        />
                    }
                </>
            )
        case "Declined":
            return (
                <>
                    {props.loading ? "Load.." :
                        <img
                            width="20px"
                            height="20px"
                            src={CancelStat}
                            alt="on the way"
                        />
                    }
                </>
            )
    
        default:
            return null;
    }
}

export default PartnerLogged
