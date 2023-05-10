import { BigDecimal, BigInt, Address } from "@graphprotocol/graph-ts";

export let BI_ZERO = BigInt.fromI32(0);
export let BI_ONE = BigInt.fromI32(1);
export let BD_ZERO = BigDecimal.fromString("0.0");

export let DEFAULT_DECIMALS = BigDecimal.fromString("1000000000000000000");

export let COLLATRAL_DECIMALS = BigDecimal.fromString("100000000");

export let ROUTER_ADDRESS = Address.fromString(
  "0x7a250d5630b4cf539739df2c5dacb4c659f2488d"
);

export let FACTORY_ADDRESS = Address.fromString(
  "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f"
);

export let PAIR_ADDRESS = Address.fromString(
  "0xB4334689c86A8d58ae06a35338c4364351B3ecDF"
);
