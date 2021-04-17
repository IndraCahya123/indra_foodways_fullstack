import {createContext, useReducer} from 'react';

export const CurrentLocationContext = createContext();

const initialValues = {
    latitude: 0,
    longitude: 0,
    setNew: false,
    processLoad: true,
};

const reducer = (state, action) => {
    //action params
    const {type, payload} = action;

    switch (type) {
        case "LOAD_LOCATION":
            return {
                ...state,
                processLoad: true,
            }
        case "LOAD_SUCCESS":
            return {
                ...state,
                processLoad: false,
            }
        
        case "SET_MY_LOCATION":
            return {
                ...state,
                latitude: payload.latitude,
                longitude: payload.longitude,
                processLoad: false,
            };
        
        case "SET_MY_NEW_LOCATION":
            return {
                ...state,
                latitude: payload.latitude,
                longitude: payload.longitude,
                setNew: true,
            };
        case "SUCCESS_SET_NEW_LOCATION":
            return {
                ...state,
                setNew: false,
                processLoad: false
            }
    
        default:
            throw new Error();
    }
}

export const CurrentLocationContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initialValues);

    return (
        <CurrentLocationContext.Provider value={[state, dispatch]} >
            {children}
        </CurrentLocationContext.Provider>
    );
} 