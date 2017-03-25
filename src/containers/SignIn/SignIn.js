import React from 'react'
import _ from 'lodash'
import {hashHistory} from 'react-router'
import {connect} from 'react-redux'
import {toastr} from 'react-redux-toastr'
import {Container, Grid, Segment} from 'semantic-ui-react'
import {signInAction} from '../../actions/signIn'
import SingInLayout from '../../components/SingInLayout'
import SignInForm from '../../components/SignInForm'
import * as ROUTES from '../../constants/routes'
import {toasterError} from '../../helpers/apiErrorsHandler'
import Paper from 'material-ui/Paper'
import './SignIn.css'

const SignIn = (props) => {
    const {dispatch, location, loading} = props

    const onSubmit = (event, {formData}) => {
        event.preventDefault()

        dispatch(signInAction(formData))
            .then(() => {
                const redirectUrl = _.get(location, ['query', 'redirect']) || ROUTES.DASHBOARD_URL

                toastr.success('Success ', 'Welcome')
                hashHistory.push(redirectUrl)
            })
            .catch((error) => {
                console.log(error)
                toastr.error('Fail', toasterError(error))
            })
    }

    const style = {
        width: '300px',
        margin: '0 auto',
        padding: '15px',
        textAlign: 'center',
        display: 'inline-block',
    };

    return (
        <SingInLayout>
            <Container className="signInContainer">
                <Paper style={style} zDepth={2}>
                    <SignInForm isLoading={loading} onSubmit={onSubmit} />
                </Paper>
                </Container>
        </SingInLayout>
    )
}

export default connect(state => {
    return {
        data: _.get(state, ['signIn', 'data']),
        loading: _.get(state, ['signIn', 'loading']),
        failed: _.get(state, ['signIn', 'failed'])
    }
})(SignIn)
