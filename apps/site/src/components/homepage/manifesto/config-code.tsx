export function ConfigCode() {
  return (
    <div className="marketing-code-panel">
      <div className="marketing-code-panel-head">
        <div className="marketing-code-panel-tab on">
          <i className="fa-light fa-file-lines" aria-hidden />
          prisma.config.ts
        </div>
        <div className="marketing-code-panel-tab">
          <i className="fa-light fa-file-lines" aria-hidden />
          schema.prisma
        </div>
        <div className="marketing-code-panel-tab">
          <i className="fa-light fa-file-lines" aria-hidden />
          AGENTS.md
        </div>
      </div>
      <pre className="marketing-code-panel-body">
        <code>
          <span className="cm">
            {"// One file, three products. Your AI reads it. The platform provisions from it."}
          </span>
          {"\n"}
          <span className="kw">import</span> <span className="p">{"{"}</span> defineConfig{" "}
          <span className="p">{"}"}</span> <span className="kw">from</span>{" "}
          <span className="st">&quot;prisma/config&quot;</span>
          {"\n\n"}
          <span className="kw">export default</span> <span className="fn">defineConfig</span>
          <span className="p">({"{"}</span>
          {"\n"}
          {"  "}
          <span className="n">data</span>
          <span className="p">:</span> <span className="p">{"{"}</span>{" "}
          <span className="n">schema</span>
          <span className="p">:</span> <span className="st">&quot;./prisma/schema.prisma&quot;</span>
          <span className="p">,</span> <span className="n">strict</span>
          <span className="p">:</span> <span className="kw">true</span> <span className="p">{"}"}</span>
          <span className="p">,</span>
          {"\n"}
          {"  "}
          <span className="n">postgres</span>
          <span className="p">:</span> <span className="p">{"{"}</span>{" "}
          <span className="n">region</span>
          <span className="p">:</span> <span className="st">&quot;iad1&quot;</span>
          <span className="p">,</span> <span className="n">branchPerPr</span>
          <span className="p">:</span> <span className="kw">true</span> <span className="p">{"}"}</span>
          <span className="p">,</span>
          {"\n"}
          {"  "}
          <span className="n">compute</span>
          <span className="p">:</span> <span className="p">{"{"}</span>{" "}
          <span className="n">entry</span>
          <span className="p">:</span> <span className="st">&quot;./app&quot;</span>
          <span className="p">,</span> <span className="n">autoscale</span>
          <span className="p">:</span> <span className="kw">true</span> <span className="p">{"}"}</span>
          <span className="p">,</span>
          {"\n"}
          {"  "}
          <span className="n">previews</span>
          <span className="p">:</span> <span className="p">{"{"}</span>{" "}
          <span className="n">perPullRequest</span>
          <span className="p">:</span> <span className="kw">true</span>
          <span className="p">,</span> <span className="n">seed</span>
          <span className="p">:</span> <span className="st">&quot;./prisma/seed.ts&quot;</span>{" "}
          <span className="p">{"}"}</span>
          <span className="p">,</span>
          {"\n"}
          <span className="p">{"})"}</span>
        </code>
      </pre>
    </div>
  );
}
