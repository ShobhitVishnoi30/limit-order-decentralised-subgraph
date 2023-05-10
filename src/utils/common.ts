import {
  BigInt,
  ethereum,
  Address,
  BigDecimal,
  Bytes,
} from "@graphprotocol/graph-ts";
import { Token as TokenContract } from "../../generated/DEXLimitOrder/Token";
import { Pair as PairContract } from "../../generated/DEXLimitOrder/Pair";
import { Router as RouterContract } from "../../generated/DEXLimitOrder/Router";
import { Factory as FactoryContract } from "../../generated/DEXLimitOrder/Factory";
import {
  BI_ONE,
  BI_ZERO,
  FACTORY_ADDRESS,
  PAIR_ADDRESS,
  ROUTER_ADDRESS,
} from "./number";

/**
 * @description For fetching the decimal of the token
 * @param tokenAddress address of the token
 * @returns 18 or 8 or etc...
 */
export function fetchTokenDecimals(tokenAddress: Address): BigInt {
  let decimalValue = null;
  let instance = TokenContract.bind(tokenAddress);
  let decimalResult = instance.try_decimals();
  if (!decimalResult.reverted) {
    decimalValue = decimalResult.value;
  }
  return BigInt.fromI32(decimalValue);
}

/**
 * @description For converting the exponent value to big decimal
 * @param decimals exponential value
 * @returns non-exponential format
 */
export function exponentToBigDecimal(decimals: BigInt): BigDecimal {
  let expo = BigDecimal.fromString("1");
  for (let i = BI_ZERO; i.lt(decimals as BigInt); i = i.plus(BI_ONE)) {
    expo = expo.times(BigDecimal.fromString("10"));
  }
  return expo;
}

/**
 * @description For converting the exponent value to big int
 * @param decimals exponential value
 * @returns non-exponential format
 */
export function exponentToBigInt(decimals: BigInt): BigInt {
  let expo = BigInt.fromString("1");
  for (let i = BI_ZERO; i.lt(decimals as BigInt); i = i.plus(BI_ONE)) {
    expo = expo.times(BigInt.fromString("10"));
  }
  return expo;
}

/**
 * @description For converting the wei to eth wei / Math.pow(10, tokenDecimals)
 * @param tokenAmount amount in wei format
 * @param tokenDecimals decimal of the token
 * @returns eth value
 */
export function convertFromWei(
  tokenAmount: BigInt,
  tokenDecimals: BigInt
): BigDecimal {
  if (tokenDecimals == BI_ZERO) {
    return tokenAmount.toBigDecimal();
  }
  return tokenAmount.toBigDecimal().div(exponentToBigDecimal(tokenDecimals));
}

/**
 * @description For fetching the token0 and token1 of any pair
 * @param pairAddress address of the pair
 * @returns token0 and token 1
 */
export function fetchPairTokens(pairAddress: Address): Address[] {
  let token0: Address = Address.fromString("0");
  let token1: Address = Address.fromString("0");
  let instance = PairContract.bind(PAIR_ADDRESS);
  //let token0Result = instance.try_token0();
  /* if (!token0Result.reverted) {
    token0 = token0Result.value;
  }
  let token1Result = instance.try_token1();
  if (!token1Result.reverted) {
    token1 = token1Result.value;
  }*/
  return [token0, token1];
}

/**
 * @description For fetching the reserves of any pair
 * @param pairAddress address of the pair
 * @returns token0 and token 1
 */
export function fetchPairReserve(pairAddress: Address): BigInt[] {
  let reserve0: BigInt = BigInt.fromString("0");
  let reserve1: BigInt = BigInt.fromString("0");
  let instance = PairContract.bind(pairAddress);
  let result = instance.try_getReserves();
  if (!result.reverted) {
    reserve0 = result.value.get_reserve0();
    reserve1 = result.value.get_reserve1();
  }
  return [reserve0, reserve1];
}

/**
 * @description For fetching the price of a token => token0/token1
 * @param pairAddress address of the pair
 */
export function fetchPairPrice(
  inputTokenAddress: Address,
  outputTokenAddress: Address,
  inputTokenAmount: BigDecimal,
  outputTokenAmount: BigDecimal
): BigDecimal {
  let instance = FactoryContract.bind(FACTORY_ADDRESS);
  let result = instance.try_getPair(inputTokenAddress, outputTokenAddress);
  if (!result.reverted) {
    let pairInstance = PairContract.bind(result.value);
    let token0Result = pairInstance.try_token0();
    let token1Result = pairInstance.try_token1();

    let price: BigDecimal;
    if (!token0Result.reverted && !token1Result.reverted) {
      if (token0Result.value.equals(inputTokenAddress)) {
        price = outputTokenAmount.div(inputTokenAmount);
      } else {
        price = inputTokenAmount.div(outputTokenAmount);
      }
      return price;
    }
  } else {
    return BigDecimal.fromString("0");
  }
  return BigDecimal.fromString("0");
}
