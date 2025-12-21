import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Simplified SplitText component
const SplitText = ({ text, className = '', delay = 0, tag = 'h1', isDark }) => {
  const [visible, setVisible] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  const chars = text.split('');
  const Tag = tag;
  
  return (
    <Tag className={className}>
      {chars.map((char, i) => (
        <span
          key={i}
          className="inline-block"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(40px)',
            transition: `all 0.6s cubic-bezier(0.4, 0, 0.2, 1) ${i * 0.03}s`,
            color: isDark ? '#FFFFFF' : '#111827'
          }}
        >
          {char === ' ' ? '\u00A0' : char}
        </span>
      ))}
    </Tag>
  );
};

// Animated Clock Component
const AnimatedClock = ({ isDark }) => {
  const [phase, setPhase] = useState('rotating');
  const [checkedHours, setCheckedHours] = useState([]);
  const [rotation, setRotation] = useState(0);
  const [animationKey, setAnimationKey] = useState(0);

  useEffect(() => {
    const runAnimation = () => {
      setPhase('rotating');
      setCheckedHours([]);
      setRotation(0);

      const rotateInterval = setInterval(() => {
        setRotation(prev => (prev + 2) % 360);
      }, 20);

      setTimeout(() => {
        clearInterval(rotateInterval);
        setRotation(0);
        setPhase('checking');

        const hours = Array.from({ length: 12 }, (_, i) => i);
        let currentHour = 0;

        const checkInterval = setInterval(() => {
          if (currentHour < 12) {
            setCheckedHours(prev => [...prev, hours[currentHour]]);
            currentHour++;
          } else {
            clearInterval(checkInterval);
            setTimeout(() => {
              setPhase('tick');
              setTimeout(() => {
                setPhase('rotating');
                setAnimationKey(prev => prev + 1);
              }, 1500);
            }, 500);
          }
        }, 300);

        return () => clearInterval(checkInterval);
      }, 3000);

      return () => clearInterval(rotateInterval);
    };

    runAnimation();

    const loopInterval = setInterval(() => {
      runAnimation();
    }, 10000);

    return () => clearInterval(loopInterval);
  }, [animationKey]);

  const hourPositions = Array.from({ length: 12 }, (_, i) => {
    const angle = (i * 30 - 90) * (Math.PI / 180);
    return {
      x: 50 + 35 * Math.cos(angle),
      y: 50 + 35 * Math.sin(angle),
    };
  });

  const strokeColor = isDark ? '#818CF8' : '#4F46E5';

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <div
        className="relative transition-all duration-1000"
        style={{
          transform: `rotate(${rotation}deg) scale(${phase === 'tick' ? 0 : 1})`,
          opacity: phase === 'tick' ? 0 : 1
        }}
      >
        <svg viewBox="0 0 100 100" className="w-64 h-64 md:w-80 md:h-80">
          <circle cx="50" cy="50" r="48" fill="none" stroke={strokeColor} strokeWidth="2" opacity="0.3" />
          <circle cx="50" cy="50" r="45" fill="none" stroke={strokeColor} strokeWidth="1" />

          {hourPositions.map((pos, i) => (
            <g key={i}>
              <circle cx={pos.x} cy={pos.y} r="3" fill="none" stroke={strokeColor} strokeWidth="1.5" className="transition-all duration-300" />
              {checkedHours.includes(i) && (
                <g className="animate-[checkPop_0.3s_ease-out]">
                  <circle cx={pos.x} cy={pos.y} r="3" fill={strokeColor} />
                  <path
                    d={`M ${pos.x - 2} ${pos.y} L ${pos.x - 0.5} ${pos.y + 2} L ${pos.x + 2} ${pos.y - 2}`}
                    stroke="white"
                    strokeWidth="1"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                  />
                </g>
              )}
            </g>
          ))}

          <line x1="50" y1="50" x2="50" y2="25" stroke={strokeColor} strokeWidth="2" strokeLinecap="round" />
          <line x1="50" y1="50" x2="65" y2="50" stroke={strokeColor} strokeWidth="1.5" strokeLinecap="round" />
          <circle cx="50" cy="50" r="2" fill={strokeColor} />
        </svg>
      </div>

      <div
        className="absolute inset-0 flex items-center justify-center transition-all duration-500"
        style={{
          transform: `scale(${phase === 'tick' ? 1 : 0})`,
          opacity: phase === 'tick' ? 1 : 0
        }}
      >
        <svg viewBox="0 0 100 100" className="w-64 h-64 md:w-80 md:h-80">
          <circle cx="50" cy="50" r="45" fill={strokeColor} className="animate-[pulse_0.5s_ease-out]" />
          <path
            d="M 25 50 L 42 67 L 75 34"
            stroke="white"
            strokeWidth="6"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            strokeDasharray="100"
            strokeDashoffset="100"
            className="animate-[drawCheck_0.8s_ease-out_forwards]"
          />
        </svg>
      </div>
    </div>
  );
};

// Main Home Component
const Home = ({ isDark }) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen transition-colors duration-300 pt-20"
      style={{
        background: isDark 
          ? 'linear-gradient(to bottom right, #1F2937, #111827)'
          : 'linear-gradient(to bottom right, #DBEAFE, #E0E7FF, #DDD6FE)'
      }}>
      <style>{`
        @keyframes checkPop {
          0% { transform: scale(0); }
          50% { transform: scale(1.2); }
          100% { transform: scale(1); }
        }
        @keyframes drawCheck {
          to { stroke-dashoffset: 0; }
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div className="container mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[70vh]">
          <div className="space-y-8 z-10">
            <div className="space-y-4">
              <SplitText
                text="Organize your"
                tag="h1"
                className="text-5xl md:text-6xl font-bold leading-tight"
                isDark={isDark}
                delay={0}
              />
              <SplitText
                text="work and life."
                tag="h1"
                className="text-5xl md:text-6xl font-bold leading-tight"
                isDark={isDark}
                delay={800}
              />
            </div>

            <div className="space-y-6" style={{ animation: 'fadeInUp 0.8s ease-out 1.6s both' }}>
              <p className="text-xl md:text-2xl leading-relaxed"
                style={{ color: isDark ? '#E5E7EB' : '#374151' }}>
                Become <span className="font-semibold" style={{color: isDark ? '#93C5FD' : '#4F46E5'}}>focused</span>,{' '}
                <span className="font-semibold" style={{color: isDark ? '#C4B5FD' : '#7C3AED'}}>organized</span>, and{' '}
                <span className="font-semibold" style={{color: isDark ? '#FBCFE8' : '#DB2777'}}>calm</span> with TaskMaster.
              </p>

              <div className="flex flex-wrap gap-4 text-sm" style={{ color: isDark ? '#D1D5DB' : '#4B5563' }}>
                {['Track all tasks', 'Set priorities', 'Stay productive'].map((text, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>{text}</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ animation: 'fadeInUp 0.8s ease-out 2s both' }}>
              <button
                onClick={() => navigate('/signup')}
                className="group inline-flex items-center gap-2 px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full text-lg font-semibold transition-all duration-300 hover:scale-105 hover:shadow-2xl"
              >
                Start for Free
                <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </button>
              <p className="mt-3 text-sm" style={{ color: isDark ? '#9CA3AF' : '#6B7280' }}>
                No credit card required • Free forever
              </p>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 bg-linear-to-br from-indigo-500/20 to-purple-500/20 blur-3xl rounded-full animate-[pulse_3s_ease-in-out_infinite]" />
            <div className="relative" style={{ animation: 'float 6s ease-in-out infinite' }}>
              <AnimatedClock isDark={isDark} />
            </div>
          </div>
        </div>

        <div className="mt-20 grid md:grid-cols-3 gap-8" style={{ animation: 'fadeInUp 0.8s ease-out 2.4s both' }}>
          {[
            { icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2', title: 'Simple Task Management', desc: 'Create, organize, and track your tasks effortlessly.' },
            { icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z', title: 'Smart Reminders', desc: 'Never miss a deadline with intelligent notifications.' },
            { icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z', title: 'Track Progress', desc: 'Visualize your productivity and celebrate wins.' }
          ].map((item, i) => (
            <div key={i} className="p-6 rounded-2xl backdrop-blur-sm border transition-all duration-300 hover:transform hover:-translate-y-2"
              style={{
                backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.7)',
                borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(229, 231, 235, 1)'
              }}>
              <div className="w-12 h-12 bg-indigo-500/20 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2" style={{color: isDark ? '#FFFFFF' : '#111827'}}>{item.title}</h3>
              <p style={{color: isDark ? '#9CA3AF' : '#4B5563'}}>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;