'use client';

import React, { useEffect, useState } from 'react';
import {
    getCommentsForHandle,
    createCommentForHandle,
    getMetadataForHandle,
} from '../util/tbd';
import { Button, Divider, Empty, Modal, Rate } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import { useDidContext } from '../context/DidProvider';
import DidButton from './DidButton';
import {
    abbreviate,
    formatDate,
    getRandomReview,
    humanError,
    isEmpty,
} from '../util';
import { Comment } from '@ant-design/compatible';

const desc = ['terrible', 'bad', 'normal', 'good', 'wonderful'];
const generatedPlaceholder = getRandomReview().message;

const Reviews = ({ handle, isVerified }) => {
    const [modalConfig, setModalConfig] = useState({});
    const [reviews, setReviews] = useState([]);
    const [message, setMessage] = useState('');
    const [rating, setRating] = useState(0);
    const [loading, setLoading] = useState(false);
    const [reviewLoading, setReviewLoading] = useState(false);
    const [error, setError] = useState();

    const { did, web5 } = useDidContext();

    async function postReview() {
        console.log('post review', handle, message, rating);
        if (!message || !rating || !handle) {
            alert('Valid handle, message, and rating required');
            return;
        }

        setReviewLoading(true);
        try {
            const metadata = await getMetadataForHandle(web5, handle);
            const recipient = metadata?.did;
            if (!recipient) {
                throw new Error('This handle has not been verified yet');
            }
            const res = await createCommentForHandle(
                web5,
                did,
                recipient,
                message,
                rating,
                handle
            );
            console.log('posted review', res);
            getReviews();
            setModalConfig({});
        } catch (e) {
            console.error('error posting review', e);
            setError(humanError(e));
        } finally {
            setReviewLoading(false);
        }
    }

    async function getReviews() {
        setError();
        setLoading(true);

        try {
            const res = await getCommentsForHandle(web5, handle);
            console.log('got reviews', res);
            setReviews(res);
        } catch (e) {
            console.error('error getting reviews', e);
            setError(humanError(e));
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (!isEmpty(handle)) {
            getReviews();
        }
    }, [handle]);

    if (!did) {
        return (
            <div>
                <p className="bold">Login to access and add reviews.</p>
                <DidButton />
            </div>
        );
    }

    return (
        <div>
            <Button
                type="primary"
                disabled={!isVerified}
                onClick={() => {
                    setModalConfig({ type: 'review' });
                }}
            >
                Add review
            </Button>

            {!isVerified && (
                <p className="error-text">
                    <br />
                    Reviews are only available for verified handles.
                </p>
            )}

            {isEmpty(reviews) && !loading && (
                <Empty description="No reviews yet" />
            )}
            {loading && <p>Loading reviews...</p>}

            {reviews.map((review, i) => {
                return (
                    <div key={i}>
                        <Comment
                            avatar={
                                <img
                                    src={`https://avatars.dicebear.com/api/avataaars/${review.sender}.svg`}
                                    alt="avatar"
                                />
                            }
                            author={
                                !isEmpty(review.sender)
                                    ? abbreviate(review.sender)
                                    : 'Anonymous'
                            }
                            content={`${review.comment || review.message} - ${
                                desc[review.rating - 1]
                            }`}
                            datetime={formatDate(review.createdAt)}
                        />
                        <Divider />
                    </div>
                );
            })}

            <Divider />
            {/* TODO: enable offer */}
            <Modal
                title={
                    <span className="success-text">
                        Add a {modalConfig.type} to {handle}
                    </span>
                }
                open={!!modalConfig.type}
                okText={`Add ${modalConfig.type}`}
                onOk={postReview}
                confirmLoading={loading || reviewLoading}
                onCancel={() => setModalConfig({})}
            >
                <a
                    href="#"
                    style={{ color: 'blue' }}
                    onClick={(e) => {
                        e.preventDefault();
                        const review = getRandomReview(handle);
                        setMessage(review.message);
                        setRating(review.rating);
                    }}
                >
                    Autogenerate review
                </a>
                <Divider />

                <p className="bold">Review / Message</p>
                <TextArea
                    rows={3}
                    placeholder={generatedPlaceholder}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                />

                <div>
                    <Rate tooltips={desc} onChange={setRating} value={rating} />
                    {rating ? (
                        <span className="ant-rate-text">
                            {desc[rating - 1]}
                        </span>
                    ) : (
                        ''
                    )}
                </div>

                <div>
                    {error && (
                        <p className="error-text">
                            Error: {error}
                            <br />
                        </p>
                    )}
                </div>
            </Modal>
        </div>
    );
};

export default Reviews;
