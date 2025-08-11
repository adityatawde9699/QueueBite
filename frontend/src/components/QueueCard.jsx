import React from 'react';
import './QueueCard.css';

const QueueCard = ({ order, onUpdateStatus }) => {
  const { id, token, status, items } = order;

  const getStatusClass = () => {
    switch (status) {
      case 'Pending':
        return 'status-pending';
      case 'In Progress':
        return 'status-in-progress';
      case 'Ready':
        return 'status-ready';
      default:
        return '';
    }
  };

  const renderActions = () => {
    switch (status) {
      case 'Pending':
        return (
          <button
            className="action-button action-start"
            onClick={() => onUpdateStatus(id, 'In Progress')}
          >
            Start Cooking
          </button>
        );
      case 'In Progress':
        return (
          <button
            className="action-button action-ready"
            onClick={() => onUpdateStatus(id, 'Ready')}
          >
            Mark as Ready
          </button>
        );
      case 'Ready':
        return (
          <button
            className="action-button action-serve"
            onClick={() => onUpdateStatus(id, 'Served')}
          >
            Mark as Served
          </button>
        );
      default:
        return null;
    }
  };


  return (
    <div className={`queue-card ${getStatusClass()}`}>
      <div className="card-main-content">
        <h3 className="order-token-display">{token}</h3>
        <p className={`order-status-badge ${getStatusClass()}`}>{status}</p>
        <ul className="order-items-list">
          {items.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </div>
      {onUpdateStatus && (
        <div className="card-action-panel">
            {renderActions()}
        </div>
      )}
    </div>
  );
};

export default QueueCard;
