import { useState, useEffect } from "react"
import client from "../api/client"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts"

const COLORS = ["#845EF7", "#00C9A7", "#FF6B6B", "#FCC419", "#339AF0", "#F06595", "#20C997"]

export default function Dashboard() {
  const [spending, setSpending] = useState({})
  const [loading, setLoading] = useState(true)

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
  }, [])

  // Convert object to array for Recharts
  const chartData = Object.entries(spending).map(([category, amount]) => ({
    category,
    amount: parseFloat(amount.toFixed(2))
  }))

  if (loading) return <p>Loading...</p>

  return (
    <div>
      <h1>Spending Dashboard</h1>
      <h2>Spending by Category</h2>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={chartData}>
          <XAxis dataKey="category" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="amount">
            {chartData.map((entry, index) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
