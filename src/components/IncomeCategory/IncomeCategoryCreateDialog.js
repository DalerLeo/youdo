import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import {compose} from 'recompose'
import injectSheet from 'react-jss'
import Dialog from 'material-ui/Dialog'
import FlatButton from 'material-ui/FlatButton'
import Loader from '../Loader'
import {Field, reduxForm} from 'redux-form'
import {TextField, CheckBox} from '../ReduxForm'
import CategoryOptionsRadioButton from '../ReduxForm/CategoryOptionsRadioButton'
import CloseIcon from 'material-ui/svg-icons/navigation/close'
import IconButton from 'material-ui/IconButton'
import MainStyles from '../Styles/MainStyles'
import t from '../../helpers/translate'
import {connect} from 'react-redux'
import formValidate from '../../helpers/formValidate'

export const INCOME_CATEGORY_CREATE_DIALOG_OPEN = 'openCreateDialog'

const enhance = compose(
    injectSheet(_.merge(MainStyles, {
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
        expenseCategoryOptions: {
            padding: '10px 30px',
            display: 'flex',
            flexWrap: 'wrap',
            '& > div': {
                whiteSpace: 'nowrap',
                display: 'flex',
                flexWrap: 'wrap'
            }
        }
    })),
    reduxForm({
        form: 'IncomeCategoryCreateForm',
        enableReinitialize: true
    }),
    connect((state) => {
        const showOptions = _.get(state, ['form', 'IncomeCategoryCreateForm', 'values', 'showOptions'])
        return {
            showOptions
        }
    })
)

const IncomeCategoryCreateDialog = enhance((props) => {
    const {open, loading, dispatch, handleSubmit, onClose, classes, isUpdate, data, dataLoading, showOptions} = props
    const formNames = ['name', 'options']
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
                <span>{isUpdate ? t('Изменить категорию приходов') : t('Добавить категорию приходов')}</span>
                <IconButton onTouchTap={onClose}>
                    <CloseIcon color="#666666"/>
                </IconButton>
            </div>
            <div className={classes.bodyContent}>
                <form onSubmit={onSubmit} className={classes.form} style={{minHeight: 'auto'}}>
                    {dataLoading && <div className={classes.load}>
                        <Loader size={0.75}/>
                    </div>}
                    <div className={classes.inContent} style={{minHeight: 'unset', paddingTop: '10px'}}>
                        <div className={classes.field}>
                            <Field
                                name="name"
                                component={TextField}
                                className={classes.inputFieldCustom}
                                label={t('Наименование')}
                                fullWidth={true}
                            />
                            <Field
                                name={'showOptions'}
                                label={t('Дополнительные параметры')}
                                component={CheckBox}/>
                        </div>
                    </div>
                    {showOptions &&
                    <div>
                        <div style={{margin: '10px 30px -10px', fontWeight: '600'}}>{t('Дополнительные параметры')}</div>
                        <div className={classes.expenseCategoryOptions}>
                            <Field
                                name={'options'}
                                optionsList={data}
                                loading={dataLoading}
                                component={CategoryOptionsRadioButton}/>
                        </div>
                    </div>}
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

IncomeCategoryCreateDialog.propTypes = {
    isUpdate: PropTypes.bool,
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    loading: PropTypes.bool.isRequired
}

IncomeCategoryCreateDialog.defaultProps = {
    isUpdate: false
}

export default IncomeCategoryCreateDialog
