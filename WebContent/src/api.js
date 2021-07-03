function doRequest(url, method, body, okFunc) {
  let options = {
    method: method,
    headers: { 'Content-Type': 'application/json; charset=UTF-8' },
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  fetch(url, options).then(async res => {
    let data = await res.json();

    if (res.ok) {
      okFunc(data);
    } else {
      //TODO: better error handling
      alert('Error (status code: ' + res.status + ').');
    }
  }).catch(error => {
    //TODO: better network error handling
    alert('Network error.');
  });
}

export default {
  doGet(url, okFunc) {
    doRequest(url, 'GET', null, okFunc);
  },

  doPost(url, body, okFunc) {
    doRequest(url, 'POST', body, okFunc);
  },

  doPut(url, body, okFunc) {
    doRequest(url, 'PUT', body, okFunc);
  },

  doDelete(url, body, okFunc) {
    doRequest(url, 'DELETE', body, okFunc);
  },
};

