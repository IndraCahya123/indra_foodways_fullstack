import {createContext, useReducer} from 'react';

export const GlobalRefetch = createContext();

const initialValues = {
    fetching: false
};

const reducer = (state, action) => {
    //action params
    const { type } = action;

    switch (type) {
        case "PROCESS_FETCHING":
            return {
                ...state,
                fetching: true
            };
        case "SUCCESS_FETCHING":
            return {
                ...state,
                fetching: false
            };
        
        default:
            throw new Error();
    }
}

export const GlobalRefetchProvider = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initialValues);

    return (
        <GlobalRefetch.Provider value={[state, dispatch]} >
            {children}
        </GlobalRefetch.Provider>
    );
} 