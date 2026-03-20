"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, Check, X, Plane, Users, Calendar, Banknote, Plus, Info } from "lucide-react";
import Header from "@/components/common/Header";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { motion, AnimatePresence } from "framer-motion";

const COUNTRIES = [
  { name: "일본", icon: "🇯🇵", currency: "JPY", symbol: "¥" },
  { name: "미국", icon: "🇺🇸", currency: "USD", symbol: "$" },
  { name: "유럽", icon: "🇪🇺", currency: "EUR", symbol: "€" },
  { name: "베트남", icon: "🇻🇳", currency: "VND", symbol: "₫" },
  { name: "태국", icon: "🇹🇭", currency: "THB", symbol: "฿" },
  { name: "영국", icon: "🇬🇧", currency: "GBP", symbol: "£" },
  { name: "중국", icon: "🇨🇳", currency: "CNY", symbol: "¥" },
];

export default function NewTripPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    title: "",
    country: "",
    currencySymbol: "₩",
    startDate: "",
    endDate: "",
    budget: "",
    members: ["나"],
  });

  const [memberInput, setMemberInput] = useState("");

  const updateForm = (key: string, value: any) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleCountrySelect = (country: typeof COUNTRIES[0]) => {
    setFormData(prev => ({ 
      ...prev, 
      country: country.name, 
      currencySymbol: country.symbol 
    }));
    setStep(2);
  };

  const addMember = () => {
    if (memberInput.trim() && !formData.members.includes(memberInput.trim())) {
      updateForm("members", [...formData.members, memberInput.trim()]);
      setMemberInput("");
    }
  };

  const removeMember = (name: string) => {
    if (name === "나") return;
    updateForm("members", formData.members.filter(m => m !== name));
  };

  const isStepValid = () => {
    if (step === 1) return !!formData.country;
    if (step === 2) return !!formData.startDate && !!formData.endDate && !!formData.title;
    if (step === 3) return formData.members.length > 0;
    if (step === 4) return !!formData.budget;
    return false;
  };

  return (
    <main className="flex-1 flex flex-col bg-app-bg min-h-screen">
      <Header 
        title={step === 1 ? "어디로 떠나시나요?" : step === 2 ? "여행 정보 입력" : step === 3 ? "누구와 함께하시나요?" : "예산 설정"}
        showBack
        onBack={() => step > 1 ? setStep(step - 1) : router.back()}
      />

      <div className="flex-1 px-7 py-8 flex flex-col">
        {/* Progress Bar */}
        <div className="flex gap-2 mb-10">
          {[1, 2, 3, 4].map((i) => (
            <div 
              key={i} 
              className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${
                i <= step ? "bg-primary" : "bg-slate-100 dark:bg-slate-800"
              }`} 
            />
          ))}
        </div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-2 gap-4">
                {COUNTRIES.map((c) => (
                  <button
                    key={c.name}
                    onClick={() => handleCountrySelect(c)}
                    className={`p-4 rounded-3xl border-2 transition-all flex flex-col items-center gap-2 ${
                      formData.country === c.name 
                      ? "border-primary bg-primary/5 text-primary" 
                      : "border-slate-50 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-500"
                    }`}
                  >
                    <span className="text-3xl">{c.icon}</span>
                    <span className="text-[14px] font-bold">{c.name}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div className="space-y-3">
                <p className="text-[12px] font-bold text-slate-500 ml-1 uppercase">여행 이름</p>
                <input
                  autoFocus
                  type="text"
                  placeholder="예: 지브리 먹방 투어"
                  value={formData.title}
                  onChange={(e) => updateForm("title", e.target.value)}
                  className="w-full bg-white dark:bg-slate-900 p-4 rounded-2xl text-[16px] font-bold outline-none border-2 border-slate-50 dark:border-slate-800 focus:border-primary/20 transition-all shadow-sm"
                />
              </div>

              <div className="space-y-3">
                <p className="text-[12px] font-bold text-slate-500 ml-1 uppercase">여행 기간</p>
                <div className="grid grid-cols-2 gap-3 text-center">
                   <div className="space-y-1.5">
                      <p className="text-[11px] font-bold text-slate-400">시작일</p>
                      <input 
                        type="date"
                        value={formData.startDate}
                        onChange={(e) => updateForm("startDate", e.target.value)}
                        className="w-full bg-white dark:bg-slate-900 p-3.5 rounded-xl text-[14px] font-bold outline-none border-2 border-slate-50 dark:border-slate-800 focus:border-primary/20"
                      />
                   </div>
                   <div className="space-y-1.5">
                      <p className="text-[11px] font-bold text-slate-400">종료일</p>
                      <input 
                        type="date"
                        value={formData.endDate}
                        onChange={(e) => updateForm("endDate", e.target.value)}
                        className="w-full bg-white dark:bg-slate-900 p-3.5 rounded-xl text-[14px] font-bold outline-none border-2 border-slate-50 dark:border-slate-800 focus:border-primary/20"
                      />
                   </div>
                </div>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div className="space-y-4">
                <p className="text-[12px] font-bold text-slate-500 ml-1 uppercase">멤버 추가</p>
                <div className="flex gap-2">
                  <input
                    autoFocus
                    type="text"
                    placeholder="친구 이름"
                    value={memberInput}
                    onChange={(e) => setMemberInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addMember()}
                    className="flex-1 bg-white dark:bg-slate-900 p-4 rounded-2xl text-[15px] font-bold outline-none border-2 border-slate-50 dark:border-slate-800 focus:border-primary/20 transition-all shadow-sm"
                  />
                  <button 
                    onClick={addMember}
                    className="w-14 h-14 bg-primary text-white rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20 active:scale-95 transition-all"
                  >
                    <Plus size={24} strokeWidth={3} />
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 pt-2">
                {formData.members.map((name) => (
                  <div 
                    key={name}
                    className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800 px-4 py-2.5 rounded-full border border-slate-100 dark:border-slate-800"
                  >
                    <span className="text-[14px] font-bold text-foreground">{name}</span>
                    {name !== "나" && (
                      <button onClick={() => removeMember(name)} className="text-slate-300 hover:text-rose-400">
                        <X size={14} strokeWidth={3} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div className="space-y-4">
                <p className="text-[12px] font-bold text-slate-500 ml-1 uppercase">전체 여행 예산</p>
                <div className="flex items-center gap-2 border-b-3 border-slate-50 dark:border-slate-800 pb-3 focus-within:border-primary transition-colors">
                  <span className="text-2xl font-bold text-slate-400">{formData.currencySymbol}</span>
                  <input
                    autoFocus
                    type="text"
                    inputMode="numeric"
                    placeholder="0"
                    value={formData.budget}
                    onChange={(e) => updateForm("budget", e.target.value.replace(/[^0-9]/g, ""))}
                    className="flex-1 bg-transparent text-3xl font-black outline-none tracking-tight"
                  />
                </div>
                <p className="text-[12px] font-medium text-slate-400 ml-1">
                  선택하신 국가의 화폐({formData.currencySymbol})로 입력해 주세요.
                </p>
              </div>

              <div className="p-6 bg-primary/5 rounded-[2rem] border border-primary/10">
                <div className="flex items-center gap-3 text-primary mb-2">
                  <Info size={16} />
                  <p className="text-[14px] font-bold">도움말</p>
                </div>
                <p className="text-[13px] font-medium text-slate-500 leading-relaxed">
                  입력하신 예산은 여행 기간 동안 지출 현황과 남은 금액을 계산하는 기준이 됩니다. 여행 중에도 언제든지 수정 가능해요!
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-auto pt-10">
          {step > 1 && (
            <button
              onClick={() => {
                if (step < 4) {
                  setStep(step + 1);
                } else {
                  alert("여행이 생성되었습니다!");
                  router.push("/travel");
                }
              }}
              disabled={!isStepValid()}
              className="w-full h-16 bg-primary disabled:bg-slate-100 dark:disabled:bg-slate-800 text-white disabled:text-slate-300 rounded-2xl text-[17px] font-extrabold shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-95"
            >
              {step === 4 ? "여행 생성 완료" : "다음 단계로"}
            </button>
          )}
        </div>
      </div>
    </main>
  );
}
