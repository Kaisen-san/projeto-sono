const ALERTS = {
  BAD: 'alert--bad'
}

const alert = (msg, status) => {
  const $alert = document.createElement('div')

  $alert.setAttribute('class', `alert ${status}`)
  $alert.innerText = msg

  document.body.appendChild($alert)

  setTimeout(() => $alert.remove(), 5000)
}
