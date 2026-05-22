import manifesto from "@/data/homepage-manifesto.json";

export function AgentTimeline() {
  const { timeline } = manifesto;

  return (
    <div className="marketing-timeline">
      <div className="marketing-timeline-head">
        <div className="marketing-timeline-title">
          <i className="fa-light fa-sparkles" aria-hidden />
          {timeline.title}
        </div>
        <div className="marketing-timeline-meta font-mono">{timeline.meta}</div>
      </div>
      <div className="marketing-timeline-body">
        {timeline.rows.map((row) => (
          <div
            key={`${row.tag}-${row.dur}`}
            className={`marketing-timeline-row${row.ok ? " ok" : ""}`}
          >
            <div className="marketing-timeline-tag">{row.tag}</div>
            <div className="marketing-timeline-cell">
              {row.tag === "PROMPT" ? (
                <>&ldquo;{row.body}&rdquo;</>
              ) : (
                row.body
              )}
              {row.code ? (
                <div className="marketing-timeline-code">
                  <span className="kw">export default function</span>{" "}
                  <span className="fn">Checkout</span>() {"{"}{" "}
                  <span className="cm">/* … */</span> {"}"}
                </div>
              ) : null}
            </div>
            <div className="marketing-timeline-dur font-mono">{row.dur}</div>
          </div>
        ))}
      </div>
      <div className="marketing-timeline-foot">
        <div className="marketing-timeline-blink" aria-hidden />
        <span className="font-mono">{timeline.foot}</span>
      </div>
    </div>
  );
}
