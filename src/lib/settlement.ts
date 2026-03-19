import { TravelMember, TravelSpending, SettlementResult } from "@/types/travel";

export function calculateSettlement(
  members: TravelMember[],
  spendings: TravelSpending[]
): SettlementResult[] {
  // 1. 참여자별 실제 지출액(Paid)과 분담액(Owed) 계산
  const balanceMap: Record<string, number> = {};
  members.forEach((m) => (balanceMap[m.id] = 0));

  spendings.forEach((s) => {
    if (s.isExcludedFromSettlement) return;

    // 결제자에게 지불액 추가
    balanceMap[s.payerId] += s.amountKrw;

    // 분담 대상자들에게 분담액 차감
    const share = s.amountKrw / s.splitMemberIds.length;
    s.splitMemberIds.forEach((mId) => {
      balanceMap[mId] -= share;
    });
  });

  // 2. 받아야 할 사람(+)과 줘야 할 사람(-) 분리
  const debtors = Object.keys(balanceMap)
    .filter((id) => balanceMap[id] < -0.01) // 부차적인 오차 방지
    .map((id) => ({ id, amount: Math.abs(balanceMap[id]) }))
    .sort((a, b) => b.amount - a.amount);

  const creditors = Object.keys(balanceMap)
    .filter((id) => balanceMap[id] > 0.01)
    .map((id) => ({ id, amount: balanceMap[id] }))
    .sort((a, b) => b.amount - a.amount);

  const results: SettlementResult[] = [];

  // 3. 그리디 알고리즘으로 상계 처리 (최소 송금 경로)
  let dIdx = 0;
  let cIdx = 0;

  while (dIdx < debtors.length && cIdx < creditors.length) {
    const debtor = debtors[dIdx];
    const creditor = creditors[cIdx];

    const settleAmount = Math.min(debtor.amount, creditor.amount);

    if (settleAmount > 0) {
      results.push({
        from: debtor.id,
        to: creditor.id,
        amount: Math.round(settleAmount),
      });
    }

    debtor.amount -= settleAmount;
    creditor.amount -= settleAmount;

    if (debtor.amount < 1) dIdx++;
    if (creditor.amount < 1) cIdx++;
  }

  return results;
}
