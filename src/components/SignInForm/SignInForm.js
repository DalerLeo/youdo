import _ from 'lodash'
import React from 'react'
import {compose} from 'recompose'
import RaisedButton from 'material-ui/RaisedButton'
import CircularProgress from 'material-ui/CircularProgress'
import Paper from 'material-ui/Paper'
import {Field, reduxForm} from 'redux-form'
import injectSheet from 'react-jss'
import {CheckBox, TextField} from '../ReduxForm'

const enhance = compose(
    injectSheet({
        loader: {
            width: '120px',
            margin: '0 auto',
            padding: '15px',
            textAlign: 'center',
            display: 'inline-block'
        },
        wrapper: {
            width: '320px',
            margin: '0 auto',
            padding: '25px 55px 25px 45px',
            textAlign: 'center',
            display: 'inline-block'
        },
        title: {
            paddingTop: '5px',
            paddingBottom: '22px',
            fontSize: '14px',
            fontWeight: '700',
            textTransform: 'uppercase',
            borderBottom: '1px dashed #e2e4e9',
            textAlign: 'center',
            color: '#647994'
        },
        rememberMe: {
            marginBottom: '20px !important',
            marginTop: '20px !important'
        },
        nonFieldErrors: {
            color: 'red',
            fontSize: '12px',
            marginTop: '12px'
        }
    }),
    reduxForm({
        form: 'SignInForm',
        validate: (values, form) => form.errors
    })
)

const SignInForm = enhance((props) => {
    const {classes, onSubmit, loading, errors} = props
    const nonFieldErrors = _.get(errors, 'nonFieldErrors')

    if (loading) {
        return (
            <Paper className={classes.loader} zDepth={2}>
                <CircularProgress size={80} thickness={5}/>
            </Paper>
        )
    }

    return (
        <Paper className={classes.wrapper} zDepth={2}>
            <form onSubmit={onSubmit}>
                <div>
                    <div className={classes.title}>
                        ENTER TO SYSTEM
                    </div>
                </div>
                <div>
                    <div className={classes.nonFieldErrors}>{nonFieldErrors}</div>

                    <Field name="username" component={TextField} label="Login" fullWidth={true} />
                    <Field name="password" component={TextField} label="Password" type="password" fullWidth={true} />
                    <Field name="rememberMe" component={CheckBox} label="Remember me" className={classes.rememberMe} />

                    <RaisedButton
                        type="submit"
                        label="Enter"
                        primary={true}
                        fullWidth={true}
                    />
                </div>
            </form>
        </Paper>
    )
})

export default SignInForm
