import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, Area, AreaChart } from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, MapPin, Users, Calendar } from 'lucide-react';

const budgetByDistrict = [
  { name: 'Maimai Wanwan', budget: 50000, projects: 8, completed: 3 },
  { name: 'Yangkok', budget: 98000, projects: 6, completed: 2 },
  { name: 'East Palai', budget: 87000, projects: 7, completed: 4 },
  { name: 'West Palai', budget: 76000, projects: 5, completed: 2 },
  { name: 'Nuku Central', budget: 65000, projects: 4, completed: 1 }
];

const projectsByCategory = [
  { name: 'Infrastructure', value: 35, color: '#3b82f6' },
  { name: 'Education', value: 20, color: '#10b981' },
  { name: 'Healthcare', value: 18, color: '#f59e0b' },
  { name: 'Water & Sanitation', value: 12, color: '#ef4444' },
  { name: 'Energy', value: 10, color: '#8b5cf6' },
  { name: 'Agriculture', value: 5, color: '#06b6d4' }
];

const monthlyProgress = [
  { month: 'Jan', budget: 50000, completed: 2, started: 3 },
  { month: 'Feb', budget: 98000, completed: 1, started: 2 },
  { month: 'Mar', budget: 87000, completed: 3, started: 4 },
  { month: 'Apr', budget: 76000, completed: 2, started: 1 },
  { month: 'May', budget: 50000, completed: 4, started: 2 },
  { month: 'Jun', budget: 67000, completed: 1, started: 3 }
];

const llgPerformance = [
  { llg: 'Maimai Wanwan', efficiency: 95, onTime: 85, budget: 92 },
  { llg: 'Yangkok', efficiency: 88, onTime: 78, budget: 85 },
  { llg: 'Nuku Central', efficiency: 92, onTime: 88, budget: 90 },
  { llg: 'East Palai', efficiency: 82, onTime: 75, budget: 80 },
  { llg: 'West Palai', efficiency: 75, onTime: 70, budget: 72 }
];

export const Analytics = () => {
  const formatCurrency = (value: number) => `K${(value / 1000000).toFixed(1)}M`;

  const totalBudget = budgetByDistrict.reduce((sum, item) => sum + item.budget, 0);
  const totalProjects = budgetByDistrict.reduce((sum, item) => sum + item.projects, 0);
  const completedProjects = budgetByDistrict.reduce((sum, item) => sum + item.completed, 0);
  const completionRate = Math.round((completedProjects / totalProjects) * 100);

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Budget Allocated</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalBudget)}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600 flex items-center">
                <TrendingUp className="h-3 w-3 mr-1" />
                +12% from last year
              </span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProjects}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600 flex items-center">
                <TrendingUp className="h-3 w-3 mr-1" />
                +8 new this quarter
              </span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completionRate}%</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-red-600 flex items-center">
                <TrendingDown className="h-3 w-3 mr-1" />
                -3% from target
              </span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Public Feedback</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">156</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600 flex items-center">
                <TrendingUp className="h-3 w-3 mr-1" />
                +23% engagement
              </span>
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Budget Allocation by Province</CardTitle>
            <CardDescription>Total project budgets allocated to each province</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={budgetByDistrict}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="name" 
                  tick={{ fontSize: 10 }}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                />
                <YAxis tickFormatter={formatCurrency} />
                <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                <Bar dataKey="budget" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Projects by Category</CardTitle>
            <CardDescription>Distribution of projects across different sectors</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={projectsByCategory}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {projectsByCategory.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Monthly Project Activity</CardTitle>
            <CardDescription>Budget allocation and project completion over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={monthlyProgress}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis yAxisId="left" tickFormatter={formatCurrency} />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip 
                  formatter={(value, name) => {
                    if (name === 'budget') return formatCurrency(Number(value));
                    return value;
                  }} 
                />
                <Legend />
                <Area 
                  yAxisId="left"
                  type="monotone" 
                  dataKey="budget" 
                  stackId="1" 
                  stroke="#3b82f6" 
                  fill="#3b82f6" 
                  fillOpacity={0.3}
                  name="Budget"
                />
                <Line 
                  yAxisId="right"
                  type="monotone" 
                  dataKey="completed" 
                  stroke="#10b981" 
                  strokeWidth={2}
                  name="Completed"
                />
                <Line 
                  yAxisId="right"
                  type="monotone" 
                  dataKey="started" 
                  stroke="#f59e0b" 
                  strokeWidth={2}
                  name="Started"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>LLG Performance Metrics</CardTitle>
            <CardDescription>Efficiency, on-time delivery, and budget management</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={llgPerformance}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="llg" 
                  tick={{ fontSize: 10 }}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                />
                <YAxis domain={[0, 100]} />
                <Tooltip formatter={(value) => `${value}%`} />
                <Legend />
                <Bar dataKey="efficiency" fill="#3b82f6" name="Efficiency" />
                <Bar dataKey="onTime" fill="#10b981" name="On-Time Delivery" />
                <Bar dataKey="budget" fill="#f59e0b" name="Budget Management" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>{/*District Projects Overview */}
      <Card>
        <CardHeader>
          <CardTitle>District Project Overview</CardTitle>
          <CardDescription>Detailed breakdown of projects and completion status by pdistrict</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">District</th>
                  <th className="text-right py-2">Total Budget</th>
                  <th className="text-right py-2">Projects</th>
                  <th className="text-right py-2">Completed</th>
                  <th className="text-right py-2">Completion Rate</th>
                </tr>
              </thead>
              <tbody>
                {budgetByDistrict.map((district, index) => (
                  <tr key={index} className="border-b">
                    <td className="py-2 font-medium">{district.name}</td>
                    <td className="text-right py-2">{formatCurrency(district.budget)}</td>
                    <td className="text-right py-2">{district.projects}</td>
                    <td className="text-right py-2">{district.completed}</td>
                    <td className="text-right py-2">
                      <span className={`px-2 py-1 rounded text-xs ${
                        Math.round((district.completed / district.projects) * 100) >= 50 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {Math.round((district.completed / district.projects) * 100)}%
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