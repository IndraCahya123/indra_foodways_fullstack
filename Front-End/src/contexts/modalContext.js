import {createContext, useReducer} from 'react';

export const ModalContext = createContext();

const initialValues = {
    showedLogin: false,
    showedRegister: false,
    showedMaps: false,
};

const reducer = (state, action) => {
    //action params
    const { type } = action;

    switch (type) {
        case "SHOW_LOGIN":
            return {
                ...state,
                showedLogin: true
            };
        case "SHOW_REGISTER":
            return {
                ...state,
                showedRegister: true
            };
        case "CLOSE_LOGIN":
            return {
                ...state,
                showedLogin: false
            };
        case "CLOSE_REGISTER":
            return {
                ...state,
                showedRegister: false
            }
        case "CHANGE_TO_REGISTER":
            return {
                ...state,
                showedLogin: false,
                showedRegister: true,
            }
        case "CHANGE_TO_LOGIN":
            return {
                ...state,
                showedLogin: true,
                showedRegister: false,
            }
        case "SHOW_MAP":
            return {
                ...state,
                showedMaps: true,
            }
        case "CLOSE_MAP":
            return {
                ...state,
                showedMaps: false,
            }
    
        default:
            throw new Error();
    }
}

export const ModalContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initialValues);

    return (
        <ModalContext.Provider value={[state, dispatch]} >
            {children}
        </ModalContext.Provider>
    );
} 