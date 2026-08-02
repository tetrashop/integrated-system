// apps/api/scripts/create-test-api-key.js
import { createClient } from '../../packages/database/src/index.js';

async function createTestKey() {
  const db = createClient();
  const testApiKey = 'ts_test_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  
  await db.query(`
    INSERT OR REPLACE INTO api_keys (api_key, name, tenant_id, rate_limit, is_active) 
    VALUES (?, 'Test Key', 'test_tenant_001', 1000, 1)
  `, [testApiKey]);
  
  await db.query(`
    INSERT OR REPLACE INTO credit_balances (tenant_id, balance) 
    VALUES ('test_tenant_001', 10000)
  `);
  
  console.log('✅ API Key created:');
  console.log('🔑 API Key:', testApiKey);
  console.log('👤 Tenant ID: test_tenant_001');
  console.log('💰 Credits: 10000');
  
  await db.close();
}

createTestKey().catch(console.error);
