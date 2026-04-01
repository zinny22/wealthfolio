"use client";

import React, { useMemo, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { CalendarDays, ChevronDown, Save } from "lucide-react";
import {
  format,
  getMonth,
  getYear,
  isAfter,
  isBefore,
  isSameDay,
  setMonth,
  setYear,
} from "date-fns";
import { ko } from "date-fns/locale";
import { DayPicker, type DateRange } from "react-day-picker";
import { Button, DetailHeader, Input } from "@/components/common";

type ActiveDateField = "start" | "end";

export default function EditTripPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const tripId = params.id;

  const initialTrip = useMemo(
    () => ({
      title: searchParams.get("title") || "후쿠오카 먹방 여행",
      country: searchParams.get("country") || "일본",
      currency: searchParams.get("currency") || "JPY",
      currencySymbol: searchParams.get("currencySymbol") || "¥",
      startDate: searchParams.get("startDate") || "2024-03-25",
      endDate: searchParams.get("endDate") || "2024-03-28",
      totalBudget: searchParams.get("totalBudget") || "800000",
    }),
    [searchParams],
  );

  const [title, setTitle] = useState(initialTrip.title);
  const [startDate, setStartDate] = useState(initialTrip.startDate);
  const [endDate, setEndDate] = useState(initialTrip.endDate);
  const [budget, setBudget] = useState(initialTrip.totalBudget);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [selectedRange, setSelectedRange] = useState<DateRange | undefined>({
    from: new Date(`${initialTrip.startDate}T12:00:00`),
    to: new Date(`${initialTrip.endDate}T12:00:00`),
  });
  const [activeDateField, setActiveDateField] =
    useState<ActiveDateField>("start");
  const [calendarMonth, setCalendarMonth] = useState(
    new Date(`${initialTrip.startDate}T12:00:00`),
  );
  const monthOptions = [
    "1월",
    "2월",
    "3월",
    "4월",
    "5월",
    "6월",
    "7월",
    "8월",
    "9월",
    "10월",
    "11월",
    "12월",
  ];
  const yearOptions = Array.from({ length: 11 }, (_, idx) => 2020 + idx);

  const handleDateClick = (day: Date) => {
    setCalendarMonth(day);

    const currentFrom = selectedRange?.from;
    const currentTo = selectedRange?.to;

    if (activeDateField === "start") {
      const nextFrom = day;
      const nextTo =
        currentTo && isBefore(currentTo, nextFrom) ? nextFrom : currentTo;

      setSelectedRange({ from: nextFrom, to: nextTo });
      setStartDate(format(nextFrom, "yyyy-MM-dd"));
      setEndDate(nextTo ? format(nextTo, "yyyy-MM-dd") : "");
      setActiveDateField("end");
      return;
    }

    const nextTo = day;
    const nextFrom =
      currentFrom && isAfter(currentFrom, nextTo) ? nextTo : currentFrom || nextTo;

    setSelectedRange({ from: nextFrom, to: nextTo });
    setStartDate(format(nextFrom, "yyyy-MM-dd"));
    setEndDate(format(nextTo, "yyyy-MM-dd"));
    setActiveDateField("start");

    if (!isSameDay(nextFrom, nextTo)) {
      setIsDatePickerOpen(false);
    }
  };

  const handleYearChange = (year: string) => {
    setCalendarMonth((prev) => setYear(prev, Number(year)));
  };

  const handleMonthChange = (month: string) => {
    setCalendarMonth((prev) => setMonth(prev, Number(month)));
  };

  const handleSave = () => {
    if (!title || !startDate || !endDate || !budget) return;

    const nextParams = new URLSearchParams({
      title,
      country: initialTrip.country,
      currency: initialTrip.currency,
      currencySymbol: initialTrip.currencySymbol,
      startDate,
      endDate,
      totalBudget: budget,
    });

    router.push(`/travel/${tripId}?${nextParams.toString()}`);
  };

  return (
    <main className="flex min-h-screen flex-1 flex-col bg-app-bg">
      <DetailHeader
        title="여행 정보 수정"
        showBack
        onBack={() => router.back()}
      />

      <div className="space-y-7 p-7">
        <div className="space-y-3">
          <p className="ml-1 text-[12px] font-bold uppercase text-slate-500">
            여행 이름
          </p>
          <Input
            autoFocus
            type="text"
            placeholder="여행 제목을 입력하세요"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className="space-y-3">
          <p className="ml-1 text-[12px] font-bold uppercase text-slate-500">
            여행 기간
          </p>
          <div className="relative">
            {isDatePickerOpen && (
              <button
                type="button"
                aria-label="달력 닫기"
                onClick={() => setIsDatePickerOpen(false)}
                className="fixed inset-0 z-40"
              />
            )}

            <button
              type="button"
              onClick={() => setIsDatePickerOpen((prev) => !prev)}
              className="w-full rounded-lg bg-gray-50 px-4 py-3 text-left transition-colors dark:bg-gray-800"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <CalendarDays size={16} className="text-slate-400" />
                  <p className="mt-0.5 text-md font-medium text-foreground">
                    {selectedRange?.from
                      ? selectedRange?.to
                        ? `${format(selectedRange.from, "yyyy.MM.dd")} - ${format(selectedRange.to, "yyyy.MM.dd")}`
                        : `${format(selectedRange.from, "yyyy.MM.dd")} - 종료일 선택`
                      : "시작일과 종료일을 선택해 주세요"}
                  </p>
                </div>
                <div
                  className={`flex items-center justify-center rounded-full text-gray-600 transition-transform ${
                    isDatePickerOpen ? "rotate-180" : ""
                  }`}
                >
                  <ChevronDown size={18} />
                </div>
              </div>
            </button>

            {isDatePickerOpen && (
              <div className="absolute left-0 right-0 top-[calc(100%+12px)] z-50 rounded-lg bg-gray-50 py-6 border border-gray-200 dark:bg-gray-800">
                <div className="mb-4 flex items-center justify-center gap-2 px-6">
                  <select
                    value={getYear(calendarMonth)}
                    onChange={(e) => handleYearChange(e.target.value)}
                    className="rounded-lg bg-white px-3 py-2 text-[13px] font-semibold text-foreground outline-none dark:bg-slate-900"
                  >
                    {yearOptions.map((year) => (
                      <option key={year} value={year}>
                        {year}년
                      </option>
                    ))}
                  </select>
                  <select
                    value={getMonth(calendarMonth)}
                    onChange={(e) => handleMonthChange(e.target.value)}
                    className="rounded-lg bg-white px-3 py-2 text-[13px] font-semibold text-foreground outline-none dark:bg-slate-900"
                  >
                    {monthOptions.map((month, idx) => (
                      <option key={month} value={idx}>
                        {month}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-4 flex items-center justify-center gap-2 px-6">
                  <button
                    type="button"
                    onClick={() => setActiveDateField("start")}
                    className={`rounded-full px-3 py-1.5 text-[12px] font-bold transition-all ${
                      activeDateField === "start"
                        ? "bg-primary text-white"
                        : "bg-white text-slate-500 dark:bg-slate-900"
                    }`}
                  >
                    시작일 수정
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveDateField("end")}
                    className={`rounded-full px-3 py-1.5 text-[12px] font-bold transition-all ${
                      activeDateField === "end"
                        ? "bg-primary text-white"
                        : "bg-white text-slate-500 dark:bg-slate-900"
                    }`}
                  >
                    종료일 수정
                  </button>
                </div>

                <DayPicker
                  mode="range"
                  locale={ko}
                  selected={selectedRange}
                  onDayClick={handleDateClick}
                  month={calendarMonth}
                  onMonthChange={setCalendarMonth}
                  weekStartsOn={0}
                  showOutsideDays
                  className="mx-auto"
                  classNames={{
                    months: "flex w-full justify-center",
                    month: "w-full max-w-[320px]",
                    month_caption:
                      "mb-4 flex items-center justify-center text-[15px] font-black text-foreground",
                    caption_label: "text-[15px] font-black",
                    nav: "hidden",
                    weekdays: "mb-2 grid grid-cols-7",
                    weekday:
                      "text-center text-[11px] font-semibold text-slate-300",
                    week: "mt-1 grid grid-cols-7",
                    day: "flex items-center justify-center",
                    day_button:
                      "h-11 w-11 rounded-2xl text-md font-medium text-foreground transition-all hover:bg-primary/10",
                    today: "text-primary",
                    selected: "bg-primary text-white hover:bg-primary",
                    range_start: "bg-primary text-white rounded-2xl",
                    range_end: "bg-primary text-white rounded-2xl",
                    range_middle: "bg-primary/10 text-primary rounded-none",
                    outside: "text-slate-300",
                    disabled: "text-slate-200",
                  }}
                />
              </div>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <p className="ml-1 text-[12px] font-bold uppercase text-slate-500">
            총 여행 예산
          </p>
          <div className="flex items-center gap-2 border-b-2 border-slate-100 pb-2 focus-within:border-primary transition-colors dark:border-slate-800">
            <span className="text-xl font-bold text-slate-400">
              {initialTrip.currencySymbol}
            </span>
            <input
              type="text"
              inputMode="decimal"
              placeholder="0"
              value={budget}
              onChange={(e) =>
                setBudget(e.target.value.replace(/[^0-9.]/g, ""))
              }
              className="flex-1 bg-transparent text-2xl font-black tracking-tight outline-none"
            />
          </div>
          <p className="ml-1 text-[12px] font-medium text-slate-400">
            현재 화폐는 {initialTrip.country}의 {initialTrip.currency}(
            {initialTrip.currencySymbol})로 유지돼요.
          </p>
        </div>
      </div>

      <Button
        handleClick={handleSave}
        disabled={!title || !startDate || !endDate || !budget}
      >
        <Save size={18} />
        저장하기
      </Button>
    </main>
  );
}
