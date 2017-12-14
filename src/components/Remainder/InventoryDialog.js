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
import Tooltip from '../ToolTip'
import {connect} from 'react-redux'
import {
    TextField,
    ProductTypeSearchField,
    StockSearchField,
    normalizeNumber
} from '../ReduxForm'
import InventoryOverallDialog from './InventoryOverallDialog'

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
                transition: 'all 150ms ease',
                '&:first-child': {
                    fontWeight: '600',
                    borderBottom: '1px #efefef solid',
                    '&:hover': {
                        background: 'transparent'
                    }
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
        form: 'RemainderInventoryForm',
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
        const formProducts = _.get(state, ['form', 'RemainderInventoryForm', 'values', 'product'])
        const formStock = _.get(state, ['form', 'RemainderInventoryForm', 'values', 'stock', 'text'])
        const itemsCount = _.get(state, ['remainder', 'inventory', 'data', 'count'])
        return {
            formProducts,
            formStock,
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
    }
}

const RemainderInventoryDialog = enhance((props) => {
    const {
        open,
        data,
        filter,
        onClose,
        classes,
        loading,
        moreLoading,
        pdSearch,
        setSearch,
        onSubmitSearch,
        stockChooseDialog,
        filterStock,
        formProducts,
        formStock,
        itemsCount,
        loadMore,
        defaultPage,
        updateDefaultPage,
        openOverallDialog,
        setOpenOverallDialog
    } = props
    const stock = _.toInteger(filter.getParam('pdStock')) > ZERO
    const products = _.map(data, (item) => {
        const id = _.get(item, 'id')
        const name = _.get(item, 'title')
        const code = _.get(item, 'code', '-')
        const balance = _.toNumber(_.get(item, 'balance'))
        const defects = _.toNumber(_.get(item, 'defects'))
        const measurement = _.get(item, ['measurement', 'name'])
        const findedProduct = _.find(formProducts, (o, i) => {
            return id === _.toInteger(i)
        })
        const inputAmount = _.toNumber(numberWithoutSpaces(_.get(findedProduct, 'amount')))
        const inputDefect = _.toNumber(numberWithoutSpaces(_.get(findedProduct, 'defect')))
        const amountDiff = numberFormat(balance - inputAmount)
        const defectDiff = numberFormat(defects - inputDefect)
        return (
            <Row key={id} className="dottedList">
                <Col xs={4}>{name}</Col>
                <Col xs={2}>{code}</Col>
                <Col xs={2}>
                    <Tooltip position="left" text="остаток / брак">{balance} / {defects} {measurement}</Tooltip>
                </Col>
                <Col xs={2} className={classes.flex} style={{justifyContent: 'flex-start'}}>
                    <Field
                        name={'product[' + id + '][amount]'}
                        component={TextField}
                        className={classes.inputFieldCustom}
                        underlineStyle={{borderColor: '#5d6474'}}
                        normalize={normalizeNumber}
                        fullWidth={true}/>
                    <Field
                        name={'product[' + id + '][defect]'}
                        component={TextField}
                        className={classes.inputFieldCustom}
                        inputStyle={{color: '#ff526d'}}
                        underlineStyle={{borderColor: '#ff526d'}}
                        underlineFocusStyle={{borderColor: '#ff526d'}}
                        normalize={normalizeNumber}
                        fullWidth={true}/>
                    <span>{measurement}</span>
                </Col>
                <Col xs={2} className={classes.flex}>
                    <Tooltip position="left" text="остаток / брак">{amountDiff} / {defectDiff} {measurement}</Tooltip>
                </Col>
            </Row>
        )
    })
    if (!open) {
        return null
    }
    return (
        <div className={classes.popUp}>
            {stockChooseDialog && !stock &&
            <div className={classes.confirm}>
                <Paper zDepth={2} className={classes.confirmContent}>
                    <header>Выберите склад</header>
                    <div className={classes.fields}>
                        <Field
                            name={'stock'}
                            label={'Выберите склад'}
                            component={StockSearchField}
                            fullWidth={true}/>
                    </div>
                    <div className={classes.buttons}>
                        <FlatButton
                            label="Сохранить"
                            labelStyle={flatButtonStyle.label}
                            onTouchTap={filterStock}/>
                    </div>
                </Paper>
            </div>}
            <div className={classes.titleContent}>
                <span>Инвентаризация</span>
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
                                    label="Фильтр по типу"
                                    fullWidth={true}
                                />
                            </div>
                            <form onSubmit={onSubmitSearch} className={classes.search}>
                                <TextFieldSearch
                                    fullWidth={true}
                                    hintText="Поиск товаров..."
                                    className={classes.searchField}
                                    value={pdSearch}
                                    onChange={(event) => setSearch(event.target.value)}
                                />
                                <IconButton
                                    iconStyle={iconStyle.icon}
                                    style={iconStyle.button}
                                    className={classes.searchButton}
                                    disableTouchRipple={true}>
                                    <SearchIcon />
                                </IconButton>
                            </form>
                            <div>Склад: <strong>{formStock}</strong></div>
                        </header>
                        <form className={classes.productsList}>
                            {!_.isEmpty(products) &&
                            <Row className="dottedList">
                                <Col xs={4}>Наименование</Col>
                                <Col xs={2}>Код</Col>
                                <Col xs={2}>Зарегистрировано</Col>
                                <Col xs={2}>ОК / Брак</Col>
                                <Col xs={2} className={classes.rightAlign}>Разница</Col>
                            </Row>}
                            {!_.isEmpty(products)
                                ? products
                                : <div className={classes.emptyQuery}>
                                    <div>По вашему запросу ничего не найдено...</div>
                                </div>}
                            {moreLoading
                                ? <div className={classes.linearProgress}>
                                    <LinearProgress/>
                                </div>
                                : (itemsCount > ITEMS_PER_LIST) && (data.length < itemsCount) &&
                                <a className={classes.loadMore} onClick={() => {
                                    loadMore(defaultPage)
                                    updateDefaultPage(defaultPage + ONE)
                                }}>Загрузить еще...</a>}
                        </form>
                    </div>
                    <div className={classes.bottomButton}>
                        <FlatButton
                            label={'Далее'}
                            labelStyle={{fontSize: '13px'}}
                            className={classes.actionButton}
                            primary={true}
                            onTouchTap={() => { setOpenOverallDialog(true) }}/>
                    </div>
                </div>
            </div>

            {openOverallDialog &&
            <InventoryOverallDialog
                data={data}
                formData={formProducts}
                closeDialog={setOpenOverallDialog}
            />}
        </div>
    )
})
RemainderInventoryDialog.defaultProps = {
    withoutCustomPrice: false,
    fromAllBalances: false,
    canChangeAnyPrice: false
}
RemainderInventoryDialog.propTyeps = {
    products: PropTypes.array,
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    loading: PropTypes.bool.isRequired
}
export default RemainderInventoryDialog
