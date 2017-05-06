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
import {TextField, UsersSearchField, StockTypeSearchField} from '../ReduxForm'
import CloseIcon2 from '../CloseIcon2'
import IconButton from 'material-ui/IconButton'
import MainStyles from '../Styles/MainStyles'

export const STOCK_CREATE_DIALOG_OPEN = 'openCreateDialog'

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
            width: '120px',
            margin: '0 auto',
            padding: '15px',
            textAlign: 'center',
            display: ({loading}) => loading ? 'flex' : 'none',
            flexDirection: 'center'
        },

        body: {
            minHeight: 'auto'
        },
        form: {
            minHeight: 'auto'
        }
    })),
    reduxForm({
        form: 'StockCreateForm',
        enableReinitialize: true
    })
)

const StockCreateDialog = enhance((props) => {
    const {open, loading, handleSubmit, onClose, classes, isUpdate} = props
    const onSubmit = handleSubmit(() => props.onSubmit().catch(validate))

    return (
        <Dialog
            modal={true}
            open={open}
            onRequestClose={onClose}
            className={classes.dialog}
            contentStyle={loading ? {width: '300px'} : {width: '500px'}}
            bodyStyle={{minHeight: 'auto'}}
            bodyClassName={classes.body}>
            <div className={classes.titleContent}>
                <span>{isUpdate ? 'Изменить склад' : 'Добавить склад'}</span>
                <IconButton onTouchTap={onClose}>
                    <CloseIcon2 color="#666666"/>
                </IconButton>
            </div>
            <form onSubmit={onSubmit} className={classes.form}>
                <div className={classes.loader}>
                    <CircularProgress size={80} thickness={5}/>
                </div>
                <div className={classes.fieldsWrap}>
                    <div className={classes.field}>
                        <Field
                            name="name"
                            component={TextField}
                            className={classes.inputField}
                            label="Наименование"
                            fullWidth={true}
                        />
                        <Field
                            name="manager"
                            component={UsersSearchField}
                            className={classes.inputField}
                            label="Завсклад"
                            fullWidth={true}
                        />
                        <Field
                            name="stockType"
                            component={StockTypeSearchField}
                            className={classes.inputField}
                            label="Тип склада"
                            fullWidth={true}
                        />
                    </div>
                </div>
                <div className={classes.bottomButton}>
                    <FlatButton
                        label="Сохранить"
                        type="submit"
                    />
                </div>
            </form>
        </Dialog>
    )
})

StockCreateDialog.propTypes = {
    isUpdate: PropTypes.bool,
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    loading: PropTypes.bool.isRequired
}

StockCreateDialog.defaultProps = {
    isUpdate: false
}

export default StockCreateDialog
