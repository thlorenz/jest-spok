import spok, { Specifications } from 'spok'
import ocat = require('ocat')
import deepEqual from 'deep-equal'
import { matcherHint, printExpected, printReceived } from 'jest-matcher-utils'

function prettyFailed(failed: string[]) {
  return failed.map((x) => '  ' + printExpected(x)).join('\n')
}

function failMessage(actual: object, expected: object, assert: Assert) {
  return () => {
    const res =
      matcherHint('toSatisfy') +
      '\n\n' +
      'Mismatches:\n' +
      `${prettyFailed(assert.failed)}\n\n` +
      'Received:\n' +
      `  ${printReceived(actual)}`
    return res
  }
}

function renderMessage(actual: object) {
  return () => {
    const res =
      matcherHint('toSatisfy') +
      '\n\n' +
      'No Specifications provided, adapt your code as follows and edit the' +
      ' specs as needed:\n\n' +
      `  expect(actual)\n` +
      `    .toSatisfy(${ocat.inspect(actual)})\n`
    return res
  }
}
class Assert {
  failed: string[] = []

  equal(actual: any, expected: any, msg?: string): void {
    if (actual !== expected) {
      if (!msg!.includes('satisfies')) msg += ` (expected ${expected})`
      this.failed.push(msg!)
    }
  }

  deepEqual(actual: any, expected: any, msg?: string): void {
    const pass = deepEqual(actual, expected)
    if (!pass) {
      if (!msg!.includes('satisfies')) msg += ` (expected ${expected})`
      this.failed.push(msg!)
    }
  }
}

function toSatisfy<T extends object>(
  received: T,
  expected?: Specifications<T>
) {
  if (expected == null) {
    return { pass: false, message: renderMessage(received) }
  }

  const assert = new Assert()
  spok(assert, received, expected)
  const pass = assert.failed.length === 0

  if (pass) return { pass: true, message: () => 'passed' }
  return { pass: false, message: failMessage(received, expected, assert) }
}

export default { toSatisfy }
export const ocatOpts = ocat.opts
export { spok }

declare global {
  namespace jest {
    interface Expect {
      /**
       * Asserts that a value matches the provided spok specifications.
       * @example
       * expect({ foo: 1, bar: {} }).toSatisfy({ foo: spok.ge(2), bar: spok.string })
       */
      toSatisfy<T>(expected?: Specifications<T>): JestMatchers<T>
    }
    interface Matchers<R, T> {
      /**
       * Asserts that a value matches the provided spok specifications.
       * @example
       * expect({ foo: 1, bar: {} }).toSatisfy({ foo: spok.ge(2), bar: spok.string })
       */
      toSatisfy(expected?: Specifications<T>): R
    }
  }
}
