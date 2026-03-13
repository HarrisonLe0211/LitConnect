import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

/**
 * Canvas-ish layout:
 * - Top breadcrumb / course selector
 * - Left course nav (Home, Modules, Assignments, Grades...)
 * - Center content (Modules)
 * - Right sidebar (To Do, Upcoming)
 */
export default function LearningPage({ currentUser }) {
  const courses = useMemo(
    () => [
      { id: 'cs161', code: 'CS 161', title: 'Intro to Programming' },
      { id: 'math251', code: 'MATH 251', title: 'Calculus I' }
    ],
    []
  );

  const modulesByCourse = useMemo(
    () => ({
      cs161: [
        {
          id: 'm1',
          title: 'Module 1 — Getting Started',
          items: [
            { id: 'i1', type: 'Page', title: 'Syllabus & Course Overview' },
            { id: 'i2', type: 'Assignment', title: 'Hello World Setup' },
            { id: 'i3', type: 'Quiz', title: 'Quiz 1 — Basics' }
          ]
        },
        {
          id: 'm2',
          title: 'Module 2 — Control Flow',
          items: [
            { id: 'i4', type: 'Page', title: 'If/Else Notes' },
            { id: 'i5', type: 'Assignment', title: 'Conditionals Practice' }
          ]
        }
      ],
      math251: [
        {
          id: 'm1',
          title: 'Module 1 — Limits',
          items: [
            { id: 'i1', type: 'Page', title: 'Limits Notes' },
            { id: 'i2', type: 'Assignment', title: 'Homework 1' }
          ]
        }
      ]
    }),
    []
  );

  const [activeCourseId, setActiveCourseId] = useState(courses[0].id);
  const activeCourse = courses.find((c) => c.id === activeCourseId);

  const modules = modulesByCourse[activeCourseId] || [];

  const displayName = currentUser?.fullName || 'Guest';

  return (
    <div className="lc-learning">
      {/* top bar */}
      <div className="lc-learningTop">
        <div className="lc-learningTopLeft">
          <Link to="/" className="lc-linkPlain">← Home</Link>
          <span className="lc-learningCrumb">E-Learning</span>
        </div>

        <div className="lc-learningTopRight">
          <span className="lc-learningUser">{displayName}</span>
          <select
            className="lc-learningCourseSelect"
            value={activeCourseId}
            onChange={(e) => setActiveCourseId(e.target.value)}
            aria-label="Select course"
          >
            {courses.map((c) => (
              <option key={c.id} value={c.id}>
                {c.code} — {c.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* content grid */}
      <div className="lc-learningGrid">
        {/* left course nav */}
        <aside className="lc-learningNav" aria-label="Course navigation">
          <div className="lc-learningNavTitle">{activeCourse.code}</div>
          <div className="lc-learningNavSub">{activeCourse.title}</div>

          <nav className="lc-learningNavList">
            <button className="lc-learningNavItem is-active" type="button">Home</button>
            <button className="lc-learningNavItem" type="button">Announcements</button>
            <button className="lc-learningNavItem" type="button">Modules</button>
            <button className="lc-learningNavItem" type="button">Assignments</button>
            <button className="lc-learningNavItem" type="button">Grades</button>
            <button className="lc-learningNavItem" type="button">People</button>
            <button className="lc-learningNavItem" type="button">Discussions</button>
          </nav>
        </aside>

        {/* main */}
        <main className="lc-learningMain" aria-label="Course content">
          <div className="lc-learningHeader">
            <h2 className="lc-learningTitle">Modules</h2>
            <div className="lc-learningActions">
              <button type="button">+ Module</button>
              <button type="button">Publish</button>
            </div>
          </div>

          <div className="lc-learningModules">
            {modules.map((mod) => (
              <section key={mod.id} className="lc-moduleCard">
                <div className="lc-moduleHeader">
                  <strong>{mod.title}</strong>
                  <span className="lc-moduleMeta">{mod.items.length} items</span>
                </div>

                <ul className="lc-moduleList">
                  {mod.items.map((it) => (
                    <li key={it.id} className="lc-moduleItem">
                      <span className="lc-moduleType">{it.type}</span>
                      <span className="lc-moduleItemTitle">{it.title}</span>
                      <button type="button" className="lc-moduleBtn">Open</button>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        </main>

        {/* right sidebar */}
        <aside className="lc-learningSide" aria-label="To do and upcoming">
          <div className="lc-sideCard">
            <div className="lc-sideTitle">To Do</div>
            <ul className="lc-sideList">
              <li>
                <div className="lc-sideItemTitle">Quiz 2</div>
                <div className="lc-sideItemSub">{activeCourse.code} • Due Fri</div>
              </li>
              <li>
                <div className="lc-sideItemTitle">Homework 4</div>
                <div className="lc-sideItemSub">{activeCourse.code} • Due Sun</div>
              </li>
            </ul>
          </div>

          <div className="lc-sideCard">
            <div className="lc-sideTitle">Upcoming</div>
            <ul className="lc-sideList">
              <li>
                <div className="lc-sideItemTitle">Office Hours</div>
                <div className="lc-sideItemSub">Tue 3:00pm</div>
              </li>
              <li>
                <div className="lc-sideItemTitle">Study Group</div>
                <div className="lc-sideItemSub">Thu 6:00pm</div>
              </li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}