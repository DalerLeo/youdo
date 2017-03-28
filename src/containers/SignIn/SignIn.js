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
import './SignIn.css'

const SignIn = (props) => {
    const {dispatch, location, loading, formValues} = props;

    const onSubmit = (event) => {
        dispatch(signInAction(formValues))
            .then(() => {
                const redirectUrl = _.get(location, ['query', 'redirect']) || ROUTES.DASHBOARD_URL;
                toastr.success('Success ', 'Welcome');
                hashHistory.push(redirectUrl)
            })
            .catch((error) => {
                toastr.error('Fail', toasterError(error))
            })
    };


    return (
        <SingInLayout>
            <Container className="signInContainer">
                <SignInForm loading={loading} onSubmit={onSubmit} />
            </Container>
        </SingInLayout>
    )
};

export default connect(state => {
    return {
        data: _.get(state, ['signIn', 'data']),
        formValues: _.get(state, ['form', 'SignInForm', 'values']),
        loading: _.get(state, ['signIn', 'loading']),
    }
})(SignIn)
