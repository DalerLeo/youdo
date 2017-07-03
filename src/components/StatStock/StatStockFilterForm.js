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
import DateToDateField from '../ReduxForm/Basic/DateToDateField'
import ExportExel from '../Images/excel.png'
import CloseIcon from '../CloseIcon'
import KeyboardArrowDown from 'material-ui/svg-icons/hardware/keyboard-arrow-down'
import {BrandSearchField, ProductTypeSearchField} from '../../components/ReduxForm'

export const STATSTOCK_FILTER_OPEN = 'openFilterDialog'

export const STATSTOCK_FILTER_KEY = {
    TYPE: 'type',
    BRAND: 'brand',
    FROM_DATE: 'from_date',
    TO_DATE: 'to_date'
}
const TWO = 2
const enhance = compose(
    injectSheet({
        wrapper: {
            position: 'absolute',
            minWidth: '300px',
            background: '#fff',
            zIndex: 99,
            top: 0,
            left: 0,
            borderRadius: 0,
            padding: '10px 20px 10px 20px'
        },
        afterFilter: {
            width: '268px',
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
        }
    }),
    reduxForm({
        form: 'StatStockFilterForm',
        enableReinitialize: true
    }),
    withHandlers({
        getCount: props => () => {
            const {filter} = props
            return _(STATSTOCK_FILTER_KEY)
                .values()
                .filter(item => item !== STATSTOCK_FILTER_KEY.FROM_DATE)
                .filter(item => filter.getParam(item))
                .value()
                .length
        }
    })
)

const StatStockFilterForm = enhance((props) => {
    const {classes, filterDialog, getCount, isBalance, getDocument} = props
    const filterCounts = getCount()

    if (!filterDialog.openFilterDialog) {
        if (filterCounts) {
            return (
                <div className={classes.afterFilter}>
                    <div>Фильтр: {filterCounts} элемента</div>
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
                <div
                    style={{position: 'absolute', top: '15px', right: '260px'}}
                    onTouchTap = {getDocument.handleGetDocument}>
                    <a><img src={ExportExel} style={{width: '24px'}} /></a>
                </div>
                <Link
                    className={classes.arrow}
                    onTouchTap={filterDialog.handleOpenFilterDialog}>
                    <div>Показать фильтр <KeyboardArrowDown color="#12aaeb" /></div>
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
                <form onSubmit={filterDialog.handleSubmitFilterDialog}>
                    {isBalance === TWO && <div>
                        <Field className={classes.inputField} name="date" component={DateToDateField} label="Диапазон дат" fullWidth={true}/>
                    </div>}
                    <div>
                        <Field className={classes.inputField} name="brand" component={BrandSearchField} label="Бренд" fullWidth={true}/>
                    </div>
                    <div>
                        <Field className={classes.inputField} name="type" component={ProductTypeSearchField} label="Тип продукта" fullWidth={true}/>
                    </div>
                    <RaisedButton
                        type="submit"
                        primary={true}
                        buttonStyle={{color: '#fff'}}
                        label="Применить"
                        style={{marginTop: '15px'}}>
                    </RaisedButton>
                </form>
            </Paper>
        </div>
    )
})

StatStockFilterForm.propTypes = {
    filter: PropTypes.object.isRequired,
    filterDialog: PropTypes.shape({
        filterLoading: PropTypes.bool.isRequired,
        openFilterDialog: PropTypes.bool.isRequired,
        handleOpenFilterDialog: PropTypes.func.isRequired,
        handleCloseFilterDialog: PropTypes.func.isRequired,
        handleSubmitFilterDialog: PropTypes.func.isRequired
    })
}
StatStockFilterForm.defaultDate = {
    isBalance: false
}

export default StatStockFilterForm
