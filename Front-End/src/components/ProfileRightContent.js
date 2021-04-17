import {useContext} from 'react';
import toRupiah from '@develoka/angka-rupiah-js';

import { ModalContext } from '../contexts/modalContext';
import { StatusBoxMapContext } from '../contexts/statusBoxMapContext';
import { CurrentLocationContext } from '../contexts/currentLocationContext';

import ModalMaps from './Modal/ModalMaps';

import Brand from '../images/fw_logo.png';

import { locToObj } from '../util/locationStringToObj';

function ProfileRightContent(props) {
    return (
        <div className="d-flex flex-column" style={{ borderRadius: 5, width: "420px" }}>
            <p style={{ fontFamily: '"Abhaya Libre"', fontWeight: "bold", fontSize: 36 }}>History Transaction</p>
            {
                props.isLoad ? <p>Load..</p> :
                    ( props.transaction == undefined ? <p>No transaction</p> :
                    props.transaction.transactions.map((myTransaction, index) => {
                        return <TransactionCard myTransaction={myTransaction} index={myTransaction.id} isLoad={props.isLoad} refetch={props.refetch} />
                    }))
            }
        </div>
    )
}

const TransactionCard = (props) => {
    const [modalState, setModal] = useContext(ModalContext);
    const [statusBox, setStatusBox] = useContext(StatusBoxMapContext);
    console.log(props.myTransaction.customerLoc, props.index);

    const openMap = () => {
        setModal({
            type: "SHOW_MAP"
        });
    }

    const statusOrder = (status) => {
        switch (status) {
            case "waiting Approval":
                setStatusBox({
                    type: "WAITING_APPROVAL"
                })
                openMap();
                break;
            case "On The Way":
                setStatusBox({
                    type: "APPROVED"
                })
                openMap();
                break;
            case "Finished":
                break;
        
            default:
                break;
        }
    }
    return (
        <>
        <div onClick={() => statusOrder(props?.myTransaction?.status)} className="history-card d-flex justify-content-between" style={{ cursor: "pointer", backgroundColor: "#fff", padding: "10px 20px", marginBottom: 15 }}>
            <div className="detail-transaction d-flex flex-column">
                <img
                    src={props?.myTransaction?.restaurant?.image}
                    alt="Partner Logo"
                    height="40px"
                    width="40px"
                    style={{ borderRadius: "50%", margin: "0 auto" }}
                />
                <span style={{ fontFamily: "'Abhaya Libre'", fontSize: 14, textAlign: "center" }}>{props?.myTransaction?.restaurant?.fullname}</span>
                <span style={{ fontFamily: "'Nunito Sans'", fontSize: 9, marginTop: 10 }}>{props?.myTransaction?.currentDate}</span>
                <span style={{ fontSize: 10, fontFamily: "'Nunito Sans'", fontWeight: "bold", color: "#974A4A" }}>{ toRupiah(props?.myTransaction?.total, {formal: false}) }</span>
            </div>
            <div className="logo-trancsaction d-flex flex-column justify-content-center h-100">
                <div className="brand">
                    <span style={{ fontSize: 23, fontFamily: "'Barlow Condensed'", fontStyle: "italic" }}>WaysFood</span>
                    <img 
                        src={Brand}
                        alt="Brand Logo"
                        width="35px"
                        height="35px"
                    />
                </div>
                {
                    props.isLoad ? "load.." : 
                    (props?.myTransaction?.status == "waiting Approval" ?
                    <button className="btn-sm" style={{ width: 112, background: "cyan", fontSize: 10, color: "#000", border: "none", marginTop: 10 }}>{ props?.myTransaction?.status }</button>
                    :
                    (props?.myTransaction?.status == "Finished" ?
                        <button className="btn-sm" style={{ width: 112, background: "red", fontSize: 10, color: "#000", border: "none", marginTop: 10 }}>{props?.myTransaction?.status}</button>
                        :
                        <button className="btn-sm" style={{ width: 112, background: "linear-gradient(180deg, #00FF75 0%, #00FF85 100%)", fontSize: 10, color: "#000", border: "none", marginTop: 10 }}>{props?.myTransaction?.status}</button>)
                    )
                }
            </div>
        </div>
            <ModalMaps longLat={locToObj(props.myTransaction.customerLoc)} status={props?.myTransaction?.status} partnerLoc={locToObj(props?.myTransaction?.restaurantLoc)} index={ props.index } refetch={props.refetch}/>
            </>
    )
}

export default ProfileRightContent
