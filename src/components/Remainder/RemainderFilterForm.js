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
import Pagination from '../GridList/GridListNavPagination'
export const REMAINDER_FILTER_OPEN = 'openFilterDialog'

const enhance = compose(
    injectSheet({
        filters: {
            backgroundColor: '#fff !important',
            margin: '0 -28px'
        },
        filtersWrapper: {
            display: 'flex',
            paddingRight: '20px',
            alignItems: 'center',
            '& .row': {
                margin: '0rem !important'
            },
            '& > div': {
                marginRight: '20px'
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
                lineHeight: '5px !important',
                color: 'rgba(0, 0, 0, 0.5)!important'
            },
            '& input': {
                marginTop: '0 !important'
            }
        },
        filterForm: {
            display: 'flex',
            justifyContent: 'space-between',
            padding: '10px 30px'
        },
        clearBtn: {
            display: 'flex',
            alignItems: 'center',
            color: '#909090',
            paddingLeft: '20px',
            marginRight: '0!important',
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
        padding: 0,
        zIndex: 0
    }
}

const RemainderFilterForm = enhance((props) => {
    const {classes, resetFilter, onSubmit, handleSubmit, filter} = props
    return (
        <Paper zDepth={1} className={classes.filters}>
            <form onSubmit={handleSubmit(onSubmit)} className={classes.filterForm}>
                <div className={classes.filtersWrapper}>
                    <Field
                        className={classes.inputFieldCustom}
                        name="stock"
                        component={StockSearchField}
                        label="Склад"
                        fullWidth={true}/>
                    <Field
                        className={classes.inputFieldCustom}
                        name="type"
                        component={ProductTypeSearchField}
                        fullWidth={true}
                        label="Тип товара"/>
                    <Field
                        className={classes.inputFieldCustom}
                        name="status"
                        fullWidth={true}
                        component={RemainderStatusSearchField}
                        label="Статус"/>
                    <Field
                        className={classes.inputFieldCustom}
                        name="product"
                        fullWidth={true}
                        component={TextField}
                        label="Товар"/>
                    <IconButton
                        iconStyle={iconSearchStyle.icon}
                        style={iconSearchStyle.button}
                        type="submit">
                        <Search/>
                    </IconButton>
                    <div className={classes.clearBtn}>
                        <IconButton
                            iconStyle={iconClearStyle.icon}
                            style={iconClearStyle.button}
                            onTouchTap={resetFilter}>
                            <CloseIcon2/>
                        </IconButton>
                        <div style={{marginTop: '-4px', cursor: 'pointer'}} onClick={resetFilter}>очистить</div>
                    </div>
                </div>
                <Pagination filter={filter}/>
            </form>
        </Paper>
    )
})

RemainderFilterForm.propTypes = {
    onSubmit: PropTypes.func.isRequired
}

export default RemainderFilterForm
