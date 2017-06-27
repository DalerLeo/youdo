import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import {compose} from 'recompose'
import injectSheet from 'react-jss'
import Dialog from 'material-ui/Dialog'
import FlatButton from 'material-ui/FlatButton'
import CircularProgress from 'material-ui/CircularProgress'
import {Field, reduxForm, SubmissionError} from 'redux-form'
import toCamelCase from '../../helpers/toCamelCase'
import {LocationField} from '../ReduxForm'
import IconButton from 'material-ui/IconButton'
import CloseIcon2 from '../CloseIcon2'

const validate = (data) => {
    const errors = toCamelCase(data)
    const nonFieldErrors = _.get(errors, 'nonFieldErrors')
    const latLng = (_.get(errors, 'lat') || _.get(errors, 'lon')) && 'Location is required.'

    throw new SubmissionError({
        ...errors,
        latLng,
        _error: nonFieldErrors
    })
}

const enhance = compose(
    injectSheet({
        loader: {
            position: 'absolute',
            width: '100%',
            height: '100%',
            background: '#fff',
            top: '0',
            left: '0',
            alignItems: 'center',
            zIndex: '999',
            textAlign: 'center',
            justifyContent: 'center',
            display: ({loading}) => loading ? 'flex' : 'none'
        },
        popUp: {
            overflowY: 'hidden !important',
            fontSize: '13px !important',
            position: 'relative',
            padding: '0 !important',
            overflowX: 'hidden',
            height: '100%',
            maxHeight: 'inherit !important'
        },
        titleContent: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '30px',
            zIndex: '999',
            '& button': {
                top: '8px',
                right: '8px',
                padding: '0 !important',
                position: 'absolute !important'
            }
        },
        inContent: {
            display: 'flex',
            flexDirection: 'column',
            color: '#333',
            position: 'relative',
            height: '600px',
            '& > div:nth-child(2)': {
                position: 'absolute'
            }
        },
        bottomButton: {
            background: '#454545',
            color: '#fff',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '10px 10px 10px 30px',
            zIndex: '999',
            textAlign: 'right',
            '& span': {
                fontSize: '13px !important',
                fontWeight: '600 !important',
                color: '#fff',
                verticalAlign: 'inherit !important'
            }
        },
        actionButton: {
            fontSize: '13px !important',
            margin: '0 !important'
        },
        podlojkaScroll: {
            padding: '0 !important',
            overflowY: 'auto !important',
            '& > div > div': {
                width: 'auto !important',
                maxWidth: '1000px !important'
            }
        }
    }),
    reduxForm({
        form: 'ShopMapForm',
        enableReinitialize: true
    }),
)
const ShopMapDialog = enhance((props) => {
    const {open, loading, handleSubmit, onClose, classes} = props
    const onSubmit = handleSubmit(() => props.onSubmit().catch(validate))
    return (
        <Dialog
            modal={true}
            open={open}
            onRequestClose={onClose}
            className={classes.podlojkaScroll}
            contentStyle={loading ? {width: '500px'} : {width: '100%'}}
            bodyClassName={classes.popUp}>
            <div className={classes.bodyContent}>
                <form onSubmit={onSubmit} className={classes.form}>
                    <div className={classes.loader}>
                        <CircularProgress size={80} thickness={5}/>
                    </div>
                    <div className={classes.inContent}>
                        <div className={classes.titleContent}>
                            <IconButton onTouchTap={onClose}>
                                <CloseIcon2 color="#333"/>
                            </IconButton>
                        </div>
                        <Field
                            name="latLng"
                            component={LocationField}
                            className={classes.map}
                            fullWidth={true}
                        />
                    </div>
                    <div className={classes.bottomButton}>
                        <span>Кликните по карте, чтобы обозначить локацию</span>
                        <FlatButton
                            label="Сохранить"
                            className={classes.actionButton}
                            primary={true}
                            type="submit"/>
                    </div>
                </form>
            </div>
        </Dialog>
    )
})

ShopMapDialog.propTyeps = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired
}
ShopMapDialog.defaultProps = {
    isUpdate: false
}

export default ShopMapDialog
