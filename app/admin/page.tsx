'use client'

import { useState } from 'react'
import { Users, DollarSign, Zap, TrendingUp, AlertCircle, CheckCircle, Clock, Activity } from 'lucide-react'

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState('overview')

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Bar */}
      <nav className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-red-600">🔒 Admin Dashboard</h1>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">Last updated: Just now</span>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700">
                Refresh Data
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Tab Navigation */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-8">
            <TabButton
              label="Overview"
              active={activeTab === 'overview'}
              onClick={() => setActiveTab('overview')}
            />
            <TabButton
              label="Users"
              active={activeTab === 'users'}
              onClick={() => setActiveTab('users')}
            />
            <TabButton
              label="Transactions"
              active={activeTab === 'transactions'}
              onClick={() => setActiveTab('transactions')}
            />
            <TabButton
              label="System"
              active={activeTab === 'system'}
              onClick={() => setActiveTab('system')}
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {activeTab === 'overview' && <OverviewTab />}
        {activeTab === 'users' && <UsersTab />}
        {activeTab === 'transactions' && <TransactionsTab />}
        {activeTab === 'system' && <SystemTab />}
      </div>
    </div>
  )
}

function OverviewTab() {
  return (
    <>
      {/* Key Metrics */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <MetricCard
          icon={<Users />}
          label="Total Users"
          value="1,247"
          change="+12.5%"
          positive={true}
        />
        <MetricCard
          icon={<DollarSign />}
          label="Revenue (MTD)"
          value="$24,890"
          change="+18.2%"
          positive={true}
        />
        <MetricCard
          icon={<Zap />}
          label="Credits Used"
          value="1.2M"
          change="+8.7%"
          positive={true}
        />
        <MetricCard
          icon={<TrendingUp />}
          label="Conversion Rate"
          value="3.4%"
          change="+0.8%"
          positive={true}
        />
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-2xl shadow-sm p-6 mb-8 border border-gray-100">
        <h3 className="text-xl font-bold mb-4">Recent Activity</h3>
        <div className="space-y-4">
          <ActivityItem
            icon={<CheckCircle className="text-green-600" />}
            title="New user signup"
            description="john@example.com joined on Pro plan"
            time="2 minutes ago"
          />
          <ActivityItem
            icon={<DollarSign className="text-blue-600" />}
            title="Payment received"
            description="$99.00 from sarah@example.com"
            time="15 minutes ago"
          />
          <ActivityItem
            icon={<Zap className="text-yellow-600" />}
            title="High credit usage"
            description="User mike@example.com used 5,000 credits"
            time="1 hour ago"
          />
          <ActivityItem
            icon={<AlertCircle className="text-red-600" />}
            title="Failed payment"
            description="Card declined for lisa@example.com"
            time="2 hours ago"
          />
        </div>
      </div>

      {/* Charts Placeholder */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-xl font-bold mb-4">Revenue (Last 30 Days)</h3>
          <div className="h-64 bg-gradient-to-t from-blue-100 to-blue-50 rounded-xl flex items-center justify-center">
            <p className="text-gray-500">Chart visualization here</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-xl font-bold mb-4">User Growth</h3>
          <div className="h-64 bg-gradient-to-t from-purple-100 to-purple-50 rounded-xl flex items-center justify-center">
            <p className="text-gray-500">Chart visualization here</p>
          </div>
        </div>
      </div>
    </>
  )
}

function UsersTab() {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
      <div className="p-6 border-b">
        <h3 className="text-xl font-bold">All Users</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">User</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Plan</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Credits</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Joined</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            <UserRow
              name="John Doe"
              email="john@example.com"
              plan="Pro"
              credits={45000}
              joined="2 days ago"
              status="active"
            />
            <UserRow
              name="Sarah Smith"
              email="sarah@example.com"
              plan="Starter"
              credits={3200}
              joined="1 week ago"
              status="active"
            />
            <UserRow
              name="Mike Johnson"
              email="mike@example.com"
              plan="Free"
              credits={850}
              joined="2 weeks ago"
              status="active"
            />
          </tbody>
        </table>
      </div>
    </div>
  )
}

function TransactionsTab() {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
      <div className="p-6 border-b">
        <h3 className="text-xl font-bold">Recent Transactions</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">User</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Type</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Amount</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Credits</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Date</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            <TransactionRow
              user="john@example.com"
              type="Subscription"
              amount="$99.00"
              credits="50,000"
              date="2 hours ago"
              status="completed"
            />
            <TransactionRow
              user="sarah@example.com"
              type="Credit Purchase"
              amount="$45.00"
              credits="5,000"
              date="5 hours ago"
              status="completed"
            />
            <TransactionRow
              user="lisa@example.com"
              type="Subscription"
              amount="$19.00"
              credits="5,000"
              date="1 day ago"
              status="failed"
            />
          </tbody>
        </table>
      </div>
    </div>
  )
}

function SystemTab() {
  return (
    <>
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <SystemMetric
          icon={<Activity />}
          label="API Status"
          value="Operational"
          color="text-green-600"
        />
        <SystemMetric
          icon={<Clock />}
          label="Uptime"
          value="99.98%"
          color="text-blue-600"
        />
        <SystemMetric
          icon={<Zap />}
          label="Avg Response"
          value="142ms"
          color="text-purple-600"
        />
      </div>

      <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
        <h3 className="text-xl font-bold mb-4">System Logs</h3>
        <div className="space-y-2 font-mono text-sm">
          <LogEntry level="info" message="Database backup completed successfully" time="10:45:23" />
          <LogEntry level="info" message="Credit transaction processed: user_123" time="10:44:18" />
          <LogEntry level="warning" message="High memory usage detected: 85%" time="10:42:05" />
          <LogEntry level="info" message="New user registration: user_456" time="10:40:12" />
          <LogEntry level="error" message="Payment webhook failed: retry scheduled" time="10:38:44" />
        </div>
      </div>
    </>
  )
}

function TabButton({ label, active, onClick }: {
  label: string
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-4 font-semibold border-b-2 transition-colors ${
        active
          ? 'border-blue-600 text-blue-600'
          : 'border-transparent text-gray-600 hover:text-gray-900'
      }`}
    >
      {label}
    </button>
  )
}

function MetricCard({ icon, label, value, change, positive }: {
  icon: React.ReactNode
  label: string
  value: string
  change: string
  positive: boolean
}) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600">
          {icon}
        </div>
        <span className={`text-sm font-semibold ${positive ? 'text-green-600' : 'text-red-600'}`}>
          {change}
        </span>
      </div>
      <p className="text-gray-600 text-sm mb-1">{label}</p>
      <p className="text-3xl font-bold">{value}</p>
    </div>
  )
}

function ActivityItem({ icon, title, description, time }: {
  icon: React.ReactNode
  title: string
  description: string
  time: string
}) {
  return (
    <div className="flex items-start gap-4">
      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
        {icon}
      </div>
      <div className="flex-1">
        <p className="font-semibold">{title}</p>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
      <span className="text-xs text-gray-500">{time}</span>
    </div>
  )
}

function UserRow({ name, email, plan, credits, joined, status }: {
  name: string
  email: string
  plan: string
  credits: number
  joined: string
  status: string
}) {
  return (
    <tr className="hover:bg-gray-50">
      <td className="px-6 py-4">
        <div>
          <p className="font-semibold">{name}</p>
          <p className="text-sm text-gray-600">{email}</p>
        </div>
      </td>
      <td className="px-6 py-4">
        <span className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm font-semibold">
          {plan}
        </span>
      </td>
      <td className="px-6 py-4 font-mono">{credits.toLocaleString()}</td>
      <td className="px-6 py-4 text-sm text-gray-600">{joined}</td>
      <td className="px-6 py-4">
        <span className="px-3 py-1 bg-green-100 text-green-600 rounded-full text-sm font-semibold">
          {status}
        </span>
      </td>
    </tr>
  )
}

function TransactionRow({ user, type, amount, credits, date, status }: {
  user: string
  type: string
  amount: string
  credits: string
  date: string
  status: string
}) {
  return (
    <tr className="hover:bg-gray-50">
      <td className="px-6 py-4 text-sm">{user}</td>
      <td className="px-6 py-4 text-sm">{type}</td>
      <td className="px-6 py-4 font-semibold">{amount}</td>
      <td className="px-6 py-4 font-mono text-sm">{credits}</td>
      <td className="px-6 py-4 text-sm text-gray-600">{date}</td>
      <td className="px-6 py-4">
        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
          status === 'completed'
            ? 'bg-green-100 text-green-600'
            : 'bg-red-100 text-red-600'
        }`}>
          {status}
        </span>
      </td>
    </tr>
  )
}

function SystemMetric({ icon, label, value, color }: {
  icon: React.ReactNode
  label: string
  value: string
  color: string
}) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center gap-3 mb-2">
        <div className={color}>{icon}</div>
        <p className="text-gray-600">{label}</p>
      </div>
      <p className={`text-2xl font-bold ${color}`}>{value}</p>
    </div>
  )
}

function LogEntry({ level, message, time }: {
  level: 'info' | 'warning' | 'error'
  message: string
  time: string
}) {
  const colors = {
    info: 'text-blue-600',
    warning: 'text-yellow-600',
    error: 'text-red-600'
  }

  return (
    <div className="flex gap-4 text-xs">
      <span className="text-gray-500">{time}</span>
      <span className={`uppercase font-bold ${colors[level]}`}>{level}</span>
      <span className="text-gray-700">{message}</span>
    </div>
  )
}
