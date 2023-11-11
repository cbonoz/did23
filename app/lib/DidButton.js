'use client'

import { useState } from "react";
import { Button } from "antd";
import { Web5 } from "@web5/api";


const DidButton = ({ children, ...props }) => {

    const [loading, setLoading] = useState(false)

    const connect = async () => {
        setLoading(true)
        try {
        const {web5, did} = await Web5.connect();
        console.log('web5', web5, did);
        } catch (error) {
        console.error('error', error)
        } finally {
        setLoading(false)
        }
    }

    return (
        <Button type='primary' {...props} onClick={connect} loading={loading} disabled={loading}>
        {children}
        </Button>
    );
}
export default DidButton;