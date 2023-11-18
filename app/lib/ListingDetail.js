'use client';

import React, { useState, useEffect, Suspense } from 'react';
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
    Breadcrumb,
    Result,
    Statistic,
    Tooltip,
    Empty,
    Tabs,
    Rate,
} from 'antd';
import Image from 'next/image'
import { APP_NAME } from '../constants';
import { getProfileByHandle, getProfileById } from '../util/lens'
import VerifiedCheck from '../lib/VerifiedCheck';
import { formatDate, isEmpty } from '../util';
import { getCommentsForHandle, postVerifyVP } from '../util/api';
import { Comment } from '@ant-design/compatible';
import { InfoCircleOutlined } from '@ant-design/icons';
import TextArea from 'antd/es/input/TextArea';
import Checkbox from 'antd/es/checkbox/Checkbox';

const desc = ['terrible', 'bad', 'normal', 'good', 'wonderful'];

const ListingDetail = ({ listingId, provider }) => {
    const [loading, setLoading] = useState(true)
    const [modalConfig, setModalConfig] = useState({})
    const [inquireLoading, setInquireLoading] = useState(false)
    const [showClaimModal, setShowClaimModal] = useState(false)
    const [presentation, setPresentation] = useState()
    const [reviews, setReviews] = useState()
    const [error, setError] = useState()
    const [profile, setProfile] = useState()
    const [amount, setAmount] = useState()
    const [message, setMessage] = useState()
    const [rating, setRating] = useState(3);
    const [hideMessage, setHideMessage] = useState(false)
    const [result, setResult] = useState()
    // get account from web3

    const verifyPresentation = async () => {
        if (!presentation) {
            return
        }
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
        }
    }

    async function getReviews(id) {
        setError()
        try {
            const res = await getCommentsForHandle(id)
            console.log('got reviews', res)
            setReviews(res);
        } catch (e) {
            console.error('error getting reviews', e)
            // setError(e.message)
        }
    }

    async function postReview(id, message, rating) {



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
                // const metadata = await getProfile(signer, id)
                // console.log('got metadata', metadata)
                // const verified = !!metadata[2];
                res.verified = true;
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

    async function init() {
        setLoading(true)
        await fetchListing(listingId)
        await getReviews(listingId)
        setLoading(false)
    }

    useEffect(() => {
        init()
    }, [listingId]);

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

    const RenderContent = ({ metadata }) => {
        if (!metadata) {
            return
        }
        if (metadata.content) {
            return <span>{metadata.content}</span>
        }

        if (metadata.image) {
            return <Image src={metadata.image} alt={metadata.name} width={64} height={64} />
        }
        return <span></span>
    }


    const profileImage = picture ? picture.original.url : '/profile.png'
    const tabItems = [{
        key: '1',
        label: 'Reviews',
        children: <div>

            <Button
                type="primary"
                onClick={() => {
                    setModalConfig({ type: 'review' })
                }}
            >Add review</Button>
                {JSON.stringify(reviews)}
        </div>,
    },
    {
        key: '2',
        label: 'Activity',
        children: <div>
            {/* <h1>Recent Activity</h1> */}
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
                    <Comment content={<RenderContent metadata={metadata} />} datetime={formatDate(createdAt)} avatar={
                        <Avatar src={profileImage} alt={metadata.name} />
                    }
                        author={`${metadata.name} (${appId})`} />
                </div>
            })}</div>
    }]

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
                        {!loading && <div>
                            <p>
                                {(isVerified) ? <span className="verified-badge success-text">
                                    {/* <Image src="/verified.svg" width={20} height={20} alt="verified" /> */}
                                    This account is verified by {APP_NAME}&nbsp;
                                    <Tooltip className='pointer' title="Verified accounts have been provided a secure identity credential and this page has been confirmed an official handle account by VerifiedEntity">
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

                            {result && <div>
                                <Divider />
                                <p>Result</p>
                                <pre>{JSON.stringify(result, null, 2)}</pre>
                            </div>}
                        </div>}
                    </Col>

                </Row>
                <Row>
                    <Col span={24}>

                        <Tabs
                            defaultActiveKey="1"
                            tabPosition='top'
                            items={tabItems}
                            style={{ height: 220 }} />

                    </Col>
                </Row>
            </Card>


            {/* TODO: enable offer */}
            <Modal
                title={ <span className='success-text'>Add a {modalConfig.type} to {handle}</span>}
                open={!!modalConfig.type}
                okText={`Add ${modalConfig.type}`}
                onOk={inquire}
                confirmLoading={loading || inquireLoading}
                onCancel={() => setModalConfig({})}
            >
                <p className='bold'>Review / Message</p>
                <TextArea
                    rows={3}
                    placeholder={`Hey ${handle}, interested in exploring a potential collaboration. Contact me at...`}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                />

                <div>
                    <Rate tooltips={desc} onChange={setRating} rating={rating} />
                    {rating ? <span className="ant-rate-text">{desc[rating - 1]}</span> : ''}
                </div>
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