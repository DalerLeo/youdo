import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import {compose, withHandlers} from 'recompose'
import {reduxForm, Field} from 'redux-form'
import injectSheet from 'react-jss'
import {Link} from 'react-router'
import Paper from 'material-ui/Paper'
import IconButton from 'material-ui/IconButton'
import RaisedButton from 'material-ui/RaisedButton'
import BorderColorIcon from 'material-ui/svg-icons/editor/border-color'
import DateToDateField from '../ReduxForm/Basic/DateToDateField'
import {
    ClientMultiSearchField,
    MarketMultiSearchField,
    UsersAgentMultiSearchField,
    DeptSearchField,
    ZoneMultiSearchField,
    DivisionMultiSearchField,
    ProductMultiSearchField,
    CheckBox,
    DeliveryManMultiSearchField,
    OrderStatusMultiSearchField
} from '../ReduxForm'
import CloseIcon from 'material-ui/svg-icons/action/highlight-off'
import KeyboardArrowDown from 'material-ui/svg-icons/hardware/keyboard-arrow-down'
import getConfig from '../../helpers/getConfig'
import t from '../../helpers/translate'

export const ORDER_FILTER_OPEN = 'openFilterDialog'

export const ORDER_FILTER_KEY = {
    CLIENT: 'client',
    STATUS: 'status',
    PRODUCT: 'product',
    INITIATOR: 'initiator',
    SHOP: 'shop',
    DIVISION: 'division',
    DEPT: 'dept',
    FROM_DATE: 'fromDate',
    TO_DATE: 'toDate',
    DELIVERY_FROM_DATE: 'deliveryFromDate',
    DELIVERY_TO_DATE: 'deliveryToDate',
    DEADLINE_FROM_DATE: 'deadlineFromDate',
    DEADLINE_TO_DATE: 'deadlineToDate',
    ZONE: 'zone',
    ONLY_BONUS: 'onlyBonus',
    EXCLUDE: 'exclude',
    DELIVERY_MAN: 'deliveryMan'
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
        form: 'OrderFilterForm',
        enableReinitialize: true
    }),
    withHandlers({
        getCount: props => () => {
            const {filter} = props
            return _(ORDER_FILTER_KEY)
                .values()
                .filter(item => item !== ORDER_FILTER_KEY.FROM_DATE)
                .filter(item => filter.getParam(item))
                .value()
                .length
        }
    })
)

const OrderFilterForm = enhance((props) => {
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
                        <Field className={classes.inputFieldCustom} name="client" component={ClientMultiSearchField} label={t('Клиент')}/>
                        <Field className={classes.inputFieldCustom} name="deliveryMan" component={DeliveryManMultiSearchField} label={t('Доставщик')}/>
                        <Field className={classes.inputFieldCustom} name="product" component={ProductMultiSearchField} label={t('Товар')}/>
                        <Field className={classes.inputFieldCustom} name="status" component={OrderStatusMultiSearchField} label={t('Статус')}/>
                        {hasMarket && <Field className={classes.inputFieldCustom} name="shop" component={MarketMultiSearchField} label={t('Магазин')}/>}
                        {divisionStatus && <Field className={classes.inputFieldCustom} name="division" component={DivisionMultiSearchField} label={t('Организация')}/>}
                        <Field className={classes.inputFieldCustom} name="initiator" component={UsersAgentMultiSearchField} label={t('Инициатор')}/>
                        <Field className={classes.inputFieldCustom} name="dept" component={DeptSearchField} label={t('Статус оплаты')}/>
                        <Field className={classes.inputFieldCustom} name="zone" component={ZoneMultiSearchField} label={t('Зона')}/>
                        <Field className={classes.inputDateCustom} name="data" component={DateToDateField} label={t('Период создания')}/>
                        <Field className={classes.inputDateCustom} name="deliveryDate" component={DateToDateField} label={t('Дата доставки')}/>
                        <Field className={classes.inputDateCustom} name="deadlineDate" component={DateToDateField} label={t('Период изготовления')}/>
                        <Field name="onlyBonus" component={CheckBox} label={t('Только бонусные заказы')}/>
                        <Field name="exclude" component={CheckBox} label={t('Исключить отмененные заказы')}/>
                    </div>

                    <RaisedButton
                        type="submit"
                        primary={true}
                        buttonStyle={{color: '#fff'}}
                        labelStyle={{fontSize: '13px'}}
                        label="Применить"
                        style={{marginTop: '15px'}}>
                    </RaisedButton>
                </form>
            </Paper>
        </div>
    )
})

OrderFilterForm.propTypes = {
    filter: PropTypes.object.isRequired,
    filterDialog: PropTypes.shape({
        filterLoading: PropTypes.bool.isRequired,
        openFilterDialog: PropTypes.bool.isRequired,
        handleOpenFilterDialog: PropTypes.func.isRequired,
        handleCloseFilterDialog: PropTypes.func.isRequired,
        handleSubmitFilterDialog: PropTypes.func.isRequired
    })
}

export default OrderFilterForm
