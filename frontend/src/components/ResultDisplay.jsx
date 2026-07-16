
const ResultDisplay = ({ result, originalImage, explainResult, explainLoading, onReset }) => {
  if (!result) return null;

  const {
    prediction,
    confidence,
    uncertain,
    class_probabilities
  } = result;

  if (prediction === "Unknown / Non-Temple" || uncertain === true) {
    return (
      <div className="result-dashboard animate-fade-in mt-12">
        <div className="glass-card result-main-card border border-[#FFD700]/30 shadow-[0_0_40px_rgba(255,215,0,0.1)] bg-[#0F0A06]/80 backdrop-blur-2xl">
          {/* Header Section */}
          <div className="result-header text-center mb-12">
            <div className="status-indicator inline-flex items-center gap-3 px-6 py-2 rounded-full border border-white/10 bg-black/50 backdrop-blur mb-6">
              <span className="status-dot w-3 h-3 rounded-full shadow-[0_0_10px_rgba(255,165,0,0.8)] bg-amber-500"></span>
              <span className="text-[#FAF3E0] font-bold tracking-widest text-xs uppercase">Unidentified Signature</span>
            </div>
            <h2 className="serif result-title text-6xl mb-4 text-[#FFD700] drop-shadow-lg">Style Unidentified</h2>
            <p className="sans result-desc text-[#FAF3E0]/80 text-xl max-w-2xl mx-auto">
              We could not confidently identify a major temple architectural style (Nagara, Dravidian, or Kalinga) in this image.
            </p>
          </div>

          {/* Results Grid */}
          <div className="result-grid">
            {/* Visual Analysis */}
            <div className="visual-panel">
              <div className="image-frame-elevated rounded-3xl overflow-hidden border-4 border-[#FFD700]/20 shadow-2xl relative mb-8">
                <div className="absolute inset-0 bg-black/20 pointer-events-none"></div>
                <img src={originalImage} alt="Input Analysis" className="w-full h-auto object-cover" />
              </div>
            </div>

            {/* Explanation & Action */}
            <div className="specs-panel flex flex-col justify-center gap-8 pl-0 lg:pl-10">
              <div className="spec-group">
                <h4 className="serif text-2xl text-[#FFD700] mb-4">Possible Reasons</h4>
                <ul className="sans text-[#FAF3E0]/80 text-base space-y-3 list-disc list-inside">
                  <li>The image might not depict a recognized Indian heritage temple.</li>
                  <li>The photo angle, lighting, or crop may not capture characteristic components (such as Shikharas, Vimanas, or Mandapas).</li>
                  <li>The temple belongs to a style or regional subset not currently in the model's dataset.</li>
                </ul>
              </div>

              <div className="result-actions">
                <button className="btn btn-primary" onClick={onReset}>
                  Try another image
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }


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

              {class_probabilities && (
                <div className="class-breakdown-container mt-6 pt-6 border-t border-[#FFD700]/10 flex flex-col gap-4">
                  {Object.entries(class_probabilities)
                    .sort((a, b) => b[1] - a[1])
                    .map(([name, prob]) => {
                      const capitalized = name.charAt(0).toUpperCase() + name.slice(1);
                      const barColor = styleData[name.toLowerCase()]?.color || style.color;
                      return (
                        <div key={name} className="class-breakdown-item">
                          <div className="flex justify-between mb-2 text-[#FAF3E0] font-bold text-xs uppercase tracking-wider">
                            <span>{capitalized}</span>
                            <span className="text-[#FFD700]">{prob.toFixed(1)}%</span>
                          </div>
                          <div className="meter-track">
                            <div 
                              className="meter-fill" 
                              style={{ width: `${prob}%`, backgroundColor: barColor }}
                            ></div>
                          </div>
                        </div>
                      );
                    })}
                </div>
              )}
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

        {/* Explainability Section */}
        {(explainLoading || explainResult) && (
          <div className="explainability-section mt-12 pt-12 border-t border-[#FFD700]/10">
            <h3 className="serif text-[#FFD700] text-3xl mb-8">AI Explainability Analysis</h3>

            {explainLoading && (
              <div className="glass-card bg-[#0F0A06]/60 rounded-3xl p-8 border border-[#FFD700]/10 animate-pulse text-center">
                <p className="sans text-[#FFD700] text-xs font-semibold uppercase tracking-widest">Generating heatmaps...</p>
              </div>
            )}

            {!explainLoading && explainResult && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* GradCAM Card */}
                  <div className="explain-card glass-card bg-black/30 p-6 rounded-3xl border border-[#FFD700]/10 flex flex-col gap-4">
                    <div>
                      <h4 className="sans uppercase tracking-widest text-xs text-[#FFD700] font-bold mb-1">GradCAM Heatmap</h4>
                      <p className="sans text-[#FAF3E0]/60 text-sm">Regions the AI focused on most</p>
                    </div>
                    <div className="image-frame-elevated rounded-3xl overflow-hidden border-4 border-[#FFD700]/20 shadow-2xl relative">
                      <img src={`data:image/png;base64,${explainResult.gradcam_base64}`} alt="GradCAM" className="w-full h-auto object-cover" />
                    </div>
                  </div>

                  {/* LIME Card */}
                  <div className="explain-card glass-card bg-black/30 p-6 rounded-3xl border border-[#FFD700]/10 flex flex-col gap-4">
                    <div>
                      <h4 className="sans uppercase tracking-widest text-xs text-[#FFD700] font-bold mb-1">LIME Explanation</h4>
                      <p className="sans text-[#FAF3E0]/60 text-sm">Architectural segments that influenced the decision</p>
                    </div>
                    <div className="image-frame-elevated rounded-3xl overflow-hidden border-4 border-[#FFD700]/20 shadow-2xl relative">
                      <img src={`data:image/png;base64,${explainResult.lime_base64}`} alt="LIME" className="w-full h-auto object-cover" />
                    </div>
                  </div>
                </div>

                <p className="sans text-xs text-[#FAF3E0]/40 mt-6 leading-relaxed">
                  Explainability maps highlight architectural regions that influenced the classification. GradCAM shows gradient activation, LIME shows segment contribution.
                </p>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ResultDisplay;
