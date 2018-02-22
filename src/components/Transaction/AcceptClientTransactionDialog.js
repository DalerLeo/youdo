import React from 'react'
import PropTypes from 'prop-types'
import {compose} from 'recompose'
import injectSheet from 'react-jss'
import _ from 'lodash'
import {reduxForm, Field} from 'redux-form'
import Dialog from 'material-ui/Dialog'
import Loader from '../Loader'
import IconButton from 'material-ui/IconButton'
import CloseIcon from 'material-ui/svg-icons/navigation/close'
import AcceptClientTransactionCashBoxSearchField from '../ReduxForm/Cashbox/AcceptClientTransactionCashBoxSearchField'
import {DateField} from '../ReduxForm'
import FlatButton from 'material-ui/FlatButton'
import numberFormat from '../../helpers/numberFormat'
import t from '../../helpers/translate'
import formValidate from '../../helpers/formValidate'

const ZERO = 0

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
        inputDateCustom: {
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
            },
            '& div:first-child': {
                height: '45px !important'
            }
        },
        popUp: {
            color: '#333 !important',
            overflow: 'unset !important',
            fontSize: '13px !important',
            position: 'relative',
            padding: '0 !important',
            height: '100%',
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
        inContent: {
            maxHeight: '50vh',
            minHeight: '184px',
            padding: '0 30px',
            color: '#333',
            '& > div:first-child': {
                padding: '20px 0 10px'
            },
            '& span': {
                fontWeight: '600'
            }
        },
        bodyContent: {
            width: '100%'
        },
        returnInfo: {
            padding: '25px 0',
            borderBottom: '1px #efefef solid',
            '& span': {
                display: 'block',
                '&:first-child': {
                    fontWeight: '600'
                }
            }
        },
        flex: {
            alignItems: 'initial',
            '& > div:first-child': {
                maxWidth: '60%'
            }
        }
    }),
    reduxForm({
        form: 'AcceptClientTransactionForm',
        enableReinitialize: true
    })
)

const AcceptClientTransactionDialog = enhance((props) => {
    const {dispatch, open, onClose, classes, loading, handleSubmit, data, currency} = props
    const formNames = ['cashbox', 'date']
    const onSubmit = handleSubmit(() => props.onSubmit(_.get(data, ['sum']))
        .catch((error) => {
            formValidate(formNames, dispatch, error)
        }))
    const user = _.get(data, ['user', 'name'])
    const currencyName = _.get(data, ['currency', 'name'])
    const amount = numberFormat(_.get(data, ['sum']), currencyName)
    return (
        <Dialog
            modal={true}
            contentStyle={loading ? {width: '200px'} : {width: '400px', maxWidth: 'auto'}}
            open={open > ZERO}
            onRequestClose={onClose}
            bodyClassName={classes.popUp}
            autoScrollBodyContent={true}>
            <div className={classes.titleContent}>
                <span>{t('Принять наличные')} {amount}</span>
                <IconButton onTouchTap={onClose}>
                    <CloseIcon color="#666666"/>
                </IconButton>
            </div>
            <div className={classes.bodyContent}>
                {loading
                    ? <div className={classes.loader}>
                        <Loader size={0.75}/>
                      </div>
                    : <form onSubmit={onSubmit}>
                        <div className={classes.inContent} style={{minHeight: 'initial'}}>
                            <div>{t('Агент')}: <span>{user}</span></div>
                            <div className={classes.list}>
                                <Field
                                    name="cashbox"
                                    component={AcceptClientTransactionCashBoxSearchField}
                                    data-currency={currency}
                                    className={classes.inputFieldCustom}
                                    fullWidth={true}
                                    label={t('Кассы')}
                                />
                                <Field
                                    name="date"
                                    component={DateField}
                                    className={classes.inputDateCustom}
                                    fullWidth={true}
                                    label={t('Дата')}
                                />
                            </div>
                        </div>
                        <div className={classes.bottomButton}>
                            <FlatButton
                                label={t('Сохранить')}
                                labelStyle={{fontSize: '13px'}}
                                primary={true}
                                type="submit"
                            />
                        </div>
                      </form>
                }
            </div>
        </Dialog>
    )
})
AcceptClientTransactionDialog.propTyeps = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired
}
export default AcceptClientTransactionDialog
