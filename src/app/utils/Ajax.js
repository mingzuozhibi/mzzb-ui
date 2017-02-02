import "whatwg-fetch";

const Ajax = {
  session: {},
};

function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  } else {
    var error = new Error(response.statusText);
    error.response = response;
    throw error;
  }
}

function prepareProps({credentials = "include", headers = {}, body, ...props}) {
  if (body) {
    headers = {"Content-Type": "application/json", ...headers};
    body = JSON.stringify(body);
  }
  return {credentials, headers, body, ...props};
}

function ajax(url, props = {}) {
  return fetch(url, prepareProps(props))
    .then(checkStatus)
    .then(response => response.json());
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
