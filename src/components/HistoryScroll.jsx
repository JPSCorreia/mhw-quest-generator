import { rankFor } from '../lib/data';

export default function HistoryScroll({ history, onRemove }) {
  return (
    <section className="qg-panel qg-col-history">
      <div className="qg-panel-hd">
        <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
          <path d="M3 6h18M3 12h18M3 18h18" />
        </svg>
        <h3>Field Log</h3>
        <span className="count">{history.length}</span>
      </div>
      <div className="qg-panel-bd">
        {history.length === 0 ? (
          <div className="qg-history-empty">
            No quests issued yet.<br />The board is empty.
          </div>
        ) : (
          <div className="qg-history-list">
            {history.map((q, i) => (
              <div key={q.id ?? i} className="qg-history-item">
                <div className="qg-history-num">
                  №{String(history.length - i).padStart(2, '0')}
                </div>
                <div className="qg-history-body">
                  <div className="qg-history-pair">{q.weapon} · {q.monster}</div>
                  <div className="qg-history-meta">{rankFor(q.monster).name}</div>
                </div>
                <button
                  type="button"
                  className="qg-history-del"
                  onClick={() => onRemove?.(q.id)}
                  aria-label="Remove entry"
                  title="Remove entry"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M6 6l12 12M18 6L6 18" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
