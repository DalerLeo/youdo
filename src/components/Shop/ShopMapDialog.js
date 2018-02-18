import React from 'react'
import PropTypes from 'prop-types'
import {compose} from 'recompose'
import injectSheet from 'react-jss'
import Dialog from 'material-ui/Dialog'
import FlatButton from 'material-ui/FlatButton'
import Loader from '../Loader'
import {Field, reduxForm} from 'redux-form'
import {LocationField} from '../ReduxForm'
import IconButton from 'material-ui/IconButton'
import CloseIcon from 'material-ui/svg-icons/navigation/close'
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
            maxHeight: 'inherit !important',
            marginBottom: '64px'
        },
        titleContent: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            zIndex: '999',
            '& button': {
                top: '5px',
                right: '5px',
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
            zIndex: '2000 !important',
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
    const {open, loading, handleSubmit, onClose, classes, viewOnly} = props
    const onSubmit = handleSubmit(() => props.onSubmit())
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
                        <Loader size={0.75}/>
                    </div>
                    <div className={classes.inContent}>
                        <div className={classes.titleContent}>
                            <IconButton onTouchTap={onClose}>
                                <CloseIcon color="#333"/>
                            </IconButton>
                        </div>
                        <Field
                            name="latLng"
                            component={LocationField}
                            className={classes.map}
                            fullWidth={true}
                            viewOnly={viewOnly}
                        />
                    </div>
                    {!viewOnly && <div className={classes.bottomButton}>
                        <span>{t('Кликните по карте, чтобы обозначить локацию')}</span>
                        <FlatButton
                            label={t('Сохранить')}
                            className={classes.actionButton}
                            primary={true}
                            type="submit"/>
                    </div>}
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
    isUpdate: false,
    viewOnly: true
}

export default ShopMapDialog
