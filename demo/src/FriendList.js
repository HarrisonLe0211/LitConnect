import React from 'react';

const FriendList = ({ friends, onSelectFriend }) => {
  return (
    <div className="friend-list">
      <h4>Friends</h4>
      <ul>
        {friends.map((friend, index) => (
          <li key={index} onClick={() => onSelectFriend(friend)}>
            {friend.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FriendList;
