import _ from 'lodash'
import React from 'react'
import {compose, withHandlers} from 'recompose'
import {reduxForm, Field} from 'redux-form'
import PropTypes from 'prop-types'
import injectSheet from 'react-jss'
import {Link} from 'react-router'
import Paper from 'material-ui/Paper'
import IconButton from 'material-ui/IconButton'
import getConfig from '../../helpers/getConfig'
import RaisedButton from 'material-ui/RaisedButton'
import BorderColorIcon from 'material-ui/svg-icons/editor/border-color'
import DateToDateField from '../ReduxForm/Basic/DateToDateField'
import {
    ClientMultiSearchField,
    MarketMultiSearchField,
    UsersMultiSearchField,
    TextField,
    ProductMultiSearchField,
    ReturnStatusMultiSearch,
    ReturnTypeSearchField,
    DivisionMultiSearchField,
    PaymentTypeSearchField,
    CheckBox
} from '../ReduxForm'
import CloseIcon from 'material-ui/svg-icons/action/highlight-off'
import KeyboardArrowDown from 'material-ui/svg-icons/hardware/keyboard-arrow-down'
import t from '../../helpers/translate'

export const RETURN_FILTER_OPEN = 'openFilterDialog'

export const RETURN_FILTER_KEY = {
    ORDER: 'order',
    TYPE: 'type',
    CLIENT: 'client',
    STATUS: 'status',
    INITIATOR: 'initiator',
    MARKET: 'market',
    CODE: 'code',
    PRODUCT: 'product',
    FROM_DATE: 'fromDate',
    TO_DATE: 'toDate',
    DIVISION: 'division',
    PAYMENT_TYPE: 'paymentType',
    EXCLUDE: 'exclude'
}

const enhance = compose(
    injectSheet({
        wrapper: {
            position: 'absolute',
            width: '310px',
            background: '#fff',
            zIndex: 99,
            top: 0,
            left: 0,
            borderRadius: 0,
            padding: '10px 20px 10px 20px'
        },
        afterFilter: {
            alignItems: 'center',
            display: 'flex',
            backgroundColor: '#efefef',
            position: 'relative',
            padding: '16px 30px',
            marginLeft: '-30px',
            '& > div:nth-child(2)': {
                position: 'absolute',
                right: '0'
            },
            '& > div:nth-child(1)': {
                color: '#666666'
            },
            '& button': {
                borderLeft: '1px solid white !important'
            }
        },
        icon: {
            color: '#8f8f8f !important'
        },
        arrow: {
            color: '#12aaeb',
            paddingRight: '14px',
            position: 'relative',
            '& svg': {
                position: 'absolute',
                width: '13px !important',
                height: '20px !important'
            }
        },
        header: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            '& button': {
                marginRight: '-12px !important'
            }
        },
        title: {
            fontSize: '15px',
            color: '#5d6474'
        },
        submit: {
            color: '#fff !important'
        },
        inputField: {
            fontSize: '13px !important'
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
            },
            '& div:first-child div:first-child': {
                transform: 'translate(0px, 0px) !important'
            }
        }
    }),
    reduxForm({
        form: 'ReturnFilterForm',
        enableReinitialize: true
    }),
    withHandlers({
        getCount: props => () => {
            const {filter} = props
            return _(RETURN_FILTER_KEY)
                .values()
                .filter(item => item !== RETURN_FILTER_KEY.FROM_DATE)
                .filter(item => filter.getParam(item))
                .value()
                .length
        }
    })
)

const ReturnFilterForm = enhance((props) => {
    const {classes, filterDialog, getCount, handleSubmit, hasMarket} = props
    const filterCounts = getCount()
    const divisionStatus = getConfig('DIVISIONS')

    if (!filterDialog.openFilterDialog) {
        if (filterCounts) {
            return (
                <div className={classes.afterFilter}>
                    <div>{t('Фильтр')}: {filterCounts} {t('элемента')}</div>
                    <div>
                        <IconButton onTouchTap={filterDialog.handleOpenFilterDialog}>
                            <BorderColorIcon color="#8f8f8f" />
                        </IconButton>
                        <IconButton onTouchTap={filterDialog.handleClearFilterDialog}>
                            <CloseIcon className={classes.icon}/>
                        </IconButton>
                    </div>
                </div>
            )
        }

        return (
            <div>
                <Link
                    className={classes.arrow}
                    onTouchTap={filterDialog.handleOpenFilterDialog}>
                    <div>{t('Показать фильтр')} <KeyboardArrowDown color="#12aaeb" /></div>
                </Link>
            </div>
        )
    }

    return (
        <div>
            <Paper className={classes.wrapper} zDepth={2}>
                <div className={classes.header}>
                    <span className={classes.title}>{t('Фильтр')}</span>
                    <IconButton onTouchTap={filterDialog.handleCloseFilterDialog}>
                        <CloseIcon className={classes.icon} />
                    </IconButton>
                </div>
                <form onSubmit={handleSubmit(filterDialog.handleSubmitFilterDialog)}>
                    <div>
                        <Field className={classes.inputFieldCustom} name="order" component={TextField} label={'№ ' + t('Заказа')}/>
                        <Field className={classes.inputFieldCustom} name="product" component={ProductMultiSearchField} label={t('Продукт')}/>
                        {divisionStatus && <Field className={classes.inputFieldCustom} name="division" component={DivisionMultiSearchField} label={t('Организация')}/>}
                        <Field className={classes.inputFieldCustom} name="paymentType" component={PaymentTypeSearchField} label={t('Тип оплаты')}/>
                        <Field className={classes.inputFieldCustom} name="status" component={ReturnStatusMultiSearch} label={t('Статус')}/>
                        <Field className={classes.inputFieldCustom} name="type" component={ReturnTypeSearchField} label={t('Тип')}/>
                        <Field className={classes.inputFieldCustom} name="client" component={ClientMultiSearchField} label={t('Клиент')}/>
                        {hasMarket && <Field className={classes.inputFieldCustom} name="market" component={MarketMultiSearchField} label={t('Магазин')}/>}
                        <Field className={classes.inputFieldCustom} name="initiator" component={UsersMultiSearchField} label={t('Инициатор')}/>
                        <Field className={classes.inputFieldCustom} name="code" component={TextField} label={t('Код')}/>
                        <Field className={classes.inputDateCustom} name="data" component={DateToDateField} label={t('Период создания')}/>
                        <Field name="exclude" component={CheckBox} label={t('Исключить отмененные заказы')}/>
                    </div>

                    <RaisedButton
                        type="submit"
                        primary={true}
                        labelStyle={{fontSize: '13px'}}
                        buttonStyle={{color: '#fff'}}
                        label={t('Применить')}
                        style={{marginTop: '15px'}}>
                    </RaisedButton>
                </form>
            </Paper>
        </div>
    )
})

ReturnFilterForm.propTypes = {
    filter: PropTypes.object.isRequired,
    filterDialog: PropTypes.shape({
        filterLoading: PropTypes.bool.isRequired,
        openFilterDialog: PropTypes.bool.isRequired,
        handleOpenFilterDialog: PropTypes.func.isRequired,
        handleCloseFilterDialog: PropTypes.func.isRequired,
        handleSubmitFilterDialog: PropTypes.func.isRequired
    })
}

export default ReturnFilterForm
