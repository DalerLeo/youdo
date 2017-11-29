import React from 'react'
import _ from 'lodash'
import {compose, withState} from 'recompose'
import {hashHistory} from 'react-router'
import {connect} from 'react-redux'
import injectSheet from 'react-jss'
import {signInAction, authConfirmAction} from '../../actions/signIn'
import SignInForm from '../../components/SignInForm'
import * as ROUTES from '../../constants/routes'
import axios from '../../helpers/axios'
import * as API from '../../constants/api'

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
    })
)

const getStorage = (local) => {
    return local ? localStorage : sessionStorage
}

const setConfigs = (configs) => {
    const storage = getStorage(false)

    _.forIn(configs, (value, key) => {
        storage.setItem(key, value)
    })
}

const SignIn = enhance((props) => {
    const {classes, dispatch, location, loading, formValues, updateSignInLoading} = props

    const onSubmit = () => {
        return dispatch(signInAction(formValues))
            .then(() => {
                const rememberUser = _.get(formValues, 'rememberMe') || false
                return dispatch(authConfirmAction(rememberUser))
                    .then(() => {
                        updateSignInLoading(true)
                        axios()
                            .get(API.CONFIG)
                            .then((response) => {
                                updateSignInLoading(false)
                                setConfigs(_.get(response, 'data'))
                                const redirectUrl = _.get(location, ['query', 'redirect']) || ROUTES.DASHBOARD_URL
                                hashHistory.push(redirectUrl)
                            })
                    })
            })
    }

    return (
        <div className={classes.container}>
            <SignInForm loading={loading} onSubmit={onSubmit} />
        </div>
    )
})

export default SignIn
