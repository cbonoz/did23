// context/DidContext.js
'use client';

import { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { Web5 } from '@web5/api';
import { humanError } from '../util';

const DidContext = createContext({
    did: null,
    web5: null,
    logout: () => {},
    connect: () => {},
});

var web5;

const setWeb5 = (w) => {
    web5 = w;
};

export const DidProvider = ({ children }) => {
    // const [web5, setWeb5] = useState(null);
    const [did, setDID] = useState(null);

    async function connect(did) {
        if (web5) {
            return;
        }
        const storedDID = localStorage.getItem('did') || did;
        let res;
        try {
            // if (storedDID) {
            //     try {
            //         res = await Web5.connect({
            //             connectedDid: storedDID,
            //         });
            //     } catch (e) {
            //         console.error('error connecting with stored did', e);
            //         localStorage.removeItem('did');
            //     }
            // }
            if (!res) {
                res = await Web5.connect();
            }
            console.log('init', storedDID, res);
            localStorage.setItem('did', res.did);
            setWeb5(res.web5);
            setDID(res.did);
        } catch (e) {
            localStorage.removeItem('did');
            console.error('error', e);
            alert('Error connecting: ' + humanError(e));
        }
    }

    useEffect(() => {
        console.log('init did context');
        if (!web5) {
            connect();
        }
    }, []);

    const logout = () => {
        localStorage.removeItem('did');
        setDID(null);
        setWeb5(null);
    };

    return (
        <DidContext.Provider
            value={{
                did,
                web5,
                connect,
                logout,
            }}
        >
            {children}
        </DidContext.Provider>
    );
};

export const useDidContext = () => {
    return useContext(DidContext);
};
