"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { auth } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { LogIn } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/");
    } catch (err: any) {
      console.error(err);
      if (err.code === "auth/invalid-credential") {
        setError("이메일 또는 비밀번호가 올바르지 않습니다.");
      } else {
        setError("로그인 중 오류가 발생했습니다: " + err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError("");
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      router.push("/");
    } catch (err: any) {
      console.error(err);
      setError("Google 로그인 중 오류가 발생했습니다: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-vh-100 py-20">
      <Card className="w-full max-w-[440px] border-none shadow-[0_8px_30px_rgb(0,0,0,0.06)] bg-white p-6 rounded-[32px]">
        <CardHeader className="pt-8 pb-10">
          <CardTitle className="text-3xl font-bold text-center text-[#191f28] tracking-tight">
            로그인
          </CardTitle>
          <CardDescription className="text-center text-[#8b95a1] font-medium mt-2">
            Wealthfolio 자산 관리를 시작해보세요
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleEmailLogin} className="space-y-6">
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="text-xs font-bold text-[#8b95a1] ml-1 uppercase"
              >
                이메일
              </label>
              <Input
                id="email"
                type="email"
                placeholder="email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-14 rounded-2xl border-none bg-[#f2f4f6] px-5 text-base focus-visible:ring-2 focus-visible:ring-[#3182f6]/20 transition-all"
              />
            </div>
            <div className="space-y-2">
              <label
                htmlFor="password"
                className="text-xs font-bold text-[#8b95a1] ml-1 uppercase"
              >
                비밀번호
              </label>
              <Input
                id="password"
                type="password"
                placeholder="비밀번호"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-14 rounded-2xl border-none bg-[#f2f4f6] px-5 text-base focus-visible:ring-2 focus-visible:ring-[#3182f6]/20 transition-all"
              />
            </div>

            {error && (
              <div className="text-sm text-[#f04452] font-bold text-center px-2 animate-shake">{error}</div>
            )}

            <Button type="submit" className="w-full h-14 rounded-2xl bg-[#3182f6] text-lg font-bold shadow-lg shadow-[#3182f6]/10 hover:bg-[#1b64da] transition-all active:scale-[0.98]" disabled={loading}>
              {loading ? "로그인 중..." : "로그인"}
            </Button>
          </form>

          <div className="relative my-10">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-[#f2f4f6]" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-white px-4 text-[#8b95a1] font-bold uppercase tracking-widest">
                OR
              </span>
            </div>
          </div>

          <Button
            variant="outline"
            type="button"
            className="w-full h-14 rounded-2xl border-2 border-[#f2f4f6] bg-white text-base font-bold text-[#4e5968] hover:bg-[#f9fafb] transition-all"
            onClick={handleGoogleLogin}
            disabled={loading}
          >
            <LogIn className="mr-3 h-5 w-5" /> Google로 시작하기
          </Button>
        </CardContent>
        <CardFooter className="flex justify-center pt-8 pb-4">
          <p className="text-sm text-[#8b95a1] font-medium">
            계정이 없으신가요?{" "}
            <Link
              href="/signup"
              className="text-[#3182f6] hover:underline font-bold ml-1"
            >
              회원가입
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
