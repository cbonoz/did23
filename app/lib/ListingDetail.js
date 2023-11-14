'use client';

import React, { useState, useEffect, Suspense, use } from 'react';
import {
    Button,
    Row,
    Avatar,
    Typography,
    Card,
    Col,
    Spin,
    Divider,
    Modal,
    Input,
    Breadcrumb,
    Result,
    Statistic,
    Tooltip,
    Empty,
} from 'antd';
import Image from 'next/image'
import { ACTIVE_CHAIN, APP_NAME, EXAMPLE_OFFERS, STAT_KEYS } from '../constants';
import { getProfileByHandle, getProfileById } from '../util/lens'
import VerifiedCheck from '../lib/VerifiedCheck';
import { formatDate, getExplorerUrl, isEmpty } from '../util';
import { postVerifyVP } from '../util/api';
import { Comment } from '@ant-design/compatible';
import { InfoCircleOutlined } from '@ant-design/icons';
import TextArea from 'antd/es/input/TextArea';
import { claimProfile, getProfile, sendInquiry } from '../util/profileContract';
import Checkbox from 'antd/es/checkbox/Checkbox';

const ListingDetail = ({ listingId, provider }) => {
    const [loading, setLoading] = useState(true)
    const [modalConfig, setModalConfig] = useState({})
    const [inquireLoading, setInquireLoading] = useState(false)
    const [showClaimModal, setShowClaimModal] = useState(false)
    const [presentation, setPresentation] = useState()
    const [error, setError] = useState()
    const [profile, setProfile] = useState()
    const [amount, setAmount] = useState()
    const [message, setMessage] = useState()
    const [hideMessage, setHideMessage] = useState(false)
    const [result, setResult] = useState()
    // get account from web3

    const verifyPresentation = async () => {
        if (!presentation) {
            return
        }
        setLoading(true)
        try {
            const res = await postVerifyVP(presentation, profile?.handle || listingId)
            console.log('verified', res)
            setShowClaimModal(false)
            if (!res.verified) {
                const err = res.error || 'Is your VP valid for this handle?'
                alert('Account could not be verified: ' + err);
                return;
            }
            await claimProfile(null, listingId)
            setResult({
                verified: true,
                message: "It may take a few moments for the verification status on the page to update"
            })
            // Greedy set.
            setProfile({ ...profile, verified: true })
        } catch (e) {
            console.error('error verifying', e)
            setError(e.message)
        } finally {
            setLoading(false)
        }
    }

    async function fetchListing(id) {
        setError()
        setLoading(true)
        let res = profile || {};
        try {
            if (profile?.handle !== id) {
                res = await getProfileByHandle(id)
                if (isEmpty(res)) {
                    throw new Error('Profile not found. Do you have a valid profile url?')
                }
            }
            try {
                const metadata = await getProfile(signer, id)
                console.log('got metadata', metadata)
                const verified = !!metadata[2];
                res.verified = verified;
            } catch (e) {
                console.error('error getting metadata', e)
                res.verified = false
            }
            console.log('set profile', res)
            setProfile(res);
        } catch (e) {
            console.error('error getting listing', e)
            setError(e.message)
        } finally {
            setLoading(false)
        }
    }

    async function inquire() {
        setError()
        setInquireLoading(true)
        const filteredMessage = hideMessage ? '(hidden)' : message
        try {
            const res = await sendInquiry(signer, listingId, filteredMessage, amount)
            console.log('sent inquiry', res)
            setResult({ hash: res.hash, status: 'Inquiry sent' })
        } catch (e) {
            console.error('error sending inquiry', e)
            setError(e.message)
        } finally {
            setModalConfig({})
            setInquireLoading(false)
        }
    }

    useEffect(() => {
        fetchListing(listingId)
    }, [listingId, signer])

    if (loading) {
        return <Spin size='large' />
    }

    if (error || !profile) {
        return <Result
            status="warning"
            title="Profile page error"
            subTitle={error || 'Please try another handle or return to search'}
            extra={[
                <Button type="primary" key={'refresh page'} onClick={() => setError()}>Return to page</Button>,
                <Button type="dashed" key={'search'} onClick={() => window.location.href = '/'}>Return to search</Button>
            ]}
        />
    }

    const { name, bio, handle, picture, coverPicture, stats } = profile.profile;
    const publications = profile.publications || [];
    const isVerified = profile.verified;

    const cardTitle = `${name} (${handle})`


    const breadcrumbs = [
        {
            title: APP_NAME,
            href: '/'
        },
        {
            title: 'Search Profiles',
            href: '/search'
        },
        {
            title: cardTitle,
            href: `/profile/${listingId}`
        }
    ]

    const RenderContent = ({metadata}) => {
        if (!metadata) {
            return
        }
        if (metadata.content) {
            return <span>{metadata.content}</span>
        }

        if (metadata.image) {
            return <Image src={metadata.image} alt={metadata.name} width={64} height={64}/>
        }
        return <span></span>
    }


    const profileImage = picture ? picture.original.url : '/profile.png'

    return (
        <div className="listing-detail-page">
            <div>
                {/* <Image src={logo}/> */}
            </div>
            <br />
            <Breadcrumb style={{ fontSize: 16 }} items={breadcrumbs} />
            <br />

            <Card
                title={cardTitle}
            // cover={
            //     coverPicture ? (
            //         <Image src={profileImage} width={200} height={200} alt="cover picture" />
            //     ) : null
            // }
            >
                <Row gutter={16}>
                    <Col span={8}>
                        <Image src={profileImage}
                            alt={`${name} profile picture`}
                            layout='fill'
                            objectFit='contain'
                        />
                    </Col>
                    <Col span={16}>
                        <span>
                            <span className='handle-header bold'>{handle}</span>
                            <span className='float-right'>
                                <VerifiedCheck verified={isVerified} />
                            </span>
                        </span>
                        {bio && <Typography.Paragraph>{bio}</Typography.Paragraph>}
                        <Statistic title="Followers" value={stats.totalFollowers} />
                        <Statistic title="Following" value={stats.totalFollowing} />
                        <Statistic title="Posts" value={stats.totalPosts} />
                    </Col>
                </Row>

                <Divider />

                <Row gutter={16}>
                    <Col span={24}>
                        {address && <div>
                            <p>
                                {(isVerified && address) ? <span className="verified-badge success-text">
                                    {/* <Image src="/verified.svg" width={20} height={20} alt="verified" /> */}
                                    This account is verified by {APP_NAME}&nbsp;
                                    <Tooltip className='pointer' title="Verified accounts have been provided a secure identity credential and this page has been confirmed an official handle account by Blockreach">
                                        <InfoCircleOutlined />
                                    </Tooltip>
                                </span> : <span></span>}
                            </p>

                            {!isVerified && <div>
                                <p>
                                    To claim this account, enter a valid Verifiable Presentation (VP) associated with this account. To get one, a {APP_NAME} admin can generate a credential for you.
                                </p>

                                {<span><Button disabled={!address} size="large" type="primary" onClick={() => {
                                    setShowClaimModal(true)
                                }}>Claim account</Button>&nbsp;
                                    {!address && <span className="">Please connect your wallet to claim this account.
                                        {!isVerified && <Tooltip title="Account must be claimed and verified for others to send inquiries">
                                            <InfoCircleOutlined size={"large"} />
                                        </Tooltip>}
                                    </span>}
                                </span>}
                            </div>}
                            <Divider />


                            <Button size="large" type="primary" disabled={!isVerified} onClick={() => {
                                setModalConfig({
                                    type: 'inquiry',
                                })
                            }}>Send inquiry</Button>&nbsp;
                            <Button size="large" type="primary" disabled={!isVerified} onClick={() => {
                                setModalConfig({
                                    type: 'payment',
                                })
                            }}>Submit payment</Button>

                            {result && <div>
                                <Divider />
                                <p>Result</p>
                                {result.hash && <p>
                                    {/* <span className='success-text'>Transaction sent!  </span> */}
                                    <a href={getExplorerUrl(result.hash, true)} target="_blank">View transaction</a>
                                </p>}
                                <pre>{JSON.stringify(result, null, 2)}</pre>
                            </div>}
                        </div>}
                    </Col>

                </Row>
                {address && <Row>
                    <Col span={24}>
                        <br />
                        <br />
                        <h1>Recent Activity</h1>
                        {isEmpty(publications) && <Empty
                            image={Empty.PRESENTED_IMAGE_SIMPLE}
                            description={
                                <span>
                                    No recent web activity found
                                </span>
                            }
                        />}
                        {publications.map((p) => {
                            const { createdAt, metadata, appId } = p
                            if (!metadata) {
                                return
                            }
                            return <div key={p.id}>
                                <Comment content={<RenderContent metadata={metadata}/>} datetime={formatDate(createdAt)} avatar={
                                    <Avatar src={profileImage} alt={metadata.name} />
                                }
                                    author={`${metadata.name} (${appId})`} />
                            </div>
                        })}
                    </Col>
                </Row>}
            </Card>


            {/* TODO: enable offer */}
            <Modal
                title={`Send ${modalConfig.type} to ${handle}`}
                open={!!modalConfig.type}
                okText={`Send ${modalConfig.type}`}
                onOk={inquire}
                confirmLoading={loading || inquireLoading}
                onCancel={() => setModalConfig({})}
            >
                <br />
                <h4 className='success-text'>You can send messages and payments to verified accounts.</h4>
                <br />
                <p className='bold'>Message / Memo</p>
                <TextArea
                    rows={3}
                    placeholder={`Hey ${handle}, interested in exploring a potential collaboration. Contact me at...`}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                />
                <br />
                <br />

                <Checkbox
                    checked={hideMessage}
                    onChange={(e) => setHideMessage(e.target.checked)}
                />
                <span>
                    Hide message on chain
                </span>
                {modalConfig.type === 'payment' && <div>
                    <br />
                    <p className='bold'>[Optional] Send amount with message</p>
                    <Input
                        type="number"
                        placeholder={`Enter amount (${ACTIVE_CHAIN.nativeCurrency.symbol}) to send`}
                        prefix={`Include payment (${ACTIVE_CHAIN.nativeCurrency.symbol}):`}
                        value={amount}
                        onError={(e) => console.log('error', e)}
                        onChange={(e) => setAmount(e.target.value)}
                    />
                </div>}

            </Modal>


            <Modal
                title={'Claim account'}
                open={showClaimModal}
                okText="Claim account"
                size="large"
                onOk={() => verifyPresentation()}
                confirmLoading={loading}
                onCancel={() => setShowClaimModal(false)}>
                <p>
                    To claim this account, enter a valid Verifiable Presentation (VP) associated with this account. To get one, a {APP_NAME} admin can generate a credential for you.
                </p>
                <br />
                <TextArea rows={5} placeholder="Enter VP" value={presentation} onChange={(e) => setPresentation(e.target.value)} />

            </Modal>

        </div>)
};

export default ListingDetail;