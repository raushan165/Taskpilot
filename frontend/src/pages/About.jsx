
import { useState, useEffect, useRef, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

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

// Task Organization Panels Illustration (without person)
const TaskPanelsIllustration = ({ isDark }) => {
  const [floatOffset, setFloatOffset] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setFloatOffset(prev => (prev + 1) % 360);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  const float = Math.sin(floatOffset * Math.PI / 180) * 8;
  const primaryColor = isDark ? '#60A5FA' : '#3B82F6';
  const secondaryColor = isDark ? '#818CF8' : '#4F46E5';
  const accentColor = isDark ? '#34D399' : '#10B981';
  const panelBg = isDark ? '#1F2937' : '#FFFFFF';
  const iconColor = isDark ? '#FBBF24' : '#F59E0B';

  return (
    <svg viewBox="0 0 500 400" className="w-full h-auto">
      {/* Background circles */}
      <circle cx="150" cy="200" r="120" fill={primaryColor} opacity="0.1" />
      <circle cx="350" cy="200" r="100" fill={secondaryColor} opacity="0.1" />
      
      {/* Left Panel - Ideas/Notes */}
      <g transform={`translate(0, ${float})`}>
        <rect x="50" y="120" width="120" height="200" rx="12" fill={panelBg} stroke={primaryColor} strokeWidth="3" />
        
        {/* Light bulb icon */}
        <circle cx="90" cy="160" r="12" fill="none" stroke={iconColor} strokeWidth="2" />
        <path d="M 85 172 L 95 172 M 87 177 L 93 177" stroke={iconColor} strokeWidth="2" strokeLinecap="round" />
        <rect x="87" y="174" width="6" height="3" fill={iconColor} />
        
        {/* Text lines */}
        <rect x="65" y="190" width="80" height="4" rx="2" fill={primaryColor} opacity="0.6" />
        <rect x="65" y="200" width="60" height="4" rx="2" fill={primaryColor} opacity="0.4" />
        
        {/* Email/message icon */}
        <rect x="75" y="220" width="40" height="30" rx="4" fill="none" stroke={iconColor} strokeWidth="2" />
        <path d="M 75 225 L 95 240 L 115 225" stroke={iconColor} strokeWidth="2" fill="none" />
        
        {/* Stack of documents at bottom */}
        <g transform={`translate(${Math.sin((floatOffset + 45) * Math.PI / 180) * 2}, 0)`}>
          <rect x="55" y="270" width="35" height="5" rx="2" fill={primaryColor} opacity="0.3" />
          <rect x="60" y="277" width="35" height="5" rx="2" fill={primaryColor} opacity="0.5" />
          <rect x="65" y="284" width="35" height="5" rx="2" fill={primaryColor} opacity="0.7" />
        </g>
        
        {/* Alert icon */}
        <circle cx="110" cy="285" r="15" fill={iconColor} opacity="0.2" />
        <circle cx="110" cy="285" r="2" fill={iconColor} />
        <path d="M 110 275 L 110 282" stroke={iconColor} strokeWidth="2" strokeLinecap="round" />
      </g>
      
      {/* Middle Panel - Task Management */}
      <g transform={`translate(0, ${float * 0.8})`}>
        <rect x="190" y="100" width="130" height="240" rx="12" fill={panelBg} stroke={secondaryColor} strokeWidth="3" />
        
        {/* Header with dots */}
        <rect x="200" y="115" width="110" height="30" rx="6" fill={secondaryColor} opacity="0.2" />
        <circle cx="215" cy="130" r="3" fill={secondaryColor} />
        <circle cx="230" cy="130" r="3" fill={secondaryColor} />
        <circle cx="245" cy="130" r="3" fill={secondaryColor} />
        
        {/* Task items with checkboxes */}
        {[0, 1, 2].map((i) => (
          <g key={i} transform={`translate(0, ${i * 40})`}>
            <rect x="200" y="160" width="110" height="30" rx="6" fill={isDark ? '#374151' : '#F9FAFB'} stroke={primaryColor} strokeWidth="1.5" />
            <rect x="210" y="170" r="6" width="12" height="12" rx="2" fill="none" stroke={accentColor} strokeWidth="2" />
            {i === 0 && (
              <path d="M 213 176 L 216 179 L 220 173" stroke={accentColor} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            )}
            <rect x="230" y="171" width="60" height="3" rx="1.5" fill={isDark ? '#9CA3AF' : '#D1D5DB'} />
            <rect x="230" y="177" width="40" height="2" rx="1" fill={isDark ? '#6B7280' : '#E5E7EB'} />
          </g>
        ))}
        
        {/* Question mark icon at bottom */}
        <g transform={`translate(${Math.sin((floatOffset + 90) * Math.PI / 180) * 3}, 0)`}>
          <circle cx="255" cy="310" r="18" fill={iconColor} opacity="0.2" />
          <text x="255" y="320" textAnchor="middle" fontSize="24" fontWeight="bold" fill={iconColor}>?</text>
        </g>
      </g>
      
      {/* Right Panel - Documents Stack */}
      <g transform={`translate(0, ${float * 1.2})`}>
        <rect x="340" y="140" width="120" height="180" rx="12" fill={panelBg} stroke={primaryColor} strokeWidth="3" />
        
        {/* Document pages stacked */}
        <g transform={`translate(${Math.sin((floatOffset + 180) * Math.PI / 180) * 2}, 0)`}>
          {[0, 1, 2, 3].map((i) => (
            <g key={i}>
              <rect 
                x={350 + i * 3} 
                y={160 + i * 8} 
                width="90" 
                height="25" 
                rx="4" 
                fill={isDark ? '#374151' : '#F9FAFB'} 
                stroke={primaryColor} 
                strokeWidth="1.5" 
              />
              <rect x={360 + i * 3} y={168 + i * 8} width="50" height="2" rx="1" fill={primaryColor} opacity="0.5" />
              <rect x={360 + i * 3} y={173 + i * 8} width="40" height="2" rx="1" fill={primaryColor} opacity="0.3" />
            </g>
          ))}
        </g>
        
        {/* Checkmark at bottom */}
        <g transform={`translate(${Math.sin((floatOffset + 270) * Math.PI / 180) * 2}, 0)`}>
          <rect x="375" y="275" width="50" height="30" rx="6" fill={accentColor} opacity="0.2" />
          <path d="M 385 290 L 393 298 L 410 280" stroke={accentColor} strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      </g>
      
      {/* Floating decorative elements */}
      <g opacity={(Math.sin((floatOffset + 0) * Math.PI / 180) + 1) / 2}>
        <circle cx="450" cy="80" r="6" fill={accentColor} />
      </g>
      <g opacity={(Math.sin((floatOffset + 90) * Math.PI / 180) + 1) / 2}>
        <circle cx="40" cy="100" r="5" fill={primaryColor} />
      </g>
      <g opacity={(Math.sin((floatOffset + 180) * Math.PI / 180) + 1) / 2}>
        <rect x="430" y="340" width="12" height="12" rx="3" fill={secondaryColor} />
      </g>
      <g opacity={(Math.sin((floatOffset + 270) * Math.PI / 180) + 1) / 2}>
        <circle cx="60" cy="350" r="7" fill={iconColor} />
      </g>
    </svg>
  );
};

// Scroll Animation Hook
const useScrollAnimation = () => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, []);

  return [ref, isVisible];
};

// Feature Card Component with scale animation
const FeatureCard = ({ icon, title, description, isDark, delay }) => {
  const [ref, isVisible] = useScrollAnimation();

  return (
    <div
      ref={ref}
      className="p-6 rounded-2xl backdrop-blur-sm border transition-all duration-500 hover:transform hover:-translate-y-2"
      style={{
        backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.7)',
        borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(229, 231, 235, 1)',
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0) scale(1)' : 'translateY(30px) scale(0.9)',
        transitionDelay: `${delay}ms`
      }}
    >
      <div className="w-12 h-12 bg-indigo-500/20 rounded-lg flex items-center justify-center mb-4">
        <svg className="w-6 h-6 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={icon} />
        </svg>
      </div>
      <h3 className="text-xl font-semibold mb-2" style={{ color: isDark ? '#FFFFFF' : '#111827' }}>
        {title}
      </h3>
      <p style={{ color: isDark ? '#9CA3AF' : '#4B5563' }}>{description}</p>
    </div>
  );
};

// Tech Stack Card with advanced animations
const TechCard = ({ name, desc, isDark, delay, icon }) => {
  const [ref, isVisible] = useScrollAnimation();
  const [hovered, setHovered] = useState(false);

  return (
    <div
      ref={ref}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="p-6 rounded-xl backdrop-blur-sm border transition-all duration-500"
      style={{
        backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.7)',
        borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(229, 231, 235, 1)',
        opacity: isVisible ? 1 : 0,
        transform: isVisible 
          ? hovered 
            ? 'translateX(10px) scale(1.05)' 
            : 'translateX(0) scale(1)' 
          : 'translateX(-30px) scale(0.95)',
        transitionDelay: `${delay}ms`
      }}
    >
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 bg-indigo-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
          <span className="text-2xl">{icon}</span>
        </div>
        <div>
          <h3 className="text-2xl font-bold mb-2" style={{ color: isDark ? '#818CF8' : '#4F46E5' }}>
            {name}
          </h3>
          <p style={{ color: isDark ? '#D1D5DB' : '#4B5563' }}>{desc}</p>
        </div>
      </div>
    </div>
  );
};

// Main About Component
const About = ({ isDark = false }) => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [ref1, isVisible1] = useScrollAnimation();
  const [ref2, isVisible2] = useScrollAnimation();
  const [ref3, isVisible3] = useScrollAnimation();

  return (
    <div
      className="min-h-screen transition-colors duration-300 pt-20"
      style={{
        background: isDark
          ? 'linear-gradient(to bottom right, #1F2937, #111827)'
          : 'linear-gradient(to bottom right, #DBEAFE, #E0E7FF, #DDD6FE)'
      }}
    >
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideInLeft {
          from { opacity: 0; transform: translateX(-50px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(50px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
      `}</style>

      <div className="container mx-auto px-6 py-12">
        {/* Hero Section */}
        <div className="text-center mb-20">
          <div className="mb-8">
            <SplitText
              text="About TaskMaster"
              tag="h1"
              className="text-5xl md:text-6xl font-bold mb-4"
              isDark={isDark}
              delay={0}
            />
          </div>

          <div style={{ animation: 'fadeInUp 0.8s ease-out 1s both' }}>
            <p className="text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed" style={{ color: isDark ? '#E5E7EB' : '#374151' }}>
              Your <span className="font-semibold" style={{ color: isDark ? '#93C5FD' : '#4F46E5' }}>personal productivity</span> companion,
              designed to help you accomplish more with less stress.
            </p>
          </div>
        </div>

        {/* Mission Section with Illustration */}
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
          {/* Mission Text - Left Side */}
          <div
            ref={ref1}
            style={{
              opacity: isVisible1 ? 1 : 0,
              transform: isVisible1 ? 'translateX(0)' : 'translateX(-50px)',
              transition: 'all 0.8s ease-out'
            }}
          >
            <h2 className="text-4xl font-bold mb-6" style={{ color: isDark ? '#FFFFFF' : '#111827' }}>
              Our Mission
            </h2>
            <p className="text-lg leading-relaxed mb-4" style={{ color: isDark ? '#D1D5DB' : '#4B5563' }}>
              TaskMaster was born from a simple idea: productivity tools should empower you, not overwhelm you. 
              We believe that managing your tasks shouldn't be another task on your list.
            </p>
            <p className="text-lg leading-relaxed" style={{ color: isDark ? '#D1D5DB' : '#4B5563' }}>
              Built with modern web technologies and designed with user experience at the forefront, TaskMaster helps 
              individuals and teams stay organized, focused, and productive without the complexity of traditional project 
              management tools.
            </p>
          </div>

          {/* Illustration - Right Side */}
          <div
            style={{
              opacity: isVisible1 ? 1 : 0,
              transform: isVisible1 ? 'translateX(0)' : 'translateX(50px)',
              transition: 'all 0.8s ease-out 0.2s'
            }}
          >
            <TaskPanelsIllustration isDark={isDark} />
          </div>
        </div>

        {/* Features Grid - What Makes Us Different */}
        <div className="mb-20">
          <h2
            className="text-4xl font-bold text-center mb-12"
            style={{ color: isDark ? '#FFFFFF' : '#111827' }}
          >
            What Makes Us Different
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              title="Intuitive Design"
              description="Clean, modern interface that gets out of your way and lets you focus on what matters."
              isDark={isDark}
              delay={0}
            />
            <FeatureCard
              icon="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
              title="Cross-Platform"
              description="Access your tasks anywhere, anytime. Seamlessly sync across all your devices."
              isDark={isDark}
              delay={100}
            />
            <FeatureCard
              icon="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              title="Secure & Private"
              description="Your data is encrypted and secure. We respect your privacy and never share your information."
              isDark={isDark}
              delay={200}
            />
            <FeatureCard
              icon="M13 10V3L4 14h7v7l9-11h-7z"
              title="Lightning Fast"
              description="Optimized performance ensures your task management experience is smooth and responsive."
              isDark={isDark}
              delay={0}
            />
            <FeatureCard
              icon="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
              title="Smart Notifications"
              description="Stay on top of deadlines with intelligent reminders that adapt to your workflow."
              isDark={isDark}
              delay={100}
            />
            <FeatureCard
              icon="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              title="Progress Tracking"
              description="Visualize your productivity with insightful analytics and progress reports."
              isDark={isDark}
              delay={200}
            />
          </div>
        </div>

        {/* Tech Stack Section with Enhanced Animations */}
        <div
          ref={ref2}
          className="max-w-4xl mx-auto mb-20"
          style={{
            opacity: isVisible2 ? 1 : 0,
            transition: 'all 0.8s ease-out'
          }}
        >
          <h2 className="text-4xl font-bold text-center mb-4" style={{ color: isDark ? '#FFFFFF' : '#111827' }}>
            Built with Modern Technology
          </h2>
          <p className="text-center text-lg mb-12" style={{ color: isDark ? '#9CA3AF' : '#6B7280' }}>
            Powered by the MERN stack for maximum performance and scalability
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            <TechCard
              name="MongoDB"
              desc="Flexible, scalable NoSQL database for efficient data storage and retrieval"
              isDark={isDark}
              delay={0}
              icon="🍃"
            />
            <TechCard
              name="Express.js"
              desc="Fast, minimalist web framework providing robust API endpoints"
              isDark={isDark}
              delay={100}
              icon="⚡"
            />
            <TechCard
              name="React"
              desc="Component-based library creating dynamic, responsive user interfaces"
              isDark={isDark}
              delay={200}
              icon="⚛️"
            />
            <TechCard
              name="Node.js"
              desc="JavaScript runtime enabling fast, efficient server-side processing"
              isDark={isDark}
              delay={300}
              icon="🟢"
            />
          </div>
        </div>

        {/* CTA Section */}
        <div
          ref={ref3}
          className="text-center max-w-3xl mx-auto p-12 rounded-3xl backdrop-blur-sm border"
          style={{
            backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.7)',
            borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(229, 231, 235, 1)',
            opacity: isVisible3 ? 1 : 0,
            transform: isVisible3 ? 'scale(1)' : 'scale(0.95)',
            transition: 'all 0.8s ease-out'
          }}
        >
          <h2 className="text-4xl font-bold mb-6" style={{ color: isDark ? '#FFFFFF' : '#111827' }}>
            Ready to Get Started?
          </h2>
          <p className="text-xl mb-8" style={{ color: isDark ? '#D1D5DB' : '#4B5563' }}>
            Join thousands of users who have transformed their productivity with TaskMaster.
          </p>
          <button 
            onClick={() => user ? navigate('/dashboard') : navigate('/login')}
            className="group inline-flex items-center gap-2 px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full text-lg font-semibold transition-all duration-300 hover:scale-105 hover:shadow-2xl"
          >
            {user ? 'Go to Dashboard' : 'Start Your Journey'}
            <svg
              className="w-5 h-5 transform group-hover:translate-x-1 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default About;