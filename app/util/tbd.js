// https://github.com/TBD54566975/web5-js

import { APP_NAME } from "../constants";
import { DidIonMethod, DidKeyMethod, DidDhtMethod } from '@web5/dids';


const getMetadataSchema = (handle) => {
    return `https://${APP_NAME.toLowerCase()}/metadata/${handle}`
}

const getReviewSchema = (handle) => {
    return `https://${APP_NAME.toLowerCase()}/reviews/${handle}`
}

// https://developer.tbd.website/api/web5-js/dwn/records#code-examples

export const createMetadataForHandle = async (web5, handle, metadata) => {
    // Create metadata by handle from dwn
    const data = {...(metadata??{}), handle}
    const newDid = await DidKeyMethod.create('key');
    console.log('createMetadataForHandle', web5, data)
    data['did'] = newDid;

    const { record } = await web5.dwn.records.create({
        data,
        message: {
            // schema: getMetadataSchema(handle),
            dataFormat: "application/json",
        },
    });
    const {status} = await record.send(newDid.did);
    return {record, status};
}

export const getMetadataForHandle = async (web5, handle) => {
    // Get metadata by handle from dwn
    const { records } = await web5.dwn.records.fetch({
        filter: {
            schema: getMetadataSchema(handle),
        },
    });
    return records;
}

export const getCommentsForHandle = async (web5, recipient) => {
    // Get comments by handle from dwn
    const { records } = await web5.dwn.records.fetch({
        recipient,
    });
    return records;
}

export const createCommentForHandle = async (web5, sender, recipient, comment) => {
    // Create comment by handle from dwn
    const data = {comment}
    const { record } = await web5.dwn.records.create({
        data,
        sender,
        message: {
            recipient,
            schema: getReviewSchema(handle),
            dataFormat: "application/json",
        },
    });

    // get did from handle
    const did = await web5.did.get(handle)
    const { status } = await record.send(did);
    return record
}

export const createDid = async (web5, handle, type) => {
    // Create did by handle from dwn
    const did = await web5.did.create(type || 'ion');
    console.log('did', did)
    return did;
}