import React from 'react';
import './Card.css';

const Card = ({ ticket, user }) => {
  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 4: return '🔴'; // Urgent
      case 3: return '🟡'; // High
      case 2: return '🟢'; // Medium
      case 1: return '⚪'; // Low
      default: return '⚫'; // No priority
    }
  };

  return (
    <div className="card">
      <div className="card-header">
        <span className="ticket-id">{ticket.id}</span>
        <span className="user-avatar">
          {user?.available ? '🟢' : '⚫'}
          {user?.name?.charAt(0)}
        </span>
      </div>
      <div className="card-title">
        <h3>{ticket.title}</h3>
      </div>
      <div className="card-footer">
        <span className="priority-icon">
          {getPriorityIcon(ticket.priority)}
        </span>
        <span className="tag">
          {ticket.tag[0]}
        </span>
      </div>
    </div>
  );
};

export default Card;