import "whatwg-fetch";

const Ajax = {
  session: {},
};

function ajax(url, {credentials = "include", headers = {}, body, ...props} = {}) {
  if (body) {
    body = JSON.stringify(body);
    headers = {"Content-Type": "application/json", ...headers};
  }
  return fetch(url, {credentials, headers, body, ...props}).then(res => res.json());
}

Ajax.session.check = function check() {
  return ajax("/api/session");
};
Ajax.session.login = function login(username, password) {
  return ajax("/api/session", {
    method: "post",
    body: {username, password},
  });
};
Ajax.session.logout = function logout() {
  return ajax("/api/session", {
    method: "delete",
  });
};

export default Ajax;
