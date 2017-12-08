import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import {compose} from 'recompose'
import injectSheet from 'react-jss'
import Dialog from 'material-ui/Dialog'
import FlatButton from 'material-ui/FlatButton'
import Loader from '../Loader'
import {Field, reduxForm, SubmissionError} from 'redux-form'
import toCamelCase from '../../helpers/toCamelCase'
import {TextField, CheckBox} from '../ReduxForm'
import CloseIcon from 'material-ui/svg-icons/navigation/close'
import IconButton from 'material-ui/IconButton'
import MainStyles from '../Styles/MainStyles'

export const EXPENSIVE_CATEGORY_CREATE_DIALOG_OPEN = 'openCreateDialog'

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
                whiteSpace: 'nowrap'
            }
        }
    })),
    reduxForm({
        form: 'ExpensiveCategoryCreateForm',
        enableReinitialize: true
    })
)

const ExpensiveCategoryCreateDialog = enhance((props) => {
    const {open, loading, handleSubmit, onClose, classes, isUpdate, data, dataLoading} = props
    const onSubmit = handleSubmit(() => props.onSubmit().catch(validate))

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
                <span>{isUpdate ? 'Изменить категорию расходов' : 'Добавить категорию расходов'}</span>
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
                                label="Наименование"
                                fullWidth={true}
                            />
                        </div>
                    </div>
                    <div style={{margin: '10px 30px -10px', fontWeight: '600'}}>Дополнительные параметры</div>
                    <div className={classes.expenseCategoryOptions}>
                        {_.map(data, (item) => {
                            const name = _.get(item, 'title')
                            const id = _.get(item, 'id')
                            return (
                                <div key={id}>
                                    <Field
                                        name={'options[' + id + ']'}
                                        label={name}
                                        component={CheckBox}/>
                                </div>
                            )
                        })}
                    </div>
                    <div className={classes.bottomButton}>
                        <FlatButton
                            label="Сохранить"
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

ExpensiveCategoryCreateDialog.propTypes = {
    isUpdate: PropTypes.bool,
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    loading: PropTypes.bool.isRequired
}

ExpensiveCategoryCreateDialog.defaultProps = {
    isUpdate: false
}

export default ExpensiveCategoryCreateDialog
