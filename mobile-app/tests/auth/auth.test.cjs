const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');

// Compile just the pure/auth service modules and inject SDK fakes: no real accounts or emails.
function load(file, dependencies = {}) {
  const source = fs.readFileSync(path.join(__dirname, '../../', file), 'utf8');
  const { outputText } = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } });
  const module = { exports: {} };
  new Function('require', 'module', 'exports', outputText)(name => {
    if (!(name in dependencies)) throw new Error('Unexpected dependency: ' + name);
    return dependencies[name];
  }, module, module.exports);
  return module.exports;
}
const validation = load('src/features/auth/utils/validation.ts');
const errors = load('src/features/auth/utils/errors.ts');
const input = { fullName: '  Test User  ', email: ' Test@Example.com ', phone: '077 123 4567', password: 'secure pass 123', confirmPassword: 'secure pass 123' };

function setup({ configured = true, createError, writeError, updateError, deleteError } = {}) {
  const calls = [];
  const user = { uid: 'auth-uid' };
  const authentication = {};
  const database = {};
  const timestamp = { serverTimestamp: true };
  const service = load('src/features/auth/services/authService.ts', {
    '@/config/firebase': { auth: configured ? authentication : null, db: configured ? database : null },
    '../utils/validation': validation,
    'firebase/auth': {
      createUserWithEmailAndPassword: async (...args) => { calls.push(['create', ...args]); if (createError) throw createError; return { user }; },
      updateProfile: async (...args) => { calls.push(['update', ...args]); if (updateError) throw updateError; },
      deleteUser: async (...args) => { calls.push(['delete', ...args]); if (deleteError) throw deleteError; },
      signOut: async (...args) => { calls.push(['logout', ...args]); },
      signInWithEmailAndPassword: async (...args) => { calls.push(['login', ...args]); },
      sendPasswordResetEmail: async (...args) => { calls.push(['reset', ...args]); },
    },
    'firebase/firestore': {
      doc: (...args) => args,
      serverTimestamp: () => timestamp,
      setDoc: async (...args) => { calls.push(['save', ...args]); if (writeError) throw writeError; },
    },
  });
  return { service, calls, user, authentication, database, timestamp };
}

test('valid international/local phone numbers and trimmed email/name are accepted', () => {
  assert.deepEqual(validation.validateRegistration(input), {});
  assert.deepEqual(validation.normalizeRegistration(input), { fullName: 'Test User', email: 'test@example.com', phone: '0771234567' });
  assert.deepEqual(validation.validateRegistration({ ...input, phone: '+94 (77) 123-4567' }), {});
});
test('all required fields, malformed emails, phone, password and confirmation are validated', () => {
  const empty = { fullName: '', email: '', phone: '', password: '', confirmPassword: '' };
  assert.equal(Object.keys(validation.validateRegistration(empty)).length, 5);
  for (const phone of ['abc0771234567', '123', '+1234567890123456', '++94771234567']) assert.ok(validation.validateRegistration({ ...input, phone }).phone);
  for (const email of ['not-an-email', 'a@', 'a b@example.com']) assert.ok(validation.validateEmail(email));
  assert.ok(validation.validateRegistration({ ...input, password: 'short' }).password);
  assert.ok(validation.validateRegistration({ ...input, confirmPassword: 'different' }).confirmPassword);
  assert.ok(validation.validateRegistration({ ...input, fullName: 'A'.repeat(101) }).fullName);
});
test('registration saves only requested profile fields under the Auth UID', async () => {
  const { service, calls, user, database, timestamp } = setup();
  await service.registerAccount({ ...input, role: 'admin', isActive: false });
  const save = calls.find(([name]) => name === 'save');
  assert.deepEqual(save[1], [database, 'users', user.uid]);
  assert.deepEqual(save[2], { uid: user.uid, fullName: 'Test User', email: 'test@example.com', phone: '0771234567', role: 'customer', isActive: true, createdAt: timestamp });
  assert.equal('password' in save[2], false);
  assert.equal('confirmPassword' in save[2], false);
  assert.equal(calls[0][3], input.password);
});
test('invalid registration and missing config do not create accounts', async () => {
  const invalid = setup();
  await assert.rejects(invalid.service.registerAccount({ ...input, confirmPassword: 'mismatch' }), { code: 'app/invalid-registration' });
  assert.equal(invalid.calls.length, 0);
  const missing = setup({ configured: false });
  await assert.rejects(missing.service.registerAccount(input), { code: 'app/not-configured' });
  assert.equal(missing.calls.length, 0);
});
test('a failed Firestore write rolls back the new Auth account', async () => {
  const failure = Object.assign(new Error('denied'), { code: 'permission-denied' });
  const { service, calls, user } = setup({ writeError: failure });
  await assert.rejects(service.registerAccount(input), error => error === failure);
  assert.deepEqual(calls.at(-1), ['delete', user]);
});
test('a failed display name update also rolls back the new account', async () => {
  const failure = new Error('offline');
  const { service, calls, user } = setup({ updateError: failure });
  await assert.rejects(service.registerAccount(input), error => error === failure);
  assert.deepEqual(calls.at(-1), ['delete', user]);
  assert.equal(calls.some(([name]) => name === 'save'), false);
});
test('failed rollback signs out and reports the incomplete account clearly', async () => {
  const { service, calls } = setup({ writeError: new Error('write failed'), deleteError: new Error('delete failed') });
  await assert.rejects(service.registerAccount(input), { code: 'app/profile-incomplete' });
  assert.equal(calls.at(-1)[0], 'logout');
});
test('duplicate email errors do not delete any existing account', async () => {
  const failure = Object.assign(new Error('duplicate'), { code: 'auth/email-already-in-use' });
  const { service, calls } = setup({ createError: failure });
  await assert.rejects(service.registerAccount(input), error => error === failure);
  assert.deepEqual(calls.map(([name]) => name), ['create']);
});
test('login and reset normalize email; login preserves the password exactly', async () => {
  const { service, calls, authentication } = setup();
  await service.loginAccount(' Test@Example.com ', ' password with spaces ');
  await service.resetPassword(' Test@Example.com ');
  await service.logout();
  assert.deepEqual(calls, [
    ['login', authentication, 'test@example.com', ' password with spaces '],
    ['reset', authentication, 'test@example.com'], ['logout', authentication],
  ]);
});
test('auth failures return friendly messages and never expose raw server errors', () => {
  assert.equal(errors.authErrorMessage({ code: 'auth/user-not-found' }), errors.authErrorMessage({ code: 'auth/wrong-password' }));
  assert.match(errors.authErrorMessage({ code: 'auth/network-request-failed' }), /internet/);
  assert.match(errors.authErrorMessage({ code: 'permission-denied' }), /Firestore/);
  assert.equal(errors.authErrorMessage(new Error('sensitive server detail')), 'An unexpected error occurred. Please try again or contact support if it continues.');
});

test('the exact live API_KEY_INVALID SDK response displays an actionable API key error', () => {
  const message = errors.authErrorMessage({
    code: 'auth/api-key-not-valid.-please-pass-a-valid-api-key.',
    message: 'Firebase: Error (auth/api-key-not-valid.-please-pass-a-valid-api-key.).',
  });
  assert.match(message, /Firebase rejected this app’s API key/);
  assert.match(message, /EXPO_PUBLIC_FIREBASE_API_KEY/);
  assert.match(message, /restart Expo/);
  assert.equal(message, errors.authErrorMessage({ code: 'auth/invalid-api-key' }));
});

test('unconfigured and unauthorized projects have distinct recovery messages', () => {
  assert.match(errors.authErrorMessage({ code: 'auth/configuration-not-found' }), /Set it up in the Firebase console/);
  assert.match(errors.authErrorMessage({ code: 'auth/operation-not-allowed' }), /Email and password sign-in is not enabled/);
  assert.match(errors.authErrorMessage({ code: 'auth/app-not-authorized' }), /API key restrictions/);
});

test('unmapped Firebase errors preserve safe error codes without exposing server payloads', () => {
  assert.equal(errors.authErrorMessage({ code: 'auth/unmapped-server-error', message: 'sensitive detail' }), 'Firebase request failed (auth/unmapped-server-error). Please contact support with this error code.');
  assert.doesNotMatch(errors.authErrorMessage({ code: 'auth/error?key=secret', message: 'sensitive detail' }), /secret|sensitive/);
});
