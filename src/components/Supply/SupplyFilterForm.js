import _ from 'lodash'
import React from 'react'
import {compose, withHandlers} from 'recompose'
import {reduxForm, Field} from 'redux-form'
import PropTypes from 'prop-types'
import injectSheet from 'react-jss'
import {Link} from 'react-router'
import Paper from 'material-ui/Paper'
import IconButton from 'material-ui/IconButton'
import RaisedButton from 'material-ui/RaisedButton'
import BorderColorIcon from 'material-ui/svg-icons/editor/border-color'
import KeyboardArrowDown from 'material-ui/svg-icons/hardware/keyboard-arrow-down'
import {
    ProviderMultiSearchField,
    StockMultiSearchField,
    ProductMultiSearchField,
    TextField,
    SupplyTypeMultiSearchField,
    PaymentTypeSearchField,
    DivisionMultiSearchField,
    CheckBox
} from '../ReduxForm'
import CloseIcon from 'material-ui/svg-icons/action/highlight-off'
import DateToDateField from '../ReduxForm/Basic/DateToDateField'
import t from '../../helpers/translate'

export const SUPPLY_FILTER_OPEN = 'openFilterDialog'

export const SUPPLY_FILTER_KEY = {
    PROVIDER: 'provider',
    PRODUCT: 'product',
    STOCK: 'stock',
    DIVISION: 'division',
    CONTRACT: 'contract',
    STATUS: 'status',
    PAYMENT_TYPE: 'paymentType',
    DELIVERY_FROM_DATE: 'deliveryFromDate',
    DELIVERY_TO_DATE: 'deliveryToDate',
    CREATED_FROM_DATE: 'createdFromDate',
    CREATED_TO_DATE: 'createdToDate',
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
        }
    }),
    reduxForm({
        form: 'SupplyFilterForm',
        enableReinitialize: true
    }),
    withHandlers({
        getCount: props => () => {
            const {filter} = props
            return _(SUPPLY_FILTER_KEY)
                .values()
                .filter(item => item !== SUPPLY_FILTER_KEY.FROM_DATE)
                .filter(item => filter.getParam(item))
                .value()
                .length
        }
    })
)

const SupplyFilterForm = enhance((props) => {
    const {classes, filterDialog, getCount, handleSubmit} = props
    const filterCounts = getCount()

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
                    <span className={classes.title}>Фильтр</span>
                    <IconButton onTouchTap={filterDialog.handleCloseFilterDialog}>
                        <CloseIcon className={classes.icon} />
                    </IconButton>
                </div>
                <form onSubmit={handleSubmit(filterDialog.handleSubmitFilterDialog)}>
                    <div>
                        <Field className={classes.inputFieldCustom} name="provider" component={ProviderMultiSearchField} label={t('Поставщик')}/>
                        <Field className={classes.inputFieldCustom} name="stock" component={StockMultiSearchField} label={t('Склад')}/>
                        <Field className={classes.inputFieldCustom} name="product" component={ProductMultiSearchField} label={t('Товар')}/>
                        <Field className={classes.inputFieldCustom} name="division" component={DivisionMultiSearchField} label={t('Организация')}/>
                        <Field className={classes.inputFieldCustom} name="paymentType" component={PaymentTypeSearchField} label={t('Тип оплаты')}/>
                        <Field className={classes.inputFieldCustom} name="status" component={SupplyTypeMultiSearchField} label={t('Тип')}/>
                        <Field className={classes.inputFieldCustom} name="contract" component={TextField} label={t('Номер договора')}/>
                    </div>
                    <div>
                        <Field className={classes.inputFieldCustom} name="dateDelivery" component={DateToDateField} label={t('Дата поставки')} fullWidth={true}/>
                    </div>
                    <div>
                        <Field className={classes.inputFieldCustom} name="dateCreated" component={DateToDateField} label={t('Дата создания')} fullWidth={true}/>
                    </div>
                    <Field name="exclude" component={CheckBox} label={t('Исключить отмененные поставки')}/>
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

SupplyFilterForm.propTypes = {
    filter: PropTypes.object.isRequired,
    filterDialog: PropTypes.shape({
        filterLoading: PropTypes.bool.isRequired,
        openFilterDialog: PropTypes.bool.isRequired,
        handleOpenFilterDialog: PropTypes.func.isRequired,
        handleCloseFilterDialog: PropTypes.func.isRequired,
        handleSubmitFilterDialog: PropTypes.func.isRequired
    })
}

export default SupplyFilterForm
