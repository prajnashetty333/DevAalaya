
const HistorySection = ({ data }) => {
  return (
    <div className="detail-section animate-fade-in">
      <div className="section-card glass-card">
        <h3 className="section-title serif text-[#FFD700] mb-6 text-3xl">Historical Lineage</h3>
        <div className="history-grid">
          <div className="history-item">
            <label className="text-[#FFD700] font-bold tracking-widest text-xs uppercase mb-2 block">Origin</label>
            <p className="text-[#FAF3E0] text-lg">{data.origin}</p>
          </div>
          <div className="history-item">
            <label className="text-[#FFD700] font-bold tracking-widest text-xs uppercase mb-2 block">Main Dynasty</label>
            <p className="text-[#FAF3E0] text-lg">{data.dynasty}</p>
          </div>
          <div className="history-item">
            <label className="text-[#FFD700] font-bold tracking-widest text-xs uppercase mb-2 block">Timeline</label>
            <p className="text-[#FAF3E0] text-lg">{data.timeline}</p>
          </div>
          <div className="history-item full-width mt-6 p-6 bg-black/40 border border-[#FFD700]/20 rounded-2xl">
            <label className="text-[#FFD700] font-bold tracking-widest text-xs uppercase mb-2 block">Evolution</label>
            <p className="text-[#FAF3E0]/80 leading-relaxed">{data.evolution}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HistorySection;
