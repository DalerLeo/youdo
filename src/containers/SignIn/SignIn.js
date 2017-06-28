import React from 'react'
import _ from 'lodash'
import {compose} from 'recompose'
import {hashHistory} from 'react-router'
import {connect} from 'react-redux'
import injectSheet from 'react-jss'
import {signInAction} from '../../actions/signIn'
import SignInForm from '../../components/SignInForm'
import {getConfig} from '../../actions/primeryCurrency'
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
            loading: _.get(state, ['signIn', 'loading']),
            config: _.get(state, ['config', 'primaryCurrency', 'data'])
        }
    })
)

const SignIn = enhance((props) => {
    const {classes, dispatch, location, loading, formValues} = props

    const onSubmit = () => {
        return dispatch(signInAction(formValues))
            .then(() => {
                const redirectUrl = _.get(location, ['query', 'redirect']) || ROUTES.DASHBOARD_URL
                dispatch(getConfig())
                hashHistory.push(redirectUrl)
            })
    }

    return (
        <div className={classes.container}>
            <SignInForm loading={loading} onSubmit={onSubmit} />
        </div>
    )
})

export default SignIn
