// src/features/goals/mock.ts
import { GoalYearRow } from "./types";

export function getMockGoals(): GoalYearRow[] {
  const rows: GoalYearRow[] = [
    {
      id: 1,
      year: 2030,
      age: 40,
      house: 200_000_000,
      car: 30_000_000,
      education: 20_000_000,
      familyExpense: 24_000_000,
      etc: 10_000_000,
      totalNeeded: 284_000_000,
    },
    {
      id: 2,
      year: 2035,
      age: 45,
      house: 100_000_000,
      car: 30_000_000,
      education: 30_000_000,
      familyExpense: 30_000_000,
      etc: 15_000_000,
      totalNeeded: 205_000_000,
    },
    {
      id: 3,
      year: 2040,
      age: 50,
      house: 150_000_000,
      car: 40_000_000,
      education: 10_000_000,
      familyExpense: 36_000_000,
      etc: 20_000_000,
      totalNeeded: 256_000_000,
    },
  ];

  return rows;
}
