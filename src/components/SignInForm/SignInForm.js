import React from 'react'
import {compose} from 'recompose'
import RaisedButton from 'material-ui/RaisedButton'
import CircularProgress from 'material-ui/CircularProgress'
import Paper from 'material-ui/Paper'
import {Field, reduxForm} from 'redux-form'
import injectSheet from 'react-jss'
import validate from '../../helpers/validate'
import {CheckBox, TextField} from '../ReduxForm'
import Dot from '../Images/dot.png'

const enhance = compose(
    injectSheet({
        loader: {
            width: '120px',
            height: '120px',
            margin: '0 auto',
            padding: '15px',
            alignItems: 'center',
            justifyContent: 'center',
            display: 'flex'
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
            textAlign: 'center',
            color: '#647994',
            position: 'relative',
            '&:after': {
                content: '""',
                backgroundImage: 'url(' + Dot + ')',
                position: 'absolute',
                bottom: '0',
                height: '2px',
                left: '0',
                right: '0'
            }
        },

        loginForm: {
            fontSize: '13px !important'
        },

        rememberMe: {
            marginBottom: '20px !important',
            marginTop: '20px !important'
        },

        error: {
            color: 'red',
            fontSize: '12px',
            marginTop: '12px'
        }
    }),

    reduxForm({
        form: 'SignInForm'
    })
)

const SignInForm = enhance((props) => {
    const {classes, handleSubmit, loading, error} = props
    const onSubmit = handleSubmit(() => props.onSubmit().catch(validate))

    if (loading) {
        return (
            <Paper className={classes.loader} zDepth={2}>
                <CircularProgress size={40} thickness={4}/>
            </Paper>
        )
    }

    return (
        <Paper className={classes.wrapper} zDepth={2}>
            <form onSubmit={onSubmit}>
                <div>
                    <div className={classes.title}>
                        Вход в систему
                    </div>
                </div>
                <div>
                    <div className={classes.error}>{error}</div>

                    <Field className={classes.loginForm} name="username" component={TextField} label="Логин" fullWidth={true} />
                    <Field className={classes.loginForm} name="password" component={TextField} label="Пароль" type="password" fullWidth={true} />
                    <Field name="rememberMe" component={CheckBox} label="Запомнить меня" className={classes.rememberMe} />

                    <RaisedButton
                        type="submit"
                        label="Войти"
                        primary={true}
                        fullWidth={true}
                    />
                </div>
            </form>
        </Paper>
    )
})

export default SignInForm
