import { createContext, useEffect, useReducer } from 'react';

const initialState = {
    user: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null,
    loading: false,
    error: null,
};

export const AuthContext = createContext(initialState);

const authReducer = (state, action) => {
    switch (action.type) {
        case 'LOGIN_START':
            return {
                ...state,
                user: null,
                loading: true,  // Correct, loading should be true here
                error: null,
            };
        case 'LOGIN_SUCCESS':
            return {
                ...state,
                user: action.payload,
                loading: false,
                error: null,
            };
        case 'LOGIN_FAILURE': // Corrected typo
            return {
                ...state,
                user: null,
                loading: false,
                error: action.payload,
            };
        case 'REGISTER_SUCCESS':
            return {
                ...state,
                user: action.payload, // Set the user after successful registration
                loading: false,
                error: null,
            };
        case 'LOGOUT':
            return {
                ...state,
                user: null,
                loading: false,
                error: null,
            };
        case 'UPDATE_USER':
            return {
                ...state,
                user: { ...state.user, ...action.payload },
                loading: false,
                error: null,
            };
        default:
            return state;
    }
};

export const AuthContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(authReducer, initialState);

    useEffect(() => {
        if (state.user) {
            localStorage.setItem('user', JSON.stringify(state.user));
        } else {
            localStorage.removeItem('user'); 
        }
    }, [state.user]);

    return (
        <AuthContext.Provider value={{
            user: state.user,
            loading: state.loading,
            error: state.error,
            dispatch,
        }}>
            {children}
        </AuthContext.Provider>
    );
};