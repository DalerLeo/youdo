import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import {compose, withReducer, withState} from 'recompose'
import injectSheet from 'react-jss'
import {Fields, reduxForm, SubmissionError} from 'redux-form'
import Dialog from 'material-ui/Dialog'
import CircularProgress from 'material-ui/CircularProgress'
import IconButton from 'material-ui/IconButton'
import FlatButton from 'material-ui/FlatButton'
import CloseIcon2 from '../CloseIcon2'
import JoinShopListField from '../ReduxForm/Join/JoinShopListField'
import JoinClientListField from '../ReduxForm/Join/JoinClientListField'
import toCamelCase from '../../helpers/toCamelCase'

const validate = (data) => {
    const errors = toCamelCase(data)
    const nonFieldErrors = _.get(errors, 'nonFieldErrors')
    throw new SubmissionError({
        ...errors,
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
            display: 'flex'
        },
        podlojkaScroll: {
            overflowY: 'auto !important'
        },
        popUp: {
            background: '#fff',
            overflowY: 'hidden !important',
            fontSize: '13px !important',
            position: 'relative',
            padding: '0 !important',
            overflowX: 'hidden',
            height: '100%',
            maxHeight: 'inherit !important',
            marginBottom: '64px'
        },
        titleContent: {
            background: '#fff',
            color: '#333',
            fontWeight: 'bold',
            textTransform: 'uppercase',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: '1px solid #efefef',
            padding: '20px 30px',
            zIndex: '999',
            '& button': {
                right: '13px',
                padding: '0 !important',
                position: 'absolute !important'
            }
        },
        inContent: {
            display: 'flex',
            color: '#333',
            height: '100%'
        },
        bodyContent: {
            color: '#333',
            width: '100%',
            height: 'calc(100% - 59px)'
        },
        form: {
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            justifyContent: 'space-between'
        },
        confirm: {
            background: '#fff',
            position: 'absolute',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            top: '0',
            left: '0',
            right: '0',
            bottom: '0',
            zIndex: '9999'
        },
        confirmButtons: {
            marginTop: '-35px',
            '& > div:first-child': {
                fontWeight: '600',
                fontSize: '15px',
                textAlign: 'center',
                marginBottom: '15px'
            }
        },
        bottomButton: {
            bottom: '0',
            left: '0',
            right: '0',
            padding: '10px',
            zIndex: '10',
            borderTop: '1px solid #efefef',
            background: '#fff',
            textAlign: 'right',
            '& span': {
                fontSize: '13px !important',
                fontWeight: '600 !important',
                color: '#129fdd',
                verticalAlign: 'inherit !important'
            }
        },
        actionButton: {
            fontSize: '13px !important',
            margin: '0 !important'
        },
        wrapper: {
            width: '100%',
            padding: '20px 30px',
            minHeight: '350px',
            maxHeight: '600px',
            overflowY: 'auto',
            overflowX: 'hidden'
        }
    }),
    reduxForm({
        form: 'JoinForm',
        enableReinitialize: true
    }),
    withReducer('state', 'dispatch', (state, action) => {
        return {...state, ...action}
    }, {open: false}),
    withState('openConfirm', 'setOpenConfirm', false)
)

const flatButton = {
    label: {
        color: '#12aaeb',
        fontWeight: 600,
        fontSize: '13px'
    }
}
const JoinDialog = enhance((props) => {
    const {open, handleSubmit, onClose, classes, isClient, openConfirm, setOpenConfirm, loading} = props
    const onSubmit = handleSubmit(() => props.onSubmit().catch(validate))
    const ZERO = 0

    const customSubmit = () => {
        onSubmit()
        setOpenConfirm(false)
    }
    return (
        <Dialog
            modal={true}
            className={classes.podlojkaScroll}
            contentStyle={loading ? {width: '500px', height: '300px'} : {width: '700px', maxWidth: 'none'}}
            open={open > ZERO || open === 'true'}
            onRequestClose={onClose}
            bodyClassName={classes.popUp}
            autoScrollBodyContent={true}>
            <div className={classes.titleContent}>
                <span>{isClient ? 'Объединение клиентов' : 'Объединение магазинов'}</span>
                <IconButton onTouchTap={onClose}>
                    <CloseIcon2 color="#666666"/>
                </IconButton>
            </div>
            <div className={classes.bodyContent}>
                {loading && <div className={classes.loader}>
                    <CircularProgress size={40} thickness={4}/>
                </div>}
                <form onSubmit={onSubmit} scrolling="auto" className={classes.form}>
                    {openConfirm && <div className={classes.confirm}>
                        <div className={classes.confirmButtons}>
                            <div>Вы уверены?</div>
                            <FlatButton
                                label="Нет"
                                labelStyle={flatButton.label}
                                onTouchTap={() => { setOpenConfirm(false) }}
                                className={classes.actionButton}
                                primary={true}
                            />
                            <FlatButton
                                label="Да"
                                labelStyle={flatButton.label}
                                className={classes.actionButton}
                                primary={true}
                                onTouchTap={customSubmit}
                            />
                        </div>
                    </div>}
                    <div className={classes.innerWrap}>
                        <div className={classes.inContent}>
                            <div className={classes.wrapper}>
                                {isClient
                                ? <Fields
                                        names={['clients', 'client', 'target']}
                                        component={JoinClientListField}/>
                                : <Fields
                                        names={['markets', 'market', 'target']}
                                        component={JoinShopListField}/>}
                            </div>
                        </div>
                    </div>
                    <div className={classes.bottomButton}>
                        <FlatButton
                            label="Объединить"
                            onTouchTap={() => { setOpenConfirm(true) }}
                            className={classes.actionButton}
                            primary={true}
                        />
                    </div>
                </form>
            </div>
        </Dialog>
    )
})
JoinDialog.propTyeps = {
    isClient: PropTypes.bool,
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    loading: PropTypes.bool.isRequired
}
JoinDialog.defaultProps = {
    isClient: false
}
export default JoinDialog
