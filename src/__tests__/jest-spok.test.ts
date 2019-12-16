import matchers, { ocatOpts, spok } from '../jest-spok'

ocatOpts.color = false
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

describe('literal specs', () => {
  it('partial failure', () =>
    expect(() =>
      expect({ foo: 1, bar: 2 }).toSatisfy({ foo: 0, bar: 2 })
    ).toThrowErrorMatchingSnapshot())
})

describe('no specs', () => {
  it('prints helping message', () =>
    expect(() =>
      expect([{ foo: 1 }, { bar: 2 }, { baz: 3 }]).toSatisfy()
    ).toThrowErrorMatchingSnapshot())
})

// @ts-ignore using process (for CI) without depending on node
const version = parseInt(process.versions.node.slice(0, 3))
if (version >= 12) {
  describe('helper for nested object', () => {
    const actual = {
      country: {
        peru: {
          capital: 'lima',
          cities: {
            arequipa: {
              mountains: true,
              beach: 'nope',
            },
            mancora: {
              mountains: false,
              beach: 'pretty',
            },
          },
          landscapes: [
            { name: 'sierra', warm: false },
            { name: 'selba', warm: true },
          ],
        },
      },
    }
    it('renders all props up to depth 20 in color', () =>
      expect(() => expect(actual).toSatisfy())
        .toThrowErrorMatchingInlineSnapshot(`
"expect(received).toSatisfy(expected)

No Specifications provided, adapt your code as follows and edit the specs as needed:

  expect(actual)
    .toSatisfy(
       { country: {
          peru: {
            capital: 'lima'
          , cities: {
              arequipa: { mountains: true, beach: 'nope' }
            , mancora: { mountains: false, beach: 'pretty' }
            }
          , landscapes: [
              { name: 'sierra', warm: false }
            , { name: 'selba', warm: true }
            ]
          }
        } }
     )
"
`))
  })
}
