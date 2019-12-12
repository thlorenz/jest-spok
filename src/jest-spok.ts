import spok, { Specifications } from 'spok'
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

class Assert {
  failed: string[] = []

  equal(actual: any, expected: any, msg?: string): void {
    if (actual !== expected) this.failed.push(msg!)
  }

  deepEqual(actual: any, expected: any, msg?: string): void {
    const pass = deepEqual(actual, expected)
    if (!pass) this.failed.push(msg!)
  }
}

function toSatisfy(received: object, expected: Specifications) {
  const assert = new Assert()
  spok(assert, received, expected)
  const pass = assert.failed.length === 0

  if (pass) return { pass: true, message: () => 'passed' }
  return { pass: false, message: failMessage(received, expected, assert) }
}

export default { toSatisfy }

declare global {
  namespace jest {
    interface Expect {
      /**
       * Asserts that a value matches the provided spok specifications.
       * @example
       * expect({ foo: 1, bar: {} }).toSatisfy({ foo: spok.ge(2), bar: spok.string })
       */
      toSatisfy<T>(received: object): JestMatchers<T>
    }
    interface Matchers<R, T> {
      /**
       * Asserts that a value matches the provided spok specifications.
       * @example
       * expect({ foo: 1, bar: {} }).toSatisfy({ foo: spok.ge(2), bar: spok.string })
       */
      toSatisfy(received: object): R
    }
  }
}
