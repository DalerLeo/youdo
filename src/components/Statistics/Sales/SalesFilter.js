import _ from 'lodash'
import PropTypes from 'prop-types'
import React from 'react'
import injectSheet from 'react-jss'
import {compose, withState} from 'recompose'
import {reduxForm, Field} from 'redux-form'
import DateToDateField from '../../ReduxForm/Basic/DateToDateField'
import {
    ClientSearchField,
    MarketSearchField,
    UsersSearchField,
    DeptSearchField,
    ZoneSearchField,
    DivisionSearchField,
    CheckBox
} from '../../ReduxForm'
import OrderStatusSearchField from '../../ReduxForm/Order/OrderStatusSearchField'
import Excel from 'material-ui/svg-icons/av/equalizer'
import Filter from 'material-ui/svg-icons/content/filter-list'
import Close from 'material-ui/svg-icons/action/highlight-off'
import IconButton from 'material-ui/IconButton'
import FlatButton from 'material-ui/FlatButton'
import Paper from 'material-ui/Paper'
import moment from 'moment'

const ZERO = 0
export const STAT_SALES_FILTER_KEY = {
    CLIENT: 'client',
    STATUS: 'status',
    INITIATOR: 'initiator',
    SHOP: 'shop',
    DIVISION: 'division',
    DEPT: 'dept',
    FROM_DATE: 'fromDate',
    TO_DATE: 'toDate',
    DELIVERY_FROM_DATE: 'deliveryFromDate',
    DELIVERY_TO_DATE: 'deliveryToDate',
    ZONE: 'zone',
    ONLY_BONUS: 'onlyBonus',
    EXCLUDE: 'exclude'
}

const enhance = compose(
    injectSheet({
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
        filterWrapper: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            position: 'relative'
        },
        form: {
            position: 'absolute',
            left: '0',
            top: '0',
            width: '300px',
            background: '#fff',
            zIndex: '10'
        },
        filter: {
            display: 'flex',
            width: '100%',
            padding: '20px 30px',
            flexDirection: 'column',
            position: 'relative',
            '& h3': {
                fontSize: '14px',
                fontWeight: '600',
                marginBottom: '20px'
            }
        },
        closeFilter: {
            position: 'absolute !important',
            top: 10,
            right: 10
        },
        searchButton: {
            '& div': {
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }
        },
        excel: {
            background: '#71ce87',
            borderRadius: '2px',
            color: '#fff',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            padding: '5px 15px',
            '& svg': {
                width: '18px !important'
            }
        },
        filterBtn: {
            extend: 'excel',
            background: '#12aaeb',
            position: 'relative'
        },
        count: {
            extend: 'excel',
            padding: '0 10px',
            justifyContent: 'center',
            position: 'absolute',
            left: '100%',
            marginLeft: '2px',
            height: '100%',
            width: '28px'
        },
        date: {
            extend: 'count',
            background: '#fff',
            color: '#71ce87',
            border: '2px #71ce87 solid',
            cursor: 'auto',
            whiteSpace: 'nowrap',
            width: 'auto'
        }
    }),
    reduxForm({
        form: 'StatSalesFilterForm',
        enableReinitialize: true
    }),
    withState('openFilter', 'setOpenFilter', false)
)

const ClientIncomeFilter = enhance((props) => {
    const {
        filter,
        classes,
        handleSubmit,
        handleSubmitFilterDialog,
        openFilter,
        setOpenFilter,
        handleGetDocument
    } = props

    const iconStyle = {
        button: {
            width: 44,
            height: 44,
            padding: 11
        },
        icon: {
            width: 22,
            height: 22,
            color: '#666'
        }
    }
    const getFilterCount = () => {
        return _(STAT_SALES_FILTER_KEY)
            .values()
            .filter(item => item !== STAT_SALES_FILTER_KEY.FROM_DATE)
            .filter(item => filter.getParam(item))
            .value()
            .length
    }
    const filterCount = getFilterCount()
    const filterDate = !_.isNil(_.get(filter.getParams(), 'fromDate') || _.get(filter.getParams(), 'fromDate'))
        ? moment(_.get(filter.getParams(), 'fromDate')).format('DD.MM.YYYY') + ' - ' + moment(_.get(filter.getParams(), 'toDate')).format('DD.MM.YYYY')
        : moment(_.get(props, ['initialValues', 'date', 'fromDate'])).format('DD.MM.YYYY') + ' - ' + moment(_.get(props, ['initialValues', 'date', 'toDate'])).format('DD.MM.YYYY')
    return (
        <div className={classes.filterWrapper}>
            {openFilter && <Paper zDepth={2} className={classes.form}>
                <form onSubmit={handleSubmit(handleSubmitFilterDialog)}>
                    <div className={classes.filter}>
                        <h3>Фильтр</h3>
                        <IconButton
                            className={classes.closeFilter}
                            style={iconStyle.button}
                            iconStyle={iconStyle.icon}
                            onTouchTap={() => { setOpenFilter(false) }}>
                            <Close />
                        </IconButton>
                        <Field name="date" className={classes.inputDateCustom} component={DateToDateField} fullWidth={true} label="Диапазон дат"/>
                        <Field name="client" className={classes.inputFieldCustom} component={ClientSearchField} fullWidth={true} label="Клиент"/>
                        <Field name="status" className={classes.inputFieldCustom} component={OrderStatusSearchField} fullWidth={true} label="Статус"/>
                        <Field name="shop" className={classes.inputFieldCustom} component={MarketSearchField} fullWidth={true} label="Магазин"/>
                        <Field name="division" className={classes.inputFieldCustom} component={DivisionSearchField} fullWidth={true} label="Подразделение"/>
                        <Field name="initiator" className={classes.inputFieldCustom} component={UsersSearchField} fullWidth={true} label="Инициатор "/>
                        <Field name="dept" className={classes.inputFieldCustom} component={DeptSearchField} fullWidth={true} label="Оплаченный "/>
                        <Field name="zone" className={classes.inputFieldCustom} component={ZoneSearchField} fullWidth={true} label="Зона"/>
                        <Field name="deliveryDate" className={classes.inputDateCustom} component={DateToDateField} fullWidth={true} label="Дата доставки"/>
                        <Field name="onlyBonus" component={CheckBox} label="Только бонусные заказы"/>
                        <Field name="exclude" component={CheckBox} label="Исключить отмененные заказы"/>

                        <FlatButton
                            label="Применить"
                            fullWidth={false}
                            labelStyle={{color: '#12aaeb', textTransform: 'none', fontWeight: '600'}}
                            className={classes.searchButton}
                            type="submit" />
                    </div>
                </form>
            </Paper>}
            <a className={classes.filterBtn} onClick={() => { setOpenFilter(true) }}>
                <Filter color="#fff"/> <span>Фильтр</span>
                {filterCount > ZERO && <span className={classes.count}>{filterCount}</span>}
                <span className={classes.date} style={filterCount > ZERO ? {left: 'calc(100% + 30px)'} : {left: '100%'}}>{filterDate}</span>
            </a>
            <a className={classes.excel} onClick={handleGetDocument}>
                <Excel color="#fff"/> <span>Excel</span>
            </a>
        </div>
    )
})

ClientIncomeFilter.propTypes = {
    filter: PropTypes.object.isRequired,
    handleSubmitFilterDialog: PropTypes.func.isRequired,
    handleGetDocument: PropTypes.func.isRequired
}

export default ClientIncomeFilter
