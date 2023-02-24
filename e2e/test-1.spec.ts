import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('http://127.0.0.1:9090/');
  await page.goto('http://127.0.0.1:9090/home');
  await page.getByRole('button', { name: '运维模式' }).click();
  await page.getByRole('tab', { name: 'web SSH' }).click();
  await page.locator('div').filter({ hasText: '请选择主机' }).click();
  await page.getByRole('option', { name: 'Dell笔记本: 192.168.60.40' }).click();
  await page.getByRole('button', { name: '连接' }).click();
});