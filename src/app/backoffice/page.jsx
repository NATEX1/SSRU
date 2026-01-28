"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

export default function Page() {
  const { data: session } = useSession();
  const [loginStats, setLoginStats] = useState([]);
  const [articleStats, setArticleStats] = useState([]);
  const [loginFilter, setLoginFilter] = useState("month");
  const [articleFilter, setArticleFilter] = useState("month");
  const [loginLoading, setLoginLoading] = useState(false);
  const [articleLoading, setArticleLoading] = useState(false);

  useEffect(() => {
    if (session?.user?.role === 'admin') {
      fetchLoginStats();
    }
  }, [session, loginFilter]);

  useEffect(() => {
    if (session?.user?.role === 'admin' || session?.user?.role === 'approver') {
      fetchArticleStats();
    }
  }, [session, articleFilter]);

  const fetchLoginStats = async () => {
    setLoginLoading(true);
    try {
      const res = await fetch(`/api/analytics/login-stats?filter=${loginFilter}`);
      const data = await res.json();
      console.log("Login Stats data:", data);
      setLoginStats(data.data || []);
    } catch (err) {
      console.error("Failed to fetch login stats:", err);
    } finally {
      setLoginLoading(false);
    }
  };

  const fetchArticleStats = async () => {
    setArticleLoading(true);
    try {
      const res = await fetch(`/api/analytics/article-stats?filter=${articleFilter}`);
      const data = await res.json();
      console.log("Article Stats data:", data);
      setArticleStats(data.data || []);
    } catch (err) {
      console.error("Failed to fetch article stats:", err);
    } finally {
      setArticleLoading(false);
    }
  };

  return (
    <div className="p-8 space-y-8">
      <h1 className="text-2xl font-bold">ยินดีต้อนรับเข้าสู่ระบบจัดการหลังบ้าน</h1>

      {session ? (
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 space-y-4">
          <p className="text-lg">สวัสดี, <span className="font-semibold text-primary">{session.user?.name}</span></p>
          <p className="text-gray-500">
            สถานะของคุณคือ: <span className="font-medium bg-gray-100 px-3 py-1 rounded-full text-sm uppercase tracking-wider">{session.user?.role}</span>
          </p>

          <div className="pt-4 flex gap-4">
            <Button asChild className="rounded-2xl">
              <Link href="/backoffice/articles">จัดการบทความ</Link>
            </Button>
            {/* Show Users button only for admin */}
            {session.user?.role === 'admin' && (
              <Button variant="outline" asChild className="rounded-2xl">
                <Link href="/backoffice/users">จัดการผู้ใช้งาน</Link>
              </Button>
            )}
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-2 text-gray-400">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-400"></div>
          Loading session...
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Admin Analytics Section (Logins) */}
        {session?.user?.role === 'admin' && (
          <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-50 space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-gray-800">สถิติผู้เข้าใช้งาน</h2>
                <p className="text-sm text-gray-500">จำนวนการเข้าสู่ระบบ</p>
              </div>

              <div className="flex bg-gray-100 p-1.5 rounded-2xl">
                {['day', 'month', 'year'].map((f) => (
                  <button
                    key={f}
                    onClick={() => setLoginFilter(f)}
                    className={`px-4 py-1.5 text-xs font-bold rounded-xl transition-all ${loginFilter === f
                      ? "bg-white text-black shadow-sm"
                      : "text-gray-400 hover:text-gray-600"
                      }`}
                  >
                    {f === 'day' ? 'รายวัน' : f === 'month' ? 'รายเดือน' : 'รายปี'}
                  </button>
                ))}
              </div>
            </div>

            <div className="min-h-[300px] w-full pt-4">
              {loginLoading ? (
                <div className="h-[300px] w-full flex items-center justify-center bg-gray-50 rounded-3xl">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
                </div>
              ) : loginStats.length > 0 ? (
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={loginStats} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3F458D" stopOpacity={0.8} />
                          <stop offset="95%" stopColor="#3F458D" stopOpacity={0.1} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#9ca3af' }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#9ca3af' }} />
                      <Tooltip cursor={{ fill: '#f9fafb' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontSize: '12px' }} />
                      <Bar dataKey="value" fill="url(#colorValue)" radius={[6, 6, 0, 0]} barSize={24} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="h-[300px] w-full flex flex-col items-center justify-center bg-gray-50 rounded-3xl border border-dashed border-gray-200 text-gray-400 text-xs text-center px-4">
                  ไม่พบข้อมูลสถิติการเข้าใช้งานในช่วงที่เลือก
                </div>
              )}
            </div>
          </div>
        )}

        {/* Article Analytics Section */}
        {(session?.user?.role === 'admin' || session?.user?.role === 'approver') && (
          <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-50 space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-gray-800">สถิติบทความ</h2>
                <p className="text-sm text-gray-500">แยกตามสถานะ</p>
              </div>

              <div className="flex bg-gray-100 p-1.5 rounded-2xl">
                {['day', 'month', 'year'].map((f) => (
                  <button
                    key={f}
                    onClick={() => setArticleFilter(f)}
                    className={`px-4 py-1.5 text-xs font-bold rounded-xl transition-all ${articleFilter === f
                      ? "bg-white text-black shadow-sm"
                      : "text-gray-400 hover:text-gray-600"
                      }`}
                  >
                    {f === 'day' ? 'รายวัน' : f === 'month' ? 'รายเดือน' : 'รายปี'}
                  </button>
                ))}
              </div>
            </div>

            <div className="min-h-[300px] w-full pt-4">
              {articleLoading ? (
                <div className="h-[300px] w-full flex items-center justify-center bg-gray-50 rounded-3xl">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
                </div>
              ) : articleStats.length > 0 ? (
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={articleStats} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorPending" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#FBBF24" stopOpacity={0.8} />
                          <stop offset="95%" stopColor="#FBBF24" stopOpacity={0.1} />
                        </linearGradient>
                        <linearGradient id="colorApproved" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10B981" stopOpacity={0.8} />
                          <stop offset="95%" stopColor="#10B981" stopOpacity={0.1} />
                        </linearGradient>
                        <linearGradient id="colorRejected" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#EF4444" stopOpacity={0.8} />
                          <stop offset="95%" stopColor="#EF4444" stopOpacity={0.1} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#9ca3af' }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#9ca3af' }} />
                      <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontSize: '12px' }} />
                      <Bar dataKey="pending" fill="url(#colorPending)" radius={[6, 6, 0, 0]} barSize={20} name="Pending" />
                      <Bar dataKey="approved" fill="url(#colorApproved)" radius={[6, 6, 0, 0]} barSize={20} name="Approved" />
                      <Bar dataKey="rejected" fill="url(#colorRejected)" radius={[6, 6, 0, 0]} barSize={20} name="Rejected" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="h-[300px] w-full flex flex-col items-center justify-center bg-gray-50 rounded-3xl border border-dashed border-gray-200 text-gray-400 text-xs text-center px-4">
                  ไม่พบข้อมูลสถิติบทยความในช่วงที่เลือก
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
