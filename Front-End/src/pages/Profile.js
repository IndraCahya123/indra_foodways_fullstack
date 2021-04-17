import { useContext } from 'react';
import { useHistory } from 'react-router-dom';

import { APIURL } from '../api/integration';

import { UserContext } from '../contexts/userContext';

import LeftContent from '../components/ProfileLeftContent';
import RightContent from '../components/ProfileRightContent';
import { useQuery } from 'react-query';

function Profile() {
    const history = useHistory()

    const [state] = useContext(UserContext);

    const {
        data: myTransaction,
        isFetching: load,
        refetch
    } = useQuery("getMyTransactionCache", async () => {
        const res = await APIURL.get("/my-transactions");
        return res.data.data
    });

    if (state.user?.role === "user") {

        return (
            <div className="d-flex justify-content-between" style={{ width: "80%", margin: "0 auto", padding: "164px 0 400px" }}>
                <LeftContent userRole="My Profile" selectedUser={ state.user?.id }/>
                <RightContent transaction={myTransaction} isLoad={ load } refetch={refetch}/>
            </div>
        )
    } else if (state.user?.role === "partner") {
        return (
            <div className="d-flex justify-content-between" style={{ width: "80%", margin: "0 auto", padding: "164px 0 400px" }}>
                <LeftContent userRole="Partner Profile" selectedUser={ state.user?.id }/>
                <RightContent nameTransaction="Indra Cahya Bali" day="Friday" date="12 Maret 2021" total="24.000"/>
            </div>
        )
    } else {
        history.goBack();
    }
    
}

export default Profile
