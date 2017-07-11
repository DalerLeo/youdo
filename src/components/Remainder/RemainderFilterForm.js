import React from 'react'
import {compose} from 'recompose'
import {reduxForm, Field} from 'redux-form'
import injectSheet from 'react-jss'
import Paper from 'material-ui/Paper'
import IconButton from 'material-ui/IconButton'
import TextField from 'material-ui/TextField'
import SearchIcon from 'material-ui/svg-icons/action/search'
import CloseIcon2 from '../CloseIcon2'
import StockSearchField from '../ReduxForm/Stock/StockSearchField'
import ProductTypeSearchField from '../ReduxForm/Product/ProductTypeSearchField'
import DateField from '../ReduxForm/RemainderDateField'
import CheckBox from '../ReduxForm/Basic/CheckBox'
import {RaisedButton} from 'material-ui'
import PropTypes from 'prop-types'

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
        filterWrapper: {
            width: '330px',
            zIndex: '99',
            position: 'absolute',
            right: '-28px',
            top: '0',
            bottom: '-28px'
        },
        filterBtnWrapper: {
            position: 'absolute',
            top: '15px',
            right: '0',
            marginBottom: '0px'
        },
        filterBtn: {
            backgroundColor: '#12aaeb !important',
            color: '#fff',
            fontWeight: '600',
            padding: '7px 7px',
            borderRadius: '3px',
            lineHeight: '12px'
        },
        filterTitle: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '0 30px',
            borderBottom: '1px #efefef solid',
            lineHeight: '60px',
            fontWeight: '600',
            position: 'relative'
        },
        search: {
            position: 'relative',
            display: 'flex',
            maxWidth: '300px'
        },
        searchField: {
            fontSize: '13px !important'
        },
        searchButton: {
            position: 'absolute !important',
            right: '-10px'
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
        subTitle: {
            fontWeight: '600',
            padding: '15px 0 10px 0'
        },
        dateLabel: {
            display: 'flex',
            justifyContent: 'space-between',
            height: '40px',
            marginTop: '10px',
            '&:first-child': {
                margin: '0'
            },
            alignItems: 'baseline'
        },
        submitBtn: {
            '& button': {
                backgroundColor: '#61a7e7!important',
                height: '32px!important',
                lineHeight: '32px!important',
                '& div': {
                    '& div': {
                        padding: '0 10px'
                    }
                }
            }
        },
        inputDateCustom: {
            '& input': {
                width: '140px'
            }
        },
        closeIcon: {
            position: 'absolute !important',
            right: '20px'
        }
    }),
    reduxForm({
        form: 'RemainderFilterForm',
        enableReinitialize: true
    }),
)
const iconStyle = {
    icon: {
        color: '#666',
        width: 20,
        height: 20
    },
    button: {
        width: 46,
        height: 46,
        padding: 0
    }
}

const RemainderFilterForm = enhance((props) => {
    const {classes, onClose} = props
    return (
        <div className={classes.filterWrapper}>
            <Paper zDepth={1} style={{height: '100%'}}>
                <div className={classes.filterTitle}>
                    <div>Фильтры</div>
                    <IconButton
                        iconStyle={iconStyle.icon}
                        style={iconStyle.button}
                        touch={true}
                        className={classes.closeIcon}
                        onTouchTap={onClose}>
                        <CloseIcon2 color="#666666"/>
                    </IconButton>
                </div>
                <form style={{padding: '0 30px'}}>
                    <div className={classes.search}>
                        <TextField
                            fullWidth={true}
                            hintText="Поиск товара"
                            className={classes.searchField}

                        />
                        <IconButton
                            iconStyle={{color: '#ccc'}}
                            className={classes.searchButton}>
                            <SearchIcon />
                        </IconButton>
                    </div>
                    <div>
                        <Field
                            className={classes.inputFieldCustom}
                            name="stock"
                            component={StockSearchField}
                            label="Укажите нужный склад"
                            fullWidth={true}/>
                        <Field
                            className={classes.inputFieldCustom}
                            name="productType"
                            component={ProductTypeSearchField}
                            label="Выберите тип товара"
                            fullWidth={true}/>
                        <div className={classes.subTitle}>Статус товаров</div>
                        <Field
                            name="current"
                            component={CheckBox}
                            label="Действующие товары"/>
                        <Field
                            name="defective"
                            component={CheckBox}
                            label="Бракованные товары"/>
                        <Field
                            name="outDated"
                            component={CheckBox}
                            label="Просроченные товары"/>
                        <div className={classes.subTitle}>Фильтр по сроку годности</div>
                        <div className={classes.dateLabel} style={{margin: '0'}}>
                            <div>Больше чем:</div>
                            <Field
                                name="biggerThan"
                                component={DateField}
                                fullWidth={true}/>
                        </div>
                        <div className={classes.dateLabel}>
                            <div>Меньше чем:</div>
                            <Field
                                name="lessThan"
                                component={DateField}
                                fullWidth={true}/>
                        </div>
                    </div>
                    <div style={{textAlign: 'center', paddingTop: '20px'}}>
                        <RaisedButton
                            className={classes.submitBtn}
                            type="submit"
                            primary={true}
                            buttonStyle={{color: '#fff'}}>
                            Применить фильтр
                        </RaisedButton>
                    </div>
                </form>
            </Paper>
        </div>
    )
})

RemainderFilterForm.propTypes = {
    onClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired
}

export default RemainderFilterForm
