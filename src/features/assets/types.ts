// src/features/assets/types.ts

export type Currency = "KRW" | "USD";

export interface StockItem {
  id: string;
  purchaseDate: string; // 구매일
  broker: string; // 증권사
  tradeType: "매수" | "매도"; // 매매구분
  name: string; // 종목명
  code: string; // 종목코드
  market: "Domestic" | "Overseas" | string; // 시장구분 (코스피, 나스닥 등)
  sector: string; // 섹터
  unitPrice: number; // 평단가 (매입단가)
  quantity: number; // 수량
  note: string; // 비고
  exchangeRate: number; // 환율 (매수 시점)
  amount: number; // 금액 (외화/원화 자체 통화 기준)
  adjustedAvgPrice: number; // 실평단가
  totalAmount: number; // 총액 (자체 통화)
  totalAmountKrw: number; // 총액(원)
  realizedGain: number; // 실현손익(원)
  currency: Currency;
  currentPrice: number; // 현재가 (평가를 위해 유지)
}

// 기존 호환성을 위해 별칭 유지 혹은 리팩토링
export type StockHolding = StockItem;

export interface CashAccount {
  id: string;
  bankName: string; // 은행명
  accountName: string; // 계좌명
  balance: number; // 잔액
  currency: "KRW" | "USD"; // 통화
}

export interface SavingDeposit {
  id: string;
  type: string; // 구분 (예금, 적금)
  bankName: string; // 은행
  joinDate: string; // 가입일
  interestRate: number; // 이율 (%)
  period: number; // 기간 (개월)
  amount: number; // 금액 (원금)
  isTaxFree: boolean; // 비과세 여부
  currency: "KRW" | "USD"; // 통화
  maturityAmountPreTax: number; // 만기수령액(세전)
  maturityAmountPostTax: number; // 만기수령액(세후)
  maturityDate: string; // 만기일
  exchangeRate: number; // 환율
  maturityAmountOriginal: number; // 만기수령액(통화)
}

export interface ExchangeRate {
  currency: "USD";
  rate: number; // 현재 기준 원/달러 환율
}

export interface Insurance {
  id: string;
  company: string; // 보험사
  description: string; // 설명
  joinDate: string; // 가입일
  endDate: string; // 종료일
  monthlyPayment: number; // 월 납입금액
  payout: number; // 수령 (옵션, 없으면 0)
  totalPayment: number; // 총 납입액
}

// 시각화를 위한 데이터 타입
export interface AssetAllocation {
  name: string;
  value: number;
  color: string;
}
