import { createContext, useReducer } from 'react';

export const StatusBoxMapContext = createContext();

const initialValues = {
    setLocation: false,
    checkoutOrderStatus: false,
    waitApprovalStatus: false,
    onTheWayStatus: false,
}

const reducer = (state, action) => {
    const { type } = action;

    switch (type) {
        case "SET_LOCATION_BUTTON":
            return {
                ...state,
                setLocation: true,
            };
        case "CHECKOUT_BUTTON":
            return {
                ...state,
                setLocation: false,
                checkoutOrderStatus: true,
            };
        case "CHECKOUT_ORDERS":
        case "WAITING_APPROVAL":
            return {
                ...state,
                setLocation: false,
                checkoutOrderStatus: false,
                waitApprovalStatus: true
            };
        case "APPROVED":
            return {
                ...state,
                checkoutOrderStatus: false,
                waitApprovalStatus: false,
                onTheWayStatus: true,
            };
        case "ORDER_FINISHED":
            return {
                ...state,
                checkoutOrderStatus: true,
                waitApprovalStatus: false,
                onTheWayStatus: false,
            };
    
        default:
            throw new Error();
    }
}

export const StatusBoxMapContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initialValues);

    return (
        <StatusBoxMapContext.Provider value={[state, dispatch]}>
            {children}
        </StatusBoxMapContext.Provider>
    );
}