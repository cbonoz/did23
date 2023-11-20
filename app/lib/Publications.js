'use client'

import React, { useState } from 'react'
import { isEmpty } from '../util'
import { Empty } from 'antd'

const Publications = ({ publications }) => {


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


    return <div>
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

}

export default Publications