import { Flex } from "@radix-ui/themes";
import TokenBalanceListItem from "./components/BalanceListItem/BalanceItem";
import { ICONS } from "./icons";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";
import { useBalances } from "./lib/api";
import { useMemo } from "react";

function App() {
  const account = useAccount().address;
  const { isLoading, balances } = useBalances();

  const data = useMemo(() => {
    if (isLoading || !balances) return null;

    return Object.entries(balances).map(([symbol, data]) => {
      return (
        <TokenBalanceListItem
          symbol={symbol}
          balance={data.balance}
          icon={ICONS[symbol]}
        />
      );
    });
  }, [isLoading, balances]);

  return (
    <Flex
      direction="column"
      align={"center"}
      justify={"center"}
      height={"100vh"}
      gap={"2"}
    >
      {!account && <ConnectButton></ConnectButton>}

      {data}
    </Flex>
  );
}

export default App;
