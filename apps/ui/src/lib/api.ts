import { useEffect, useState } from "react";
import { useAccount } from "wagmi";

const ENDPOINT = "http://localhost:3000";

function fetchBalances(address: string) {
  return fetch(`${ENDPOINT}/${address}`).then((response) => response.json());
}

export function useBalances() {
  const address = useAccount().address;
  const [isLoading, setIsLoading] = useState(false);
  const [balances, setBalances] = useState<Record<
    string,
    {
      balance: string;
      decimals: number;
    }
  > | null>(null);

  useEffect(() => {
    if (address) {
      setIsLoading(true);
      fetchBalances(address)
        .then((data) => {
          setBalances(data);
          setIsLoading(false);
        })
        .catch((err) => {
          setIsLoading(false);
        });
    }
  }, [address]);

  return {
    isLoading,
    balances,
  };
}
