import React from 'react'
import {compose} from 'recompose'
import {reduxForm, Field} from 'redux-form'
import injectSheet from 'react-jss'
import Paper from 'material-ui/Paper'
import IconButton from 'material-ui/IconButton'
import {TextField} from '../ReduxForm'
import CloseIcon2 from '../CloseIcon2'
import Search from 'material-ui/svg-icons/action/search'
import PropTypes from 'prop-types'
import StockSearchField from '../ReduxForm/Stock/StockSearchField'
import ProductTypeSearchField from '../ReduxForm/Product/ProductTypeSearchField'
import RemainderStatusSearchField from '../ReduxForm/Remainder/RemainderStatusSearchField'
export const REMAINDER_FILTER_OPEN = 'openFilterDialog'

export const REMAINDER_FILTER_KEY = {
    PRODUCT_TYPE: 'productType',
    STOCK: 'stock',
    BIGGER_THAN: 'biggerThan',
    LESS_THAN: 'lessThan',
    DEFECTIVE: 'defective',
    OUT_DATED: 'outDated',
    CURRENT: 'current'
}

const enhance = compose(
    injectSheet({
        filters: {
            backgroundColor: '#fff !important',
            margin: '0 -28px'
        },
        filtersWrapper: {
            display: 'flex',
            padding: '10px 30px',
            alignItems: 'center',
            '& .row': {
                margin: '0rem !important'
            },
            '& > div': {
                width: '200px',
                marginRight: '20px'
            }
        },
        inputFieldCustom: {
            fontSize: '13px !important',
            height: '45px !important',
            width: '200px !important',
            marginTop: '7px',
            '& div': {
                fontSize: '13px !important'
            },
            '& label': {
                top: '20px !important',
                lineHeight: '5px !important',
                color: 'rgba(0, 0, 0, 0.5)!important'
            },
            '& input': {
                marginTop: '0 !important'
            }
        },
        filterForm: {
            display: 'flex',
            justifyContent: 'space-between'
        },
        clearBtn: {
            padding: '20px 30px',
            display: 'flex',
            alignItems: 'center',
            color: '#909090',
            '& button': {
                '& > div': {
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                }
            }

        }
    }),
    reduxForm({
        form: 'RemainderFilterForm',
        enableReinitialize: true
    }),
)

const iconSearchStyle = {
    icon: {
        color: '#333',
        width: 25,
        height: 25
    },
    button: {
        width: 40,
        height: 40,
        padding: 0
    }
}
const iconClearStyle = {
    icon: {
        color: '#909090',
        width: 20,
        height: 20
    },
    button: {
        width: 30,
        height: 30,
        padding: 0
    }
}

const RemainderFilterForm = enhance((props) => {
    const {classes, reset, onSubmit, handleSubmit} = props
    return (
        <Paper zDepth={1} className={classes.filters}>
            <form onSubmit={handleSubmit(onSubmit)} className={classes.filterForm}>
                <div className={classes.filtersWrapper}>
                    <Field
                        className={classes.inputFieldCustom}
                        name="stock"
                        component={StockSearchField}
                        label="Склад"/>
                    <Field
                        className={classes.inputFieldCustom}
                        name="type"
                        component={ProductTypeSearchField}
                        label="Тип товара"/>
                    <Field
                        className={classes.inputFieldCustom}
                        name="status"
                        component={RemainderStatusSearchField}
                        label="Статус"/>
                    <Field
                        className={classes.inputFieldCustom}
                        name="product"
                        component={TextField}
                        label="Товар"/>
                    <IconButton
                        iconStyle={iconSearchStyle.icon}
                        style={iconSearchStyle.button}
                        type="submit">
                        <Search/>
                    </IconButton>
                </div>
                <div className={classes.clearBtn} onClick={reset}>
                    <IconButton
                        iconStyle={iconClearStyle.icon}
                        style={iconClearStyle.button}>
                        <CloseIcon2/>
                    </IconButton>
                    <span style={{marginTop: '-4px'}}>очистить</span>
                </div>
            </form>
        </Paper>
    )
})

RemainderFilterForm.propTypes = {
    onSubmit: PropTypes.func.isRequired
}

export default RemainderFilterForm
