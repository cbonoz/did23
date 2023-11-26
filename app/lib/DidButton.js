'use client'

import { useEffect, useState } from "react";
import { Button, Modal } from "antd";
import { abbreviate } from "../util";
import { useDidContext } from "../context/DidProvider";


const DidButton = ({ children, useExisting }) => {
    const [loading, setLoading] = useState();
    const { connect, logout, did } = useDidContext()

    const login = async (newDid) => {
        setLoading(true)
        try {
            await connect(newDid)

        } catch (error) {
            console.error('error', error)
        } finally {
            setLoading(false)
        }
    }

    if (did) {
        return (
            <span>
                {abbreviate(did, 12)}&nbsp;
                <Button type='primary' onClick={logout} loading={loading} disabled={loading}>
                    Logout
                </Button>
            </span>
        )
    }

    return (<span>
        <Button type='primary' onClick={login} loading={loading} disabled={loading}>
            Signin
        </Button>&nbsp;
    </span>

    );
}
export default DidButton;
