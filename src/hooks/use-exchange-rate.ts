import { useState, useEffect } from "react";

export function useExchangeRate() {
  const [rate, setRate] = useState(1400); // Default fallback
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let mounted = true;

    async function fetchRate() {
      try {
        const res = await fetch(
          "https://api.frankfurter.app/latest?from=USD&to=KRW"
        );
        if (!res.ok) throw new Error("Failed to fetch exchange rate");

        const data = await res.json();
        if (mounted && data?.rates?.KRW) {
          setRate(data.rates.KRW);
        }
      } catch (err) {
        if (mounted) {
          console.error("Failed to fetch exchange rate:", err);
          setError(err instanceof Error ? err : new Error("Unknown error"));
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    }

    fetchRate();

    return () => {
      mounted = false;
    };
  }, []);

  return { rate, isLoading, error };
}
