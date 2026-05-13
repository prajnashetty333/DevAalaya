import React, { useState, useRef } from 'react';
import ResultDisplay from '../components/ResultDisplay.jsx';
import ArchitectureCard from '../components/ArchitectureCard.jsx';
import { architectureData } from '../data/architectureData';

const API_BASE_URL = 'http://localhost:5000';

const Home = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      setPreviewUrl(URL.createObjectURL(file));
      setResult(null);
      setError(null);
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
      } else {
        setError(data.message || 'Prediction failed');
      }
    } catch (err) {
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
  };

  return (
    <div className="home-page">
      {/* 1. Sticky Navbar */}
      <nav className="navbar">
        <div className="container nav-content">
          <div className="logo">
            <span className="logo-icon">🛕</span>
            <h1>DevAlaya</h1>
          </div>
          <div className="nav-links">
            <a href="#styles">Temple Styles</a>
            <a href="#how-it-works">How It Works</a>
            <button className="btn btn-primary" onClick={() => document.getElementById('upload-section').scrollIntoView({behavior: 'smooth'})}>
              Try Now
            </button>
          </div>
        </div>
      </nav>

      {/* 2. Hero Section */}
      <header className="hero">
        <div className="container">
          <div className="hero-content">
            <span className="badge">AI-Powered Heritage Assistant</span>
            <h2 className="serif">Discover the Soul of<br/><span>Indian Architecture</span></h2>
            <p className="sans">
              Upload temple images and discover whether they belong to Dravidian, 
              Nagara, or Kalinga architecture using state-of-the-art AI analysis.
            </p>
            <div className="hero-actions">
              <button className="btn btn-primary" onClick={() => document.getElementById('upload-section').scrollIntoView({behavior: 'smooth'})}>
                Upload Temple Image
              </button>
              <button className="btn btn-outline" onClick={() => document.getElementById('styles').scrollIntoView({behavior: 'smooth'})}>
                Learn Styles
              </button>
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
            <div className="step-card white-card">
              <div className="step-num">01</div>
              <h3>Upload Image</h3>
              <p>Upload a clear photo of a temple's Shikhara, Vimana, or Mandapa.</p>
            </div>
            <div className="step-card white-card">
              <div className="step-num">02</div>
              <h3>AI Analysis</h3>
              <p>Our CNN engine extracts features and identifies the architectural lineage.</p>
            </div>
            <div className="step-card white-card">
              <div className="step-num">03</div>
              <h3>View Results</h3>
              <p>Get detailed insights into features, materials, and historical examples.</p>
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
              <div className="upload-box white-card drop-zone" onClick={() => fileInputRef.current.click()}>
                <div className="icon-circle">↑</div>
                <h3>Select Image</h3>
                <p>Drag & drop or click to browse</p>
                <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" hidden />
              </div>
            ) : (
              <div className="preview-card white-card">
                <img src={previewUrl} alt="Preview" className="mini-preview" />
                <div className="preview-btns">
                  <button className="btn btn-primary" onClick={handleUpload} disabled={loading}>
                    {loading ? 'Analyzing...' : 'Analyze Architecture'}
                  </button>
                  <button className="btn btn-outline" onClick={reset}>Change</button>
                </div>
                {error && <p className="error-text">{error}</p>}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 6. Results Section */}
      {result && (
        <section id="results-section" className="section result-section">
          <div className="container">
            <ResultDisplay result={result} originalImage={previewUrl} onReset={reset} />
          </div>
        </section>
      )}

      {/* 7. Footer */}
      <footer className="footer">
        <div className="container footer-content">
          <div className="footer-brand">
            <h2 className="serif">DevAlaya</h2>
            <p className="sans">Preserving Indian Heritage Through AI</p>
          </div>
          <div className="footer-links">
            <a href="#">GitHub</a>
            <a href="#">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
