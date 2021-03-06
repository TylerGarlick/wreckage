import test from 'ava';
import Wreckage from '../src';
import { USERS, BASE_URL } from './fixtures/users';

test.beforeEach(t => {
  t.context = Wreckage.create();
});

test('#get(uri) that returns 200 with an array', async t => {
  const { payload } = await t.context.get(`${BASE_URL}/users`);
  t.is(payload.length, USERS.length);
});

test(`#get(uri) that returns 404`, async t => {
  try {
    await t.context.get(`${BASE_URL}/users/bogus`);
  } catch (err) {
    t.regex(err.message, /Found/);
  }
});

test(`#get(url) that returns 200 with an object`, async t => {
  const { payload } = await t.context.get(`${BASE_URL}/users/1`);
  t.deepEqual(payload, USERS[0]);
});

test(`#get(url) that returns 200 with an array and query string params`, async t => {
  const { payload } = await t.context.get(`${BASE_URL}/users/search?isActive=true`);
  t.is(payload.length, USERS.length);
});
