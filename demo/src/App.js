import React, { useState } from 'react';
import FriendList from './FriendList';
import ChatBox from './ChatBox';
import './App.css';

const App = () => {
  const [friends] = useState([
    { name: 'Alice' },
    { name: 'Bob' },
    { name: 'Charlie' }
  ]);
  const [selectedFriend, setSelectedFriend] = useState(null);

  return (
    <div className="app-container">
      <Header />
      <div className="main-content">
        <Sidebar />
        <Feed />
        <Rightbar friends={friends} onSelectFriend={setSelectedFriend} />
      </div>
      {selectedFriend && (
        <ChatBox 
          selectedFriend={selectedFriend} 
          onClose={() => setSelectedFriend(null)} 
        />
      )}
    </div>
  );
};

const Header = () => (
  <header className="header">
    <div className="logo">EduConnect</div>
    <nav className="nav">
      <ul>
        <li>Home</li>
        <li>Notifications</li>
        <li>Profile</li>
      </ul>
    </nav>
  </header>
);

const Sidebar = () => (
  <aside className="sidebar">
    <ul>
      <li>Dashboard</li>
      <li>Messages</li>
      <li>Classes</li>
      <li>Groups</li>
    </ul>
  </aside>
);

const Feed = () => (
  <section className="feed">
    <div className="post-creator">
      <textarea placeholder="What's on your mind?"></textarea>
      <button>Post</button>
    </div>
    <div className="posts">
      <Post 
        title="Welcome to EduConnect!" 
        content="This is our first post on the social network for educational institutions. Stay tuned for more updates!" 
      />
      {/* Additional posts can be mapped here */}
    </div>
  </section>
);

const Post = ({ title, content }) => (
  <div className="post">
    <h3>{title}</h3>
    <p>{content}</p>
  </div>
);

const Rightbar = ({ friends, onSelectFriend }) => (
  <aside className="rightbar">
    <div className="suggestions">
      <h4>Suggestions</h4>
      <p>Join your class groups, follow your college clubs, and more.</p>
    </div>
    <FriendList friends={friends} onSelectFriend={onSelectFriend} />
  </aside>
);

export default App;
