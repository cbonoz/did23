// https://github.com/TBD54566975/web5-js



export const getCommentsForHandle = async (web5, recipient) => {
    // Get comments by handle from dwn
    const { records } = await web5.dwn.records.fetch({
        recipient,
    });
    return records;
}

export const createCommentForHandle = async (web5, sender, recipient, comment) => {
    // Create comment by handle from dwn
    const { record } = await web5.dwn.records.create({
        data: "Hello World!",
        sender,
        message: {
            recipient,
            dataFormat: "text/plain",
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