import { createPageMetadata } from "@/lib/page-metadata";
import { Press_Start_2P, VT323 } from "next/font/google";
import { ArcadeScreen } from "./_components/arcade-screen";

const pressStart = Press_Start_2P({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-arcade",
  display: "swap",
});

const vt323 = VT323({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-arcade-alt",
  display: "swap",
});

export const metadata = createPageMetadata({
  title: "Prisma Arcade | Insert Coin to Play",
  description:
    "Step into the Prisma Arcade — three retro games, global high scores, and zero quarters required. Schema Snake, Query Invaders, and Migration Breakout are coming soon.",
  path: "/arcade",
});

export default function ArcadePage() {
  return (
    <main className={`${pressStart.variable} ${vt323.variable}`}>
      <ArcadeScreen />
    </main>
  );
}
