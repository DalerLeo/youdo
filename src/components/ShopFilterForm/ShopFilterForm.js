import React from 'react'
import {compose} from 'recompose'
import {reduxForm, Field} from 'redux-form'
import injectSheet from 'react-jss'
import Paper from 'material-ui/Paper'
import IconButton from 'material-ui/IconButton'
import RaisedButton from 'material-ui/RaisedButton'
import DateToDateField from '../ReduxForm/DateToDateField'
import CloseIcon from '../CloseIcon'

const enhance = compose(
    injectSheet({
        wrapper: {
            position: 'absolute',
            minWidth: '300px',
            background: '#fff',
            zIndex: 99,
            top: 0,
            left: 0,
            borderRadius: 0,
            padding: '10px 20px 10px 20px'
        },
        header: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
        },
        title: {
            fontSize: '15px',
            color: '#5d6474'
        },
        submit: {
            color: '#fff !important'
        }
    }),
    reduxForm({
        form: 'ShopFilterForm'
    })
)

const ShopFilterForm = enhance(({classes, open, onSubmit, onClose}) => {
    if (!open) {
        return null
    }

    return (
        <Paper className={classes.wrapper} zDepth={2}>
            <div className={classes.header}>
                <span className={classes.title}>Filter</span>
                <IconButton onTouchTap={onClose}>
                    <CloseIcon />
                </IconButton>
            </div>
            <form onSubmit={onSubmit}>
                <div>
                    <Field name="date" component={DateToDateField} label="Date to Date" fullWidth={true} />
                </div>

                <div>
                    <RaisedButton
                        type="submit"
                        primary={true}
                        buttonStyle={{color: '#fff'}}>
                        Apply
                    </RaisedButton>
                </div>
            </form>
        </Paper>
    )
})

ShopFilterForm.propTypes = {
    open: React.PropTypes.bool.isRequired,
    onSubmit: React.PropTypes.func.isRequired,
    onClose: React.PropTypes.func.isRequired
}

export default ShopFilterForm
