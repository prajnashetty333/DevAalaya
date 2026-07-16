import { Link, useLocation } from 'react-router-dom';
import { Home } from 'lucide-react';
import logoImg from '../../assets/logo.png';

const Navbar = () => {
  const location = useLocation();
  const isMuseum = location.pathname === '/museum';
  const isDetail = location.pathname.includes('/architecture/');

  return (
    <nav className="navbar">
      <div className="container nav-content">
        <Link to="/" className="logo flex items-center gap-3 no-underline">
          <div className="w-12 h-12 rounded-full overflow-hidden border border-[#FFD700]/40 shadow-[0_0_15px_rgba(255,215,0,0.3)] flex items-center justify-center bg-black">
            <img src={logoImg} alt="DevAlaya" className="w-full h-full object-cover object-center scale-110" />
          </div>
          <h1 className="serif m-0 text-2xl font-bold text-[#FFD700]">DevAlaya</h1>
        </Link>
        
        <div className="nav-links">
          {isMuseum || isDetail ? (
            <>
              <Link to="/" className="sans no-underline font-bold text-sm text-[#FAF3E0]/80 hover:text-[#FFD700] transition-colors flex items-center gap-2">
                <Home size={18} /> BACK TO HOME
              </Link>
              <div className="h-6 w-px bg-white/20 hidden md:block"></div>
              <span className="badge m-0 hidden md:block border border-[#FFD700]/30 text-[#FFD700] bg-[#FFD700]/10">
                {isMuseum ? 'Virtual Museum' : 'Heritage Detail'}
              </span>
            </>
          ) : (
            <>
              <a href="#styles">Temple Styles</a>
              <a href="#how-it-works">How It Works</a>
              <button className="btn btn-primary" onClick={() => document.getElementById('upload-section')?.scrollIntoView({behavior: 'smooth'})}>
                Try Now
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
