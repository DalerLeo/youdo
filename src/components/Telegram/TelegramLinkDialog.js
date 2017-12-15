import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import {compose} from 'recompose'
import injectSheet from 'react-jss'
import Dialog from 'material-ui/Dialog'
import Loader from '../Loader'
import {Field, reduxForm} from 'redux-form'
import {TextField} from '../ReduxForm'
import CloseIcon from 'material-ui/svg-icons/navigation/close'
import CopyContent from 'material-ui/svg-icons/content/content-copy'
import IconButton from 'material-ui/IconButton'
import MainStyles from '../Styles/MainStyles'

const enhance = compose(
    injectSheet(_.merge(MainStyles, {
        loader: {
            position: 'absolute',
            width: '100%',
            height: '100%',
            background: '#fff',
            top: '0',
            left: '0'
        },
        inContent: {
            '& > div': {
                width: '100%',
                display: 'flex',
                alignItems: 'center'
            }
        }
    })),
    reduxForm({
        form: 'TelegramCreateForm',
        enableReinitialize: true
    })
)

const TelegramCreateDialog = enhance((props) => {
    const {open, loading, onClose, classes, copyToClipBoard} = props
    return (
        <Dialog
            modal={true}
            open={open}
            onRequestClose={onClose}
            className={classes.dialog}
            contentStyle={loading ? {width: '200px'} : {width: '400px'}}
            bodyClassName={classes.popUp}>
            <div className={classes.titleContent}>
                <span>{'Получить ключ'}</span>
                <IconButton onTouchTap={onClose}>
                    <CloseIcon color="#666666"/>
                </IconButton>
            </div>
            <div className={classes.bodyContent}>
                <div className={classes.form}>
                    {loading
                    ? <div className={classes.loader}>
                        <Loader size={0.75}/>
                      </div>
                    : <div className={classes.inContent} style={{minHeight: '70px'}}>
                        <div>
                            <Field
                                component={TextField}
                                name='link'
                                className={classes.inputFieldCustom}
                                fullWidth={true}
                            />
                            <IconButton onClick={() => copyToClipBoard()}>
                                <CopyContent color="#666666"/>
                            </IconButton>
                        </div>
                      </div>}
                </div>
            </div>
        </Dialog>
    )
})

TelegramCreateDialog.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    loading: PropTypes.bool.isRequired
}

export default TelegramCreateDialog
