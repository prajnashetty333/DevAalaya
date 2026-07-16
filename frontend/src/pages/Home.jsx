import { useState, useRef } from 'react';
import ResultDisplay from '../components/ResultDisplay.jsx';
import ArchitectureCard from '../components/ArchitectureCard.jsx';
import { architectureData } from '../data/architectureData';
import { Link, useNavigate } from 'react-router-dom';
import templeBg from '../assets/temple.jpg';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

const Home = () => {
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [explainResult, setExplainResult] = useState(null);
  const [explainLoading, setExplainLoading] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      setPreviewUrl(URL.createObjectURL(file));
      setResult(null);
      setError(null);
      setExplainResult(null);
      setExplainLoading(false);
    }
  };

  const fetchExplanation = async (imageFile) => {
    setExplainLoading(true);
    setExplainResult(null);
    const formData = new FormData();
    formData.append('image', imageFile);
    try {
      const response = await fetch(`${API_BASE_URL}/explain/`, {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      if (data.success) {
        setExplainResult(data);
      } else {
        console.error('Explanation failed:', data.message);
      }
    } catch (err) {
      console.error('Explanation request error:', err);
    } finally {
      setExplainLoading(false);
    }
  };

  const handleUpload = async () => {
    if (!selectedImage) return;
    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('image', selectedImage);

    try {
      const response = await fetch(`${API_BASE_URL}/predict`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        setResult(data);
        setTimeout(() => {
          document.getElementById('results-section')?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
        
        // Trigger explanation independently
        fetchExplanation(selectedImage);
      } else {
        setError(data.message || 'Prediction failed');
      }
    } catch (err) {
      console.error('Upload prediction error:', err);
      setError('Could not connect to the server. Make sure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setSelectedImage(null);
    setPreviewUrl(null);
    setResult(null);
    setError(null);
    setExplainResult(null);
    setExplainLoading(false);
  };

  return (
    <div 
      className="home-page"
      style={{
        backgroundImage: `linear-gradient(to bottom, rgba(15, 10, 6, 0.8) 0%, rgba(0, 0, 0, 0.95) 100%), url(${templeBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >

      {/* 2. Hero Section */}
      <header className="hero">
        <div className="container">
          <div className="hero-content">
            <h2 className="serif">Discover the Soul of<br/><span>Indian Architecture</span></h2>
            <p className="sans">
              Identify temple architecture, uncover historical significance, and explore immersive virtual museums designed to preserve India’s timeless architectural legacy.
            </p>
            <div className="hero-actions flex gap-4 flex-wrap mt-6">
              <button className="btn btn-primary" onClick={() => document.getElementById('upload-section').scrollIntoView({behavior: 'smooth'})}>
                Upload Temple Image
              </button>
              <button className="btn btn-outline" onClick={() => document.getElementById('styles').scrollIntoView({behavior: 'smooth'})}>
                Learn Styles
              </button>
              <Link to="/museum" className="btn btn-outline" style={{ background: 'rgba(255, 215, 0, 0.1)' }}>
                Explore 3D Museum
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* 3. How It Works */}
      <section id="how-it-works" className="section bg-light">
        <div className="container">
          <div className="section-header">
            <h2 className="serif">How It Works</h2>
            <p className="sans">Analyze architectural heritage in three simple steps.</p>
          </div>
          <div className="steps-grid">
            <div className="step-card glass-card">
              <div className="step-num">01</div>
              <h3 className="serif text-2xl mb-3 text-[#FFD700]">Upload Image</h3>
              <p className="sans text-[#FAF3E0]/80">Upload a clear photo of a temple's Shikhara, Vimana, or Mandapa.</p>
            </div>
            <div className="step-card glass-card">
              <div className="step-num">02</div>
              <h3 className="serif text-2xl mb-3 text-[#FFD700]">AI Analysis</h3>
              <p className="sans text-[#FAF3E0]/80">Our CNN engine extracts features and identifies the architectural lineage.</p>
            </div>
            <div className="step-card glass-card">
              <div className="step-num">03</div>
              <h3 className="serif text-2xl mb-3 text-[#FFD700]">View Results</h3>
              <p className="sans text-[#FAF3E0]/80">Get detailed insights into features, materials, and historical examples.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Temple Styles Section (NOW INTERACTIVE) */}
      <section id="styles" className="section">
        <div className="container">
          <div className="section-header">
            <h2 className="serif">Architectural Styles</h2>
            <p className="sans">Click any card to explore the history and anatomy of each style.</p>
          </div>
          <div className="styles-grid">
            {Object.values(architectureData).map(style => (
              <ArchitectureCard key={style.id} style={style} />
            ))}
          </div>
        </div>
      </section>


      {/* 5. Upload Section */}
      <section id="upload-section" className="section bg-light">
        <div className="container">
          <div className="section-header">
            <h2 className="serif">Identify a Temple</h2>
            <p className="sans">Upload an image below to start the AI analysis.</p>
          </div>
          
          <div className="upload-wrapper">
            {!previewUrl ? (
              <div className="upload-box drop-zone" onClick={() => fileInputRef.current.click()}>
                <div className="icon-circle">↑</div>
                <h3 className="serif text-3xl mb-2 text-[#FAF3E0]">Select Image</h3>
                <p className="sans text-[#FAF3E0]/70">Drag & drop or click to browse</p>
                <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" hidden />
              </div>
            ) : (
              <div className="preview-card">
                <img src={previewUrl} alt="Preview" className="mini-preview" />
                <div className="preview-btns flex justify-center gap-4">
                  <button className="btn btn-primary" onClick={handleUpload} disabled={loading}>
                    {loading ? 'Analyzing...' : 'Analyze Architecture'}
                  </button>
                  <button className="btn btn-outline" onClick={reset}>Change Image</button>
                </div>
                {error && <p className="error-text mt-4 text-red-400 font-bold">{error}</p>}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 6. Results Section */}
      {result && (
        <section id="results-section" className="section result-section">
          <div className="container">
            <ResultDisplay 
              result={result} 
              originalImage={previewUrl} 
              explainResult={explainResult} 
              explainLoading={explainLoading} 
              onReset={reset} 
            />
          </div>
        </section>
      )}
      {/* NEW: 3D Museum Link Section */}
      <section className="section overflow-hidden relative group cursor-pointer" onClick={() => navigate('/museum')}>
        <div className="absolute inset-0 bg-gradient-to-r from-[#FFD700]/5 to-[#D4A373]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
        <div className="container relative z-10 py-16">
          <div className="text-center glass-card border border-[#FFD700]/30 shadow-2xl relative overflow-hidden flex flex-col items-center justify-center" style={{ padding: 'clamp(3rem, 6vw, 6rem)' }}>
            <div className="absolute -inset-1 bg-gradient-to-tr from-[#FFD700] via-[#C5A059] to-[#FFD700] opacity-20 blur-2xl group-hover:opacity-40 transition-opacity pointer-events-none"></div>
            <div className="relative z-10 w-full flex flex-col items-center">
              <h2 className="serif text-white text-4xl md:text-5xl">Enter the <span className="text-[#FFD700]">3D Museum</span></h2>
              <p className="sans text-[#FAF3E0]/80 max-w-xl text-center my-8 text-lg md:text-xl font-light leading-relaxed px-4">
                Step into our virtual gallery and experience the grandeur of Indian temple architecture.
              </p>
              <Link to="/museum" className="btn btn-primary inline-flex text-base md:text-lg px-8 md:px-10 py-3 md:py-4 font-bold shadow-[0_0_30px_rgba(255,215,0,0.3)] hover:shadow-[0_0_40px_rgba(255,215,0,0.6)] hover:-translate-y-2 transition-all duration-300">
                Explore 3D Museum
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
