import React, { useMemo, useState } from 'react';
import FriendList from './FriendList';
import ChatBox from './ChatBox';
import './App.css';

const App = () => {
  const [friends] = useState([
    { id: 'alice', name: 'Alice', headline: 'CS Student • Study Group' },
    { id: 'bob', name: 'Bob', headline: 'TA • Algorithms' },
    { id: 'charlie', name: 'Charlie', headline: 'Intern • Product' }
  ]);

  const [selectedFriend, setSelectedFriend] = useState(null);

  // Basic demo feed data (later: fetch from API)
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
      <TopNav />

      <main className="lc-shell">
        <aside className="lc-left">
          <ProfileCard />
          <QuickLinks />
          <CourseCard />
        </aside>

        <section className="lc-center" aria-label="Feed">
          <Composer />
          <Feed posts={posts} />
        </section>

        <aside className="lc-right">
          <NewsCard />
          <PeopleYouMayKnow friends={friends} onSelectFriend={setSelectedFriend} />
        </aside>
      </main>

      {selectedFriend && (
        <ChatBox selectedFriend={selectedFriend} onClose={() => setSelectedFriend(null)} />
      )}
    </div>
  );
};

const TopNav = () => (
  <header className="lc-topnav">
    <div className="lc-topnav__inner">
      <div className="lc-brand">LitConnect</div>

      <div className="lc-search" role="search" aria-label="Search">
        <span className="lc-search__icon" aria-hidden="true">🔎</span>
        <input placeholder="Search people, posts, courses..." />
      </div>

      <nav className="lc-nav" aria-label="Primary navigation">
        <button className="lc-nav__item" type="button">Home</button>
        <button className="lc-nav__item" type="button">My Network</button>
        <button className="lc-nav__item" type="button">Learning</button>
        <button className="lc-nav__item" type="button">Messages</button>
        <button className="lc-nav__item" type="button">Notifications</button>
        <button className="lc-nav__item lc-nav__me" type="button">Me</button>
      </nav>
    </div>
  </header>
);

const ProfileCard = () => (
  <div className="lc-card">
    <div className="lc-profileCover" />
    <div className="lc-profileBody">
      <div className="lc-avatar" aria-hidden="true">HL</div>
      <div className="lc-profileMeta">
        <div className="lc-profileName">Harrison Le</div>
        <div className="lc-profileHeadline">Student • Aspiring SWE • LitConnect</div>
      </div>

      <div className="lc-divider" />

      <div className="lc-statRow">
        <span>Profile views</span>
        <strong>28</strong>
      </div>
      <div className="lc-statRow">
        <span>Post impressions</span>
        <strong>312</strong>
      </div>

      <div className="lc-divider" />

      <button className="lc-linkBtn" type="button">Saved items</button>
    </div>
  </div>
);

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

const CourseCard = () => (
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
      <button className="lc-primaryBtn" type="button">Go to Learning</button>
    </div>
  </div>
);

const Composer = () => (
  <div className="lc-card lc-composer">
    <div className="lc-composerTop">
      <div className="lc-avatar lc-avatar--small" aria-hidden="true">HL</div>
      <button className="lc-composerInput" type="button">
        Start a post
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
            {p.author.split(' ').map(s => s[0]).slice(0,2).join('')}
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

    {/* Reuse your FriendList for click-to-chat */}
    <FriendList friends={friends} onSelectFriend={(friend) => onSelectFriend(friend)} />
    <div className="lc-hint">Tip: click a friend to open chat</div>
  </div>
);

export default App;