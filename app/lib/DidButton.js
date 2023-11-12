'use client'

import { useState } from "react";
import { Button, Modal } from "antd";
import { Web5 } from "@web5/api";


const DidButton = ({ children, useExisting }) => {
    const [loading, setLoading] = useState(false)
    const [connectedDid, setConnectedDid] = useState(localStorage.getItem('connectedDid'));

    const connect = async () => {
        setLoading(true)
        let res
        try {
            if (useExisting && connectedDid) {
                res = await Web5.connect({
                    agent: null,
                    connectedDid
                });
            } else {
                res = await Web5.connect();
            }

            let { web5, did } = res;
            localStorage.setItem('connectedDid', did)
            console.log('web5', null, did);
        } catch (error) {
            console.error('error', error)
        } finally {
            setLoading(false)
        }
    }

    const logout = () => {
        localStorage.removeItem('connectedDid')
        setConnectedDid(null)
    }

    if (connectedDid) {
        return
    }

    return (

        <Button type='primary' {...props} onClick={connect} loading={loading} disabled={loading}>
            {children}
        </Button>
    );
}
export default DidButton;