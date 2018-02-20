import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import {compose} from 'recompose'
import injectSheet from 'react-jss'
import Dialog from 'material-ui/Dialog'
import Loader from '../Loader'
import FlatButton from 'material-ui/FlatButton'
import {Field, reduxForm} from 'redux-form'
import {TextField, CurrencySearchField, UsersSearchField, PaymentTypeSearchField} from '../ReduxForm'
import CloseIcon from 'material-ui/svg-icons/navigation/close'
import IconButton from 'material-ui/IconButton'
import MainStyles from '../Styles/MainStyles'
import t from '../../helpers/translate'
import formValidate from '../../helpers/formValidate'

export const CASHBOX_CREATE_DIALOG_OPEN = 'openCreateDialog'

const styles = _.merge(MainStyles, {
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
    }
})

const enhance = compose(
    injectSheet(styles),
    reduxForm({
        form: 'CashboxCreateForm',
        enableReinitialize: true
    })
)

const CashboxCreateDialog = enhance((props) => {
    const {open, loading, dispatch, handleSubmit, onClose, classes, isUpdate} = props
    const formNames = ['name', 'currency', 'cashier', 'type']
    const onSubmit = handleSubmit(() => props.onSubmit()
        .catch((error) => {
            formValidate(formNames, dispatch, error)
        }))

    return (
        <Dialog
            modal={true}
            open={open}
            onRequestClose={onClose}
            className={classes.dialog}
            contentStyle={loading ? {width: '300px'} : {width: '500px'}}
            bodyStyle={{minHeight: 'auto'}}
            bodyClassName={classes.popUp}>
            <div className={classes.titleContent}>
                <span>{isUpdate ? t('Изменить кассу') : t('Добавить кассу')}</span>
                <IconButton onTouchTap={onClose}>
                    <CloseIcon color="#666666"/>
                </IconButton>
            </div>
            <div className={classes.bodyContent}>
                <form onSubmit={onSubmit} className={classes.form}>
                    <div className={classes.loader}>
                        <Loader size={0.75}/>
                    </div>
                    <div className={classes.inContent} style={{minHeight: '235px', paddingTop: '15px'}}>
                        <div className={classes.field}>
                            <Field
                                name="name"
                                component={TextField}
                                className={classes.inputFieldCustom}
                                label={t('Наименование')}
                                fullWidth={true}
                            />
                            <Field
                                name="currency"
                                component={CurrencySearchField}
                                className={classes.inputFieldCustom}
                                label={t('Валюта')}
                                fullWidth={true}
                            />
                            <Field
                                name="cashier"
                                component={UsersSearchField}
                                className={classes.inputFieldCustom}
                                label={t('Кассир')}
                                fullWidth={true}
                            />
                            <Field
                                name="type"
                                component={PaymentTypeSearchField}
                                className={classes.inputFieldCustom}
                                label={t('Тип оплаты')}
                                fullWidth={true}
                            />
                        </div>
                    </div>
                    <div className={classes.bottomButton}>
                        <FlatButton
                            label={t('Сохранить')}
                            className={classes.actionButton}
                            labelStyle={{fontSize: '13px'}}
                            primary={true}
                            type="submit"
                        />
                    </div>
                </form>
            </div>
        </Dialog>
    )
})

CashboxCreateDialog.propTyeps = {
    isUpdate: PropTypes.bool.isRequired,
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    loading: PropTypes.bool.isRequired
}

CashboxCreateDialog.defaultProps = {
    isUpdate: false
}
export default CashboxCreateDialog
