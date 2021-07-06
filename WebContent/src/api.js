//"onComplete" is a function with the arguments: (ok, status, data, error)
function doRequest(url, method, body, onComplete) {
  let options = {
    method: method,
    headers: { 'Content-Type': 'application/json; charset=UTF-8' },
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  fetch(url, options).then(async res => {
    let data = await res.json();
    onComplete(res.ok, res.status, data, null);
  }).catch(error => {
    onComplete(false, null, null, error);
  });
}

export default {
  doGet(url, onComplete) {
    doRequest(url, 'GET', null, onComplete);
  },

  doPost(url, body, onComplete) {
    doRequest(url, 'POST', body, onComplete);
  },

  doPut(url, body, onComplete) {
    doRequest(url, 'PUT', body, onComplete);
  },

  doDelete(url, body, onComplete) {
    doRequest(url, 'DELETE', body, onComplete);
  },
};

