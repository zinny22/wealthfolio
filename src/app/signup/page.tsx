"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
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

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }

    if (password.length < 6) {
      setError("비밀번호는 최소 6자 이상이어야 합니다.");
      return;
    }

    setLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      // 사용자 이름 업데이트
      await updateProfile(userCredential.user, {
        displayName: name,
      });
      router.push("/");
    } catch (err: any) {
      console.error(err);
      if (err.code === "auth/email-already-in-use") {
        setError("이미 사용 중인 이메일 주소입니다.");
      } else if (err.code === "auth/invalid-email") {
        setError("유효하지 않은 이메일 주소입니다.");
      } else {
        setError("회원가입 중 오류가 발생했습니다: " + err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-vh-100 py-20">
      <Card className="w-full max-w-[440px] border-none shadow-[0_8px_30px_rgb(0,0,0,0.06)] bg-white p-6 rounded-[32px]">
        <CardHeader className="pt-8 pb-8">
          <CardTitle className="text-3xl font-bold text-center text-[#191f28] tracking-tight">
            회원가입
          </CardTitle>
          <CardDescription className="text-center text-[#8b95a1] font-medium mt-2">
            Wealthfolio의 회원이 되어 자산을 체계적으로 관리하세요
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignup} className="space-y-6">
            <div className="space-y-2">
              <label
                htmlFor="name"
                className="text-xs font-bold text-[#8b95a1] ml-1 uppercase"
              >
                이름
              </label>
              <Input
                id="name"
                type="text"
                placeholder="홍길동"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="h-14 rounded-2xl border-none bg-[#f2f4f6] px-5 text-base focus-visible:ring-2 focus-visible:ring-[#3182f6]/20 transition-all"
              />
            </div>
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
                placeholder="6자 이상 입력"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-14 rounded-2xl border-none bg-[#f2f4f6] px-5 text-base focus-visible:ring-2 focus-visible:ring-[#3182f6]/20 transition-all"
              />
            </div>
            <div className="space-y-2">
              <label
                htmlFor="confirmPassword"
                className="text-xs font-bold text-[#8b95a1] ml-1 uppercase"
              >
                비밀번호 확인
              </label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="비밀번호 확인"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="h-14 rounded-2xl border-none bg-[#f2f4f6] px-5 text-base focus-visible:ring-2 focus-visible:ring-[#3182f6]/20 transition-all"
              />
            </div>

            {error && (
              <div className="text-sm text-[#f04452] font-bold text-center px-2">{error}</div>
            )}

            <Button type="submit" className="w-full h-14 rounded-2xl bg-[#3182f6] text-lg font-bold shadow-lg shadow-[#3182f6]/10 hover:bg-[#1b64da] transition-all active:scale-[0.98]" disabled={loading}>
              {loading ? "가입 중..." : "회원가입"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center pt-8 pb-4">
          <p className="text-sm text-[#8b95a1] font-medium">
            이미 계정이 있으신가요?{" "}
            <Link
              href="/login"
              className="text-[#3182f6] hover:underline font-bold ml-1"
            >
              로그인
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
