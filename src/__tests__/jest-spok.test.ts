import matchers from '../jest-spok'
import spok from 'spok'

spok.color = false
expect.extend(matchers)

describe('simple objects', () => {
  it('failing', () =>
    expect(() =>
      expect({ foo: 1, bar: {}, baz: 3 }).toSatisfy({
        foo: spok.ge(2),
        bar: spok.string,
        baz: 3,
      })
    ).toThrowErrorMatchingSnapshot())
  it('passing', () =>
    expect({ foo: 2, bar: 'hello' }).toSatisfy({
      foo: spok.ge(2),
      bar: spok.string,
    }))
})

describe('nested objects', () => {
  it('failing', () =>
    expect(() =>
      expect({
        uno: { eins: 1, one: 1, unoDeep: { elf: 11, eleven: 11 } },
      }).toSatisfy({
        uno: {
          eins: spok.gez,
          one: spok.lez,
          unoDeep: { elf: spok.function, eleven: 11 },
        },
      })
    ).toThrowErrorMatchingSnapshot())
})

describe('arrays', () => {
  it('failing', () =>
    expect(() =>
      expect([{ foo: 1 }, { bar: 2 }, { baz: 3 }]).toSatisfy([
        { foo: spok.ge(1) },
        { bar: spok.le(1) },
        { baz: spok.string },
      ])
    ).toThrowErrorMatchingSnapshot())
})
