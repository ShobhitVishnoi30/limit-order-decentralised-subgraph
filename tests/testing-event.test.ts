import {
  assert,
  describe,
  test,
  clearStore,
  beforeAll,
  afterAll
} from "matchstick-as/assembly/index"
import { BigInt, Address } from "@graphprotocol/graph-ts"
import { ExampleEntity } from "../generated/schema"
import { LimitOrderPlaced } from "../generated/TestingEvent/TestingEvent"
import { handleLimitOrderPlaced } from "../src/testing-event"
import { createLimitOrderPlacedEvent } from "./testing-event-utils"

// Tests structure (matchstick-as >=0.5.0)
// https://thegraph.com/docs/en/developer/matchstick/#tests-structure-0-5-0

describe("Describe entity assertions", () => {
  beforeAll(() => {
    let limitOrderId = BigInt.fromI32(234)
    let user = Address.fromString("0x0000000000000000000000000000000000000001")
    let inputToken = Address.fromString(
      "0x0000000000000000000000000000000000000001"
    )
    let inputTokenAmount = BigInt.fromI32(234)
    let outputToken = Address.fromString(
      "0x0000000000000000000000000000000000000001"
    )
    let minimumOutputToken = BigInt.fromI32(234)
    let orderType = 123
    let newLimitOrderPlacedEvent = createLimitOrderPlacedEvent(
      limitOrderId,
      user,
      inputToken,
      inputTokenAmount,
      outputToken,
      minimumOutputToken,
      orderType
    )
    handleLimitOrderPlaced(newLimitOrderPlacedEvent)
  })

  afterAll(() => {
    clearStore()
  })

  // For more test scenarios, see:
  // https://thegraph.com/docs/en/developer/matchstick/#write-a-unit-test

  test("ExampleEntity created and stored", () => {
    assert.entityCount("ExampleEntity", 1)

    // 0xa16081f360e3847006db660bae1c6d1b2e17ec2a is the default address used in newMockEvent() function
    assert.fieldEquals(
      "ExampleEntity",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a",
      "limitOrderId",
      "234"
    )
    assert.fieldEquals(
      "ExampleEntity",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a",
      "user",
      "0x0000000000000000000000000000000000000001"
    )
    assert.fieldEquals(
      "ExampleEntity",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a",
      "inputToken",
      "0x0000000000000000000000000000000000000001"
    )
    assert.fieldEquals(
      "ExampleEntity",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a",
      "inputTokenAmount",
      "234"
    )
    assert.fieldEquals(
      "ExampleEntity",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a",
      "outputToken",
      "0x0000000000000000000000000000000000000001"
    )
    assert.fieldEquals(
      "ExampleEntity",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a",
      "minimumOutputToken",
      "234"
    )
    assert.fieldEquals(
      "ExampleEntity",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a",
      "orderType",
      "123"
    )

    // More assert options:
    // https://thegraph.com/docs/en/developer/matchstick/#asserts
  })
})
