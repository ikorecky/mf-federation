;(function () {
  const messages = document.querySelector('#messages')
  const wsButton = document.querySelector('#wsButton')
  const wsSendButton = document.querySelector('#wsSendButton')
  // const logoutButton = document.querySelector("#logout");
  // const loginButton = document.querySelector("#login");
  const clearButton = document.querySelector('#clear')

  function prettifyJson (json) {
    if (typeof json !== 'string') {
      json = JSON.stringify(json, null, 2)
    }
    return json.replace(
      /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,
      function (match) {
        let cls = '<span>'
        if (/^"/.test(match)) {
          if (/:$/.test(match)) {
            cls = "<span class='text-warning'>"
          } else {
            cls = '<span>'
          }
        } else if (/true|false/.test(match)) {
          cls = "<span class='text-white'>"
        } else if (/null/.test(match)) {
          cls = "<span class='text-info'>"
        }
        return cls + match + '</span>'
      }
    )
  }

  function showMessage (message) {
    document.getElementById('jsonCode').innerHTML += `\n${prettifyJson(
      message
    )}`
    messages.scrollTop = messages.scrollHeight
  }

  let ws

  wsButton.onclick = function () {
    if (ws) {
      ws.onerror = ws.onopen = ws.onclose = null
      ws.close()
    }

    ws = new WebSocket(`ws://${location.host}:8062`)
    ws.onerror = function () {
      showMessage('WebSocket error')
    }
    ws.onopen = function () {
      showMessage('WebSocket connection established')
      ws.send('webswitch')
    }
    ws.onclose = function () {
      showMessage('WebSocket connection closed')
      ws = null
    }
    ws.onmessage = function (data) {
      console.log('onmessage', data)
      //showMessage(JSON.stringify(JSON.parse(data.data), undefined, 2))
    }
  }

  clearButton.onclick = function () {
    messages.textContent = ''
  }

  wsSendButton.onclick = function () {
    if (!ws) {
      showMessage('No WebSocket connection')
      return
    }

    ws.send('Hello World!')
    showMessage('Sent "Hello World!"')
  }
})()
