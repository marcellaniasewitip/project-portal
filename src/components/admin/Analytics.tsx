import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, ResponsiveContainer, Line, Area, AreaChart } from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, MapPin, Users, Calendar, Loader2 } from 'lucide-react';

export const Analytics = () => {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('http://localhost/project-tracking-portal/api/dashboard/get_analytics_data.php')
            .then(res => res.json())
            .then(json => {
                if (json.success) setData(json);
                setLoading(false);
            })
            .catch(err => console.error("Analytics fetch error:", err));
    }, []);

    const formatCurrency = (v: number) => `K${(v / 1000000).toFixed(1)}M`;
    const formatYAxisCurrency = (v: number) => `K${(v / 1000000).toFixed(1)}`;

    if (loading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin h-10 w-10 text-primary" /></div>;
    if (!data) return <div className="p-10 text-center">No analytics data available.</div>;

    const totalBudget = data.budgetByDistrict.reduce((sum: number, item: any) => sum + item.budget, 0);
    const totalProjects = data.budgetByDistrict.reduce((sum: number, item: any) => sum + item.projects, 0);
    const completedProjects = data.budgetByDistrict.reduce((sum: number, item: any) => sum + item.completed, 0);
    const completionRate = totalProjects > 0 ? Math.round((completedProjects / totalProjects) * 100) : 0;

    return (
        <div id="analytic" className="space-y-6 p-4 sm:p-6 lg:p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Total Budget</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{formatCurrency(totalBudget)}</div>
                        <p className="text-xs text-green-600 flex items-center mt-1"><TrendingUp className="h-3 w-3 mr-1" /> Live from DB</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalProjects}</div>
                        <p className="text-xs text-muted-foreground mt-1">Across all LLGs</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{completionRate}%</div>
                        <div className="w-full bg-secondary h-1 mt-2 rounded-full overflow-hidden">
                            <div className="bg-primary h-full" style={{ width: `${completionRate}%` }} />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Engagement</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">Live</div>
                        <p className="text-xs text-blue-600 mt-1">Public Feedback Active</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                    <CardHeader><CardTitle>Budget Allocation by LLG</CardTitle></CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={data.budgetByDistrict} margin={{ bottom: 50 }}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" angle={-45} textAnchor="end" interval={0} tick={{fontSize: 11}} />
                                <YAxis tickFormatter={formatYAxisCurrency} />
                                <Tooltip formatter={(v: any) => [formatCurrency(v), 'Budget']} />
                                <Bar dataKey="budget" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader><CardTitle>Projects by Category</CardTitle></CardHeader>
                    <CardContent className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie data={data.projectsByCategory} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({name}) => name}>
                                    {data.projectsByCategory.map((entry: any, index: number) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader><CardTitle>LLG Performance Scores</CardTitle></CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-border">
                            <thead className="bg-muted/50">
                                <tr>
                                    <th className="text-left p-3 text-xs font-bold uppercase">LLG Name</th>
                                    <th className="text-right p-3 text-xs font-bold uppercase">Budget</th>
                                    <th className="text-right p-3 text-xs font-bold uppercase">Projects</th>
                                    <th className="text-right p-3 text-xs font-bold uppercase">Progress</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {data.budgetByDistrict.map((d: any, i: number) => (
                                    <tr key={i} className="hover:bg-muted/30 transition-colors">
                                        <td className="p-3 text-sm font-medium">{d.name}</td>
                                        <td className="p-3 text-sm text-right">{formatCurrency(d.budget)}</td>
                                        <td className="p-3 text-sm text-right">{d.projects}</td>
                                        <td className="p-3 text-right">
                                            <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-bold">
                                                {Math.round((d.completed / d.projects) * 100)}%
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};