export default function VersusMark() {
  return (
    <div className="qg-versus-mark">
      <svg viewBox="0 0 120 120" aria-hidden>
        <defs>
          <radialGradient id="vs-g" cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor="#a6ffb0" stopOpacity=".9" />
            <stop offset="60%"  stopColor="#21c94a" stopOpacity=".2" />
            <stop offset="100%" stopColor="#0c6d23" stopOpacity="0" />
          </radialGradient>
        </defs>
        <circle cx="60" cy="60" r="50" fill="url(#vs-g)" />
        <circle cx="60" cy="60" r="42" fill="none" stroke="#d9b24e" strokeWidth="1"   opacity=".6" />
        <circle cx="60" cy="60" r="34" fill="none" stroke="#d9b24e" strokeWidth=".6"  opacity=".4" />
        <text
          x="63" y="72"
          fontFamily="Cinzel, serif" fontWeight="900" fontSize="36" letterSpacing="6"
          fill="#f3e0a1" textAnchor="middle"
          style={{ textShadow: '0 0 12px rgba(91,255,125,.8)' }}
        >VS</text>
        <g opacity=".5" stroke="#d9b24e" strokeWidth=".8" fill="none">
          <path d="M12 60 L28 60 M92 60 L108 60" />
          <path d="M22 55 L28 60 L22 65 M98 55 L92 60 L98 65" />
        </g>
      </svg>
    </div>
  );
}
