import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { architectureData } from '../data/architectureData';
import HistorySection from '../components/HistorySection';
import VisualizationSection from '../components/VisualizationSection';
import TempleMap from '../components/TempleMap';

const ArchitectureDetail = () => {
  const { styleId } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('features'); // 'features', 'history', 'visual', 'map'
  const [data, setData] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const styleData = architectureData[styleId.toLowerCase()];
    if (styleData) {
      setData(styleData);
      window.scrollTo(0, 0);
    } else {
      navigate('/');
    }
  }, [styleId, navigate]);

  if (!data) return null;

  return (
    <div className="detail-page app-container selection:bg-[#FFD700]/30">

      {/* Hero Banner */}
      <header 
        className="detail-hero" 
        style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url(${data.heroImage})` }}
      >
        <div className="container">
          <span className="badge">Heritage Architecture</span>
          <h2 className="serif text-white drop-shadow-2xl">{data.title}</h2>
          <p className="detail-intro">{data.description}</p>
        </div>
      </header>

      {/* Interactive Controls */}
      <section className="detail-content section">
        <div className="container">
          <div className="tab-controls">
            <button 
              className={`tab-btn ${activeTab === 'features' ? 'active' : ''}`}
              onClick={() => setActiveTab('features')}
            >
              Key Features
            </button>
            <button 
              className={`tab-btn ${activeTab === 'history' ? 'active' : ''}`}
              onClick={() => setActiveTab('history')}
            >
              History & Timeline
            </button>
            <button 
              className={`tab-btn ${activeTab === 'visual' ? 'active' : ''}`}
              onClick={() => setActiveTab('visual')}
            >
              Visual Breakdown
            </button>
            <button 
              className={`tab-btn ${activeTab === 'map' ? 'active' : ''}`}
              onClick={() => setActiveTab('map')}
            >
              Temple Map
            </button>
          </div>

          {/* Dynamic Content Rendering */}
          <div className="tab-content">
            {activeTab === 'features' && (
              <div className="features-view animate-fade-in">
                <div className="glass-card">
                  <h3 className="section-title serif text-[#FFD700] mb-6 text-3xl">Defining Characteristics</h3>
                  <div className="features-list-grid">
                    {data.features.map(f => (
                      <div key={f} className="feature-pill border border-[#FFD700]/30 bg-black/40 text-[#FAF3E0] shadow-md hover:bg-[#FFD700]/10 transition-colors">{f}</div>
                    ))}
                  </div>
                  
                  <div className="examples-box mt-10 p-6 bg-black/40 border border-[#FFD700]/20 rounded-2xl">
                    <h4 className="sub-title serif text-[#FFD700] mb-4 text-xl">Famous Temple Examples</h4>
                    <ul className="examples-list space-y-2 text-[#FAF3E0]/80">
                      {data.examples.map(e => <li key={e} className="flex items-center gap-2"><span className="text-[#FFD700]">✦</span> {e}</li>)}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'history' && <HistorySection data={data.history} />}
            {activeTab === 'visual' && <VisualizationSection data={data.visualization} />}
            {activeTab === 'map' && <TempleMap mapData={data.mapData} />}
          </div>
        </div>
      </section>
    </div>
  );
};

export default ArchitectureDetail;
