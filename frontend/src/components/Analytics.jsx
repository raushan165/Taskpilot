import React, { useEffect, useState } from 'react';
import { 
    PieChart, Pie, Cell, ResponsiveContainer, 
    BarChart, Bar, XAxis, YAxis, Tooltip, Legend 
} from 'recharts';
import api from '../api/axios';
import { Activity, CheckCircle2, ListTodo } from 'lucide-react';

const Analytics = ({ isDark, tasks }) => {
    const completedTasks = tasks.filter(t => t.completed);
    const pendingTasks = tasks.filter(t => !t.completed);
    const total = tasks.length;
    
    const stats = {
        total,
        completed: completedTasks.length,
        pending: pendingTasks.length,
        completionRate: total === 0 ? 0 : Math.round((completedTasks.length / total) * 100),
        priority: [
            { name: 'High', value: tasks.filter(t => t.priority === 'High').length, color: '#ef4444' },
            { name: 'Medium', value: tasks.filter(t => t.priority === 'Medium').length, color: '#f59e0b' },
            { name: 'Low', value: tasks.filter(t => t.priority === 'Low').length, color: '#10b981' }
        ]
    };

    if (!tasks) return <div className="p-8 text-center text-gray-500">No data available</div>;

    const COLORS = ['#ef4444', '#f59e0b', '#10b981']; // High, Medium, Low

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className={`p-6 rounded-2xl border ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} shadow-sm`}>
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-indigo-100 text-indigo-600 rounded-xl">
                            <ListTodo size={24} />
                        </div>
                        <div>
                            <p className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Completion Rate</p>
                            <h3 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{stats.completionRate}%</h3>
                        </div>
                    </div>
                </div>
                
                <div className={`p-6 rounded-2xl border ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} shadow-sm`}>
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-emerald-100 text-emerald-600 rounded-xl">
                            <CheckCircle2 size={24} />
                        </div>
                        <div>
                            <p className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Completed Tasks</p>
                            <h3 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{stats.completed} / {stats.total}</h3>
                        </div>
                    </div>
                </div>

                <div className={`p-6 rounded-2xl border ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} shadow-sm`}>
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-amber-100 text-amber-600 rounded-xl">
                            <Activity size={24} />
                        </div>
                        <div>
                            <p className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Pending Tasks</p>
                            <h3 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{stats.pending}</h3>
                        </div>
                    </div>
                </div>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Priority Distribution */}
                <div className={`p-6 rounded-2xl border ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} shadow-sm min-h-[300px]`}>
                    <h3 className={`font-semibold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>Tasks by Priority</h3>
                    <div className="h-[250px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={stats.priority}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {stats.priority.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip 
                                    contentStyle={{ 
                                        backgroundColor: isDark ? '#1f2937' : '#fff', 
                                        borderColor: isDark ? '#374151' : '#e5e7eb',
                                        borderRadius: '12px',
                                        color: isDark ? '#fff' : '#000'
                                    }} 
                                    itemStyle={{ color: isDark ? '#fff' : '#000' }}
                                />
                                <Legend verticalAlign="bottom" height={36}/>
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Completion Status Bar Chart */}
                <div className={`p-6 rounded-2xl border ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} shadow-sm min-h-[300px]`}>
                    <h3 className={`font-semibold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>Task Status</h3>
                    <div className="h-[250px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                data={[
                                    { name: 'Completed', value: stats.completed, color: '#10b981' },
                                    { name: 'Pending', value: stats.pending, color: '#f59e0b' }
                                ]}
                            >
                                <XAxis dataKey="name" stroke={isDark ? '#9ca3af' : '#4b5563'} tick={{fill: isDark ? '#9ca3af' : '#4b5563'}} />
                                <YAxis stroke={isDark ? '#9ca3af' : '#4b5563'} tick={{fill: isDark ? '#9ca3af' : '#4b5563'}} />
                                <Tooltip 
                                    cursor={{fill: 'transparent'}}
                                    contentStyle={{ 
                                        backgroundColor: isDark ? '#1f2937' : '#fff', 
                                        borderColor: isDark ? '#374151' : '#e5e7eb',
                                        borderRadius: '12px',
                                        color: isDark ? '#fff' : '#000'
                                    }} 
                                />
                                <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                                    {stats.priority.map((entry, index) => (
                                         <Cell key={`cell-${index}`} fill={index === 0 ? '#10b981' : '#f59e0b'} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Analytics;
