import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// App registry uses public icons placed in /icons/
const APP_REGISTRY = [
  { id: 'timeline', kind: 'native', title: 'Timeline', icon: '/icons/timeline.svg' },
  { id: 'gallery', kind: 'native', title: 'Gallery', icon: '/icons/polaroid.svg' },
  { id: 'letters', kind: 'native', title: 'Letters', icon: '/icons/letter.svg' },
  { id: 'music', kind: 'native', title: 'Music', icon: '/icons/music.svg' },
  { id: 'games', kind: 'native', title: 'Games', icon: '/icons/gamepad.svg' },
  { id: 'achievements', kind: 'native', title: 'Achievements', icon: '/icons/badge.svg' },
  { id: 'galaxy', kind: 'native', title: 'Memory Galaxy', icon: '/icons/galaxy.svg' },
  { id: 'movie-night', kind: 'external', title: 'Movie Night', icon: '/icons/projector.svg', url: 'https://your-movie-site.example' },
  { id: 'fortune-cookie', kind: 'external', title: 'Fortune Cookie', icon: '/icons/cookie.svg', url: 'https://your-cookie-site.example' },
];

const WALLPAPERS = [
  { id: 'romantic', title: 'Romantic', src: '/assets/wallpapers/romantic-gradient.svg' },
  { id: 'night', title: 'Night Sky', src: '/assets/wallpapers/night-sky.svg' },
  { id: 'clouds', title: 'Dreamy Clouds', src: '/assets/wallpapers/dreamy-clouds.svg' },
  { id: 'galaxy', title: 'Galaxy Love', src: '/assets/wallpapers/galaxy-love.svg' },
];

function useLocalStorage(key, initial) {
  const [state, setState] = useState(() => {
    try { return JSON.parse(localStorage.getItem(key)) ?? initial; } catch(e) { return initial; }
  });
  useEffect(()=>{ try{ localStorage.setItem(key, JSON.stringify(state)); }catch(e){} },[key,state]);
  return [state, setState];
}

function BootScreen({ onFinish }) {
  const [message, setMessage] = useState('Booting up love...');
  useEffect(()=>{
    fetch('/bootMessages.json').then(r=>r.json()).then(data=>{
      const today = new Date();
      const mmdd = String(today.getMonth()+1).padStart(2,'0') + '-' + String(today.getDate()).padStart(2,'0');
      if (data.special && data.special[mmdd]) {
        setMessage(data.special[mmdd][Math.floor(Math.random()*data.special[mmdd].length)]);
      } else {
        setMessage(data.default[Math.floor(Math.random()*data.default.length)]);
      }
    }).catch(()=>{});
    const t = setTimeout(()=>{ onFinish(); }, 1600 + Math.random()*900);
    return ()=>clearTimeout(t);
  },[onFinish]);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{background: 'linear-gradient(180deg,#0b1020, #2b2450)'}}>
      <motion.div initial={{opacity:0,scale:0.98}} animate={{opacity:1,scale:1}} className="glass p-8 rounded-2xl text-center">
        <div style={{fontSize:28}} className="mb-3">LoveOS 💖</div>
        <div className="text-sm mb-3">{message}</div>
        <div className="w-64 h-2 bg-white/6 rounded-full overflow-hidden mx-auto">
          <motion.div initial={{width:0}} animate={{width: '100%'}} transition={{duration:1.2}} className="h-full bg-sky" />
        </div>
      </motion.div>
    </div>
  );
}

function WallpaperPanel({ current, onSelect }) {
  return (
    <div className="glass p-3 rounded-xl">
      <div className="mb-2 font-medium">Choose Wallpaper</div>
      <div className="flex gap-3">
        {WALLPAPERS.map(w=>(
          <div key={w.id} className="flex flex-col items-center">
            <div className="wall-thumb" onClick={()=>onSelect(w.id)}>
              <img src={w.src} alt={w.title} className="w-full h-full object-cover"/>
            </div>
            <div className="text-xs mt-1">{w.title}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function TimelineApp() {
  const items = [
    { date: '2023-02-14', title: 'First Movie Marathon', blurb: 'We did 3 rom-coms!' },
    { date: '2024-06-20', title: 'Roadtrip', blurb: 'Mountains + chai + rain.' },
  ];
  return (
    <div className="p-4">
      <h3 className="text-xl font-semibold mb-3">Timeline</h3>
      <div className="flex gap-3 overflow-x-auto py-2">
        {items.map(s=>(
          <motion.article key={s.date} whileHover={{scale:1.03}} className="glass min-w-[220px] p-4 rounded-lg">
            <div className="text-sm text-slate-300">{s.date}</div>
            <div className="mt-2 font-medium text-lg">{s.title}</div>
            <p className="mt-2 text-sm leading-relaxed text-slate-200/90">{s.blurb}</p>
          </motion.article>
        ))}
      </div>
    </div>
  );
}

function GalleryApp() {
  const imgs = ['/icons/avatar-example.svg','/icons/avatar-example.svg','/icons/avatar-example.svg'];
  return (
    <div className="p-4">
      <h3 className="text-xl font-semibold mb-3">Polaroid Gallery</h3>
      <div className="flex gap-4 items-start">
        {imgs.map((src,i)=>(
          <motion.figure whileHover={{scale:1.04, rotate: (i%2===0?-2:2)}} key={i} className="polaroid w-40 cursor-pointer">
            <img src={src} alt={'p'+i} className="w-full h-28 object-cover rounded-md"/>
            <figcaption className="mt-2 text-sm text-slate-700 text-center">Our memory #{i+1}</figcaption>
          </motion.figure>
        ))}
      </div>
    </div>
  );
}

function LettersApp() {
  const [letters, setLetters] = useLocalStorage('love_letters_v1', []);
  const [text, setText] = useState('');
  return (
    <div className="p-4">
      <h3 className="text-xl font-semibold mb-3">Love Letters</h3>
      <textarea value={text} onChange={(e)=>setText(e.target.value)} placeholder="Write a short sweet note..." className="w-full h-28 p-3 rounded-md bg-white/90 text-slate-900" />
      <div className="flex gap-2 mt-3">
        <button onClick={()=>{
          if(!text.trim()) return;
          setLetters([{id:Date.now(), body:text.trim(), date:new Date().toISOString()}, ...letters]);
          setText('');
        }} className="px-3 py-2 rounded-md glass hover:scale-105 transition">Save Letter</button>
        <button onClick={()=>{
          const blob=new Blob([JSON.stringify(letters,null,2)],{type:'application/json'});
          const url=URL.createObjectURL(blob);
          const a=document.createElement('a'); a.href=url; a.download='letters.json'; a.click(); URL.revokeObjectURL(url);
        }} className="px-3 py-2 rounded-md glass hover:scale-105 transition">Export</button>
      </div>
      <div className="mt-4 space-y-3 max-h-44 overflow-auto">
        {letters.map(l=>(
          <div key={l.id} className="p-2 rounded-md bg-white/90 text-slate-900">
            <div className="text-xs text-slate-500">{new Date(l.date).toLocaleString()}</div>
            <div className="mt-1">{l.body}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------------- Music App ---------------- */
function MusicApp() {
  const playlist = [
    { id: 's1', title: 'Our Song', src: '' },
    { id: 's2', title: 'Soft Piano', src: '' }
  ];
  const [current, setCurrent] = useState(null);
  const audioRef = React.useRef(null);

  useEffect(()=>{
    // placeholder: no remote audio included. User can drop mp3s in public/assets/audio/ and update src paths.
  },[]);

  return (
    <div className="p-4">
      <h3 className="text-xl font-semibold mb-3">Music Player</h3>
      <div className="glass p-3 rounded-md">
        <div className="text-sm text-slate-200 mb-2">Drop your favorite songs into <code>/public/assets/audio/</code> and update playlist paths.</div>
        <div className="space-y-2">
          {playlist.map(s=>(
            <div key={s.id} className="flex items-center justify-between p-2 bg-white/6 rounded">
              <div>
                <div className="font-medium">{s.title}</div>
                <div className="text-xs text-slate-300">Duration: —</div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={()=>{ setCurrent(s.id); if (audioRef.current) { audioRef.current.src = s.src; audioRef.current.play(); } }} className="px-3 py-1 glass rounded">Play</button>
                <button onClick={()=>{ if(audioRef.current){ audioRef.current.pause(); } }} className="px-3 py-1 glass rounded">Pause</button>
              </div>
            </div>
          ))}
        </div>
        <audio ref={audioRef} controls className="w-full mt-3 glass p-2 rounded" />
      </div>
    </div>
  );
}

/* ---------------- Games App (Tic-Tac-Toe) ---------------- */
function TicTacToe() {
  const empty = Array(9).fill(null);
  const [board, setBoard] = useState(empty);
  const [xTurn, setXTurn] = useState(true);
  const winner = calculateWinner(board);

  function handleClick(i){
    if(board[i] || winner) return;
    const nb = board.slice(); nb[i] = xTurn ? 'X' : 'O'; setBoard(nb); setXTurn(!xTurn);
  }
  function reset(){ setBoard(empty); setXTurn(true); }

  return (
    <div className="p-4">
      <h3 className="text-xl font-semibold mb-3">Tic-Tac-Toe (Hearts)</h3>
      <div className="glass p-4 rounded-md inline-block">
        <div className="grid grid-cols-3 gap-2">
          {board.map((v,i)=>(
            <button key={i} onClick={()=>handleClick(i)} className="w-16 h-16 rounded bg-white/6 flex items-center justify-center text-2xl">{v === 'X' ? '💗' : v === 'O' ? '💙' : ''}</button>
          ))}
        </div>
        <div className="mt-3">{ winner ? <div className="font-medium">Winner: {winner}</div> : <div className="text-sm">Turn: {xTurn ? '💗' : '💙'}</div> }</div>
        <div className="mt-3"><button onClick={reset} className="px-3 py-2 glass rounded">Reset</button></div>
      </div>
    </div>
  );
}

function calculateWinner(b){
  const lines = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
  for(const [a,b1,c] of lines){
    if(b[a] && b[a]===b[b1] && b[a]===b[c]) return b[a] === 'X' ? '💗 (You)' : '💙 (Partner)';
  }
  return null;
}

function GamesApp() {
  return (
    <div className="p-4">
      <TicTacToe />
    </div>
  );
}

/* ---------------- Achievements ---------------- */
function AchievementsApp() {
  const [unlocked, setUnlocked] = useLocalStorage('loveos_achievements', ['100-days']);
  const all = [
    { id: '100-days', title: '100 Days Together', icon: '/icons/badge.svg' },
    { id: 'first-trip', title: 'First Trip', icon: '/icons/badge.svg' },
    { id: 'movie-marathon', title: 'Movie Marathon', icon: '/icons/badge.svg' },
  ];
  return (
    <div className="p-4">
      <h3 className="text-xl font-semibold mb-3">Achievements</h3>
      <div className="flex gap-4">
        {all.map(a=>{
          const is = unlocked.includes(a.id);
          return (
            <div key={a.id} className="glass p-3 rounded-md w-40 text-center">
              <img src={a.icon} className="mx-auto w-16 h-16" alt={a.title} />
              <div className="mt-2 font-medium">{a.title}</div>
              <div className="text-xs mt-1">{is ? 'Unlocked' : 'Locked'}</div>
              {!is && <button onClick={()=>setUnlocked([...unlocked, a.id])} className="mt-2 px-2 py-1 glass rounded text-sm">Unlock</button>}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ---------------- Memory Galaxy ---------------- */
function GalaxyApp() {
  const stars = Array.from({length:9}).map((_,i)=>({id:i, x: Math.random()*80+10, y: Math.random()*60+10, title: `Memory ${i+1}`}));
  return (
    <div className="p-4">
      <h3 className="text-xl font-semibold mb-3">Memory Galaxy</h3>
      <div className="glass p-4 rounded-md" style={{height:360}}>
        <svg viewBox="0 0 100 70" className="w-full h-full">
          {stars.map(s=>(
            <g key={s.id} transform={`translate(${s.x}, ${s.y})`}>
              <circle r="2.4" fill="#ffd2d2"/>
              <text x="4" y="1.5" fontSize="2.8" fill="#fff" opacity="0.9">{s.title}</text>
            </g>
          ))}
        </svg>
      </div>
    </div>
  );
}

/* ---------------- Window component ---------------- */
function Window({ win, children, onClose, onMinimize, onFocus }) {
  const [pos,setPos] = useState({x:win.x||120, y:win.y||80});
  const dragging = React.useRef(false);
  const offset = React.useRef({x:0,y:0});
  const start = (e)=>{
    dragging.current = true;
    const p = e.nativeEvent.touches ? e.nativeEvent.touches[0] : e.nativeEvent;
    offset.current = {x:p.clientX - pos.x, y:p.clientY - pos.y};
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', end);
  };
  const move = (e)=>{ if(!dragging.current) return; setPos({x:e.clientX - offset.current.x, y:e.clientY - offset.current.y}); };
  const end = ()=>{ dragging.current = false; window.removeEventListener('pointermove', move); window.removeEventListener('pointerup', end); };
  return (
    <motion.div style={{left:pos.x, top:pos.y, zIndex: win.z}} className="fixed w-[760px] max-w-[92%] h-[480px] rounded-xl glass overflow-hidden" onMouseDown={()=>onFocus(win.id)} initial={{opacity:0, scale:0.98}} animate={{opacity:1, scale:1}} exit={{opacity:0, scale:0.98}} whileHover={{boxShadow:'0 18px 60px rgba(56,182,255,0.08)', y:-2}}>
      <div onPointerDown={start} className="px-3 py-2 bg-transparent flex items-center justify-between cursor-move select-none" style={{WebkitUserSelect:'none'}}>
        <div className="flex items-center gap-3"><div className="w-2 h-2 rounded-full bg-rose-300"/><div className="w-2 h-2 rounded-full bg-amber-300"/><div className="w-2 h-2 rounded-full bg-green-300"/><div className="ml-2 font-medium text-slate-100">{win.title}</div></div>
        <div className="flex items-center gap-2"><button onClick={()=>onMinimize(win.id)} className="px-2 py-1 rounded hover:bg-white/6">—</button><button onClick={()=>onClose(win.id)} className="px-2 py-1 rounded hover:bg-white/6">✕</button></div>
      </div>
      <div className="h-[calc(100%-48px)] overflow-auto bg-gradient-to-b from-white/3 to-white/2 p-2">{children}</div>
    </motion.div>
  );
}

/* ---------------- Main App ---------------- */
export default function App() {
  const [booting, setBooting] = useState(true);
  const [windows, setWindows] = useLocalStorage('loveos_windows_v1', []);
  const [zTop, setZTop] = useLocalStorage('loveos_zTop_v1', 1000);
  const [themePref, setThemePref] = useLocalStorage('loveos_theme_pref', {mode:'auto', manual:null});
  const [wallpaper, setWallpaper] = useLocalStorage('loveos_wallpaper', WALLPAPERS[0].id);
  const [wallOpen, setWallOpen] = useState(false);

  useEffect(()=>{
    // auto theme
    if(!themePref.manual) {
      const hour = new Date().getHours();
      const mode = (hour>=7 && hour<19) ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', mode);
    } else {
      document.documentElement.setAttribute('data-theme', themePref.manual);
    }
  },[themePref]);

  const finishBoot = ()=> setBooting(false);

  const openApp = (appId) => {
    const id = `${appId}-${Date.now()}`;
    const next = { id, appId, title: APP_REGISTRY.find(a=>a.id===appId)?.title || appId, z: (zTop||1000)+1, x: 80+Math.random()*80, y: 80+Math.random()*40, minimized:false };
    setZTop((zTop||1000)+1);
    setWindows(w=>[...w, next]);
  };
  const closeWin = (id) => setWindows(w=>w.filter(x=>x.id!==id));
  const focusWin = (id) => setWindows(w=>w.map(win=>win.id===id?{...win, z: (zTop||1000)+1}:win));
  const toggleMin = (id) => setWindows(w=>w.map(win=>win.id===id?{...win, minimized:!win.minimized}:win));
  const changeWallpaper = (id)=> setWallpaper(id);

  return (
    <div className="h-screen w-screen relative overflow-hidden" style={{background:'#0b1020'}}>
      {/* wallpaper layers */}
      {WALLPAPERS.map(w=>(
        <img key={w.id} src={w.src} alt={w.title} className="desktop-wallpaper" style={{opacity: wallpaper===w.id?1:0}}/>
      ))}

      {/* topbar */}
      <div className="absolute top-4 left-4 right-4 flex justify-between items-center pointer-events-auto z-40">
        <div className="glass px-3 py-2 rounded-full flex items-center gap-3">
          <div className="rounded-full w-7 h-7 bg-rose-200 flex items-center justify-center">💗</div>
          <div className="font-medium text-slate-100">LoveOS</div>
        </div>
        <div className="flex items-center gap-3">
          <div className="glass px-3 py-2 rounded-full">
            <button onClick={()=>setWallOpen(!wallOpen)} className="flex items-center gap-2"><span>🖼️</span><span className="text-sm">Wallpapers</span></button>
          </div>
          <div className="glass px-3 py-2 rounded-full">
            <button onClick={()=>{
              // toggle manual theme between light/dark
              const current = document.documentElement.getAttribute('data-theme') || 'dark';
              const next = current==='dark' ? 'light' : 'dark';
              setThemePref({mode:'manual', manual: next});
              document.documentElement.setAttribute('data-theme', next);
            }}>{document.documentElement.getAttribute('data-theme')==='dark' ? '🌙' : '🌤️'}</button>
          </div>
        </div>
      </div>

      {/* wallpaper panel */}
      <AnimatePresence>
        {wallOpen && (
          <motion.div initial={{opacity:0,y:-8}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-8}} className="fixed right-6 top-20 z-50">
            <WallpaperPanel current={wallpaper} onSelect={(id)=>{changeWallpaper(id); setWallOpen(false);}} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Affirmation widget */}
      <div className="fixed top-6 right-6 z-40"><div className="glass p-3 rounded-2xl"><div className="flex items-center gap-2 mb-2"><div className="w-6 h-6 rounded-full bg-rose-200 flex items-center justify-center">🥠</div><div className="text-sm font-medium">Today’s Cookie</div></div><div className="text-sm leading-relaxed text-slate-100">You are my favorite place.</div></div></div>

      {/* windows */}
      <AnimatePresence>
        {windows.filter(w=>!w.minimized).sort((a,b)=>a.z-b.z).map(w=>(
          <Window key={w.id} win={w} onClose={closeWin} onMinimize={toggleMin} onFocus={focusWin}>
            {{
              'timeline': <TimelineApp/>,
              'gallery': <GalleryApp/>,
              'letters': <LettersApp/>,
              'music': <MusicApp/>,
              'games': <GamesApp/>,
              'achievements': <AchievementsApp/>,
              'galaxy': <GalaxyApp/>
            }[w.appId] || <div className="p-6">This is a placeholder for {w.appId}</div>}
          </Window>
        ))}
      </AnimatePresence>

      {/* dock */}
      <div className="fixed left-1/2 -translate-x-1/2 bottom-6 z-50">
        <div className="glass px-4 py-3 rounded-3xl flex gap-4 items-center justify-center shadow-lg">
          {APP_REGISTRY.map(a=>(
            <motion.button key={a.id} onClick={()=> a.kind==='external' ? window.open(a.url, '_blank', 'noopener') : openApp(a.id)} whileHover={{scale:1.12}} whileTap={{scale:0.98}} className="flex flex-col items-center gap-1 p-2">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center text-lg">
                <img src={a.icon} alt={a.title} className="w-7 h-7 object-contain"/>
              </div>
              <div className="text-[10px] text-slate-200/80 mt-1">{a.title}</div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* minimized tray */}
      <div className="fixed left-6 bottom-6 z-40 space-x-2 flex">
        {windows.filter(w=>w.minimized).map(w=>(
          <button key={w.id} onClick={()=>toggleMin(w.id)} className="glass px-3 py-2 rounded-md flex items-center gap-2"><span className="text-sm">{w.title}</span></button>
        ))}
      </div>

      <div className="fixed right-6 bottom-6 text-xs text-slate-300/70 z-40">Hover icons — feel the glow ✨</div>

      {/* boot */}
      <AnimatePresence>{booting && <BootScreen onFinish={finishBoot} />}</AnimatePresence>
    </div>
  );
}
