import React from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'
import {connect} from 'react-redux'
import {compose, withReducer} from 'recompose'
import injectSheet from 'react-jss'
import {Field, reduxForm} from 'redux-form'
import Dialog from 'material-ui/Dialog'
import Loader from '../Loader'
import FlatButton from 'material-ui/FlatButton'
import IconButton from 'material-ui/IconButton'
import CloseIcon from 'material-ui/svg-icons/navigation/close'
import {
    UsersSearchField,
    MarketTypeSearchField,
    MarketTypeParentSearchField,
    ShopStatusSearchField
} from '../ReduxForm'
import t from '../../helpers/translate'

const enhance = compose(
    injectSheet({
        loader: {
            width: '100%',
            height: '100px',
            display: 'flex',
            background: '#fff',
            alignItems: 'center',
            zIndex: '999',
            justifyContent: 'center'
        },
        popUp: {
            color: '#333 !important',
            overflowY: 'unset !important',
            fontSize: '13px !important',
            position: 'relative',
            padding: '0 !important',
            overflowX: 'unset',
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
            padding: '20px 30px',
            zIndex: '999',
            '& button': {
                right: '13px',
                padding: '0 !important',
                position: 'absolute !important'
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
        inContent: {
            display: 'flex',
            padding: '20px 30px',
            color: '#333',
            '& form': {
                width: '100%'
            }
        },
        field: {
            height: '50px',
            display: 'flex',
            alignItems: 'center',
            width: '100%',
            '& > div': {
                width: '100%'
            }
        },
        bottomButton: {
            padding: '10px',
            zIndex: '999',
            borderTop: '1px solid #efefef',
            background: '#fff',
            textAlign: 'right',
            margin: '10px -30px -20px',
            '& span': {
                fontSize: '13px !important',
                fontWeight: '600 !important',
                color: '#129fdd',
                verticalAlign: 'inherit !important'
            }
        },
        actionButton: {
            fontSize: '13px !important',
            margin: '0 !important'
        },
        bodyContent: {
            width: '100%'
        }
    }),
    reduxForm({
        form: 'ShopMultiUpdateForm',
        enableReinitialize: true
    }),
    connect((state) => {
        const typeParent = _.get(state, ['form', 'ShopMultiUpdateForm', 'values', 'marketTypeParent', 'value'])
        const marketType = _.get(state, ['form', 'ShopMultiUpdateForm', 'values', 'marketType', 'value'])
        return {
            typeParent,
            marketType
        }
    }),
    withReducer('state', 'dispatch', (state, action) => {
        return {...state, ...action}
    }, {open: false}),
)

const ShopMultiUpdateDialog = enhance((props) => {
    const {open, onSubmit, loading, onClose, classes, handleSubmit, typeParent, marketType} = props

    return (
        <Dialog
            modal={true}
            contentStyle={loading ? {width: '500px'} : {width: '500px', maxWidth: 'none'}}
            open={open}
            onRequestClose={onClose}
            bodyClassName={classes.popUp}
            autoScrollBodyContent={true}>
            <div className={classes.titleContent}>
                <span>{t('Изменение выбранных магазинов')}</span>
                <IconButton onTouchTap={onClose}>
                    <CloseIcon color="#666666"/>
                </IconButton>
            </div>

            <div className={classes.bodyContent}>
                {loading
                    ? <div className={classes.loader}>
                        <Loader size={0.75}/>
                    </div>
                    : <div className={classes.inContent}>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div className={classes.field}>
                                <Field
                                    name="responsibleAgent"
                                    component={UsersSearchField}
                                    className={classes.inputDateCustom}
                                    label={t('Ответственный агент')}
                                    fullWidth={true}/>
                            </div>
                            <div className={classes.field}>
                                <Field
                                    name="marketTypeParent"
                                    component={MarketTypeParentSearchField}
                                    className={classes.inputFieldCustom}
                                    label={t('Тип заведения')}
                                    fullWidth={true}/>
                            </div>
                            {(typeParent || marketType) &&
                            <div className={classes.field}>
                                <Field
                                    name="marketType"
                                    component={MarketTypeSearchField}
                                    className={classes.inputFieldCustom}
                                    parentType={typeParent}
                                    label={t('Подкатегория')}
                                    fullWidth={true}/>
                            </div>}
                            <div className={classes.field}>
                                <Field
                                    name="status"
                                    component={ShopStatusSearchField}
                                    className={classes.inputDateCustom}
                                    label={t('Статус')}
                                    fullWidth={true}/>
                            </div>
                            <div className={classes.bottomButton}>
                                <FlatButton
                                    label={t('Изменить магазины')}
                                    labelStyle={{fontSize: '13px'}}
                                    className={classes.actionButton}
                                    primary={true}
                                    type="submit"/>
                            </div>
                        </form>
                    </div>
                }
            </div>
        </Dialog>
    )
})
ShopMultiUpdateDialog.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired
}
export default ShopMultiUpdateDialog
