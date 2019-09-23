import {userApi} from '../api/local/userApi'

export default function({route, redirect, req}) {
  let authed = false

  function login() {
    let path = route.path.split('/')

    if (path.length > 2) {
      if (path[1] === 'b' || path[1] === 'c') {
        redirect(`/login?r=${route.path}&shortId=${path[2]}`)
      } else {
        redirect('/login?r=' + route.path)
      }
    } else {
      redirect('/login?r=' + route.path)
    }
  }

  if (process.server) {
    if (!req.headers.cookie) {
      login()
      return
    }

    let token = req.headers.cookie.split(';').find(c => c.trim().startsWith('token='))
    if (!token) {
      login()
      return
    }

    let value = token.split('=')[1]
    authed = !!value
  } else {
    authed = Boolean(userApi.getUserId())
  }

  if (!authed) {
    login()
  }
}
