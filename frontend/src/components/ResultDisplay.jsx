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
    <div className="result-dashboard animate-fade-in">
      <div className="white-card result-main-card">
        {/* Header Section */}
        <div className="result-header">
          <div className="status-indicator">
            <span className={`status-dot ${uncertain ? 'warning' : 'success'}`}></span>
            {uncertain ? 'Ambiguous Signature' : 'Heritage Signature Verified'}
          </div>
          <h2 className="serif result-title">{style.title}</h2>
          <p className="sans result-desc">{style.description}</p>
        </div>

        {/* Results Grid */}
        <div className="result-grid">
          {/* Visual Analysis */}
          <div className="visual-panel">
            <div className="image-frame-elevated">
              <img src={originalImage} alt="Input Analysis" />
            </div>
            
            <div className="confidence-meter">
              <div className="meter-label">
                <span>Analysis Confidence</span>
                <span className="bold">{(confidence * 100).toFixed(1)}%</span>
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
          <div className="specs-panel">
            <div className="spec-group">
              <h4>Key Architectural Features</h4>
              <div className="feature-tags">
                {style.features.map(f => <span key={f} className="tag">{f}</span>)}
              </div>
            </div>

            <div className="spec-row">
              <div className="spec-item">
                <h4>Historical Examples</h4>
                <p>{style.examples.join(', ')}</p>
              </div>
              <div className="spec-item">
                <h4>Prime Materials</h4>
                <p>{style.materials.join(', ')}</p>
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
