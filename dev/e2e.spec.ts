import { expect, test } from '@playwright/test'
import path from 'path'
import { fileURLToPath } from 'url'

const dirname = path.dirname(fileURLToPath(import.meta.url))
const shot = (name: string) => path.resolve(dirname, 'screenshots', name)

test('capture admin screenshots', async ({ page }) => {
  test.setTimeout(180_000)
  const res = await page.request.post('/api/users/login', { data: { email: 'dev@payloadcms.com', password: 'test' } })
  expect(res.ok(), `login failed: ${res.status()}`).toBeTruthy()

  const list = await page.request.get('/api/maps?limit=1')
  const id = (await list.json()).docs[0].id
  await page.goto(`/admin/collections/maps/${id}`)
  await page.waitForSelector('.map-editor', { timeout: 30_000 })
  await page.waitForSelector('.map-editor__waypoint-dot', { timeout: 15_000 }).catch(() => {})
  await page.waitForTimeout(2000)
  await page.screenshot({ path: shot('01-map-editor.png'), fullPage: true })
})
