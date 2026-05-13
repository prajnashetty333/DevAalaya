import React from 'react';
import { useNavigate } from 'react-router-dom';

const ArchitectureCard = ({ style }) => {
  const navigate = useNavigate();

  return (
    <div 
      className="style-card white-card clickable-card" 
      onClick={() => navigate(`/architecture/${style.id}`)}
    >
      <div className="card-image-wrapper">
        <img src={style.heroImage} alt={style.title} className="card-cover-image" />
        <div className="card-overlay">
          <span className="view-details">Explore Heritage →</span>
        </div>
      </div>
      <div className="style-info">
        <h3>{style.title}</h3>
        <p className="style-region"><strong>Region:</strong> {style.region}</p>
        <p className="style-desc-short">{style.description.substring(0, 80)}...</p>
      </div>
    </div>
  );
};

export default ArchitectureCard;
