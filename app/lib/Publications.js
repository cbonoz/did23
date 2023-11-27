'use client';

import React, { useState } from 'react';
import { formatDate, isEmpty } from '../util';
import { Avatar, Empty } from 'antd';
import { Comment } from '@ant-design/compatible';

const Publications = ({ publications }) => {
    const RenderContent = ({ metadata }) => {
        if (!metadata) {
            return;
        }
        if (metadata.content) {
            return <span>{metadata.content}</span>;
        }

        if (metadata.image) {
            return (
                <Image
                    src={metadata.image}
                    alt={metadata.name}
                    width={64}
                    height={64}
                />
            );
        }
        return <span></span>;
    };

    return (
        <div className="" style={{ background: '#f5f5f5 !important' }}>
            {isEmpty(publications) && (
                <Empty
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                    description={<span>No recent web activity found</span>}
                />
            )}
            {publications.map((p) => {
                const { createdAt, profile, metadata, appId } = p;
                if (!metadata) {
                    return;
                }
                const defaultProfileImage = `https://avatars.dicebear.com/api/avataaars/${appId}.svg`;
                let profileImage =
                    profile?.picture?.original?.url || defaultProfileImage;

                return (
                    <div key={p.id} style={{ background: '#f5f5f5' }}>
                        <Comment
                            content={<RenderContent metadata={metadata} />}
                            datetime={formatDate(createdAt)}
                            avatar={
                                <Avatar
                                    src={profileImage}
                                    alt={metadata.name}
                                />
                            }
                            author={`${metadata.name} (${appId})`}
                        />
                    </div>
                );
            })}
        </div>
    );
};

export default Publications;
