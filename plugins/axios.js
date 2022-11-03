export default function ({ $auth, $axios, redirect }) {
  $axios.onError((error) => {
    if (error.response.status === 401) {
      if ($auth.loggedIn === false) {
        redirect('/login')
      }
    }
  })
}
