import { isBuild } from '../../testUtils'

test('should work', async () => {
  expect(await page.textContent('#app')).toMatch('Hello')
})

test('import.meta.env.LEGACY', async () => {
  expect(await page.textContent('#env')).toMatch(isBuild ? 'true' : 'false')
})

// https://github.com/vitejs/vite/issues/3400
test('transpiles down iterators correctly', async () => {
  expect(await page.textContent('#iterators')).toMatch('hello')
})

test('generates chunk names with hashes', async () => {
  // we're only supporting legacy in prod,
  // so we skip this test when isBuild is false
  if (!isBuild) return

  const scriptTags = await page.$$('//html/body/script')
  expect(scriptTags).toHaveLength(3)

  const [, polyfills, systemJSScriptSrc] = scriptTags

  expect(await polyfills.getAttribute('src')).toEqual(
    expect.stringMatching(/^\/assets\/polyfills-legacy.[a-zA-Z0-9]+.js$/)
  )

  expect(await systemJSScriptSrc.getAttribute('data-src')).toEqual(
    expect.stringMatching(/^\/assets\/index-legacy.[a-zA-Z0-9]+.js$/)
  )
})
