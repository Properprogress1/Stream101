import React, { useState } from 'react';
import StreamPlatform from '../contracts/StreamPlatform.json';
import StreamReward from '../contracts/StreamReward.json';
import web3 from '../web3';
import { createStream } from '../livepeer';

const UploadContent = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [streamInfo, setStreamInfo] = useState(null);

    const uploadContent = async () => {
        const accounts = await web3.eth.getAccounts();

        // Create a new Livepeer stream
        const stream = await createStream(title);
        if (!stream) {
            alert('Failed to create stream.');
            return;
        }
        setStreamInfo(stream);

        const streamPlatform = new web3.eth.Contract(
            StreamPlatform.abi,
            'YOUR_STREAM_PLATFORM_CONTRACT_ADDRESS'
        );

        const streamReward = new web3.eth.Contract(
            StreamReward.abi,
            'YOUR_STREAM_REWARD_CONTRACT_ADDRESS'
        );

        // Upload content details to the blockchain
        await streamPlatform.methods
            .uploadContent(
                title,
                description,
                stream.playbackId,
                web3.utils.toWei(price, 'ether')
            )
            .send({ from: accounts[0] });

        // Reward the content creator
        await streamReward.methods.rewardContentCreation(accounts[0]).send({ from: accounts[0] });

        alert('Content uploaded successfully!');
    };

    return (
        <div>
            <h2>Upload Content</h2>
            <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Title"
            />
            <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Description"
            />
            <input
                type="text"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="Price (in ETH)"
            />
            <button onClick={uploadContent}>Upload</button>
            {streamInfo && (
                <div>
                    <p>Stream ID: {streamInfo.id}</p>
                    <p>Playback ID: {streamInfo.playbackId}</p>
                </div>
            )}
        </div>
    );
};

export default UploadContent;
