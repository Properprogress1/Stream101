import React, { useState, useEffect } from 'react';
import StreamPlatform from '../contracts/StreamPlatform.json';
import StreamReward from '../contracts/StreamReward.json';
import web3 from '../web3';
import Hls from 'hls.js';

const ViewContent = () => {
    const [contentId, setContentId] = useState('');
    const [content, setContent] = useState(null);

    const fetchContent = async () => {
        const streamPlatform = new web3.eth.Contract(
            StreamPlatform.abi,
            'YOUR_STREAM_PLATFORM_CONTRACT_ADDRESS'
        );

        const contentData = await streamPlatform.methods.contents(contentId).call();
        setContent(contentData);

        // Reward viewership
        const accounts = await web3.eth.getAccounts();
        const streamReward = new web3.eth.Contract(
            StreamReward.abi,
            'YOUR_STREAM_REWARD_CONTRACT_ADDRESS'
        );
        await streamReward.methods.rewardViewership(accounts[0]).send({ from: accounts[0] });
    };

    const tipCreator = async () => {
        const streamPlatform = new web3.eth.Contract(
            StreamPlatform.abi,
            'YOUR_STREAM_PLATFORM_CONTRACT_ADDRESS'
        );
        const accounts = await web3.eth.getAccounts();

        await streamPlatform.methods.tipContentCreator(contentId).send({
            from: accounts[0],
            value: web3.utils.toWei('0.1', 'ether'), // Example tip of 0.1 ETH
        });

        alert('Creator tipped successfully!');
    };

    useEffect(() => {
        if (content && Hls.isSupported()) {
            const video = document.getElementById('video');
            const hls = new Hls();
            hls.loadSource(`https://cdn.livepeer.com/hls/${content.playbackId}/index.m3u8`);
            hls.attachMedia(video);
        }
    }, [content]);

    return (
        <div>
            <h2>View Content</h2>
            <input
                type="text"
                value={contentId}
                onChange={(e) => setContentId(e.target.value)}
                placeholder="Content ID"
            />
            <button onClick={fetchContent}>Fetch Content</button>
            {content && (
                <div>
                    <h3>{content.title}</h3>
                    <p>{content.description}</p>
                    <video id="video" controls></video>
                    <button onClick={tipCreator}>Tip Creator</button>
                </div>
            )}
        </div>
    );
};

export default ViewContent;
