import React from 'react';
import { useNavigate } from 'react-router-dom';

const ArchitectureCard = ({ style }) => {
  const navigate = useNavigate();

  return (
    <div 
      className="style-card glass-card clickable-card border border-[#FFD700]/20 hover:border-[#FFD700]/50 bg-black/40 group transition-all duration-300" 
      onClick={() => navigate(`/architecture/${style.id}`)}
    >
      <div className="card-image-wrapper">
        <img src={style.heroImage} alt={style.title} className="card-cover-image" />
        <div className="card-overlay">
          <span className="view-details">Explore Heritage →</span>
        </div>
      </div>
      <div className="style-info p-6">
        <h3 className="serif text-[#FFD700] text-2xl mb-2">{style.title}</h3>
        <p className="style-region sans text-[#FAF3E0] text-sm mb-3"><strong className="text-[#FFD700]/70">Region:</strong> {style.region}</p>
        <p className="style-desc-short sans text-[#FAF3E0]/70 leading-relaxed text-sm">{style.description.substring(0, 80)}...</p>
      </div>
    </div>
  );
};

export default ArchitectureCard;
