'use client'

import React, { useEffect, useState } from 'react'
import { getCommentsForHandle, createCommentForHandle } from '../util/tbd'
import { Button, Divider, Empty, Modal, Rate } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import { useDidContext } from '../context/DidProvider';
import DidButton from './DidButton';
import { getRandomReview, isEmpty } from '../util';

const desc = ['terrible', 'bad', 'normal', 'good', 'wonderful'];

const Reviews = ({ handle }) => {
    const [modalConfig, setModalConfig] = useState({})
    const [reviews, setReviews] = useState([])
    const [message, setMessage] = useState('')
    const [rating, setRating] = useState(0)
    const [loading, setLoading] = useState(false)
    const [reviewLoading, setReviewLoading] = useState(false)
    const [error, setError] = useState()

    const { did, web5 } = useDidContext()

    async function postReview() {
        console.log('post review', handle, message, rating)
        if (!message || !rating || !handle) {
            alert('Valid handle, message, and rating required')
            return
        }

        setReviewLoading(true)
        try {
            const metadata = await getMetadataForHandle(web5, handle);
            const recipient = metadata.did
            const res = await createCommentForHandle(web5, did, recipient, message, rating);
            console.log('posted review', res)
            setReviews([...reviews, res])
            setModalConfig({})
        } catch (e) {
            console.error('error posting review', e)
            setError(e.message)
        } finally {
            setReviewLoading(false)
        }
    }

    async function getReviews() {

        if (!handle) {
            return
        }

        setError()
        setLoading(true)


        try {
            const res = await getCommentsForHandle(handle)
            console.log('got reviews', res)
            setReviews(res);
        } catch (e) {
            console.error('error getting reviews', e)
            setError(e.message)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        getReviews()
    }, [handle])

    if (!did) {
        return <div>
            <p className='bold'>Login to access and add reviews.</p>
            <DidButton />
        </div>
    }

    return <div>
        <Button
            type="primary"
            onClick={() => {
                setModalConfig({ type: 'review' })
            }}
        >Add review</Button>

        <Divider />

        {isEmpty(reviews) && !loading && <Empty description='No reviews yet' />}
        {loading && <p>Loading reviews...</p>}

        {JSON.stringify(reviews)}

        {/* TODO: enable offer */}
        <Modal
            title={<span className='success-text'>Add a {modalConfig.type} to {handle}</span>}
            open={!!modalConfig.type}
            okText={`Add ${modalConfig.type}`}
            onOk={postReview}
            confirmLoading={loading || reviewLoading}
            onCancel={() => setModalConfig({})}
        >
            <a href="#" style={{color: 'blue'}} onClick={e => {
                e.preventDefault()
                const review = getRandomReview(handle);
                setMessage(review.message)
                setRating(review.rating)
            }}>Generate review</a>
            <Divider/>

            <p className='bold'>Review / Message</p>
            <TextArea
                rows={3}
                placeholder={`Hey ${handle}, interested in exploring a potential collaboration. Contact me at...`}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
            />

            <div>
                <Rate tooltips={desc} onChange={setRating} value={rating} />
                {rating ? <span className="ant-rate-text">{desc[rating - 1]}</span> : ''}
            </div>
        </Modal>
    </div>

}

export default Reviews