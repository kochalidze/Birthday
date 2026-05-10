import { useState, useEffect, useRef } from "react";

const HEARTS = ["❤️", "🩷", "🤍", "💗", "💓", "💕", "💖", "💝"];

function Heart({ id }) {
  const style = {
    position: "fixed",
    left: `${Math.random() * 100}vw`,
    bottom: "-80px",
    fontSize: `${Math.random() * 28 + 14}px`,
    opacity: 0,
    animation: `floatUp ${Math.random() * 6 + 7}s ease-in ${Math.random() * 8}s infinite`,
    pointerEvents: "none",
    zIndex: 0,
    filter: "drop-shadow(0 0 6px rgba(255,100,150,0.5))",
  };
  return <span style={style}>{HEARTS[id % HEARTS.length]}</span>;
}

const congratsLines = [
  "ანა, გილოცავ დაბადების დღეს! ✨",
  "",
  "ძალიან მიხარია, რომ ჩემს ცხოვრებაში ხარ,",
  "შენნაირი ადამიანები სამყაროს აფერადებენ 🌈",
  "",
  "გისურვებ, რომ სულ ასეთი ბედნიერი,",
  "მხიარული და საყვარელი იყო 🥰",
  "",
  "გილოცავ ანა🌸",
  // "მიყვარხარ🌸"
];

// ფოტოების თანმიმდევრობა შეცვლილია
const PHOTOS = [
  "https://tse3.mm.bing.net/th/id/OIP.BV1vh7lYdV17beq65P9flAHaHk?pid=Api&h=220&P=0",
  "https://tse4.mm.bing.net/th/id/OIP.8LlXbMNblPvPiB3KQwpG4QHaFj?pid=Api&h=220&P=0",
];

function NoButton({ containerRef }) {
  const [pos, setPos] = useState({ x: null, y: null });
  const btnRef = useRef(null);

  function runAway() {
    const container = containerRef.current;
    if (!container || !btnRef.current) return;
    const cr = container.getBoundingClientRect();
    const br = btnRef.current.getBoundingClientRect();
    const maxX = cr.width - br.width;
    const maxY = cr.height - br.height;
    let nx, ny;
    let tries = 0;
    do {
      nx = Math.random() * maxX;
      ny = Math.random() * maxY;
      tries++;
    } while (
      tries < 20 &&
      Math.abs(nx - (pos.x || maxX / 2)) < 80 &&
      Math.abs(ny - (pos.y || maxY / 2)) < 80
    );
    setPos({ x: nx, y: ny });
  }

  const style = pos.x !== null ? {
    position: "absolute",
    left: pos.x,
    top: pos.y,
    transition: "left 0.18s cubic-bezier(.34,1.56,.64,1), top 0.18s cubic-bezier(.34,1.56,.64,1)",
  } : {
    position: "relative",
  };

  return (
    <button
      ref={btnRef}
      onMouseEnter={runAway}
      onTouchStart={runAway}
      style={{
        ...style,
        background: "rgba(255,255,255,0.9)",
        border: "2px solid rgba(220,100,140,0.4)",
        borderRadius: "30px",
        padding: "14px 32px",
        color: "#c0265a",
        fontSize: "clamp(1rem, 3vw, 1.2rem)",
        fontFamily: "'Georgia', serif",
        fontWeight: "700",
        cursor: "default",
        userSelect: "none",
        whiteSpace: "nowrap",
        zIndex: 2,
      }}
    >
      არა 😅
    </button>
  );
}

export default function App() {
  const [clicked, setClicked] = useState(false);
  const [visibleLines, setVisibleLines] = useState([]);
  const [btnPulse, setBtnPulse] = useState(true);
  const [sparkles, setSparkles] = useState([]);
  const [showLove, setShowLove] = useState(false);
  const [allDone, setAllDone] = useState(false);
  const timeoutsRef = useRef([]);
  const loveBoxRef = useRef(null);

  useEffect(() => {
    return () => timeoutsRef.current.forEach(clearTimeout);
  }, []);

  function fireSparkles(x, y) {
    const rects = [];
    for (let i = 0; i < 22; i++) {
      rects.push({
        id: Date.now() + i,
        x: x + (Math.random() - 0.5) * 200,
        y: y + (Math.random() - 0.5) * 200,
        emoji: HEARTS[i % HEARTS.length],
      });
    }
    setSparkles(rects);
    setTimeout(() => setSparkles([]), 1200);
  }

  function handleMainClick(e) {
    setClicked(true);
    setBtnPulse(false);
    fireSparkles(e.clientX, e.clientY);
    congratsLines.forEach((_, idx) => {
      const t = setTimeout(() => {
        setVisibleLines((prev) => [...prev, idx]);
        if (idx === congratsLines.length - 1) {
          setTimeout(() => setAllDone(true), 300);
        }
      }, 400 + idx * 220);
      timeoutsRef.current.push(t);
    });
  }

  function handleYes(e) {
    fireSparkles(e.clientX, e.clientY);
    setShowLove(true);
    setTimeout(() => {
      loveBoxRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 100);
  }

  const hearts = Array.from({ length: 30 }, (_, i) => i);

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #ffe0ec 0%, #fff0f5 40%, #ffd6e7 70%, #fff 100%)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "'Georgia', 'Times New Roman', serif",
      overflow: "hidden",
      position: "relative",
      padding: "2rem 0",
    }}>
      <style>{`
        @keyframes floatUp {
          0% { transform: translateY(0) scale(1) rotate(-10deg); opacity: 0; }
          10% { opacity: 1; }
          80% { opacity: 0.8; }
          100% { transform: translateY(-110vh) scale(1.3) rotate(20deg); opacity: 0; }
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(220,50,110,0.5); }
          50% { transform: scale(1.06); box-shadow: 0 0 0 18px rgba(220,50,110,0); }
        }
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(18px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes popIn {
          0% { opacity: 0; transform: scale(0.5); }
          70% { transform: scale(1.1); }
          100% { opacity: 1; transform: scale(1); }
        }
        @keyframes sparkleOut {
          0% { opacity: 1; transform: scale(1); }
          100% { opacity: 0; transform: scale(2.5) translateY(-40px); }
        }
        @keyframes titleFloat {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        @keyframes ringPulse {
          0% { transform: scale(0.95); opacity: 0.7; }
          50% { transform: scale(1.05); opacity: 1; }
          100% { transform: scale(0.95); opacity: 0.7; }
        }
        @keyframes heartBeat {
          0%, 100% { transform: scale(1); }
          25% { transform: scale(1.15); }
          50% { transform: scale(1); }
          75% { transform: scale(1.1); }
        }
        .btn-main:hover { transform: scale(1.08) !important; box-shadow: 0 8px 40px rgba(200,50,100,0.45) !important; }
        .btn-main:active { transform: scale(0.97) !important; }
        .btn-yes:hover { transform: scale(1.08) !important; }
        .btn-yes:active { transform: scale(0.95) !important; }
      `}</style>

      {hearts.map((i) => <Heart key={i} id={i} />)}

      {sparkles.map((s) => (
        <span key={s.id} style={{
          position: "fixed", left: s.x, top: s.y,
          fontSize: "22px", pointerEvents: "none", zIndex: 9999,
          animation: "sparkleOut 0.9s ease-out forwards",
        }}>{s.emoji}</span>
      ))}

      {!clicked ? (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "2rem", zIndex: 10 }}>
          <div style={{ fontSize: "clamp(2rem, 6vw, 3.5rem)", textAlign: "center", animation: "titleFloat 3s ease-in-out infinite" }}>
            🎂 ✨ 🎂
          </div>
          <div style={{ position: "relative" }}>
            <div style={{ position: "absolute", inset: "-12px", borderRadius: "50px", border: "2px solid rgba(220,50,110,0.3)", animation: "ringPulse 2s ease-in-out infinite", pointerEvents: "none" }} />
            <div style={{ position: "absolute", inset: "-24px", borderRadius: "60px", border: "1.5px solid rgba(220,50,110,0.15)", animation: "ringPulse 2s ease-in-out infinite 0.4s", pointerEvents: "none" }} />
            <button className="btn-main" onClick={handleMainClick} style={{
              background: "linear-gradient(120deg, #e8285a, #ff6699, #e8285a, #c0265a)",
              backgroundSize: "200% auto",
              animation: btnPulse ? "pulse 2s ease-in-out infinite, shimmer 3s linear infinite" : "shimmer 3s linear infinite",
              border: "none", borderRadius: "40px", padding: "22px 48px",
              color: "#fff", fontSize: "clamp(1rem, 3vw, 1.4rem)",
              fontFamily: "'Georgia', serif", fontWeight: "700", cursor: "pointer",
              letterSpacing: "0.03em", transition: "transform 0.15s, box-shadow 0.15s",
              boxShadow: "0 6px 30px rgba(200,50,100,0.4)", position: "relative", zIndex: 1, whiteSpace: "nowrap",
            }}>
              💝 დააკლიკე, ანა 💝
            </button>
          </div>
          <p style={{ color: "rgba(180,40,80,0.55)", fontSize: "0.95rem", fontStyle: "italic" }}>✨ პატარა სიურპრიზი შენთვის ✨</p>
        </div>
      ) : (
        <div style={{ zIndex: 10, maxWidth: "600px", width: "90vw", display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem" }}>

          {/* Main card */}
          <div style={{
            background: "rgba(255,255,255,0.85)", backdropFilter: "blur(16px)",
            borderRadius: "28px", border: "2px solid rgba(220,100,140,0.25)",
            boxShadow: "0 12px 60px rgba(200,50,100,0.18)",
            padding: "clamp(1.5rem, 5vw, 2.5rem) clamp(1.5rem, 6vw, 3rem)",
            textAlign: "center", width: "100%",
          }}>
            <div style={{ fontSize: "clamp(2rem, 8vw, 3.5rem)", marginBottom: "1.2rem", animation: "titleFloat 3s ease-in-out infinite" }}>
              🎉💖🎂💖🎉
            </div>

            {congratsLines.map((line, idx) => (
              visibleLines.includes(idx) && (
                <p key={idx} style={{
                  margin: line === "" ? "0.5rem 0" : "0.1rem 0",
                  fontSize: idx === 0 ? "clamp(1.3rem, 4vw, 1.9rem)" : "clamp(1rem, 3vw, 1.2rem)",
                  fontWeight: idx === 0 ? "700" : "400",
                  color: idx === 0 ? "#c0265a" : "#6b2040",
                  lineHeight: "1.7",
                  animation: "fadeSlideIn 0.6s ease-out both",
                }}>
                  {line === "" ? "\u00A0" : line}
                </p>
              )
            ))}
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "1.5rem" }}>
              {PHOTOS.map((src, i) => (
                <div key={i} style={{
                  borderRadius: "16px", overflow: "hidden",
                  border: "3px solid rgba(220,100,140,0.3)",
                  boxShadow: "0 4px 16px rgba(200,50,100,0.15)",
                  aspectRatio: "1",
                  animation: `fadeSlideIn 0.6s ease-out ${i * 0.15}s both`,
                  transform: i % 2 === 0 ? "rotate(-1.5deg)" : "rotate(1.5deg)",
                }}>
                  <img src={src} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                </div>
              ))}
            </div>


            {visibleLines.length >= congratsLines.length && (
              <div style={{ marginTop: "1.5rem", fontSize: "clamp(1.5rem, 5vw, 2.2rem)", animation: "titleFloat 2.5s ease-in-out infinite" }}>
                🌸💕🌸💕🌸
              </div>
            )}
          </div>

          {/* გიყვარვარ section */}
          {allDone && !showLove && (
            <div style={{
              width: "100%",
              background: "rgba(255,255,255,0.88)",
              backdropFilter: "blur(16px)",
              borderRadius: "24px",
              border: "2px solid rgba(220,100,140,0.25)",
              boxShadow: "0 8px 40px rgba(200,50,100,0.14)",
              padding: "1.8rem 1.5rem",
              textAlign: "center",
              animation: "fadeSlideIn 0.7s ease-out both",
            }}>
              <p style={{
                fontSize: "clamp(1.2rem, 4vw, 1.6rem)",
                fontWeight: "700",
                color: "#c0265a",
                marginBottom: "1.5rem",
                animation: "titleFloat 3s ease-in-out infinite",
              }}>
                მოგეწონა? 💝
              </p>

              <div ref={loveBoxRef} style={{
                position: "relative",
                height: "120px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "1.5rem",
              }}>
                <button className="btn-yes" onClick={handleYes} style={{
                  position: "relative",
                  zIndex: 2,
                  background: "linear-gradient(120deg, #e8285a, #ff6699, #e8285a)",
                  backgroundSize: "200% auto",
                  animation: "shimmer 3s linear infinite",
                  border: "none", borderRadius: "30px",
                  padding: "14px 36px",
                  color: "#fff",
                  fontSize: "clamp(1rem, 3vw, 1.2rem)",
                  fontFamily: "'Georgia', serif", fontWeight: "700",
                  cursor: "pointer", whiteSpace: "nowrap",
                  boxShadow: "0 4px 20px rgba(220,50,100,0.35)",
                  transition: "transform 0.15s",
                }}>
                  ძალიან 😍
                </button>

                <NoButton containerRef={loveBoxRef} />
              </div>
            </div>
          )}

          {/* Love response */}
          {showLove && (
            <div style={{
              width: "100%",
              background: "linear-gradient(135deg, #ffe0ec, #fff0f5)",
              borderRadius: "24px",
              border: "2px solid rgba(220,100,140,0.35)",
              boxShadow: "0 8px 40px rgba(200,50,100,0.2)",
              padding: "2rem 1.5rem",
              textAlign: "center",
              animation: "popIn 0.5s cubic-bezier(.34,1.56,.64,1) both",
            }}>
              <div style={{ fontSize: "clamp(2.5rem, 8vw, 4rem)", animation: "heartBeat 1.2s ease-in-out infinite", marginBottom: "0.8rem" }}>
                💖
              </div>
              <p style={{
                fontSize: "clamp(1.3rem, 4vw, 1.8rem)",
                fontWeight: "700",
                color: "#c0265a",
                margin: "0 0 0.4rem 0",
              }}>
                მიხარია! 🥰
              </p>
              <p style={{ fontSize: "clamp(0.95rem, 2.5vw, 1.1rem)", color: "#8b3a5a", margin: 0, fontStyle: "italic" }}>
                კიდევ ერთხელ გილოცავ, საუკეთესო წელი გქონოდეს! 🌸
              </p>
            </div>
          )}

        </div>
      )}
    </div>
  );
}