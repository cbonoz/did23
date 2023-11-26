import axios from 'axios';

const baseUrl =
    process.env.NODE_ENV === 'production'
        ? 'https://verifiedentity.vercel.app'
        : 'http://localhost:3000';

const axiosInstance = axios.create({
    baseURL: baseUrl,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const postGenerateDid = async (handle, email) => {
    const res = await axiosInstance.post(`/api/provision/did`, {
        handle,
        email,
    });
    return res.data;
};

export const postGenerateVC = async (handle, holderDid) => {
    const res = await axiosInstance.post(`/api/provision/vc`, {
        handle,
        holderDid,
    });
    return res.data;
};

export const postVerifyCredential = async (credential, handle) => {
    const res = await axiosInstance.post(`/api/verify`, {
        credential,
        handle,
    });
    return res.data;
};

// export const getCommentsForHandle = async (handle) => {
//     const res = await axiosInstance.get(`/api/comments/${handle}`)
//     return res.data
// }

// export const createCommentForHandle = async (handle, comment) => {
//     const res = await axiosInstance.post(`/api/comments/${handle}`, {comment})
//     return res.data
// }
