import Cookies from 'js-cookie'

export default function ({ route, redirect }) {
  if (route.path === '/') {
    if (Cookies.get('token')) {
      Cookies.remove('token')
    }
  }

  // eslint-disable-next-line no-console
  console.log('@@@ Navigate to: ', route.path)
}
