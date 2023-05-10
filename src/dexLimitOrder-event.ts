import { BigInt } from "@graphprotocol/graph-ts";
import {
  DEXLimitOrder,
  LimitOrderPlaced,
  LimitOrderExecuted,
  LimitOrderCancelled,
} from "../generated/DEXLimitOrder/DEXLimitOrder";
import { LimitOrder } from "../generated/schema";
import {
  convertFromWei,
  fetchPairPrice,
  fetchTokenDecimals,
} from "./utils/common";

export function handleLimitOrderPlaced(event: LimitOrderPlaced): void {
  // Entities can be loaded from the store using a string ID; this ID
  // needs to be unique across all entities of the same type
  let entity = LimitOrder.load(event.params.limitOrderId.toString());

  // Entities only exist after they have been saved to the store;
  // `null` checks allow to create entities on demand
  if (!entity) {
    entity = new LimitOrder(event.params.limitOrderId.toString());
  }

  let inputTokenDecimals = fetchTokenDecimals(event.params.inTokenAddr);
  let outputTokenDecimals = fetchTokenDecimals(event.params.outTokenAddr);
  if (inputTokenDecimals === null || outputTokenDecimals === null) {
    return;
  }

  let originalInputAmount = convertFromWei(
    event.params.tokenAmt,
    inputTokenDecimals
  );
  let originalOutputAmount = convertFromWei(
    event.params.boundToken,
    outputTokenDecimals
  );

  // Entity fields can be set based on event parameters
  entity.id = event.params.limitOrderId.toString();
  entity.userAddress = event.params.owner;
  entity.transactionHash = event.transaction.hash;
  entity.inputTokenAddress = event.params.inTokenAddr;
  entity.inputTokenAmount = originalInputAmount;
  entity.outputTokenAmount = originalOutputAmount;
  entity.price = fetchPairPrice(
    event.params.inTokenAddr,
    event.params.outTokenAddr,
    originalInputAmount,
    originalOutputAmount
  );
  entity.inBoundToken = event.params.inBoundToken;

  entity.outputTokenAddress = event.params.outTokenAddr;

  entity.limitOrderType = event.params.orderType;
  entity.status = 0;
  entity.timestamp = event.params.timeStamp;

  // Entities can be written to the store with `.save()`
  entity.save();

  // Note: If a handler doesn't require existing field values, it is faster
  // _not_ to load the entity from the store. Instead, create it fresh with
  // `new Entity(...)`, set the fields that should be updated and save the
  // entity back to the store. Fields that were not set or unset remain
  // unchanged, allowing for partial updates to be applied.

  // It is also possible to access smart contracts from mappings. For
  // example, the contract that has emitted the event can be connected to
  // with:
  //
  // let contract = Contract.bind(event.address)
  //
  // The following functions can then be called on this contract to access
  // state variables and other data:
  //
  // - contract.count(...)
}

export function handleLimitOrderExecution(event: LimitOrderExecuted): void {
  // Entities can be loaded from the store using a string ID; this ID
  // needs to be unique across all entities of the same type
  let entity = LimitOrder.load(event.params.limitOrderId.toString());

  // Entities only exist after they have been saved to the store;
  // `null` checks allow to create entities on demand
  if (!entity) {
    return;
  }
  entity.status = 1;

  // Entities can be written to the store with `.save()`
  entity.save();
}

export function handleLimitOrderCancellation(event: LimitOrderCancelled): void {
  // Entities can be loaded from the store using a string ID; this ID
  // needs to be unique across all entities of the same type
  let entity = LimitOrder.load(event.params.limitOrderId.toString());

  // Entities only exist after they have been saved to the store;
  // `null` checks allow to create entities on demand
  if (!entity) {
    return;
  }
  entity.status = 2;

  // Entities can be written to the store with `.save()`
  entity.save();
}
