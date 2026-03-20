"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Plus, Plane, MapPin, Calendar, ChevronRight } from "lucide-react";
import Header from "@/components/common/Header";
import BottomNav from "@/components/BottomNav";
import { format } from "date-fns";
import { ko } from "date-fns/locale";

interface Trip {
  id: string;
  title: string;
  country: string;
  currency: string;
  currencySymbol: string;
  startDate: Date;
  endDate: Date;
  budget: number;
  spent: number;
  members: string[];
  status: "active" | "past" | "upcoming";
}

const MOCK_TRIPS: Trip[] = [
  {
    id: "trip-1",
    title: "후쿠오카 먹방 여행",
    country: "일본",
    currency: "JPY",
    currencySymbol: "¥",
    startDate: new Date("2024-03-25"),
    endDate: new Date("2024-03-28"),
    budget: 800000,
    spent: 425000,
    members: ["나", "철수", "영희"],
    status: "active",
  },
  {
    id: "trip-2",
    title: "파리 낭만 일주일",
    country: "프랑스",
    currency: "EUR",
    currencySymbol: "€",
    startDate: new Date("2024-05-10"),
    endDate: new Date("2024-05-17"),
    budget: 2500000,
    spent: 0,
    members: ["나"],
    status: "upcoming",
  },
];

export default function TravelPage() {
  const [trips, setTrips] = useState<Trip[]>(MOCK_TRIPS);

  return (
    <main className="flex-1 flex flex-col bg-app-bg min-h-screen pb-32">
      <Header title="여행" transparent />

      <div className="px-7 mt-8 space-y-10">
        {/* Active & Upcoming Trips */}
        <section className="space-y-6">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-[17px] font-bold text-foreground opacity-80">
              진행 중이거나 예정된 여행
            </h2>
            <span className="text-[13px] font-bold text-primary">
              {trips.filter((t) => t.status !== "past").length}개
            </span>
          </div>

          <div className="flex flex-col gap-4">
            {trips
              .filter((t) => t.status !== "past")
              .map((trip) => (
                <Link
                  key={trip.id}
                  href={`/travel/${trip.id}`}
                  className="bg-white dark:bg-slate-900 rounded-3xl p-5 shadow-sm border border-slate-50 dark:border-slate-800 transition-all active:scale-[0.98] group"
                >
                  <div className="flex justify-between items-start mb-5">
                    <div className="flex items-center gap-3.5">
                      <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-[22px] group-hover:bg-primary/5 transition-colors">
                        {trip.country === "일본"
                          ? "🇯🇵"
                          : trip.country === "프랑스"
                            ? "🇫🇷"
                            : "✈️"}
                      </div>
                      <div>
                        <h3 className="text-[16px] font-bold text-foreground mb-0.5 group-hover:text-primary transition-colors">
                          {trip.title}
                        </h3>
                        <p className="text-[12px] font-bold text-slate-500 flex items-center gap-1.5 opacity-90">
                          <Calendar size={12} strokeWidth={3} />
                          {format(trip.startDate, "M.dd")} -{" "}
                          {format(trip.endDate, "M.dd")}
                        </p>
                      </div>
                    </div>
                    <ChevronRight
                      size={18}
                      className="text-slate-300 group-hover:text-primary transition-colors mt-1"
                    />
                  </div>

                  <div className="space-y-2.5">
                    <div className="flex justify-between items-end px-1">
                      <p className="text-[11px] font-bold text-slate-500 uppercase tracking-tighter">
                        총 지출액
                      </p>
                      <p className="text-[15px] font-extrabold text-foreground">
                        <span className="text-primary mr-1">
                          {trip.currencySymbol}
                          {trip.spent.toLocaleString()}
                        </span>
                        <span className="text-slate-400 text-[12px] font-bold">
                          {" "}
                          / {trip.currencySymbol}
                          {trip.budget.toLocaleString()}
                        </span>
                      </p>
                    </div>
                    <div className="h-2 bg-slate-50 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full transition-all duration-700"
                        style={{
                          width: `${Math.min((trip.spent / trip.budget) * 100, 100)}%`,
                        }}
                      />
                    </div>
                  </div>
                </Link>
              ))}
          </div>
        </section>

        {/* Create Trip Placeholder */}
        <Link
          href="/travel/new"
          className="w-full py-6 border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-3xl flex flex-col items-center justify-center gap-2.5 text-slate-400 hover:text-primary hover:border-primary/20 transition-all group active:scale-[0.98]"
        >
          <div className="w-10 h-10 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center group-hover:bg-primary/5 transition-colors">
            <Plus size={20} strokeWidth={3} />
          </div>
          <p className="text-[14px] font-bold tracking-tight">
            새로운 여행 떠나기
          </p>
        </Link>
      </div>

      <BottomNav />
    </main>
  );
}
