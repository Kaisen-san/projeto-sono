(() => {
  // ***LOGIN PAGE***
  const $login = document.getElementById('login')

  if ($login != null) {
    $login.addEventListener('submit', evt => {
      evt.preventDefault()
    
      const $password = $login.querySelector('input[name="password"]')

      axios.post('/report/login', {
        password: $password.value
      })
      .then(({ data }) => {
        const { cookie, redirectTo } = data
    
        document.cookie = cookie
        window.location.href = redirectTo
      })
      .catch(e => {
        console.error(e)
        alert(e.response.data.error, ALERTS.BAD)
      })
    })
  }

  // ***REPORT PAGE***
  const $logout = document.getElementById('logout')

  if ($logout != null) {
    $logout.addEventListener('click', evt => {
      evt.preventDefault()

      axios.delete('/report/logout')
      .then(({ data }) => {
        const { cookie, redirectTo } = data

        document.cookie = cookie
        window.location.href = redirectTo
      })
      .catch(e => {
        console.error(e)
        alert(e.response.data.error, ALERTS.BAD)
      })
    })
  }

  const $report = document.getElementById('report')

  if ($report != null) {
    $report.addEventListener('submit', evt => {
      evt.preventDefault()

      const $year = $report.querySelector('select[name="year"]')
      const $state = $report.querySelector('select[name="state"]')
      const $acceptTerms = $report.querySelector('select[name="acceptTerms"]')

      axios.post('/report', {
        year: parseInt($year.value),
        state: $state.value,
        acceptTerms: parseInt($acceptTerms.value)
      })
      .then(response => {
        const url = window.URL.createObjectURL(new Blob([response.data]))
        const link = document.createElement('a')
        const contentDisposition = response.headers['content-disposition'];
        let fileName = 'output.csv';

        if (contentDisposition) {
          const fileNameMatch = contentDisposition.match(/filename=(.+)/)

          if (fileNameMatch.length === 2) {
            fileName = fileNameMatch[1]
          }
        }

        link.href = url
        link.setAttribute('download', fileName)
        document.body.appendChild(link)
        link.click()
        link.remove();
        window.URL.revokeObjectURL(url);
      })
      .catch(e => {
        console.error(e)
        alert(e.response.data.error, ALERTS.BAD)
      })
    })
  }
})()
