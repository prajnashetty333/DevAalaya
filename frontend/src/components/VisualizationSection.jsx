import React from 'react';

const VisualizationSection = ({ data }) => {
  return (
    <div className="detail-section animate-fade-in">
      <div className="section-card glass-card">
        <h3 className="section-title serif text-[#FFD700] mb-8 text-3xl">Architectural Anatomy</h3>
        <div className="visual-grid-layout">
          <div className="diagram-box rounded-3xl overflow-hidden border border-[#FFD700]/30 shadow-2xl relative group">
            <div className="absolute inset-0 bg-[#FFD700]/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <img src={data.diagram} alt="Structural Diagram" className="diagram-image w-full h-auto" />
          </div>
          <div className="components-list space-y-6">
            {data.components.map((comp, idx) => (
              <div key={idx} className="comp-item bg-black/40 p-5 rounded-2xl border border-[#FFD700]/10 hover:border-[#FFD700]/40 transition-colors shadow-inner">
                <span className="comp-name serif text-2xl text-[#FFD700] block mb-2">{comp.name}</span>
                <p className="comp-desc sans text-[#FAF3E0]/80 leading-relaxed text-sm">{comp.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VisualizationSection;
