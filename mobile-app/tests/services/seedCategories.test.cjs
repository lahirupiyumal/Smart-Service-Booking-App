const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');
const expectedIds = ['home_services', 'agriculture_services', 'vehicle_services'];

function setup({ configured = true, signedIn = true, existing = {}, readError, commitError, verificationError, missingId, verificationGate } = {}) {
  const documents = new Map(Object.entries(existing));
  const written = [];
  const verified = [];
  let transactions = 0;
  const database = {};
  const source = fs.readFileSync(path.join(__dirname, '../../src/scripts/seedCategories.ts'), 'utf8');
  const output = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
  const dependencies = {
    '@/config/firebase': { db: configured ? database : null, auth: { currentUser: signedIn ? { uid: 'setup-user' } : null } },
    'firebase/firestore': {
      doc: (db, collection, id) => { assert.equal(db, database); return { id, path: `${collection}/${id}` }; },
      serverTimestamp: () => 'server-timestamp',
      runTransaction: async (db, callback) => {
        assert.equal(db, database);
        transactions++;
        const staged = [];
        const result = await callback({
          get: async reference => { if (readError) throw readError; return { exists: () => documents.has(reference.path) }; },
          set: (reference, data) => staged.push([reference.path, data]),
        });
        if (commitError) throw commitError;
        staged.forEach(([reference, data]) => { documents.set(reference, data); written.push(reference); });
        return result;
      },
      getDocFromServer: async reference => {
        verified.push(reference.path);
        if (verificationError) throw verificationError;
        if (verificationGate) await verificationGate(reference.id);
        return { id: reference.id, exists: () => reference.id !== missingId && documents.has(reference.path) };
      },
    },
  };
  const module = { exports: {} };
  new Function('require', 'module', 'exports', output)(name => {
    if (!(name in dependencies)) throw new Error('Unexpected dependency: ' + name);
    return dependencies[name];
  }, module, module.exports);
  return { seed: module.exports.seedServiceCategories, documents, written, verified, transactionCount: () => transactions };
}

test('importing the module does not execute initialization; missing auth/config cause no transactions', async () => {
  const idle = setup();
  assert.equal(idle.transactionCount(), 0);
  const noAuth = setup({ signedIn: false });
  await assert.rejects(noAuth.seed(), { code: 'app/not-authenticated' });
  assert.equal(noAuth.transactionCount(), 0);
  const noConfig = setup({ configured: false });
  await assert.rejects(noConfig.seed(), /Firestore is not configured/);
  assert.equal(noConfig.transactionCount(), 0);
});
test('initialization creates only the three expected categories and reads all three from server', async () => {
  const user = { fullName: 'Existing user', role: 'customer' };
  const state = setup({ existing: { 'users/existing-user': user } });
  assert.deepEqual(await state.seed(), expectedIds.map(id => ({ id, status: 'created' })));
  assert.deepEqual(state.written, expectedIds.map(id => `service_categories/${id}`));
  assert.deepEqual(state.verified, state.written);
  assert.equal(state.documents.get('users/existing-user'), user);
  assert.equal(state.documents.get('service_categories/home_services').name, 'Home Services');
  assert.equal(state.documents.get('service_categories/agriculture_services').icon, 'sprout');
  assert.equal(state.documents.get('service_categories/vehicle_services').sortOrder, 3);
  assert.equal(state.documents.get('service_categories/vehicle_services').createdAt, 'server-timestamp');
});
test('repeated initialization preserves existing category content and timestamps', async () => {
  const existing = { name: 'Customized home category', createdAt: 'original-timestamp', customField: 'preserve' };
  const state = setup({ existing: { 'service_categories/home_services': existing } });
  await state.seed();
  assert.equal(state.documents.get('service_categories/home_services'), existing);
  assert.equal(state.written.length, 2);
  state.written.length = 0;
  const results = await state.seed();
  assert.equal(state.written.length, 0);
  assert.deepEqual(results, expectedIds.map(id => ({ id, status: 'already-exists' })));
});
test('read/commit permission errors propagate unchanged and never report verified success', async () => {
  const failure = Object.assign(new Error('Missing or insufficient permissions.'), { code: 'permission-denied' });
  for (const options of [{ readError: failure }, { commitError: failure }]) {
    const state = setup(options);
    await assert.rejects(state.seed(), error => error === failure);
    assert.deepEqual(state.written, []);
    assert.deepEqual(state.verified, []);
  }
});
test('server verification failure or a missing document rejects even after commit', async () => {
  const offline = Object.assign(new Error('Failed to get document from server.'), { code: 'unavailable' });
  const rejected = setup({ verificationError: offline });
  await assert.rejects(rejected.seed(), error => error === offline);
  const missing = setup({ missingId: 'vehicle_services' });
  await assert.rejects(missing.seed(), { code: 'app/category-verification-failed' });
});
test('initialization cannot resolve until the last server confirmation arrives', async () => {
  let release;
  const gate = new Promise(resolve => { release = resolve; });
  const state = setup({ verificationGate: id => id === 'vehicle_services' ? gate : Promise.resolve() });
  let completed = false;
  const operation = state.seed().then(ids => { completed = true; return ids; });
  await new Promise(resolve => setImmediate(resolve));
  assert.equal(state.verified.length, 3);
  assert.equal(completed, false);
  release();
  assert.deepEqual(await operation, expectedIds.map(id => ({ id, status: 'created' })));
});
