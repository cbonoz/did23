// https://github.com/TBD54566975/web5-js

import { isEmpty } from '.';
import { APP_NAME } from '../constants';
import { DidIonMethod, DidKeyMethod, DidDhtMethod } from '@web5/dids';

const getMetadataSchema = (handle) => {
    return `https://${APP_NAME.toLowerCase()}/metadata/${handle}`;
};

const getReviewSchema = (handle) => {
    return `https://${APP_NAME.toLowerCase()}/reviews/${handle}`;
};

// https://developer.tbd.website/api/web5-js/dwn/records#code-examples

export const createMetadataForHandle = async (web5, handle, metadata) => {
    // Create metadata by handle from dwn
    const data = { ...(metadata ?? {}), handle, claimed: false };
    const newDid = await DidKeyMethod.create('key');
    console.log('createMetadataForHandle', web5, data);
    data['did'] = newDid;

    const { record } = await web5.dwn.records.create({
        data,
        message: {
            schema: getMetadataSchema(handle),
            dataFormat: 'application/json',
        },
    });
    // const {status} = await record.send(newDid.did);
    return await record.data.json();
};

export const getMetadataForHandle = async (web5, handle) => {
    // Get metadata by handle from dwn
    const { records } = await web5.dwn.records.query({
        message: {
            filter: {
                schema: getMetadataSchema(handle),
                dataFormat: 'application/json',
            },
        },
    });
    const results = await Promise.all(
        records.map(async (record) => record.data.json())
    );

    if (!isEmpty(results)) {
        console.log('getMetadataForHandle', handle, results[0]);
        return {
            handle,
            id: records[0]._recordId,
            did: results[0].did.did,
            claimed: results[0].claimed,
        };
    }

    return null;
};

export const getCommentsForHandle = async (web5, handle) => {
    // Get comments by handle from dwn
    const { records } = await web5.dwn.records.query({
        message: {
            filter: {
                schema: getReviewSchema(handle),
                dataFormat: 'application/json',
            },
        },
    });
    const results = await Promise.all(
        records.map(async (record) => record.data.json())
    );
    return results;
};

export const createCommentForHandle = async (
    web5,
    sender,
    recipient,
    comment,
    rating,
    handle
) => {
    // Create comment by handle from dwn
    const data = { comment, rating, sender, handle, createdAt: Date.now() };
    const { record } = await web5.dwn.records.create({
        data,
        sender,
        message: {
            recipient,
            schema: getReviewSchema(handle),
            dataFormat: 'application/json',
        },
    });

    // get did from handle
    return record;
};

export const createDid = async (web5, handle, type) => {
    // Create did by handle from dwn
    const did = await web5.did.create(type || 'ion');
    console.log('did', did);
    return did;
};
