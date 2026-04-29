"use client";

import dynamic from "next/dynamic";

// Lazy-load the particle animation component client-side only.
// next/dynamic with ssr:false cannot be called from a Server Component — it
// must live in a "use client" module. This thin wrapper follows the same
// pattern used by masonry-client.tsx.
const Antigravity = dynamic(() => import("./antigravity"), { ssr: false });

export default Antigravity;
