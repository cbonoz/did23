// context/DidContext.js
'use client'

import { createContext, useContext, useState, useEffect, useMemo } from "react";
import { Web5 } from "@web5/api";

const DidContext = createContext({
    did: null,
    web5: null,
    logout: () => { }
});

export const DidProvider = ({ children }) => {
    const [web5, setWeb5] = useState(null);
    const [did, setDID] = useState(null);

    async function connect(did) {

        const storedDID = localStorage.getItem("did") || did;
        console.log('init', storedDID)
        let res;
        try {
            if (storedDID) {
                res = await Web5.connect({
                    agent: null,
                    connectedDid: storedDID,
                });
            } else {
                res = await Web5.connect();
            }
            localStorage.setItem("did", res.did);
            setWeb5(res.web5);
            setDID(res.did);
        } catch (e) {
            localStorage.removeItem("did");
            console.error('error', e)
            alert('Error connecting')
        }
    }

    useEffect(() => {
        connect();
    }, []);

    const logout = () => {
        localStorage.removeItem("did");
        setDID(null);
        setWeb5(null);
    }

    const createNewDid = async (type) => {
        return 
    }

    return (
        <DidContext.Provider
            value={{
                did,
                web5,
                connect,
                logout
            }}
        >
            {children}
        </DidContext.Provider>
    );
};

export const useDidContext = () => {
    const context = useContext(DidContext);
    return context;
};
