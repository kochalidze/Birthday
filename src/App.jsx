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
];

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
    let isTooCloseToCenter;
    let tries = 0;

    do {
      nx = Math.random() * maxX;
      ny = Math.random() * maxY;
      
      // ვამოწმებთ, რომ ახალი პოზიცია არ იყოს ცენტრთან ძალიან ახლოს (სადაც "ძალიან" ღილაკია)
      const centerX = maxX / 2;
      const centerY = maxY / 2;
      const distFromCenter = Math.sqrt(Math.pow(nx - centerX, 2) + Math.pow(ny - centerY, 2));
      
      isTooCloseToCenter = distFromCenter < 100; 
      tries++;
    } while (isTooCloseToCenter && tries < 50);

    setPos({ x: nx, y: ny });
  }

  const style = pos.x !== null ? {
    position: "absolute",
    left: pos.x,
    top: pos.y,
    transition: "all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
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
        background: "rgba(255,255,255,0.95)",
        border: "2px solid rgba(220,100,140,0.3)",
        borderRadius: "30px",
        padding: "14px 32px",
        color: "#c0265a",
        fontSize: "1rem",
        fontFamily: "'Georgia', serif",
        fontWeight: "700",
        cursor: "pointer",
        userSelect: "none",
        whiteSpace: "nowrap",
        zIndex: 5,
        boxShadow: "0 4px 15px rgba(0,0,0,0.05)",
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
      overflowX: "hidden",
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
        </div>
      ) : (
        <div style={{ zIndex: 10, maxWidth: "600px", width: "90vw", display: "flex", flexDirection: "column", alignItems: "center", gap: "1.5rem" }}>

          <div style={{
            background: "rgba(255,255,255,0.85)", backdropFilter: "blur(16px)",
            borderRadius: "28px", border: "2px solid rgba(220,100,140,0.25)",
            boxShadow: "0 12px 60px rgba(200,50,100,0.18)",
            padding: "2rem", textAlign: "center", width: "100%",
          }}>
            <div style={{ fontSize: "2.5rem", marginBottom: "1.2rem", animation: "titleFloat 3s ease-in-out infinite" }}>
              🎉💖🎂💖🎉
            </div>

            {congratsLines.map((line, idx) => (
              visibleLines.includes(idx) && (
                <p key={idx} style={{
                  margin: line === "" ? "0.5rem 0" : "0.1rem 0",
                  fontSize: idx === 0 ? "1.6rem" : "1.1rem",
                  fontWeight: idx === 0 ? "700" : "400",
                  color: idx === 0 ? "#c0265a" : "#6b2040",
                  lineHeight: "1.7",
                  animation: "fadeSlideIn 0.6s ease-out both",
                }}>
                  {line === "" ? "\u00A0" : line}
                </p>
              )
            ))}

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginTop: "1.5rem" }}>
              {PHOTOS.map((src, i) => (
                <div key={i} style={{
                  borderRadius: "16px", overflow: "hidden",
                  border: "3px solid rgba(220,100,140,0.3)",
                  boxShadow: "0 4px 16px rgba(200,50,100,0.15)",
                  aspectRatio: "1",
                  animation: `fadeSlideIn 0.6s ease-out ${i * 0.15}s both`,
                  transform: i % 2 === 0 ? "rotate(-2deg)" : "rotate(2deg)",
                }}>
                  <img src={src} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
              ))}
            </div>
          </div>

          {allDone && !showLove && (
            <div ref={loveBoxRef} style={{
              width: "100%", height: "250px", // სიმაღლე გაიზარდა რომ მეტი ადგილი ჰქონდეს გაქცევისთვის
              background: "rgba(255,255,255,0.8)",
              backdropFilter: "blur(10px)",
              borderRadius: "24px",
              border: "2px solid rgba(220,100,140,0.2)",
              padding: "1.5rem",
              textAlign: "center",
              position: "relative",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              overflow: "hidden"
            }}>
              <p style={{ fontSize: "1.4rem", fontWeight: "700", color: "#c0265a", marginBottom: "1rem" }}>
                მოგეწონა? 💝
              </p>

              {/* ცენტრალური კონტეინერი ღილაკებისთვის */}
              <div style={{ position: "relative", width: "100%", height: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
                
                <button className="btn-yes" onClick={handleYes} style={{
                  background: "linear-gradient(120deg, #e8285a, #ff6699)",
                  border: "none", borderRadius: "30px",
                  padding: "14px 36px", color: "#fff",
                  fontSize: "1.1rem", fontWeight: "700",
                  cursor: "pointer", zIndex: 10,
                  boxShadow: "0 4px 20px rgba(220,50,100,0.3)",
                }}>
                  ძალიან 😍
                </button>

                <NoButton containerRef={loveBoxRef} />
              </div>
            </div>
          )}

          {showLove && (
            <div style={{
              width: "100%", background: "white", borderRadius: "24px",
              padding: "2rem", textAlign: "center",
              animation: "popIn 0.5s cubic-bezier(.34,1.56,.64,1) both",
              border: "2px solid #ff6699"
            }}>
              <div style={{ fontSize: "3rem", animation: "heartBeat 1.2s infinite" }}>💖</div>
              <p style={{ fontSize: "1.5rem", fontWeight: "700", color: "#c0265a" }}>მიხარია! 🥰</p>
              <p style={{ color: "#8b3a5a", fontStyle: "italic" }}>საუკეთესო დღეს გისურვებ!</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}