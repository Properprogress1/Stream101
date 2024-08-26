import axios from 'axios';

const LIVEPEER_API_KEY = 'YOUR_LIVEPEER_API_KEY';
const LIVEPEER_API_URL = 'https://livepeer.com/api/';

export const createStream = async (name) => {
    try {
        const response = await axios.post(
            `${LIVEPEER_API_URL}stream`,
            {
                name: name,
                profiles: [
                    { name: '720p', bitrate: 2000000, fps: 30, width: 1280, height: 720 },
                    { name: '480p', bitrate: 1000000, fps: 30, width: 854, height: 480 },
                    { name: '360p', bitrate: 500000, fps: 30, width: 640, height: 360 },
                ],
            },
            {
                headers: {
                    Authorization: `Bearer ${LIVEPEER_API_KEY}`,
                },
            }
        );
        return response.data;
    } catch (error) {
        console.error('Error creating stream:', error);
        return null;
    }
};

export const getStreamStatus = async (streamId) => {
    try {
        const response = await axios.get(`${LIVEPEER_API_URL}stream/${streamId}`, {
            headers: {
                Authorization: `Bearer ${LIVEPEER_API_KEY}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching stream status:', error);
        return null;
    }
};
