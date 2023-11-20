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
import { getProfileByHandle } from '../util/lens'
import VerifiedCheck from '../lib/VerifiedCheck';
import { isEmpty } from '../util';
import Publications from '../lib/Publications';
import Reviews from '../lib/Reviews';
import { postVerifyVP } from '../util/api';
import { InfoCircleOutlined } from '@ant-design/icons';
import TextArea from 'antd/es/input/TextArea';
import { getMetadataForHandle, getCommentsForHandle } from '../util/tbd';
import { useDidContext } from '../context/DidProvider';


const ListingDetail = ({ listingId, provider }) => {
    const [loading, setLoading] = useState(true)
    const [showClaimModal, setShowClaimModal] = useState(false)
    const [presentation, setPresentation] = useState()
    const [error, setError] = useState()
    const [profile, setProfile] = useState()
    const [result, setResult] = useState()

    const {did, web5} = useDidContext()
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
                const metadata = await getMetadataForHandle(handle)
                console.log('got metadata', metadata)
                const verified = !!metadata[2];
                res.verified = true;
            } catch (e) {
                console.error('error getting metadata', e)
                res.verified = false
            }
            console.log('set profile', res)
            setProfile(res);
        } catch (e) {
            console.error('error getting profile', e)
            setError(e.message)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchListing(listingId)
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
            title: 'Search',
            href: '/search'
        },
        {
            title: cardTitle,
            href: `/profile/${listingId}`
        }
    ]


    const profileImage = picture ? picture.original.url : '/profile.png'
    const tabItems = [{
        key: '1',
        label: 'Reviews',
        children: <Reviews handle={handle} />,
    },
    {
        key: '2',
        label: 'Activity',
        children: <Publications publications={publications} />,

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
                    <Col span={7}>
                        <Image src={profileImage}
                            alt={`${name} profile picture`}
                            layout='fill'
                            objectFit='contain'
                        />
                    </Col>
                    <Col span={1}></Col>
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

                                {<span><Button disabled={!did} size="large" type="primary" onClick={() => {
                                    setShowClaimModal(true)
                                }}>Claim account</Button>&nbsp;
                                    {!did && <span className="">Please connect your wallet to claim this account.
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