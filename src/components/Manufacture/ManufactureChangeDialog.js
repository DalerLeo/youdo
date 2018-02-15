import React from 'react'
import PropTypes from 'prop-types'
import {compose} from 'recompose'
import injectSheet from 'react-jss'
import Dialog from 'material-ui/Dialog'
import FlatButton from 'material-ui/FlatButton'
import {Field, reduxForm} from 'redux-form'
import {ManufactureSearchField, EquipmentSearchField} from '../ReduxForm'
import CloseIcon from 'material-ui/svg-icons/navigation/close'
import IconButton from 'material-ui/IconButton'
import t from '../../helpers/translate'

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
            display: ({loading}) => loading ? 'flex' : 'none'
        },
        popUp: {
            color: '#333 !important',
            fontSize: '13px !important',
            position: 'relative',
            padding: '0 !important',
            height: '100%',
            maxHeight: 'none !important',
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
            padding: '0 10px 0 30px',
            height: '60px',
            zIndex: '999'
        },
        inContent: {
            minHeight: '100px',
            padding: '10px 30px 0',
            color: '#333'
        },
        bodyContent: {
            width: '100%'
        },
        bottomButton: {
            bottom: '0',
            left: '0',
            right: '0',
            padding: '10px',
            zIndex: '999',
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
        inputFieldCustom: {
            fontSize: '13px !important',
            height: '45px !important',
            marginTop: '7px',
            '& div': {
                fontSize: '13px !important'
            },
            '& label': {
                top: '20px !important',
                lineHeight: '5px !important'
            },
            '& input': {
                marginTop: '0 !important'
            }
        },
        actionButton: {
            fontSize: '13px !important',
            margin: '0 !important'
        }
    }),
    reduxForm({
        form: 'ChangeManufactureForm',
        enableReinitialize: true
    })
)

const ManufactureChange = enhance((props) => {
    const {open, handleSubmit, loading, onClose, classes, error} = props
    const onSubmit = handleSubmit(() => props.onSubmit())

    return (
        <Dialog
            modal={true}
            open={open}
            onRequestClose={onClose}
            className={classes.dialog}
            contentStyle={loading ? {width: '135px'} : {width: '600px'}}
            bodyClassName={classes.popUp}>
            <form onSubmit={onSubmit} className={classes.form}>
                <div className={classes.titleContent}>
                    <span>{t('Изменение производства')}</span>
                    <IconButton onTouchTap={onClose}>
                        <CloseIcon color="#666666"/>
                    </IconButton>
                </div>
                {error && <div className={classes.error}>{t('Ошибка')}: {error}</div>}
                <div className={classes.inContent}>
                    <div>
                        <Field
                            name="manufacture"
                            label={t('Производство')}
                            className={classes.inputFieldCustom}
                            component={ManufactureSearchField}
                            fullWidth={true}/>
                    </div>
                    <div>
                        <Field
                            name="equipment"
                            label={t('Оборудование')}
                            className={classes.inputFieldCustom}
                            component={EquipmentSearchField}
                            fullWidth={true}/>
                    </div>
                    </div>
                <div className={classes.bottomButton}>
                    <FlatButton
                        label={t('Сохранить')}
                        className={classes.actionButton}
                        primary={true}
                        type="submit"
                    />
                </div>
            </form>
        </Dialog>
    )
})

ManufactureChange.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func,
    loading: PropTypes.bool
}

ManufactureChange.defaultProps = {
    isUpdate: false
}

export default ManufactureChange
