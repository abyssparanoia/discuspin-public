import React, { useCallback } from 'react'
import Head from 'next/head'
import { MenuAppBar } from './AppBar/index'
import { GlobalErrorSnackBar } from './ErrorSnackBar'
import { useDispatch, useSelector } from 'react-redux'
import { signOut } from 'src/modules/auth'
import { ReduxStore } from 'src/modules/reducer'
import { popError } from 'src/modules/error'
import { NextComponentType, NextPageContext, ExNextPageContext } from 'next'
import { fetchUserOnServer } from 'src/modules/repositories'
import { setMe } from 'src/modules/user'

type Props = {
  title?: string
}

const Global: NextComponentType<NextPageContext, {}, Props> = ({ children, title = 'This is the default title' }) => {
  const { errorList, credential } = useSelector(({ error, auth }: ReduxStore) => ({
    errorList: error.list,
    credential: auth.credential
  }))

  const dispatch = useDispatch()
  const handleSignOut = useCallback(() => dispatch(signOut()), [dispatch])
  const handlePopError = useCallback(() => dispatch(popError), [dispatch])

  return (
    <div>
      <Head>
        <title>{title}</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <MenuAppBar credential={credential} handleSignOut={handleSignOut} />
      <GlobalErrorSnackBar errorList={errorList} popError={handlePopError} />
      {children}
      <footer>
        <hr />
        <span> {"I'm here to stay (Footer)"}</span>
      </footer>
    </div>
  )
}

Global.getInitialProps = async ({ req, store }: ExNextPageContext) => {
  // on server
  // credential があれば ログインユーザー情報をとってくる
  if (req && req.session && req.session.credential) {
    const user = await fetchUserOnServer(req.firebaseStore, req.session.credential.uid)
    if (user) {
      store.dispatch(setMe(user) as any)
    }
  }
  return {}
}

export default Global
