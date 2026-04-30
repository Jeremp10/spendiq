import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts"
import client from "../api/client"

const COLORS = ["#22c55e", "#16a34a", "#4ade80", "#86efac", "#bbf7d0", "#059669", "#34d399"]

export default function Dashboard() {
  const [spending, setSpending] = useState({})
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    client.get("/spending-by-category")
      .then(response => {
        setSpending(response.data)
        setLoading(false)
      })
      .catch(error => {
        console.error("Failed to fetch spending data", error)
        setLoading(false)
      })

    client.get("/")
      .then(response => {
        setTransactions(response.data)
      })
      .catch(error => {
        console.error("Failed to fetch transactions", error)
      })
  }, [])

  const chartData = Object.entries(spending).map(([category, amount]) => ({
    category,
    amount: parseFloat(amount.toFixed(2))
  }))

  const total = chartData.reduce((sum, item) => sum + item.amount, 0)

  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <p className="text-gray-400">Loading your insights...</p>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Navbar */}
      <nav className="bg-white border-b border-gray-100 px-8 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-gray-900">SpendIQ</h1>
        <button
          onClick={() => navigate("/")}
          className="text-sm text-gray-500 hover:text-green-500 transition-colors"
        >
          + Upload new CSV
        </button>
      </nav>

      <div className="max-w-5xl mx-auto px-8 py-10">

        {/* Header */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Spending Overview</h2>
          <p className="text-gray-500 text-sm mt-1">Based on your uploaded transactions</p>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
            <p className="text-sm text-gray-500">Total Spent</p>
            <p className="text-3xl font-bold text-gray-900 mt-1">${total.toFixed(2)}</p>
          </div>
          <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
            <p className="text-sm text-gray-500">Categories</p>
            <p className="text-3xl font-bold text-gray-900 mt-1">{chartData.length}</p>
          </div>
          <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
            <p className="text-sm text-gray-500">Top Category</p>
            <p className="text-3xl font-bold text-green-500 mt-1">
              {chartData.sort((a, b) => b.amount - a.amount)[0]?.category || "-"}
            </p>
          </div>
        </div>

        {/* Chart */}
        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 mb-8">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-6">
            Spending by Category
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData} barSize={48}>
              <XAxis dataKey="category" tick={{ fontSize: 12, fill: "#9ca3af" }} />
              <YAxis tick={{ fontSize: 12, fill: "#9ca3af" }} />
              <Tooltip
                formatter={(value) => [`$${value}`, "Amount"]}
                contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }}
              />
              <Bar dataKey="amount" radius={[6, 6, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Category breakdown */}
        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
            Breakdown
          </h3>
          {chartData.map((item, index) => (
            <div key={index} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                <span className="text-sm text-gray-700">{item.category}</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-400">
                  {((item.amount / total) * 100).toFixed(0)}%
                </span>
                <span className="text-sm font-semibold text-gray-900">${item.amount}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Transaction table */}
        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 mt-6">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
            Transactions
          </h3>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-400 border-b border-gray-100">
                <th className="pb-3 font-medium">Date</th>
                <th className="pb-3 font-medium">Description</th>
                <th className="pb-3 font-medium">Category</th>
                <th className="pb-3 font-medium text-right">Amount</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((t, index) => (
                <tr key={index} className="border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors">
                  <td className="py-3 text-gray-400">{t.date}</td>
                  <td className="py-3 text-gray-700">{t.description}</td>
                  <td className="py-3">
                    <span className="bg-green-50 text-green-600 text-xs px-2 py-1 rounded-full">
                      {t.category_confirmed || t.category}
                    </span>
                  </td>
                  <td className="py-3 text-right font-semibold text-gray-900">${t.amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  )
}
