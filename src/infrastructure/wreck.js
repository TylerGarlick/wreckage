import Wreck from 'wreck';
import Promise from 'bluebird';

const read = async(response, options) => {
  return await new Promise((resolve, reject) => {
    Wreck.read(response, options, (err, payload) => {
      if (err) return reject(err);
      return resolve(payload);
    });
  });
};


const basicRequest = async(method, uri, options = {}) => {
  return await new Promise((resolve, reject) => {
    Wreck.request(method, uri, options, (err, response) => {
      if (err) return reject(err);
      return resolve(response);
    });
  });
};


const request = async(method, uri, options = {}) => {
  const requestOptions = options.request || {};
  const readOptions = options.read || {};
  readOptions.json = true;
  
  const onlyPayload = options.onlyPayload || true;

  const response = await basicRequest(method, uri, requestOptions);
  const payload = await read(response, readOptions);

  if (onlyPayload)
    return Promise.resolve(payload);

  return Promise.resolve({ response, payload });
};


const requestWithPayload = async(method, uri, payload, options = {}) => {
  options.request = options.request || {};
  options.request.payload = payload;

  return await request(method, uri, options);
};

const post = async(uri, payload, options = {}) => {
  return await requestWithPayload('POST', uri, payload, options);
};

const put = async(uri, payload, options = {}) => {
  return await requestWithPayload('PUT', uri, payload, options);
};

const get = async(uri, options = {}) => {
  return await request('GET', uri, options);
};

const patch = async(uri, payload, options = {}) => {
  return await requestWithPayload('PATCH', uri, payload, options);
};

const deletable = async(uri, payload, options = {}) => {
  return await requestWithPayload('DELETE', uri, payload, options);
};

export default {
  post,
  put,
  get,
  patch,
  read,
  request,
  requestWithPayload,
  delete: deletable,
};