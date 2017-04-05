import React from 'react'
import {compose} from 'recompose'
import {reduxForm, Field} from 'redux-form'
import injectSheet from 'react-jss'
import TextField from '../ReduxForm/TextField'

const enhance = compose(
    injectSheet({
        wrapper: {
            position: 'absolute',
            minHeight: '400px',
            minWidth: '400px',
            background: '#fff',
            zIndex: 99
        }
    }),
    reduxForm({
        form: 'SignInForm'
    })
)

const ShopFilter = enhance(({classes, onSubmit}) => {
    return (
        <form className={classes.wrapper} onSubmit={onSubmit}>
            <Field name="name" component={TextField} label="Login" fullWidth={true} />
            <button type="submit">filter</button>
        </form>
    )
})

export default ShopFilter
