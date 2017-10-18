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
import {TextField, CheckBox} from '../ReduxForm'
import CloseIcon2 from '../CloseIcon2'
import IconButton from 'material-ui/IconButton'
import MainStyles from '../Styles/MainStyles'
export const POSITION_CREATE_DIALOG_OPEN = 'openCreateDialog'
import userGroupFormat from '../../helpers/userGroupFormat'
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
        load: {
            position: 'absolute',
            width: '100%',
            height: '100%',
            background: '#fff',
            alignItems: 'center',
            zIndex: '999',
            display: 'flex',
            justifyContent: 'center'
        },
        perms: {
            display: 'flex',
            flexWrap: 'wrap',
            '& > div': {
                flexBasis: '50%',
                maxWidth: '50%',
                '&:nth-child(even)': {
                    textAlign: 'right'
                }
            }
        }
    })),
    reduxForm({
        form: 'PositionCreateForm',
        enableReinitialize: true
    })
)
const PositionCreateDialog = enhance((props) => {
    const {open, loading, handleSubmit, onClose, classes, isUpdate, data, dataLoading} = props
    const onSubmit = handleSubmit(() => props.onSubmit().catch(validate))
    return (
        <Dialog
            modal={true}
            open={open}
            onRequestClose={onClose}
            className={classes.dialog}
            contentStyle={loading ? {width: '300px'} : {width: '500px'}}
            bodyStyle={{minHeight: '100px !important'}}
            bodyClassName={classes.popUp}>
            <div className={classes.titleContent}>
                <span>{isUpdate ? 'Изменить ДОЛЖНОСТЬ' : 'ДОБАВЛЕНИЕ ДОЛЖНОСТИ'}</span>
                <IconButton onTouchTap={onClose}>
                    <CloseIcon2 color="#666666"/>
                </IconButton>
            </div>
            <div className={classes.bodyContent}>
                <form onSubmit={onSubmit} className={classes.form} style={{minHeight: 'auto', position: 'relative'}}>
                    {dataLoading && <div className={classes.load}>
                        <CircularProgress size={40} thickness={4}/>
                    </div>}
                    <div className={classes.inContent} style={{minHeight: '120px', paddingTop: '15px'}}>
                        <div className={classes.field}>
                            <Field
                                name="name"
                                component={TextField}
                                className={classes.inputFieldCustom}
                                label="Наименование"
                                fullWidth={true}
                            />
                            <div className={classes.perms}>
                                {_.map(data, (item) => {
                                    const name = userGroupFormat(_.get(item, 'name'))
                                    const id = _.get(item, 'id')
                                    return (
                                    <div key={id}>
                                        <Field
                                            name={'groups[' + id + ']'}
                                            label={name}
                                            component={CheckBox}/>
                                    </div>
                                    )
                                })}
                            </div>
                        </div>
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
PositionCreateDialog.propTypes = {
    isUpdate: PropTypes.bool,
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    loading: PropTypes.bool.isRequired
}
PositionCreateDialog.defaultProps = {
    isUpdate: false
}
export default PositionCreateDialog
