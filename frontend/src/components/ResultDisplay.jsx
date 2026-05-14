import React from 'react';

const ResultDisplay = ({ result, originalImage, onReset }) => {
  if (!result) return null;

  const {
    prediction,
    confidence,
    uncertain
  } = result;

  // Heritage Style Intelligence
  const styleData = {
    'dravidian': {
      title: 'Dravidian Architecture',
      description: 'The majestic architecture of South India, defined by pyramidal towers and massive gateways.',
      features: ['Vimana (Pyramidal Tower)', 'Gopurams (Gateways)', 'Mandapas', 'Temple Tanks'],
      examples: ['Brihadisvara Temple', 'Meenakshi Amman', 'Shore Temple'],
      materials: ['Granite', 'Sandstone', 'Soapstone'],
      color: '#D4A373'
    },
    'nagara': {
      title: 'Nagara Architecture',
      description: 'The curvilinear architectural lineage of North India, famous for its beehive-shaped towers.',
      features: ['Shikhara (Curvilinear Tower)', 'Amalaka (Stone Disc)', 'Kalasha (Pot Finial)', 'Jagati'],
      examples: ['Khajuraho Group', 'Konark Sun Temple', 'Lingaraja Temple'],
      materials: ['Red Sandstone', 'Buff Sandstone', 'Granite'],
      color: '#C5A059'
    },
    'kalinga': {
      title: 'Kalinga Architecture',
      description: 'The monumental stone architecture of Odisha, characterized by the Deula (tower) and Jagamohana.',
      features: ['Rekha Deula (Tower)', 'Jagamohana (Hall)', 'Amalaka & Kalasha', 'Stone Relief Art'],
      examples: ['Konark Sun Temple', 'Lingaraja Temple', 'Mukteshvara Temple'],
      materials: ['Chlorite', 'Laterite', 'Khondalite'],
      color: '#FFD700'
    }
  };

  const style = styleData[prediction.toLowerCase()] || {
    title: prediction,
    description: 'A unique heritage style exhibiting regional craftsmanship and structural precision.',
    features: ['Unique Carvings', 'Symmetric Geometry'],
    examples: ['Regional Sites'],
    materials: ['Local Masonry'],
    color: '#D4A373'
  };

  return (
    <div className="result-dashboard animate-fade-in mt-12">
      <div className="glass-card result-main-card border border-[#FFD700]/30 shadow-[0_0_40px_rgba(255,215,0,0.1)] bg-[#0F0A06]/80 backdrop-blur-2xl">
        {/* Header Section */}
        <div className="result-header text-center mb-12">
          <div className="status-indicator inline-flex items-center gap-3 px-6 py-2 rounded-full border border-white/10 bg-black/50 backdrop-blur mb-6">
            <span className={`status-dot w-3 h-3 rounded-full shadow-[0_0_10px_rgba(255,255,255,0.8)] ${uncertain ? 'bg-amber-500' : 'bg-emerald-500'}`}></span>
            <span className="text-[#FAF3E0] font-bold tracking-widest text-xs uppercase">{uncertain ? 'Ambiguous Signature' : 'Heritage Signature Verified'}</span>
          </div>
          <h2 className="serif result-title text-6xl mb-4 text-[#FFD700] drop-shadow-lg">{style.title}</h2>
          <p className="sans result-desc text-[#FAF3E0]/80 text-xl max-w-2xl mx-auto">{style.description}</p>
        </div>

        {/* Results Grid */}
        <div className="result-grid">
          {/* Visual Analysis */}
          <div className="visual-panel">
            <div className="image-frame-elevated rounded-3xl overflow-hidden border-4 border-[#FFD700]/20 shadow-2xl relative mb-8">
              <div className="absolute inset-0 bg-black/20 pointer-events-none"></div>
              <img src={originalImage} alt="Input Analysis" className="w-full h-auto object-cover" />
            </div>
            
            <div className="confidence-meter bg-black/40 p-6 rounded-3xl border border-[#FFD700]/10 shadow-inner">
              <div className="meter-label flex justify-between mb-3 text-[#FAF3E0] font-bold">
                <span className="uppercase tracking-widest text-xs">Analysis Confidence</span>
                <span className="text-[#FFD700] text-lg">{(confidence * 100).toFixed(1)}%</span>
              </div>
              <div className="meter-track">
                <div 
                  className="meter-fill" 
                  style={{ width: `${confidence * 100}%`, backgroundColor: style.color }}
                ></div>
              </div>
            </div>
          </div>

          {/* Intelligence Panel */}
          <div className="specs-panel flex flex-col justify-center gap-8 pl-0 lg:pl-10">
            <div className="spec-group">
              <h4 className="serif text-2xl text-[#FFD700] mb-4">Key Architectural Features</h4>
              <div className="feature-tags flex flex-wrap gap-3">
                {style.features.map(f => <span key={f} className="tag bg-[#2B1D11] border border-[#FFD700]/20 text-[#FAF3E0] px-4 py-2 rounded-full text-sm font-medium shadow-md">{f}</span>)}
              </div>
            </div>

            <div className="spec-row grid grid-cols-1 md:grid-cols-2 gap-6 bg-black/30 p-6 rounded-3xl border border-white/5">
              <div className="spec-item">
                <h4 className="sans uppercase tracking-widest text-xs text-[#FFD700]/70 font-bold mb-2">Historical Examples</h4>
                <p className="text-[#FAF3E0] text-sm leading-relaxed">{style.examples.join(', ')}</p>
              </div>
              <div className="spec-item">
                <h4 className="sans uppercase tracking-widest text-xs text-[#FFD700]/70 font-bold mb-2">Prime Materials</h4>
                <p className="text-[#FAF3E0] text-sm leading-relaxed">{style.materials.join(', ')}</p>
              </div>
            </div>

            <div className="result-actions">
              <button className="btn btn-primary" onClick={onReset}>
                New Analysis
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultDisplay;
