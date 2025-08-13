import { motion } from "framer-motion";

type Circle = {
  size: number;
  color: string;
  delay: number;
  opacity?: number;
  top?: string;
  bottom?: string;
  left?: string;
  right?: string;
};

const circlesMono: Circle[] = [
  { size: 1500, bottom: "90%", left: "90%", color: "from-indigo-900/30 to-gray-700", delay: 0, opacity: 20 },
  { size: 1500, top: "10%", right: "10%", color: "from-indigo-900/30 to-gray-600", delay: 1, opacity: 20 },
  { size: 2500, bottom: "90%", right: "50%", color: "from-indigo-900/30 to-gray-500", delay: 2, opacity: 20 },
  { size: 1100, top: "80%", left: "30%", color: "from-indigo-900/30 to-gray-400", delay: 2, opacity: 20 },
  { size: 2100, top: "20%", right: "20%", color: "from-indigo-900/30 to-gray-300", delay: 1.5, opacity: 20 },
];

export default function AnimatedBackground({ darkMode }: { darkMode: boolean }) {
  const circles = darkMode ? circlesMono : circlesMono;
  return (
    <div className="fixed inset-0 -z-10 w-full h-full overflow-hidden pointer-events-none">
      {/* Degradé y blur */}
      <div className={`absolute inset-0 ${darkMode
        ? "bg-gradient-to-tr from-slate-900 via-zinc-900 to-zinc-900"
        : "bg-gradient-to-tr from-zinc-400 via-slate-700 to-zinc-400"
      } opacity-90 blur-2xl`} />
      {/* Círculos animados */}
      {circles.map((c, i) => (
        <motion.div
          key={i}
          className={`absolute rounded-full bg-gradient-to-br ${c.color} opacity-${c.opacity} blur-2xl`}
          style={{
            width: c.size,
            height: c.size,
            top: c.top,
            left: c.left,
          }}
          animate={{
            y: [0, 200, 100, -200, 0],
            x: [0, -200, -100, 200, 0],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            repeatType: "mirror",
            delay: c.delay,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}