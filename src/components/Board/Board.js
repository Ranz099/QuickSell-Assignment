import React, { useState, useEffect, useRef } from 'react';
import Card from '../Card/Card';
import './Board.css';

const STATUS_ICONS = {
  'Backlog': '📋',
  'Todo': '◌',
  'In progress': '⏳', // Note: API returns "In progress" not "In Progress"
  'Done': '✅',
  'Canceled': '❌'
};

const PRIORITY_ICONS = {
  'No priority': '⚫',
  'Urgent': '🔴',
  'High': '🟡',
  'Medium': '🟢',
  'Low': '⚪'
};

const DisplayButton = ({ onGroupingChange, onOrderingChange }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
  
    useEffect(() => {
      const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
          setIsOpen(false);
        }
      };
  
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);
  
    return (
      <div className="display-button-container" ref={dropdownRef}>
        <button 
          className="display-button"
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className="display-icon">☰</span> 
          Display 
          <span className="dropdown-arrow">▼</span>
        </button>
        
        {isOpen && (
          <div className="dropdown-menu">
            <div className="dropdown-item">
              <span>Grouping</span>
              <select 
                onChange={(e) => onGroupingChange(e.target.value)}
                onClick={(e) => e.stopPropagation()}
              >
                <option value="status">Status</option>
                <option value="user">User</option>
                <option value="priority">Priority</option>
              </select>
            </div>
            <div className="dropdown-item">
              <span>Ordering</span>
              <select 
                onChange={(e) => onOrderingChange(e.target.value)}
                onClick={(e) => e.stopPropagation()}
              >
                <option value="priority">Priority</option>
                <option value="title">Title</option>
              </select>
            </div>
          </div>
        )}
      </div>
    );
  };

const Board = ({ tickets, users, grouping, ordering, onGroupingChange, onOrderingChange }) => {
    const [groupedTickets, setGroupedTickets] = useState({});
  
    const priorityOrder = {
      'No priority': 0,
      'Urgent': 1,
      'High': 2,
      'Medium': 3,
      'Low': 4
    };
  
    const statusOrder = {
      'Backlog': 0,
      'Todo': 1,
      'In progress': 2, // Changed to match API response
      'Done': 3,
      'Canceled': 4
    };
  
    const getPriorityName = (priority) => {
      switch (priority) {
        case 4: return 'Urgent';
        case 3: return 'High';
        case 2: return 'Medium';
        case 1: return 'Low';
        default: return 'No priority';
      }
    };
  
    useEffect(() => {
      const groupTickets = () => {
        let grouped = {};
        
        switch (grouping) {
          case 'status':
            // Initialize all status groups first
            Object.keys(STATUS_ICONS).forEach(status => {
              grouped[status] = [];
            });
            // Then group tickets
            tickets.forEach(ticket => {
              // Ensure the status exists in our grouped object
              if (!grouped[ticket.status]) {
                grouped[ticket.status] = [];
              }
              grouped[ticket.status].push(ticket);
            });
            break;
            
          case 'user':
            // Initialize groups for all users first
            users.forEach(user => {
              grouped[user.name] = [];
            });
            // Then group tickets
            tickets.forEach(ticket => {
              const user = users.find(u => u.id === ticket.userId);
              if (user && user.name) {
                grouped[user.name].push(ticket);
              }
            });
            break;
            
          case 'priority':
            // Initialize all priority groups first
            Object.keys(PRIORITY_ICONS).forEach(priority => {
              grouped[priority] = [];
            });
            // Then group tickets
            tickets.forEach(ticket => {
              const priorityName = getPriorityName(ticket.priority);
              grouped[priorityName].push(ticket);
            });
            break;
            
          default:
            break;
        }
  
        // Sort tickets within each group
        Object.keys(grouped).forEach(key => {
          if (Array.isArray(grouped[key])) {
            grouped[key].sort((a, b) => {
              if (ordering === 'priority') {
                return b.priority - a.priority;
              } else {
                return a.title.localeCompare(b.title);
              }
            });
          }
        });
  
        setGroupedTickets(grouped);
      };
  
      // Only run grouping if we have tickets and users
      if (tickets.length > 0 && users.length > 0) {
        groupTickets();
      }
    }, [tickets, users, grouping, ordering]);
  
    const getOrderedGroups = () => {
      return Object.entries(groupedTickets).sort(([keyA], [keyB]) => {
        if (grouping === 'status') {
          return (statusOrder[keyA] || 0) - (statusOrder[keyB] || 0);
        } else if (grouping === 'priority') {
          return (priorityOrder[keyA] || 0) - (priorityOrder[keyB] || 0);
        }
        return keyA.localeCompare(keyB);
      });
    };
  
    const getGroupIcon = (groupName) => {
      if (grouping === 'status') return STATUS_ICONS[groupName] || '📋';
      if (grouping === 'priority') return PRIORITY_ICONS[groupName] || '📌';
      return '👤';
    };
  
    // Add loading state
    if (!tickets.length || !users.length) {
      return <div className="board-container">Loading...</div>;
    }
  
    return (
    <div className="board-container">
        <div className="navbar">
          <DisplayButton
            onGroupingChange={onGroupingChange}
            onOrderingChange={onOrderingChange}
          />
        </div>
        <div className="board">
          {getOrderedGroups().map(([group, tickets]) => (
            <div key={group} className="board-column">
              <div className="column-header">
                <div className="header-title">
                  <span className="group-icon">{getGroupIcon(group)}</span>
                  <h2>{group}</h2>
                  <span className="ticket-count">{tickets.length}</span>
                </div>
                <div className="header-actions">
                  <button className="add-button">+</button>
                  <button className="options-button">⋯</button>
                </div>
              </div>
              <div className="column-content">
                {tickets.map(ticket => (
                  <Card 
                    key={ticket.id} 
                    ticket={ticket}
                    user={users.find(u => u.id === ticket.userId)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };
  
export default Board;