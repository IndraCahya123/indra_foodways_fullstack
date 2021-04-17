import { createContext, useReducer } from 'react';

export const UserContext = createContext();

const initialValues = {
    loginStatus: false,
    user: null,
    loading: true,
};

const reducer = (state, action) => {
    //action params
    const {type, payload} = action;

    switch (type) {
        case "AUTH_SUCCESS":
        case "REGISTER":
        case "LOGIN":
            //set Token to local storage
            localStorage.setItem("token", payload.user.token);
            
            return {
                ...state,
                loginStatus: true,
                user: payload.user,
                loading: false,
            };
        case "AUTH_ERROR":
        case "LOGOUT":
            localStorage.removeItem("token")
            return {
                ...state,
                loginStatus: false,
                loading: true
            }
        
        case "IS_LOGGED":
        case "IS_EDITED":
            return {
                ...state,
                loading: true
            };
            
        case "SUCCESS_EDIT":
            return {
                ...state,
                loading: false
            };
    
        default:
            throw new Error();
    }
}

export const UserContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initialValues);

    return (
        <UserContext.Provider value={[state, dispatch]} >
            {children}
        </UserContext.Provider>
    );
} 