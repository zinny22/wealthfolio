# Wealthfolio (Personal Asset Manager)

Wealthfolio는 개인의 모든 자산(주식, 현금, 예적금, 보험 등)을 한곳에서 통합 관리할 수 있는 스마트한 웹 대시보드입니다.
복잡한 엑셀 파일 대신, 직관적인 UI와 차트를 통해 자산 현황을 한눈에 파악하세요.

## ✨ Key Features

### 1. 📊 통합 대시보드 (Dashboard)

- **자산 요약**: 총 자산 및 자산군별(주식, 현금, 예적금, 보험) 합계를 한눈에 확인.
- **시각화**: 도넛 차트와 프로그레스 바를 통해 자산 배분 현황을 직관적으로 파악.
- **실시간 환율 반영**: USD 자산을 KRW로 자동 환산하여 통합 가치 제공 (설정된 환율 기준).

### 2. 📈 포트폴리오 관리 (Stocks)

- **주식 매매 내역 기록**: 종목, 수량, 매수가, 통화(USD/KRW) 등 상세 정보 입력.
- **수익률 자동 계산**: 현재가 입력 시 평가손익 및 수익률 자동 계산.
- **다양한 자산 지원**: 국내 주식, 미국 주식 등 다양한 통화 지원.

### 3. 💰 현금 및 예적금 (Cash & Savings)

- **입출금 계좌**: 은행별 파킹통장, 입출금 계좌 잔액 관리.
- **예적금 상품**: 가입일, 만기일, 이율, 비과세 여부 등을 기록하고 만기 수령액(세후) 자동 계산.

### 4. 🛡️ 보험 및 연금 (Insurance & Pension)

- **납입 관리**: 월 납입금, 총 납입액, 만기 수령 예상액 관리.
- **보장 내용 기록**: 보험사 및 상품명, 주요 보장 내용 메모.

### 5. 🎨 사용자 편의 기능

- **Dark/Light Mode**: 눈이 편안한 다크 모드와 깔끔한 라이트 모드 지원.
- **데이터 영구 저장**: 별도 서버 없이 브라우저(Local Storage)에 데이터가 안전하게 저장됩니다.
- **반응형 디자인**: PC 및 모바일 환경 최적화.

## 🛠 Tech Stack

- **Framework**: Next.js 15+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: Shadcn/ui (Radix UI 기반)
- **State Management**: Zustand (with Persist Middleware)
- **Icons**: Lucide React
- **Charts**: Recharts

## 🚀 Getting Started

### Prerequisites

- Node.js 18.17.0 이상
- npm 또는 yarn, pnpm

### Installation

1. 저장소 클론 (Clone the repository)

   ```bash
   git clone https://github.com/your-username/wealthfolio.git
   cd wealthfolio
   ```

2. 패키지 설치 (Install dependencies)

   ```bash
   npm install
   # or
   yarn install
   ```

3. 개발 서버 실행 (Run development server)

   ```bash
   npm run dev
   ```

4. 브라우저 접속
   `http://localhost:3000` 주소로 접속하여 확인.

## 📁 Project Structure

```
src/
├── app/                 # Next.js App Router Pages
│   ├── page.tsx         # Dashboard
│   ├── portfolio/       # Stocks Page
│   ├── cash/            # Cash Accounts Page
│   ├── savings/         # Savings & Deposits Page
│   └── insurance/       # Insurance Page
├── components/          # Reusable UI Components (Shadcn/ui)
├── features/            # Feature-based Modules
│   └── assets/          # Asset Management Logic (Store, Types, Components)
└── lib/                 # Utilities
```

## 📝 License

This project is licensed under the MIT License.
