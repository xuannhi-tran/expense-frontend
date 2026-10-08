function DemoBanner({ onExit }) {
  return (
    <div className="demo-banner" role="status">
      <span>Demo mode - sample data, nothing is saved.</span>
      <button type="button" className="demo-banner-exit" onClick={onExit}>
        Exit demo
      </button>
    </div>
  );
}

export default DemoBanner;
