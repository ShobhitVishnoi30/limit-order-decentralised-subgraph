import { newMockEvent } from "matchstick-as"
import { ethereum, BigInt, Address } from "@graphprotocol/graph-ts"
import { LimitOrderPlaced } from "../generated/TestingEvent/TestingEvent"

export function createLimitOrderPlacedEvent(
  limitOrderId: BigInt,
  user: Address,
  inputToken: Address,
  inputTokenAmount: BigInt,
  outputToken: Address,
  minimumOutputToken: BigInt,
  orderType: i32
): LimitOrderPlaced {
  let limitOrderPlacedEvent = changetype<LimitOrderPlaced>(newMockEvent())

  limitOrderPlacedEvent.parameters = new Array()

  limitOrderPlacedEvent.parameters.push(
    new ethereum.EventParam(
      "limitOrderId",
      ethereum.Value.fromUnsignedBigInt(limitOrderId)
    )
  )
  limitOrderPlacedEvent.parameters.push(
    new ethereum.EventParam("user", ethereum.Value.fromAddress(user))
  )
  limitOrderPlacedEvent.parameters.push(
    new ethereum.EventParam(
      "inputToken",
      ethereum.Value.fromAddress(inputToken)
    )
  )
  limitOrderPlacedEvent.parameters.push(
    new ethereum.EventParam(
      "inputTokenAmount",
      ethereum.Value.fromUnsignedBigInt(inputTokenAmount)
    )
  )
  limitOrderPlacedEvent.parameters.push(
    new ethereum.EventParam(
      "outputToken",
      ethereum.Value.fromAddress(outputToken)
    )
  )
  limitOrderPlacedEvent.parameters.push(
    new ethereum.EventParam(
      "minimumOutputToken",
      ethereum.Value.fromUnsignedBigInt(minimumOutputToken)
    )
  )
  limitOrderPlacedEvent.parameters.push(
    new ethereum.EventParam(
      "orderType",
      ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(orderType))
    )
  )

  return limitOrderPlacedEvent
}
