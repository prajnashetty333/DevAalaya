import React from 'react';
import { Link } from 'react-router-dom';
import logoImg from '../../assets/logo.png';

const Footer = () => {
  return (
    <footer className="footer py-24 relative overflow-hidden">
      {/* Decorative Top Border */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#FFD700] to-transparent opacity-50"></div>
      
      <div className="container text-center relative z-10">
        <div className="logo flex flex-col items-center gap-4 mb-12">
          <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-[#FFD700]/50 shadow-[0_0_30px_rgba(255,215,0,0.4)] flex items-center justify-center bg-black">
            <img src={logoImg} alt="DevAlaya" className="w-full h-full object-cover object-center scale-110" />
          </div>
          <h2 className="serif text-white text-3xl">DevAlaya</h2>
          <p className="sans text-[#FFD700] font-bold tracking-[0.3em] uppercase text-xs">Digital Heritage Sanctum</p>
        </div>
        
        <div className="w-full max-w-lg mx-auto h-px bg-white/10 mb-12"></div>
        
        <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16">
          <Link to="/" className="sans no-underline text-white/60 hover:text-[#FFD700] transition-colors font-bold text-xs tracking-widest">LANDING PAGE</Link>
        </div>
        
        <p className="mt-16 text-white/20 sans text-[10px] tracking-[0.5em] uppercase">
          &copy; {new Date().getFullYear()} DevAlaya Preservation Initiative • All Models Educational Purpose
        </p>
      </div>
    </footer>
  );
};

export default Footer;
