import PropTypes from 'prop-types'
import React from 'react'
import {compose} from 'recompose'
import injectSheet from 'react-jss'
import {reduxForm, Field} from 'redux-form'
import {TextField, DivisionSearchField} from '../../ReduxForm/index'
import ProductTypeSearchField from '../../ReduxForm/Product/ProductTypeSearchField'
import DateToDateField from '../../ReduxForm/Basic/DateToDateField'
import Search from 'material-ui/svg-icons/action/search'
import IconButton from 'material-ui/IconButton'
import Excel from 'material-ui/svg-icons/av/equalizer'

export const STAT_PRODUCT_FILTER_KEY = {
    SEARCH: 'search',
    PRODUCT: 'product',
    DIVISION: 'division',
    PRODUCT_TYPE: 'productType',
    TO_DATE: 'toDate',
    FROM_DATE: 'fromDate'
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
        form: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
        },
        filter: {
            display: 'flex',
            alignItems: 'center',
            '& > div': {
                width: '100% !important',
                position: 'relative',
                marginRight: '40px',
                '&:after': {
                    content: '""',
                    position: 'absolute',
                    right: '-20px',
                    height: '30px',
                    width: '1px',
                    top: '50%',
                    marginTop: '-15px',
                    background: '#efefef'
                },
                '&:last-child': {
                    '&:after': {
                        content: '""',
                        background: 'none'
                    }
                }
            }
        },
        searchButton: {
            marginLeft: '-10px !important',
            marginRight: '10px !important',
            '& div': {
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }
        }
    }),
    reduxForm({
        form: 'StatProductFilterForm',
        enableReinitialize: true
    }),
)

const StatProductFilterForm = enhance((props) => {
    const {
        classes,
        handleSubmitFilterDialog,
        getDocument
    } = props

    const iconStyle = {
        icon: {
            color: '#5d6474',
            width: 22,
            height: 22
        },
        button: {
            width: 40,
            height: 40,
            padding: 0
        }
    }

    return (
        <form className={classes.form} onSubmit={handleSubmitFilterDialog}>
            <div className={classes.filter}>
                <Field
                    className={classes.inputFieldCustom}
                    name="date"
                    component={DateToDateField}
                    label="Диапазон дат"
                    fullWidth={true}/>
                <Field
                    className={classes.inputFieldCustom}
                    name="productType"
                    component={ProductTypeSearchField}
                    label="Тип товара"
                    fullWidth={true}/>
                <Field
                    name="division"
                    component={DivisionSearchField}
                    className={classes.inputFieldCustom}
                    label="Подразделение"
                    fullWidth={true}/>
                <Field
                    className={classes.inputFieldCustom}
                    name="search"
                    component={TextField}
                    label="Поиск"
                    fullWidth={true}/>
                <IconButton
                    className={classes.searchButton}
                    iconStyle={iconStyle.icon}
                    style={iconStyle.button}
                    type="submit">
                    <Search/>
                </IconButton>
            </div>
            <a className={classes.excel}
               onClick={getDocument.handleGetDocument}>
                <Excel color="#fff"/> <span>Excel</span>
            </a>
        </form>
    )
})

StatProductFilterForm.propTypes = {
    onSubmit: PropTypes.func.isRequired,
    getDocument: PropTypes.object.isRequired
}

export default StatProductFilterForm
