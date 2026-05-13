import React from 'react';

const HistorySection = ({ data }) => {
  return (
    <div className="detail-section animate-fade-in">
      <div className="section-card white-card">
        <h3 className="section-title serif">Historical Lineage</h3>
        <div className="history-grid">
          <div className="history-item">
            <label>Origin</label>
            <p>{data.origin}</p>
          </div>
          <div className="history-item">
            <label>Main Dynasty</label>
            <p>{data.dynasty}</p>
          </div>
          <div className="history-item">
            <label>Timeline</label>
            <p>{data.timeline}</p>
          </div>
          <div className="history-item full-width">
            <label>Evolution</label>
            <p>{data.evolution}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HistorySection;
