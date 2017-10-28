import React from 'react'
import _ from 'lodash'
import {compose} from 'recompose'
import {hashHistory} from 'react-router'
import {connect} from 'react-redux'
import injectSheet from 'react-jss'
import {signInAction, authConfirmAction} from '../../actions/signIn'
import SignInForm from '../../components/SignInForm'
import {getConfig} from '../../actions/primaryCurrency'
import * as ROUTES from '../../constants/routes'

const enhance = compose(
    injectSheet({
        container: {
            height: '100%',
            display: 'flex !important',
            justifyContent: 'center',
            flexDirection: 'column'
        }
    }),
    connect(state => {
        return {
            formValues: _.get(state, ['form', 'SignInForm', 'values']),
            loading: (_.get(state, ['signIn', 'loading']) || _.get(state, ['authConfirm', 'loading']))
        }
    })
)

const SignIn = enhance((props) => {
    const {classes, dispatch, location, loading, formValues} = props

    const onSubmit = () => {
        return dispatch(signInAction(formValues))
            .then(() => {
                const rememberUser = _.get(formValues, 'rememberMe') || false
                dispatch(getConfig())
                return dispatch(authConfirmAction(rememberUser))
                    .then(() => {
                        const redirectUrl = _.get(location, ['query', 'redirect']) || ROUTES.DASHBOARD_URL
                        hashHistory.push(redirectUrl)
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
