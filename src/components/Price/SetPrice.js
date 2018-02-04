import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import {compose, withState, withHandlers} from 'recompose'
import injectSheet from 'react-jss'
import {Field, reduxForm} from 'redux-form'
import {hashHistory} from 'react-router'
import Loader from '../Loader'
import IconButton from 'material-ui/IconButton'
import FlatButton from 'material-ui/FlatButton'
import CloseIcon from 'material-ui/svg-icons/navigation/close'
import TextFieldSearch from 'material-ui/TextField'
import Paper from 'material-ui/Paper'
import SearchIcon from 'material-ui/svg-icons/action/search'
import NotFound from '../Images/not-found.png'
import numberWithoutSpaces from '../../helpers/numberWithoutSpaces'
import {connect} from 'react-redux'
import {
    TextField,
    ProductTypeSearchField,
    CurrencySearchField,
    normalizeNumber
} from '../ReduxForm'
import t from '../../helpers/translate'

const ZERO = 0
const TWO = 2
const enhance = compose(
    injectSheet({
        loader: {
            position: 'absolute',
            background: '#fff',
            alignItems: 'center',
            zIndex: '999',
            textAlign: 'center',
            justifyContent: 'center',
            display: 'flex',
            top: '0',
            left: '0',
            right: '0',
            bottom: '0'
        },
        confirm: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'absolute',
            background: 'rgba(0,0,0, 0.3)',
            width: '100%',
            height: '100%',
            zIndex: '2100'
        },
        confirmContent: {
            width: '500px',
            '& > header': {
                padding: '24px 30px'
            }
        },
        fields: {
            padding: '0 30px'
        },
        buttons: {
            textAlign: 'right',
            padding: '8px'
        },
        popUp: {
            display: 'flex',
            flexDirection: 'column',
            background: '#fff',
            overflow: 'unset',
            fontSize: '13px',
            position: 'fixed',
            padding: '0',
            height: '100%',
            top: '0',
            left: '0',
            right: '0',
            bottom: '0',
            zIndex: '2000'
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
            minHeight: '60px',
            zIndex: '999',
            '& button': {
                right: '13px',
                padding: '0 !important',
                position: 'absolute !important'
            }
        },
        bodyContent: {
            color: '#333',
            width: '100%',
            height: '100%'
        },
        form: {
            position: 'relative',
            display: 'flex',
            flexDirection: 'column'
        },
        inContent: {
            color: '#333',
            height: 'calc(100vh - 120px)',
            position: 'relative',
            '& header': {
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderBottom: '1px #efefef solid',
                height: '56px',
                padding: '0 30px',
                position: 'relative'
            }
        },
        field: {
            width: '100%'
        },
        search: {
            position: 'absolute',
            display: 'flex',
            alignItems: 'center',
            border: '1px #d9e0e5 solid',
            borderRadius: '2px',
            background: '#f2f5f8',
            width: '280px',
            left: 'calc(50% - 140px)',
            '& > div': {
                height: '40px !important',
                padding: '0 35px 0 10px'
            }
        },
        searchField: {
            fontSize: '13px !important',
            width: '100%',
            '& > div:first-child': {
                bottom: '8px !important'
            },
            '& hr': {
                display: 'none'
            }
        },
        searchButton: {
            position: 'absolute !important',
            alignItems: 'center',
            justifyContent: 'center',
            right: '0'
        },
        productsList: {
            padding: '0 30px',
            height: 'calc(100% - 56px)',
            overflowY: 'auto',
            '& .dottedList': {
                margin: '0 -30px',
                padding: '15px 30px',
                height: '50px',
                borderBottom: '1px #f2f5f8 solid',
                transition: 'all 150ms ease',
                '&:first-child': {
                    fontWeight: '600',
                    borderBottom: '1px #efefef solid',
                    '&:hover': {
                        background: 'transparent'
                    }
                },
                '&:last-child': {
                    borderBottom: 'none'
                },
                '&:hover': {
                    background: '#f2f5f8'
                },
                '&:after': {
                    display: 'none'
                },
                '& > div': {
                    '&:first-child': {
                        paddingLeft: '0'
                    },
                    '&:last-child': {
                        paddingRight: '0'
                    }
                }
            }
        },
        flex: {
            display: 'flex',
            alignItems: 'baseline',
            justifyContent: 'flex-end',
            '& > div': {
                marginRight: '10px'
            },
            '& > span': {
                whiteSpace: 'nowrap'
            }
        },
        rightAlign: {
            textAlign: 'right'
        },
        bottomButton: {
            height: '60px',
            padding: '10px',
            zIndex: '999',
            borderTop: '1px solid #efefef',
            background: '#fff',
            textAlign: 'right',
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
        inputFieldCustom: {
            fontSize: '13px !important',
            height: '20px !important',
            // marginTop: '7px',
            marginLeft: '5px',
            width: '30px !important',
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
        loadMore: {
            display: 'block',
            fontWeight: '600',
            textAlign: 'center',
            margin: '10px 0',
            '&:hover': {
                textDecoration: 'underline'
            }
        },
        linearProgress: {
            position: 'absolute',
            bottom: '0',
            left: '0',
            right: '0',
            height: '3px',
            '& > div': {
                background: 'transparent',
                height: '3px'
            }
        },
        emptyQuery: {
            background: 'url(' + NotFound + ') no-repeat center center',
            backgroundSize: '175px',
            padding: '350px 0 180px',
            textAlign: 'center',
            fontSize: '13px',
            color: '#666'
        },
        marginRightField: {
            marginRight: '10px'
        },

        leftTable: {
            color: '#666',
            fontWeight: '600',
            zIndex: '4',
            width: '350px',
            boxShadow: '5px 0 8px -3px #ccc',
            '& > div': {
                '&:hover': {
                    '& > div': {
                        opacity: '1'
                    }
                },
                position: 'relative',
                '&:nth-child(odd)': {
                    backgroundColor: '#f9f9f9'
                },
                height: '40px',
                '&:nth-child(2)': {
                    height: '39px'
                },
                '&:first-child': {
                    backgroundColor: 'white',
                    height: '41px',
                    borderTop: '1px #efefef solid',
                    borderBottom: '1px #efefef solid'
                },
                '& span': {
                    lineHeight: '40px',
                    paddingLeft: '30px'
                }
            }
        },
        mainTableWrapper: {
            overflowX: 'auto',
            overflowY: 'hidden'
        },
        mainTable: {
            width: '100%',
            minWidth: '850px',
            color: '#666',
            borderCollapse: 'collapse',
            '& tr, td': {
                height: '40px'
            },
            '& td': {
                padding: '0 20px',
                minWidth: '200px'
            },
            '& tr > td:last-child': {
                borderRight: 'none'
            }
        },
        tableWrapper: {
            display: 'flex',
            overflow: 'hidden',
            marginLeft: '-30px',
            'padding-left': ({stat}) => stat ? '0' : '30px',
            'margin-right': ({stat}) => stat ? '-30px' : 'unset'
        },
        tableWrapperLoading: {
            display: 'block',
            overflow: 'hidden',
            marginLeft: '-30px',
            'padding-left': ({stat}) => stat ? '0' : '30px',
            'margin-right': ({stat}) => stat ? '-30px' : 'unset'
        },
        tableRow: {
            '& td': {
                borderRight: '1px #efefef solid',
                textAlign: 'left',
                '&:first-child': {
                    width: '200px !important'
                }
            },
            '&:nth-child(odd)': {
                backgroundColor: '#f9f9f9'
            }
        },
    }),
    reduxForm({
        form: 'SetPricesForm',
        enableReinitialize: true
    }),
    withState('pdSearch', 'setSearch', ({filter}) => filter.getParam('pdSearch')),
    withState('defaultPage', 'updateDefaultPage', TWO),
    withState('openOverallDialog', 'setOpenOverallDialog', false),
    withHandlers({
        onSubmitSearch: props => () => {
            const {pdSearch, filter} = props
            hashHistory.push(filter.createURL({pdSearch}))
        }
    }),
    connect((state) => {
        const formProducts = _.get(state, ['form', 'SetPricesForm', 'values', 'product'])
        const cashCurrency = _.get(state, ['form', 'SetPricesForm', 'values', 'cashCurrency'])
        const bankCurrency = _.get(state, ['form', 'SetPricesForm', 'values', 'bankCurrency'])
        const itemsCount = _.get(state, ['remainder', 'inventory', 'data', 'count'])
        return {
            formProducts,
            cashCurrency,
            bankCurrency,
            itemsCount
        }
    })
)

const iconStyle = {
    icon: {
        color: '#bac6ce',
        width: 22,
        height: 22
    },
    button: {
        width: 40,
        height: 40,
        padding: 0,
        display: 'flex'
    }
}

const flatButtonStyle = {
    label: {
        color: '#12aaeb',
        fontWeight: '600'
    },
    disabled: {
        color: '#b3b3b3',
        fontWeight: '600'
    }
}
let head = []
const SetPrice = enhance((props) => {
    const {
        open,
        data,
        filter,
        onClose,
        onSubmit,
        classes,
        loading,
        pdSearch,
        setSearch,
        onSubmitSearch,
        currencyChooseDialog,
        filterCurrency,
        formProducts,
        cashCurrency,
        bankCurrency,
        priceList
    } = props
    const cashCurrencyShow = _.toInteger(filter.getParam('pdCashCurrency')) > ZERO
    const cashCurrencyName = _.get(cashCurrency, 'text')
    const cashCurrencyValue = _.get(cashCurrency, 'value')

    const bankCurrencyShow = _.toInteger(filter.getParam('pdBankCurrency')) > ZERO
    const bankCurrencyName = _.get(bankCurrency, 'text')
    const bankCurrencyValue = _.get(bankCurrency, 'value')

    const filteredProducts = _.filter(formProducts, (item) => {
        return _.toNumber(numberWithoutSpaces(_.get(item, 'amount'))) > ZERO ||
            _.toNumber(numberWithoutSpaces(_.get(item, 'defect')))
    })
    console.log(_.get(data, 'results'), 'products')
    const products = (
        <div className={classes.leftTable}>
            <div><span>{t('Product')}</span></div>
            {_.map(_.get(data, 'results'), (item) => {
                const id = _.get(item, 'id')
                const name = _.get(item, 'name') || t('No')
                const code = _.get(item, 'code', '-') || t('No')
                return (
                    <div key={id}>
                        <td>{name}</td>
                        <td>{code}</td>
                    </div>
                )
            })}
        </div>
    )
    head = []
    _.map(_.get(priceList, 'results'), (item) => {
        head.push({name: item.name, id: item.id})
    })

    const tableList = (
        <table className={classes.mainTable}>
            <tbody>
            <tr className={classes.title}>
                {_.map(head, (item, index) => {
                    return (
                        <td key={index}>
                            {item.name}
                        </td>
                    )
                })}
            </tr>

            {_.map(_.get(data, 'results'), (item) => {
                const id = _.get(item, 'id')
                return (
                    <tr key={id} className={classes.tableRow}>
                        {_.map(_.get(priceList, 'results'), (val, index) => {
                            return (
                                <td key={index}>
                                    <Field
                                        name={'products[' + id + '][' + val.id + '][cashPrice]'}
                                        component={TextField}
                                        className={classes.inputFieldCustom}
                                        underlineStyle={{borderColor: '#5d6474'}}
                                        normalize={normalizeNumber}
                                        fullWidth={true}/>
                                    <span className={classes.marginRightField}>{cashCurrencyName}</span>
                                    <Field
                                        name={'products[' + id + '][' + val.id + '][bankPrice]'}
                                        component={TextField}
                                        className={classes.inputFieldCustom}
                                        underlineStyle={{borderColor: '#5d6474'}}
                                        normalize={normalizeNumber}
                                        fullWidth={true}/>
                                    <span className={classes.marginRightField}>{bankCurrencyName}</span>
                                </td>
                            )
                        })}
                    </tr>
                )
            })}
            </tbody>
        </table>
    )
    const emptyData = _.isEmpty(_.get(data, 'results'))
    const lists = (
        <div className={(loading || emptyData)
            ? classes.tableWrapperLoading
            : classes.tableWrapper}
             style={{marginBottom: 30}}>
            {loading &&
            <div className={classes.loader}>
                <Loader size={0.75}/>
            </div>}
            {!loading && emptyData &&
            <div className={classes.emptyQuery}>
                <div>{t('По вашему запросу ничего не найдено')}</div>
            </div>}
            {!loading && !emptyData && products}
            <div ref="mainTable" className={classes.mainTableWrapper} style={{width: 'calc(100% - 350px)'}}>
                {!loading && !emptyData && tableList}
            </div>
        </div>
    )
    if (!open) {
        return null
    }
    return (
        <div className={classes.popUp}>
            {currencyChooseDialog && !cashCurrencyShow && !bankCurrencyShow &&
            <div className={classes.confirm}>
                <Paper zDepth={2} className={classes.confirmContent}>
                    <header><b>{t('Выберите валюту')}</b></header>
                    <div className={classes.fields}>
                        <Field
                            name={'cashCurrency'}
                            label={t('Выберите валюту для наличных')}
                            component={CurrencySearchField}
                            fullWidth={true}/>
                    </div>
                    <div className={classes.fields}>
                        <Field
                            name={'bankCurrency'}
                            label={t('Выберите валюту для перевода')}
                            component={CurrencySearchField}
                            fullWidth={true}/>
                    </div>
                    <div className={classes.buttons}>
                        <FlatButton
                            label={t('Отмена')}
                            labelStyle={flatButtonStyle.label}
                            onTouchTap={onClose}/>
                        <FlatButton
                            label={t('Сохранить')}
                            disabled={!cashCurrencyValue && !bankCurrencyValue}
                            labelStyle={cashCurrencyValue && bankCurrencyValue ? flatButtonStyle.label : flatButtonStyle.disabled}
                            onTouchTap={filterCurrency}/>
                    </div>
                </Paper>
            </div>}
            <div className={classes.titleContent}>
                <span>{t('Установить цену в прайс-лист')}</span>
                <IconButton onTouchTap={onClose}>
                    <CloseIcon color="#666666"/>
                </IconButton>
            </div>
            <div className={classes.bodyContent}>
                <div className={classes.form}>
                    <div className={classes.inContent}>
                        {loading && <div className={classes.loader}>
                            <Loader size={0.75}/>
                        </div>}
                        <header>
                            <div style={{width: '250px'}}>
                                <Field
                                    name="productType"
                                    component={ProductTypeSearchField}
                                    label={t('Фильтр по типу')}
                                    fullWidth={true}
                                />
                            </div>
                            <div onSubmit={onSubmitSearch} className={classes.search}>
                                <TextFieldSearch
                                    fullWidth={true}
                                    hintText={t('Поиск товаров') + '...'}
                                    className={classes.searchField}
                                    value={pdSearch}
                                    onChange={(event) => setSearch(event.target.value)}
                                />
                                <IconButton
                                    iconStyle={iconStyle.icon}
                                    style={iconStyle.button}
                                    className={classes.searchButton}
                                    disableTouchRipple={true}>
                                    <SearchIcon/>
                                </IconButton>
                            </div>
                        </header>
                        <div className={classes.productsList}>
                            <div className={classes.expandedTable}>
                                {lists}
                            </div>
                            <div className={classes.bottomButton}>
                                <button className={classes.actionButton} primary={true} onClick={() => { onSubmit() }}>
                                    {t('Далее')}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
})
SetPrice.defaultProps = {
    withoutCustomPrice: false,
    fromAllBalances: false,
    canChangeAnyPrice: false
}
SetPrice.propTyeps = {
    products: PropTypes.array,
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    loading: PropTypes.bool.isRequired
}
export default SetPrice
