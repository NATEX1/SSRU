import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import fs from "fs";
import path from "path";

export async function GET(req) {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "admin") {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const filterType = searchParams.get("filter") || "month"; // day, month, year

    try {
        const logDir = path.join(process.cwd(), "logs");
        const now = new Date();
        const currentYear = now.getFullYear();
        const logFile = path.join(logDir, `login-${currentYear}.log`);

        if (!fs.existsSync(logFile)) {
            return NextResponse.json({ data: [] });
        }

        const content = fs.readFileSync(logFile, "utf-8");
        const lines = content.split("\n").filter(line => line.trim() !== "");

        // Parse logic
        // [2026-01-26T06:40:00.000Z] | Email: ... | Status: Success | IP: ... | Location: ...
        const stats = {};
        console.log(`Parsing ${lines.length} lines from log file`);

        lines.forEach(line => {
            const match = line.match(/^\[(.*?)]/);
            if (!match) return;

            const timestamp = new Date(match[1]);
            if (isNaN(timestamp.getTime())) return;

            const isSuccess = line.includes("Status: Success");
            if (!isSuccess) return; // Only count successful logins for the graph

            let key;
            if (filterType === "day") {
                // Last 30 days
                key = timestamp.toISOString().split("T")[0];
            } else if (filterType === "month") {
                // By month in current year (YYYY-MM)
                key = `${timestamp.getFullYear()}-${String(timestamp.getMonth() + 1).padStart(2, '0')}`;
            } else {
                key = timestamp.getFullYear().toString();
            }

            stats[key] = (stats[key] || 0) + 1;
        });

        // Format for Recharts
        const data = Object.keys(stats).map(key => ({
            name: key,
            value: stats[key]
        })).sort((a, b) => a.name.localeCompare(b.name));

        console.log(`Returning ${data.length} data points for login stats`);

        return NextResponse.json({ data });
    } catch (err) {
        console.error("Login Stats API Error:", err);
        return NextResponse.json({
            message: "Internal Server Error",
            error: err.message,
            stack: process.env.NODE_ENV === "development" ? err.stack : undefined
        }, { status: 500 });
    }
}
