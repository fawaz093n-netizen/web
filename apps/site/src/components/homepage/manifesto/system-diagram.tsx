import manifesto from "@/data/homepage-manifesto.json";

export function SystemDiagram() {
  const { platform } = manifesto;

  return (
    <div className="marketing-arch">
      <div className="marketing-arch-row">
        {platform.products.map((product) => (
          <div
            key={product.label}
            className={`marketing-arch-cell${product.brand ? " brand" : ""}`}
          >
            <div className="marketing-arch-cell-label">{product.label}</div>
            <div className="marketing-arch-cell-title">{product.title}</div>
            <div className="marketing-arch-cell-body">{product.body}</div>
            <div className="marketing-arch-cell-icon">
              <i className={product.icon} aria-hidden />
            </div>
          </div>
        ))}
      </div>
      <div className="marketing-arch-foot">
        <div>{platform.footLeft}</div>
        <div>{platform.footRight}</div>
      </div>
    </div>
  );
}
