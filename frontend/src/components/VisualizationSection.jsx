import React from 'react';

const VisualizationSection = ({ data }) => {
  return (
    <div className="detail-section animate-fade-in">
      <div className="section-card white-card">
        <h3 className="section-title serif">Architectural Anatomy</h3>
        <div className="visual-grid-layout">
          <div className="diagram-box">
            <img src={data.diagram} alt="Structural Diagram" className="diagram-image" />
          </div>
          <div className="components-list">
            {data.components.map((comp, idx) => (
              <div key={idx} className="comp-item">
                <span className="comp-name">{comp.name}</span>
                <p className="comp-desc">{comp.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VisualizationSection;
