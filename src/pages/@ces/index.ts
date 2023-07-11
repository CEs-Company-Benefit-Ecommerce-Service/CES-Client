import { useEffect } from 'react'
// next
import { useRouter } from 'next/router'
// config
import { PATH_AFTER_LOGIN } from '../../config'
// routes
import { PATH_CES } from '../../routes/paths'

// ----------------------------------------------------------------------

export default function Index() {
  const { pathname, replace, prefetch } = useRouter()

  useEffect(() => {
    if (pathname === PATH_CES.root) {
      replace(PATH_AFTER_LOGIN)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  useEffect(() => {
    prefetch(PATH_AFTER_LOGIN)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return null
}
