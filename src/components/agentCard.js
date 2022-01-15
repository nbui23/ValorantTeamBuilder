import React from "react";

const agentCard = ({ role, name, img, handleClick }) => {
  return (
    <div className="card-container" onClick={() => handleClick(name)}>
      <div className="img-container">
        <img src={img} alt={name} />
      </div>
      <div className="info">
        <h3 className="name">{name}</h3>
        <small className="role">
          <span>Role: {role}</span>
        </small>
      </div>
    </div>
  );
};

export default agentCard;
