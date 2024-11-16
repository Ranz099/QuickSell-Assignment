import React, { useState, useEffect } from 'react';
import { fetchData } from './utils/api';
import Board from './components/Board/Board';
import './App.css';

function App() {
  const [tickets, setTickets] = useState([]);
  const [users, setUsers] = useState([]);
  const [grouping, setGrouping] = useState(() => {
    const savedState = localStorage.getItem('viewState');
    return savedState ? JSON.parse(savedState).grouping : 'status';
  });
  const [ordering, setOrdering] = useState(() => {
    const savedState = localStorage.getItem('viewState');
    return savedState ? JSON.parse(savedState).ordering : 'priority';
  });

  useEffect(() => {
    const loadData = async () => {
      const data = await fetchData();
      if (data) {
        setTickets(data.tickets);
        setUsers(data.users);
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    localStorage.setItem('viewState', JSON.stringify({ grouping, ordering }));
  }, [grouping, ordering]);

  return (
    <div className="app">
      <Board
        tickets={tickets}
        users={users}
        grouping={grouping}
        ordering={ordering}
        onGroupingChange={setGrouping}
        onOrderingChange={setOrdering}
      />
    </div>
  );
}

export default App;