import React, { useEffect, useState } from 'react';
import { db } from '../../firebase/firebase-config';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { useFirestoreUser } from '../../User_crud/users_crud';

// Color palettes
const KPI_COLORS = ['#FBBF24', '#EF4444', '#10B981', '#3B82F6'];
// Paid = green, Unpaid = yellow
const PIE_COLORS = ['#34D399', '#FBBF24'];

export default function Analyse() {
  const [paidOrders, setPaidOrders] = useState([]);
  const [allValidOrders, setAllValidOrders] = useState([]);
  const [dailyRevenue, setDailyRevenue] = useState([]);
  const [ordersPerDay, setOrdersPerDay] = useState([]);
  const [ordersPerHour, setOrdersPerHour] = useState([]);
  const [avgOrderValue, setAvgOrderValue] = useState(0);
  const [topItems, setTopItems] = useState([]);

  const { firebaseUser } = useFirestoreUser();
  const adminId = firebaseUser?.uid;
  // Listen to valid orders for payment status
  useEffect(() => {
    if (!adminId) return; // Prevent running query before adminId is available

    const q = query(
      collection(db, 'products_ordered'),
      where('valid', '==', true),
      where('adminId', '==', adminId)
    );

    const unsub = onSnapshot(q, snapshot => {
      const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setAllValidOrders(docs);
    });

    return unsub;
  }, [adminId]); 

  // Listen to paid & valid orders for metrics
  useEffect(() => {
    const q = query(
      collection(db, 'products_ordered'),
      where('valid', '==', true),
      where('payed', '==', true),
      where('adminId', '==', adminId)
    );
    const unsub = onSnapshot(q, snapshot => {
      const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setPaidOrders(docs);
    });
    return unsub;
  }, [adminId]);

  // Helper to parse Firestore timestamp or string
  const toDate = ts => (ts?.toDate ? ts.toDate() : new Date(ts));

  // Compute daily revenue & order counts (paid)
  useEffect(() => {
    const revMap = {};
    const cntMap = {};
    paidOrders.forEach(o => {
      const day = toDate(o.createdAt).toLocaleDateString();
      const total = o.items?.reduce(
        (sum, i) => sum + Number(i.price) * (i.quantity || 0),
        0
      ) || 0;
      revMap[day] = (revMap[day] || 0) + total;
      cntMap[day] = (cntMap[day] || 0) + 1;
    });
    setDailyRevenue(
      Object.entries(revMap)
        .map(([date, revenue]) => ({ date, revenue }))
        .sort((a, b) => new Date(a.date) - new Date(b.date))
    );
    setOrdersPerDay(
      Object.entries(cntMap)
        .map(([date, orders]) => ({ date, orders }))
        .sort((a, b) => new Date(a.date) - new Date(b.date))
    );
  }, [paidOrders]);

  // Compute orders per hour (paid)
  useEffect(() => {
    const hourMap = {};
    paidOrders.forEach(o => {
      const hr = toDate(o.createdAt).getHours();
      hourMap[hr] = (hourMap[hr] || 0) + 1;
    });
    setOrdersPerHour(
      Array.from({ length: 24 }, (_, h) => ({
        hour: `${h}:00`,
        orders: hourMap[h] || 0
      }))
    );
  }, [paidOrders]);

  // Compute average order value (paid)
  useEffect(() => {
    if (!paidOrders.length) {
      setAvgOrderValue(0);
      return;
    }
    const sumTotal = paidOrders.reduce(
      (sum, o) =>
        sum +
        (o.items?.reduce((s, i) => s + Number(i.price) * (i.quantity || 0), 0) || 0),
      0
    );
    setAvgOrderValue((sumTotal / paidOrders.length).toFixed(2));
  }, [paidOrders]);

  // Compute top 5 items (paid)
  useEffect(() => {
    const itemMap = {};
    paidOrders.forEach(o => {
      o.items?.forEach(i => {
        itemMap[i.name] = (itemMap[i.name] || 0) + (i.quantity || 0);
      });
    });
    setTopItems(
      Object.entries(itemMap)
        .map(([name, qty]) => ({ name, qty }))
        .sort((a, b) => b.qty - a.qty)
        .slice(0, 5)
    );
  }, [paidOrders]);

  const paidCount = allValidOrders.filter(o => o.payed).length;
  const unpaidCount = allValidOrders.length - paidCount;

  return (
    <div className="p-6 space-y-10">
      <h2 className="text-2xl font-semibold">Owner Analytics</h2>

      {/* KPI Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-sm text-gray-500">Total Valid Orders</p>
          <p className="text-2xl font-bold">{allValidOrders.length}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-sm text-gray-500">Paid Orders</p>
          <p className="text-2xl font-bold">{paidCount}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-sm text-gray-500">Total Revenue</p>
          <p className="text-2xl font-bold">
            {dailyRevenue.reduce((sum, d) => sum + d.revenue, 0).toFixed(2)} MAD
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-sm text-gray-500">Avg Order Value</p>
          <p className="text-2xl font-bold">{avgOrderValue} MAD</p>
        </div>
      </div>

      {/* Payment Status Pie */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="font-medium mb-2">Payment Status</h3>
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie
              data={[
                { name: 'Paid', value: paidCount },
                { name: 'Unpaid', value: unpaidCount }
              ]}
              dataKey="value"
              nameKey="name"
              innerRadius={40}
              outerRadius={70}
              label
            >
              <Cell fill={PIE_COLORS[0]} />
              <Cell fill={PIE_COLORS[1]} />
            </Pie>
            <Legend />
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Daily Revenue Chart */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="font-medium mb-2">Daily Revenue (Paid)</h3>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={dailyRevenue}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" tick={{ fontSize: 10 }} />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="revenue" stroke={KPI_COLORS[0]} strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Orders per Day Chart */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="font-medium mb-2">Orders per Day (Paid)</h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={ordersPerDay}>
            <XAxis dataKey="date" tick={{ fontSize: 10 }} />
            <YAxis />
            <Tooltip />
            <Bar dataKey="orders" fill={KPI_COLORS[1]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Orders per Hour Chart */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="font-medium mb-2">Orders per Hour (Paid)</h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={ordersPerHour}>
            <XAxis dataKey="hour" tick={{ fontSize: 10 }} />
            <YAxis />
            <Tooltip />
            <Bar dataKey="orders" fill={KPI_COLORS[2]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Top Items Chart */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="font-medium mb-2">Top 5 Menu Items (Paid)</h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart layout="vertical" data={topItems}>
            <XAxis type="number" />
            <YAxis dataKey="name" type="category" width={100} />
            <Tooltip />
            <Bar dataKey="qty" fill={KPI_COLORS[3]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
