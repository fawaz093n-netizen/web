import manifesto from "@/data/homepage-manifesto.json";

export function ThesisSection() {
  const { thesis } = manifesto;

  return (
    <section className="marketing-section">
      <div className="mx-auto max-w-[81rem] px-4 md:px-0">
        <div className="marketing-section-header">
          <div className="marketing-eyebrow">{thesis.eyebrow}</div>
          <div className="marketing-meta">{thesis.meta}</div>
        </div>

        <div className="marketing-thesis-list">
          {thesis.items.map((item) => (
            <article key={item.n} className="marketing-thesis-item">
              <div className="num">§ {item.n}</div>
              <div>
                <h3>{item.title}</h3>
                <p>{item.body}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
