import React from 'react'
import _ from 'lodash'
import {compose, withState, withPropsOnChange} from 'recompose'
import {hashHistory} from 'react-router'
import {connect} from 'react-redux'
import injectSheet from 'react-jss'
import {signInAction} from '../../actions/signIn'
import SignInForm from '../../components/SignInForm'
import * as ROUTES from '../../constants/routes'
import {setApi} from '../../helpers/storage'

const enhance = compose(
  injectSheet({
    container: {
      height: '100%',
      display: 'flex !important',
      justifyContent: 'center',
      flexDirection: 'column'
    }
  }),
  withState('signInLoading', 'updateSignInLoading', false),
  connect((state, props) => {
    const loading = _.get(props, 'signInLoading')
    return {
      formValues: _.get(state, ['form', 'SignInForm', 'values']),
      loading: _.get(state, ['signIn', 'loading']) || _.get(state, ['authConfirm', 'loading']) || loading
    }
  }),
  withPropsOnChange((props, nextProps) => {
    const prevApi = _.get(props, ['location', 'query', 'api_host'])
    const nextApi = _.get(nextProps, ['location', 'query', 'api_host'])
    return prevApi !== nextApi && nextApi
  }, ({location}) => {
    const api = _.get(location, ['query', 'api_host'])
    if (!_.isEmpty(api)) {
      return setApi(api)
    }
    return null
  }),
)

/*
Const getStorage = (local) => {
  return local ? localStorage : sessionStorage
}

Const setConfigs = (configs) => {
  const storage = getStorage(false)

  _.forIn(configs, (value, key) => {
    storage.setItem(key, value)
  })
}
*/

const SignIn = enhance((props) => {
  const {classes, dispatch, location, loading, formValues, updateSignInLoading} = props
  const onSubmit = () => {
    return dispatch(signInAction(formValues))
      .then(() => {
        // .        const rememberUser = _.get(formValues, 'rememberMe') || false
        const re = _.get(location, ['query', 'redirect'])
        updateSignInLoading(false)
        const redirectUrl = !re || re === '/' ? ROUTES.USERS_LIST_URL : re
        return hashHistory.push(redirectUrl)

        /*
        Return dispatch(authConfirmAction(rememberUser))

          .then(() => {
            const re = _.get(location, ['query', 'redirect'])
            updateSignInLoading(true)

            Axios()
              .get(API.CONFIG)
              .then((response) => {
                updateSignInLoading(false)
                setConfigs(_.get(response, 'data'))
                                const redirectUrl = !re || re === '/' ? ROUTES.USERS_LIST_URL : re
                                hashHistory.push(redirectUrl)
              })

          })
          */
      })
  }

  return (
    <div className={classes.container}>
      <SignInForm loading={loading} onSubmit={onSubmit}/>
    </div>
  )
})

export default SignIn
