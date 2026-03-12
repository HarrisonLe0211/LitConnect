import React, { useEffect, useMemo, useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';

import FriendList from './FriendList';
import ChatBox from './ChatBox';
import ProfileModal from './ProfileModal';
import LearningPage from './LearningPage';
import { safeMe } from './api';

import './App.css';

const App = () => {
  const [friends] = useState([
    { id: 'alice', name: 'Alice', headline: 'CS Student • Study Group' },
    { id: 'bob', name: 'Bob', headline: 'TA • Algorithms' },
    { id: 'charlie', name: 'Charlie', headline: 'Intern • Product' }
  ]);

  const [selectedFriend, setSelectedFriend] = useState(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    safeMe().then((res) => {
      if (res?.user) setCurrentUser(res.user);
    });
  }, []);

  const posts = useMemo(
    () => [
      {
        id: 'p1',
        author: 'LitConnect Team',
        authorHeadline: 'Campus + Career + Learning in one place',
        time: '2h',
        content:
          'Welcome to LitConnect — your student life hub. Share updates, join course discussions, and build your professional presence.'
      },
      {
        id: 'p2',
        author: 'Alice',
        authorHeadline: 'CS Student • Study Group',
        time: '5h',
        content:
          'Anyone want to form a study group for Data Structures? I’m putting together a weekly session.'
      }
    ],
    []
  );

  return (
    <div className="lc-app">
      <TopNav user={currentUser} onOpenProfile={() => setProfileOpen(true)} />

      <Routes>
        <Route
          path="/"
          element={
            <HomePage
              currentUser={currentUser}
              friends={friends}
              posts={posts}
              onOpenProfile={() => setProfileOpen(true)}
              onSelectFriend={setSelectedFriend}
            />
          }
        />

        <Route
          path="/learning"
          element={<LearningPage currentUser={currentUser} />}
        />
      </Routes>

      {selectedFriend && (
        <ChatBox selectedFriend={selectedFriend} onClose={() => setSelectedFriend(null)} />
      )}

      <ProfileModal
        open={profileOpen}
        onClose={() => setProfileOpen(false)}
        onAuth={(user) => setCurrentUser(user)}
        onLogout={() => setCurrentUser(null)}
      />
    </div>
  );
};

const HomePage = ({ currentUser, friends, posts, onOpenProfile, onSelectFriend }) => (
  <main className="lc-shell">
    <aside className="lc-left">
      <ProfileCard user={currentUser} onOpenProfile={onOpenProfile} />
      <QuickLinks />
      <CourseCard />
    </aside>

    <section className="lc-center" aria-label="Feed">
      <Composer user={currentUser} onOpenProfile={onOpenProfile} />
      <Feed posts={posts} />
    </section>

    <aside className="lc-right">
      <NewsCard />
      <PeopleYouMayKnow friends={friends} onSelectFriend={onSelectFriend} />
    </aside>
  </main>
);

const initialsFromName = (name = '') =>
  name
    .trim()
    .split(/\s+/)
    .map((s) => s[0]?.toUpperCase())
    .filter(Boolean)
    .slice(0, 2)
    .join('') || 'ME';

const TopNav = ({ user, onOpenProfile }) => {
  const navigate = useNavigate();

  return (
    <header className="lc-topnav">
      <div className="lc-topnav__inner">
        <div className="lc-brand" role="button" tabIndex={0} onClick={() => navigate('/')}>
          LitConnect
        </div>

        <div className="lc-search" role="search" aria-label="Search">
          <span className="lc-search__icon" aria-hidden="true">🔎</span>
          <input placeholder="Search people, posts, courses..." />
        </div>

        <nav className="lc-nav" aria-label="Primary navigation">
          <button className="lc-nav__item" type="button" onClick={() => navigate('/')}>Home</button>
          <button className="lc-nav__item" type="button">My Network</button>
          <button className="lc-nav__item" type="button" onClick={() => navigate('/learning')}>Learning</button>
          <button className="lc-nav__item" type="button">Messages</button>
          <button className="lc-nav__item" type="button">Notifications</button>
          <button className="lc-nav__item lc-nav__me" type="button" onClick={onOpenProfile}>
            {user?.fullName ? user.fullName.split(' ')[0] : 'Me'}
          </button>
        </nav>
      </div>
    </header>
  );
};

const ProfileCard = ({ user, onOpenProfile }) => {
  const fullName = user?.fullName || 'Guest';
  const role = user?.role || 'student';
  const headline = user?.headline || 'Login to add a headline';
  const school = user?.school || 'Add your school';

  return (
    <div className="lc-card">
      <div className="lc-profileCover" />
      <div className="lc-profileBody">
        <div className="lc-avatar" aria-hidden="true">{initialsFromName(fullName)}</div>

        <div className="lc-profileMeta">
          <div className="lc-profileName">{fullName}</div>
          <div className="lc-profileHeadline">{headline}</div>
          <div className="lc-profileHeadline" style={{ marginTop: 4 }}>
            {school} • {role}
          </div>
        </div>

        <div className="lc-divider" />

        <div className="lc-statRow"><span>Profile views</span><strong>28</strong></div>
        <div className="lc-statRow"><span>Post impressions</span><strong>312</strong></div>

        <div className="lc-divider" />

        <button className="lc-linkBtn" type="button" onClick={onOpenProfile}>
          {user ? 'Edit profile' : 'Login / Create account'}
        </button>
        <button className="lc-linkBtn" type="button">Saved items</button>
      </div>
    </div>
  );
};

const QuickLinks = () => (
  <div className="lc-card">
    <div className="lc-cardTitle">Shortcuts</div>
    <div className="lc-list">
      <button className="lc-linkBtn" type="button">Groups</button>
      <button className="lc-linkBtn" type="button">Events</button>
      <button className="lc-linkBtn" type="button">Internships</button>
      <button className="lc-linkBtn" type="button">Career Center</button>
    </div>
  </div>
);

const CourseCard = () => {
  const navigate = useNavigate();

  return (
    <div className="lc-card">
      <div className="lc-cardTitle">My Courses</div>
      <div className="lc-miniList">
        <div className="lc-miniItem">
          <div className="lc-miniTitle">CS 161 — Intro to Programming</div>
          <div className="lc-miniSub">Next: Quiz 2 • Due Fri</div>
        </div>
        <div className="lc-miniItem">
          <div className="lc-miniTitle">MATH 251 — Calculus</div>
          <div className="lc-miniSub">Next: Homework 4 • Due Sun</div>
        </div>

        {/* ✅ now navigates */}
        <button className="lc-primaryBtn" type="button" onClick={() => navigate('/learning')}>
          Go to Learning
        </button>
      </div>
    </div>
  );
};

const Composer = ({ user, onOpenProfile }) => (
  <div className="lc-card lc-composer">
    <div className="lc-composerTop">
      <div className="lc-avatar lc-avatar--small" aria-hidden="true">
        {initialsFromName(user?.fullName || 'ME')}
      </div>
      <button className="lc-composerInput" type="button" onClick={onOpenProfile}>
        {user ? 'Start a post' : 'Start a post (login to post)'}
      </button>
    </div>

    <div className="lc-composerActions">
      <button type="button">📝 Post</button>
      <button type="button">📷 Media</button>
      <button type="button">📚 Course</button>
      <button type="button">📅 Event</button>
    </div>
  </div>
);

const Feed = ({ posts }) => (
  <div className="lc-feed">
    {posts.map((p) => (
      <article key={p.id} className="lc-card lc-post">
        <div className="lc-postHeader">
          <div className="lc-avatar lc-avatar--small" aria-hidden="true">
            {p.author.split(' ').map((s) => s[0]).slice(0, 2).join('')}
          </div>
          <div>
            <div className="lc-postAuthor">{p.author}</div>
            <div className="lc-postMeta">{p.authorHeadline} • {p.time}</div>
          </div>
        </div>

        <div className="lc-postContent">{p.content}</div>

        <div className="lc-postActions">
          <button type="button">Like</button>
          <button type="button">Comment</button>
          <button type="button">Repost</button>
          <button type="button">Send</button>
        </div>
      </article>
    ))}
  </div>
);

const NewsCard = () => (
  <div className="lc-card">
    <div className="lc-cardTitle">Campus News</div>
    <ul className="lc-bullets">
      <li>Career fair next week — update your profile</li>
      <li>New study rooms available in the library</li>
      <li>Workshop: “Interview Prep for Internships”</li>
    </ul>
  </div>
);

const PeopleYouMayKnow = ({ friends, onSelectFriend }) => (
  <div className="lc-card">
    <div className="lc-cardTitle">People you may know</div>
    <FriendList friends={friends} onSelectFriend={(friend) => onSelectFriend(friend)} />
    <div className="lc-hint">Tip: click a friend to open chat</div>
  </div>
);

export default App;