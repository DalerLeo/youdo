import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import {compose, withState, withHandlers} from 'recompose'
import injectSheet from 'react-jss'
import {Row, Col} from 'react-flexbox-grid'
import {Field, reduxForm} from 'redux-form'
import {hashHistory} from 'react-router'
import Loader from '../Loader'
import LinearProgress from '../LinearProgress'
import IconButton from 'material-ui/IconButton'
import FlatButton from 'material-ui/FlatButton'
import CloseIcon from 'material-ui/svg-icons/navigation/close'
import TextFieldSearch from 'material-ui/TextField'
import Paper from 'material-ui/Paper'
import SearchIcon from 'material-ui/svg-icons/action/search'
import NotFound from '../Images/not-found.png'
import numberFormat from '../../helpers/numberFormat'
import numberWithoutSpaces from '../../helpers/numberWithoutSpaces'
import ToolTip from '../ToolTip'
import {connect} from 'react-redux'
import {
    TextField,
    ProductTypeSearchField,
    CurrencySearchField,
    normalizeNumber
} from '../ReduxForm'
import SetPriceOverallDialog from './SetPriceOverallDialog'
import t from '../../helpers/translate'

const ZERO = 0
const ONE = 1
const TWO = 2
const ITEMS_PER_LIST = 50
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
            height: '45px !important',
            marginTop: '7px',
            width: '50px !important',
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
        }
    }),
    reduxForm({
        form: 'SetCurrenyForm',
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
        const formProducts = _.get(state, ['form', 'SetCurrenyForm', 'values', 'product'])
        const cashCurrency = _.get(state, ['form', 'SetCurrenyForm', 'values', 'cashCurrency'])
        const bankCurrency = _.get(state, ['form', 'SetCurrenyForm', 'values', 'bankCurrency'])
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

const SetPrice = enhance((props) => {
    const {
        open,
        data,
        filter,
        onClose,
        onSubmit,
        classes,
        loading,
        moreLoading,
        pdSearch,
        setSearch,
        onSubmitSearch,
        currencyChooseDialog,
        filterCurrency,
        formProducts,
        cashCurrency,
        bankCurrency,
        itemsCount,
        loadMore,
        defaultPage,
        updateDefaultPage,
        openOverallDialog,
        setOpenOverallDialog,
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
    const products = _.map(_.get(data, 'results'), (item) => {
        const id = _.get(item, 'id')
        const name = _.get(item, 'name')
        const code = _.get(item, 'code', '-')

        return (
            <Row key={id} className="dottedList">
                <Col xs={4}>{name}</Col>
                <Col xs={2}>{code}</Col>
                {_.map(_.get(priceList, 'results'), (item) => {
                    return (
                        <Col xs={3} key={item.id}>
                            <Row>
                                <Col xs={6} className={classes.flex} style={{justifyContent: 'flex-start'}}>
                                    <Field
                                        name={'product[' + id + '][cashPrice]'}
                                        component={TextField}
                                        className={classes.inputFieldCustom}
                                        underlineStyle={{borderColor: '#5d6474'}}
                                        normalize={normalizeNumber}
                                        fullWidth={true}/>
                                    <span>{cashCurrencyName}</span>
                                </Col>
                                <Col xs={6} className={classes.flex} style={{justifyContent: 'flex-start'}}>
                                    <Field
                                        name={'product[' + id + '][bankPrice]'}
                                        component={TextField}
                                        className={classes.inputFieldCustom}
                                        inputStyle={{color: '#ff526d'}}
                                        underlineStyle={{borderColor: '#5d6474'}}
                                        underlineFocusStyle={{borderColor: '#ff526d'}}
                                        normalize={normalizeNumber}
                                        fullWidth={true}/>
                                    <span>{bankCurrencyName}</span>
                                </Col>
                            </Row>
                        </Col>
                    )
                })}
            </Row>
        )
    })

    let head = []
    head = []
    _.map(_.get(priceList, ['data', '0', 'divisions']), (item) => {
        head.push({name: t('Наличный'), id: item.id, type: 'cash'}),
        head.push({name: t('Перечисление'), id: item.id, type: 'bank'})
    })
    const tableList = (
        <table className={classes.mainTable}>
            <tbody>
            <tr className={classes.title}>
                <td
                    style={{cursor: 'pointer'}}>
                    {t('Cash')}
                </td>
                <td
                    style={{cursor: 'pointer'}}>
                    {t('Bank')}
                </td>
            </tr>

            {_.map(_.get(priceList, 'results'), (item) => {
                const id = _.get(item, 'id')
                const orderNo = numberFormat(_.get(item, 'orders'))
                amountValues = []
                _.map(_.get(item, 'divisions'), (child) => {
                    amountValues.push({amount: _.get(child, 'cash'), type: 'cash', id: _.get(child, 'id')})
                    amountValues.push({amount: _.get(child, 'bank'), type: 'bank', id: _.get(child, 'id')})
                })
                const totalSum = _.toNumber(_.get(item, 'total'))
                return (
                    <tr key={id}
                        style={id === currentRow ? styleOnHover : {}}
                        className={classes.tableRow}>
                        <td>{orderNo}</td>
                        <td>
                            <Field
                                name={'product[' + id + '][cashPrice]'}
                                component={TextField}
                                className={classes.inputFieldCustom}
                                underlineStyle={{borderColor: '#5d6474'}}
                                normalize={normalizeNumber}
                                fullWidth={true}/>
                            <span>{cashCurrencyName}</span>
                        </td>
                        {_.map(amountValues, (val, index) => {
                            const amount = _.toNumber(_.get(val, 'amount'))
                            return (
                                <td key={index}>
                                    <span>
                                        </span>
                                </td>
                            )
                        })}
                    </tr>
                )
            })}
            </tbody>
        </table>
    )
    const clients = (
        <div className={classes.leftTable}>
            <div><span>{t('Клиент')}</span></div>
            {_.map(_.get(listData, 'data'), (item) => {
                const id = _.get(item, 'id')
                const name = _.get(item, 'name') || t('No')
                return (
                    <div
                        key={id}
                        style={id === currentRow ? styleOnHover : {}}
                        onMouseEnter={() => setCurrentRow(id)}
                        onMouseLeave={() => setCurrentRow(null)}><span>{name}</span>
                        {!stat && isSuperUser &&
                        id === currentRow && <div key={id} className={classes.buttonsWrapper}>
                            <ToolTip position="bottom" text={t('Списать')}>
                                <IconButton
                                    disableTouchRipple={true}
                                    iconStyle={iconStyle.icon}
                                    style={iconStyle.button}
                                    touch={true}
                                    onTouchTap={() => {
                                        createDialog.handleOpenCreateDialog(id)
                                    }}>
                                    <Cancel color='#ff584b'/>
                                </IconButton>
                            </ToolTip>
                            <ToolTip position="bottom" text={t('Добавить')}>
                                <IconButton
                                    disableTouchRipple={true}
                                    iconStyle={iconStyle.icon}
                                    style={iconStyle.button}
                                    touch={true}
                                    onTouchTap={() => {
                                        addDialog.handleOpenAddDialog(id)
                                    }}>
                                    <Add color='#8dc572'/>
                                </IconButton>
                            </ToolTip>
                        </div>}
                    </div>
                )
            })}
        </div>
    )
    const lists = (
        <div className={(listLoading || emptyData)
            ? classes.tableWrapperLoading
            : classes.tableWrapper}
             style={!stat ? {marginBottom: 30} : {}}>
            {loading &&
            <div className={classes.loader}>
                <Loader size={0.75}/>
            </div>}
            {!loading &&
            <div className={classes.emptyQuery}>
                <div>{t('По вашему запросу ничего не найдено')}</div>
            </div>}
            {!loading && clients}
            <div ref="mainTable" className={classes.mainTableWrapper} style={{width: 'calc(100% - 350px)'}}>
                {!loading && tableList}
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
                    <header>Выберите валюту за наличные деньги и перечисления</header>
                    <div className={classes.fields}>
                        <Field
                            name={'cashCurrency'}
                            label={t('Выберите валюта cash')}
                            component={CurrencySearchField}
                            fullWidth={true}/>
                    </div>
                    <div className={classes.fields}>
                        <Field
                            name={'bankCurrency'}
                            label={t('Выберите валюта bank')}
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
                <span>{t('Инвентаризация')}</span>
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
                            <form onSubmit={onSubmitSearch} className={classes.search}>
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
                            </form>
                            <div>{t('Склад')}: <strong>{cashCurrencyName}</strong></div>
                        </header>
                        <form className={classes.productsList}>
                            {!_.isEmpty(products) &&
                            <Row className="dottedList">
                                <Col xs={4}>{t('Наименование')}</Col>
                                <Col xs={2}>{t('Код')}</Col>
                                <Col xs={3}>{t('Cash')}</Col>
                                <Col xs={3}>{t('Bank')}</Col>
                            </Row>}
                            {!_.isEmpty(products)
                                ? products
                                : <div className={classes.emptyQuery}>
                                    <div>{t('По вашему запросу ничего не найдено')}...</div>
                                </div>}
                            {moreLoading
                                ? <div className={classes.linearProgress}>
                                    <LinearProgress/>
                                </div>
                                : (itemsCount > ITEMS_PER_LIST) && (data.length < itemsCount) &&
                                <a className={classes.loadMore} onClick={() => {
                                    loadMore(defaultPage)
                                    updateDefaultPage(defaultPage + ONE)
                                }}>{t('Загрузить еще')}...</a>}
                        </form>
                    </div>
                    <div className={classes.bottomButton}>
                        <FlatButton
                            label={t('Далее')}
                            disabled={_.isEmpty(filteredProducts)}
                            labelStyle={_.isEmpty(filteredProducts) ? {fontSize: 13, color: '#b3b3b3'} : {fontSize: 13}}
                            className={classes.actionButton}
                            primary={true}
                            onTouchTap={() => {
                                setOpenOverallDialog(true)
                            }}/>
                    </div>
                </div>
            </div>

            {openOverallDialog &&
            <SetPriceOverallDialog
                data={data}
                formData={formProducts}
                closeDialog={setOpenOverallDialog}
                submitDialog={onSubmit}
            />}
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
