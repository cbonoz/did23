'use client';

import { Button, Card, Divider, Input } from 'antd';
import { useEffect, useState } from 'react';
import { APP_NAME } from '../constants';
import { postGenerateDid, postGenerateVC } from '../util/api';
import { createMetadataForHandle, getMetadataForHandle } from '../util/tbd';
import { useDidContext } from '../context/DidProvider';

export default function Admin() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState();
    const [handle, setHandle] = useState();
    const [email, setEmail] = useState();
    const [holderDid, setHolderDid] = useState();
    const [result, setResult] = useState({});

    const { did, web5 } = useDidContext();

    const updateResult = (key, value) => {
        setResult({ ...result, [key]: value });
    };

    async function createDid() {
        if (!handle) {
            alert('Please enter a Lens handle');
            return;
        }

        setLoading(true);

        let metadata;
        let res = {};
        try {
            metadata = await getMetadataForHandle(web5, handle);
            if (metadata) {
                console.log(
                    'Metadata already exists for this handle: ' + handle,
                    metadata
                );
                res['metadata'] = metadata;
            } else {
                res = await postGenerateDid(handle, email);
                res = await createMetadataForHandle(web5, handle);
                console.log('generated', res);
                metadata = await getMetadataForHandle(web5, handle);
                // res['metadata'] = res;
            }
            updateResult('did', metadata);
        } catch (e) {
            console.error('generating did', e);
            setError(e.message);
        } finally {
            setLoading(false);
        }
    }

    async function generate() {
        setLoading(true);
        try {
            const res = await postGenerateVC(handle, holderDid);
            console.log('generated', res);
            updateResult('vc', res);
        } catch (e) {
            console.error('generating vc', e);
            // setError(e.message)
        } finally {
            setLoading(false);
        }
        // alert('TODO: generate verified credential for handle')
    }

    if (!did) {
        return <p>Connect DID with an admin account to continue</p>;
    }

    return (
        <div className="admin-page">
            <h1>Admin</h1>
            <br></br>
            <p>
                This page contains admin utilities for the {APP_NAME}{' '}
                application.
            </p>

            <Divider />

            <Card title="2. Generate DID (issuer and holder) keys">
                <p>
                    This will generate a new DID associated with the handle
                    below.
                </p>

                <Input
                    value={handle}
                    size="large"
                    className="standard-padding standard-margin"
                    onChange={(e) => setHandle(e.target.value)}
                    placeholder="Enter entity (business or individual) lens handle"
                    style={{ width: 400 }}
                />

                {/* Email input */}
                <br />
                <Input
                    value={email}
                    size="large"
                    className="standard-padding standard-margin"
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter entity email address"
                    style={{ width: 400 }}
                />

                {/* <Input
                value={handle}
                size='large'
                className='standard-padding standard-margin'
                onChange={(e) => setHandle(e.target.value)}
                placeholder="Enter entity or individual lens handle"
                style={{ width: 400 }} /> */}

                <br />
                <Button
                    type="primary"
                    disabled={loading}
                    loading={loading}
                    onClick={createDid}
                >
                    Generate DID{' '}
                </Button>

                {result.did && (
                    <div>
                        <Divider />
                        <p>Result</p>
                        <pre>{JSON.stringify(result.did, null, 2)}</pre>
                    </div>
                )}
            </Card>

            <br />

            <Card title="3. Generate Verified Credentials (VC) and signed presentation (VP) for a new handle owner">
                <p>
                    This will generate a verified credential for the given
                    handle using the {APP_NAME} issuer key. This should be
                    shared with the business/entity handle owner.
                </p>
                {/* <Input
                value={handle}
                size='large'
                className='standard-padding standard-margin'
                onChange={(e) => setHandle(e.target.value)}
                placeholder="Enter entity or individual lens handle"
                style={{ width: 400 }} /> */}

                {/* holder */}
                <br />
                <Input
                    value={holderDid}
                    size="large"
                    className="standard-padding standard-margin"
                    onChange={(e) => setHolderDid(e.target.value)}
                    placeholder="Enter holder DID"
                    style={{ width: 400 }}
                />

                <br />
                <br />
                <Button
                    type="primary"
                    disabled={loading || !handle || !holderDid}
                    loading={loading}
                    onClick={generate}
                >
                    Generate
                </Button>

                {result.vc && (
                    <div
                        style={{
                            whiteSpace: 'pre-wrap',
                            wordWrap: 'break-word',
                        }}
                    >
                        <Divider />
                        <span>Copy and share the below VC and VP.</span>
                        <br />
                        <p>Result</p>
                        {JSON.stringify(result.vc, null, 2)}
                    </div>
                )}
            </Card>
        </div>
    );
}
