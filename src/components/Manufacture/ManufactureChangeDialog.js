import React from 'react'
import PropTypes from 'prop-types'
import {compose} from 'recompose'
import injectSheet from 'react-jss'
import Dialog from 'material-ui/Dialog'
import FlatButton from 'material-ui/FlatButton'
import {Field, reduxForm} from 'redux-form'
import {ManufactureSearchField} from '../ReduxForm'
import CloseIcon2 from '../CloseIcon2'
import IconButton from 'material-ui/IconButton'
import validate from '../../helpers/validate'

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
        }
    }),
    reduxForm({
        form: 'ChangeManufactureForm',
        enableReinitialize: true
    })
)

const ManufactureChange = enhance((props) => {
    const {open, handleSubmit, loading, onClose, classes, error} = props
    const onSubmit = handleSubmit(() => props.onSubmit().catch(validate))

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
                    <span>Изменение производитель</span>
                    <IconButton onTouchTap={onClose}>
                        <CloseIcon2 color="#666666"/>
                    </IconButton>
                </div>
                {error && <div className={classes.error}>Ошибка: {error}</div>}
                <div>
                    <Field
                        name="manufacture"
                        label="Производство"
                        className={classes.inputFieldCustom}
                        component={ManufactureSearchField}
                        fullWidth={true}/>
                </div>
                <div className={classes.bottomButton}>
                    <FlatButton
                        label="Сохранить"
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
