import "whatwg-fetch";

const Ajax = {
  session: {},
};

Ajax.session.check = function () {
  return ajax('/api/session')
};
Ajax.session.login = function (username, password) {
  return ajax('/api/session', {
    method: 'post',
    body: {username, password}
  })
};
Ajax.session.logout = function () {
  return ajax('/api/session', {
    method: 'delete'
  })
};

function ajax(url, {credentials = 'include', headers = {}, body, ...props} = {}) {
  if (body) {
    body = JSON.stringify(body);
    headers['Content-Type'] = 'application/json';
  }
  return fetch(url, {credentials, headers, body, ...props}).then(res => res.json());
}

export default Ajax;
