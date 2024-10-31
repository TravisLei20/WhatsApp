import { createContext, useReducer, useContext } from 'react';
import reducer, { initialState } from './StateReducers'; // Ensure correct import

export const StateContext = createContext();

export const StateProvider = ({ children }) => (
    <StateContext.Provider value={useReducer(reducer, initialState)}>
        {children}
    </StateContext.Provider>
);

export const useStateProvider = () => useContext(StateContext);