// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Streamone {
    struct Content {
        uint256 id;
        string title;
        string description;
        string playbackId;  // From Livepeer, previously ipfsHash
        address payable creator;
        uint256 price;
        uint256 tips;
    }

    mapping(uint256 => Content) public contents;
    uint256 public contentCount = 0;

    event ContentUploaded(
        uint256 id,
        string title,
        string description,
        string playbackId,
        address payable creator,
        uint256 price
    );

    event ContentTipped(
        uint256 id,
        string title,
        string description,
        string playbackId,
        address payable creator,
        uint256 price,
        uint256 tips
    );

    function uploadContent(
        string memory _title,
        string memory _description,
        string memory _playbackId,
        uint256 _price
    ) public {
        require(bytes(_title).length > 0, "Title cannot be empty");
        require(bytes(_description).length > 0, "Description cannot be empty");
        require(bytes(_playbackId).length > 0, "Playback ID cannot be empty");
        require(_price > 0, "Price must be greater than zero");

        contentCount++;
        contents[contentCount] = Content(
            contentCount,
            _title,
            _description,
            _playbackId,
            payable(msg.sender),
            _price,
            0
        );

        emit ContentUploaded(contentCount, _title, _description, _playbackId, payable(msg.sender), _price);
    }

    function tipContentCreator(uint256 _id) public payable {
        require(_id > 0 && _id <= contentCount, "Invalid content ID");

        Content memory _content = contents[_id];
        address payable _creator = _content.creator;

        _creator.transfer(msg.value);
        _content.tips = _content.tips + msg.value;

        contents[_id] = _content;

        emit ContentTipped(_id, _content.title, _content.description, _content.playbackId, _creator, _content.price, _content.tips);
    }
}
