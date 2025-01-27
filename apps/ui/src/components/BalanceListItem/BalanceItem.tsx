import { Box, Flex, Avatar, Text } from "@radix-ui/themes";
import "./styles.css";
import { useMemo } from "react";

type TokenBalanceListItemProps = {
  symbol: string;
  balance: string;
  tokenPriceUSD?: number;
  icon: string;
};

function TokenBalanceListItem({
  symbol,
  balance,
  tokenPriceUSD,
  icon,
}: TokenBalanceListItemProps) {
  const tokenValue = useMemo(() => {
    if (!tokenPriceUSD) return null;

    return (Number(balance) * tokenPriceUSD).toLocaleString();
  }, [tokenPriceUSD, balance]);

  return (
    <Flex
      className="balanceListItem"
      direction="row"
      width="100%"
      justify={"between"}
    >
      <Box>
        <Avatar mt="1" src={icon} fallback="USDC" mr="3" />
        <Text align={"center"} weight="bold">
          {symbol}
        </Text>
      </Box>

      <Flex direction="column" pr="1">
        <Text align="right">
          {balance} {symbol}
        </Text>
        <Text align="right">$ {tokenValue}</Text>
      </Flex>
    </Flex>
  );
}

export default TokenBalanceListItem;
