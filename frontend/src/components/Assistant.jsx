import { useState, useEffect } from 'react';
import { Bot, X, MessageSquare, CheckCircle2, AlertTriangle, Zap } from 'lucide-react';
import { isPast, isToday } from 'date-fns';

const Assistant = ({ tasks, isDark }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [unread, setUnread] = useState(false);

    useEffect(() => {
        analyzeTasks();
    }, [tasks]);

    const analyzeTasks = () => {
        const newMessages = [];
        const pending = tasks.filter(t => !t.completed);
        const completed = tasks.filter(t => t.completed);
        const overdue = pending.filter(t => t.deadline && isPast(new Date(t.deadline)) && !isToday(new Date(t.deadline)));
        const highPriority = pending.filter(t => t.priority === 'High');
        const pinned = pending.filter(t => t.isPinned);

        // 1. Welcome / Status
        if (pending.length === 0 && tasks.length > 0) {
            newMessages.push({ type: 'success', text: "🎉 Amazing! You've cleared all your tasks. Time to relax or plan ahead?", icon: CheckCircle2 });
        } else if (tasks.length === 0) {
             newMessages.push({ type: 'info', text: "👋 Hi! I'm your assistant. Add some tasks to get started, and I'll help you stay on track.", icon: Bot });
        } else {
            // 2. Critical Alerts (Overdue)
            if (overdue.length > 0) {
                newMessages.push({ 
                    type: 'error', 
                    text: `🚨 Attention: You have ${overdue.length} overdue task${overdue.length > 1 ? 's' : ''}. I recommend tackling "${overdue[0].title}" first.`, 
                    icon: AlertTriangle 
                });
            }

            // 3. Focus Suggestions (Pinned or High Priority)
            if (pinned.length > 0) {
                 newMessages.push({ 
                    type: 'warning', 
                    text: `📌 You have ${pinned.length} pinned task${pinned.length > 1 ? 's' : ''}. Don't forget about "${pinned[0].title}".`, 
                    icon: Zap 
                });
            } else if (highPriority.length > 0) {
                newMessages.push({ 
                    type: 'warning', 
                    text: `⚡ Focus Mode: You have ${highPriority.length} high priority task${highPriority.length > 1 ? 's' : ''} pending. "${highPriority[0].title}" looks important.`, 
                    icon: Zap 
                });
            }

            // 4. Motivation
            const completionRate = Math.round((completed.length / tasks.length) * 100) || 0;
            if (completionRate > 50 && pending.length > 0) {
                newMessages.push({ type: 'info', text: `🚀 You're doing great! ${completionRate}% of tasks completed. Keep that momentum going!`, icon: CheckCircle2 });
            }
        }
        
        setMessages(newMessages);
        if (newMessages.length > 0) setUnread(true);
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-4">
            {/* Chat Window */}
            {isOpen && (
                <div className={`w-80 md:w-96 rounded-2xl shadow-2xl overflow-hidden border animate-in slide-in-from-bottom-5 duration-300 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                    {/* Header */}
                    <div className="bg-indigo-600 p-4 flex items-center justify-between text-white">
                        <div className="flex items-center gap-2">
                            <div className="p-1.5 bg-white/20 rounded-lg">
                                <Bot size={20} />
                            </div>
                            <div>
                                <h3 className="font-semibold text-sm">Smart Assistant</h3>
                                <p className="text-[10px] text-indigo-200">AI-powered insights</p>
                            </div>
                        </div>
                        <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 p-1 rounded-lg transition-colors">
                            <X size={18} />
                        </button>
                    </div>

                    {/* Messages Area */}
                    <div className={`p-4 max-h-96 overflow-y-auto space-y-3 ${isDark ? 'bg-gray-900/50' : 'bg-gray-50'}`}>
                        {messages.length === 0 && (
                            <p className="text-center text-sm text-gray-500 py-4">Analyzing your tasks...</p>
                        )}
                        {messages.map((msg, idx) => (
                            <div key={idx} className={`flex gap-3 p-3 rounded-xl border ${
                                isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'
                            }`}>
                                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                                    msg.type === 'error' ? 'bg-red-100 text-red-600' :
                                    msg.type === 'warning' ? 'bg-amber-100 text-amber-600' :
                                    msg.type === 'success' ? 'bg-emerald-100 text-emerald-600' :
                                    'bg-blue-100 text-blue-600'
                                }`}>
                                    <msg.icon size={16} />
                                </div>
                                <p className={`text-sm leading-relaxed ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                                    {msg.text}
                                </p>
                            </div>
                        ))}
                    </div>

                    {/* Footer / Input (Simulated) */}
                    <div className={`p-3 border-t text-xs text-center ${isDark ? 'border-gray-700 text-gray-500' : 'border-gray-100 text-gray-400'}`}>
                        Tips exclude completed tasks
                    </div>
                </div>
            )}

            {/* Toggle Button */}
            <button 
                onClick={() => { setIsOpen(!isOpen); setUnread(false); }}
                className="relative group flex items-center justify-center w-14 h-14 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full shadow-lg hover:shadow-indigo-500/30 transition-all hover:scale-105"
            >
                {isOpen ? <X size={24} /> : <Bot size={24} />}
                
                {/* Unread Badge */}
                {!isOpen && unread && (
                    <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 border-2 border-white dark:border-gray-900 rounded-full animate-pulse"></span>
                )}
                
                {/* Tooltip */}
                {!isOpen && (
                     <span className="absolute right-full mr-3 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                        Ask AI Assistant
                    </span>
                )}
            </button>
        </div>
    );
};

export default Assistant;
