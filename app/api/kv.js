import axios from 'axios'


const baseURL = 'https://kvdb.io/' + process.env.KV_DB_BUCKET;
const TOKEN = process.env.KV_DB_TOKEN;

console.log('baseURL', baseURL, TOKEN)

const axiosInstance = axios.create({
    baseURL,
    timeout: 10000,
});

export const setKey = async (key, value) => {
    const res = await axiosInstance.post(`/${key}?access_token=${TOKEN}`, value)
    return res.data
}

export const getKey = async (key) => {
    const res = await axiosInstance.get(`/${key}?access_token=${TOKEN}`)
    return res.data
}