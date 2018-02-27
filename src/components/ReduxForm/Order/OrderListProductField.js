import _ from 'lodash'
import React from 'react'
import ReactDOM from 'react-dom'
import {compose, withState, withReducer, withHandlers, lifecycle} from 'recompose'
import {Row, Col} from 'react-flexbox-grid'
import injectSheet from 'react-jss'
import {Field} from 'redux-form'
import IconButton from 'material-ui/IconButton'
import FlatButton from 'material-ui/FlatButton'
import Groceries from '../../Images/groceries.svg'
import ToolTip from '../../ToolTip'
import {connect} from 'react-redux'
import numberFormat from '../../../helpers/numberFormat'
import numberWithoutSpaces from '../../../helpers/numberWithoutSpaces'
import Loader from '../../Loader'
import {
    Table,
    TableBody,
    TableHeader,
    TableHeaderColumn,
    TableRow,
    TableRowColumn
} from 'material-ui/Table'
import DeleteIcon from 'material-ui/svg-icons/action/delete-forever'
import EditIcon from 'material-ui/svg-icons/editor/mode-edit'
import normalizeNumber from '../normalizers/normalizeNumber'
import {TextField} from '../../ReduxForm'
import Check from 'material-ui/svg-icons/navigation/check'
import ProductCustomSearchField from './ProductCustomSearchField'
import OrderProductTypeSearchField from './OrderProductTypeSearchField'
import t from '../../../helpers/translate'

let initialPaymentType = ''
let initialPriceList = ''
let initialCurrency = ''
const enhance = compose(
    injectSheet({
        loader: {
            position: 'absolute',
            width: '100%',
            height: '300px',
            background: '#fff',
            alignItems: 'center',
            zIndex: '999',
            textAlign: 'center',
            justifyContent: 'center',
            display: 'flex'
        },
        wrapper: {
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            position: 'relative'
        },
        error: {
            background: '#ffebee',
            borderRadius: '2px',
            color: '#f44336',
            fontSize: '13px',
            textAlign: 'center',
            marginTop: '10px',
            padding: '10px 15px'
        },
        imagePlaceholder: {
            width: '100%',
            height: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            '& img': {
                width: '70px',
                marginBottom: '20px',
                marginTop: '25px'
            }
        },
        table: {
            marginTop: '20px'
        },
        tableTitle: {
            fontWeight: '600',
            color: '#333 !important',
            textAlign: 'left'
        },
        tableRow: {
            height: '40px !important',
            border: 'none !important',
            '& td:first-child': {
                whiteSpace: 'normal !important',
                width: '250px'
            },
            '& tr': {
                border: 'none !important'
            },
            '& td': {
                height: '40px !important',
                padding: '0 5px !important',
                whiteSpace: 'unset !important',
                '&:last-child': {
                    whiteSpace: 'nowrap !important'
                }
            },
            '& th:first-child': {
                width: '250px',
                fontWeight: '600 !important'
            },
            '& th': {
                border: 'none !important',
                height: '40px !important',
                padding: '0 5px !important',
                fontWeight: '600 !important'
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
                lineHeight: '5px !important'
            },
            '& input': {
                marginTop: '0 !important'
            }
        },
        inputFieldEdit: {
            extend: 'inputFieldCustom',
            height: '40px !important',
            marginTop: '0'
        },
        inputFieldEditRight: {
            extend: 'inputFieldEdit',
            '& input': {
                textAlign: 'right'
            }
        },
        searchFieldCustom: {
            extend: 'inputFieldCustom',
            position: 'initial !important',
            '& label': {
                lineHeight: 'auto !important'
            }
        },
        title: {
            fontWeight: '600',
            border: 'none !important'
        },
        headers: {
            display: 'flex',
            alignItems: 'center',
            height: '40px',
            justifyContent: 'space-between',
            '& span': {
                textTransform: 'lowercase !important'
            }
        },
        background: {
            display: 'flex',
            alignItems: 'flex-end',
            padding: '10px',
            margin: '5px -30px 0',
            backgroundColor: '#f1f5f8',
            position: 'relative',
            zIndex: '2',
            '& .Select-menu-outer': {
                maxHeight: '200px',
                minWidth: '250px'
            },
            '& > div': {
                marginTop: '-2px !important'
            },
            '& > button > div > span': {
                padding: '0 !important'
            },
            '& button': {
                alignSelf: 'center'
            }
        },
        confirm: {
            background: '#fff',
            position: 'absolute',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            top: -20,
            left: -30,
            right: -30,
            bottom: -20
        },
        confirmButtons: {
            marginTop: '-35px',
            textAlign: 'center',
            '& > div:first-child': {
                fontWeight: '600',
                fontSize: '15px',
                marginBottom: '15px'
            },
            '& button span': {
                display: 'block'
            }
        }
    }),
    connect((state) => {
        const measurement = _.get(state, ['product', 'extra', 'data', 'measurement', 'name'])
        const customPrice = _.get(state, ['product', 'extra', 'data', 'custom_price'])
        const prices = {
            cashPrice: _.get(state, ['product', 'extra', 'data', 'cash_price']),
            transferPrice: _.get(state, ['product', 'extra', 'data', 'transfer_price'])
        }
        const isAdmin = _.get(state, ['authConfirm', 'data', 'isSuperuser'])
        const paymentType = _.get(state, ['form', 'OrderCreateForm', 'values', 'paymentType'])
        const priceList = _.get(state, ['form', 'OrderCreateForm', 'values', 'priceList'])
        const formCurerncy = _.get(state, ['form', 'OrderCreateForm', 'values', 'currency'])
        const updatedPriceListProducts = _.get(state, ['order', 'changePrice', 'data', 'results'])
        const changePriceLoading = _.get(state, ['order', 'changePrice', 'loading'])
        const initialProducts = _.get(state, ['form', 'OrderCreateForm', 'values', 'products'])
        return {
            measurement,
            customPrice,
            prices,
            paymentType,
            updatedPriceListProducts,
            changePriceLoading,
            isAdmin,
            priceList,
            formCurerncy,
            initialProducts
        }
    }),
    withReducer('state', 'dispatch', (state, action) => {
        return {...state, ...action}
    }, {open: false}),
    withState('editItem', 'setEditItem', null),
    withState('price', 'updatePrice', false),

    withHandlers({
        handleAdd: props => () => {
            const product = _.get(props, ['product', 'input', 'value'])
            const price = _.get(props, 'prices')
            const amount = numberWithoutSpaces(_.get(props, ['amount', 'input', 'value']))
            const cost = numberWithoutSpaces(_.get(props, ['cost', 'input', 'value']))
            const measurement = _.get(props, ['measurement'])
            const customPrice = _.get(props, ['customPrice'])
            const onChange = _.get(props, ['products', 'input', 'onChange'])
            const products = _.get(props, ['products', 'input', 'value'])

            if (!_.isEmpty(_.get(product, 'value')) && amount && cost) {
                const fields = ['amount', 'cost', 'product']
                for (let i = 0; i < fields.length; i++) {
                    const newChange = _.get(props, [fields[i], 'input', 'onChange'])
                    props.dispatch(newChange(null))
                }

                const newRemoved = _.remove(products, (item) => {
                    return _.get(item, ['product', 'value', 'id']) !== _.get(product, ['value', 'id'])
                })

                const newArray = [{product, amount, cost, measurement, customPrice, price}]

                _.map(newRemoved, (obj) => {
                    newArray.push(obj)
                })
                onChange(newArray)
            }
        },

        handleChangePT: props => () => {
            const paymentType = _.get(props, 'paymentType')
            initialPaymentType = paymentType
            const products = _.get(props, ['products', 'input', 'value'])
            const changedProducts = _.get(props, ['products', 'input', 'onChange'])
            const initialProducts = _.get(props, 'initialProducts')
            _.map(products, (item, index) => {
                const prices = _.find(initialProducts, (obj, indx) => {
                    return index === indx
                })
                item.cost = (paymentType === 'bank') ? _.get(prices, ['price', 'transferPrice']) : _.get(prices, ['price', 'cashPrice'])
            })
            let newArray = []
            _.map(products, (obj) => {
                newArray.push(obj)
            })
            changedProducts(newArray)
        },

        handleChangePriceList: props => () => {
            const paymentType = _.get(props, 'paymentType')
            initialPriceList = _.get(props, ['priceList', 'value'])
            const products = _.get(props, ['products', 'input', 'value'])
            const changedProducts = _.get(props, ['products', 'input', 'onChange'])
            const updatedPriceListProducts = _.get(props, 'updatedPriceListProducts')
            _.map(products, (item) => {
                const prices = _.find(updatedPriceListProducts, (obj) => {
                    return obj.id === item.product.value.id
                })
                item.price = {
                    cashPrice: _.get(prices, 'netCost') ? _.toNumber(_.get(prices, 'netCost')) : _.get(prices, 'cashPrice'),
                    transferPrice: _.get(prices, 'netCost') ? _.toNumber(_.get(prices, 'netCost')) : _.get(prices, 'transferPrice')
                }
                item.cost = _.get(prices, 'netCost')
                    ? _.toNumber(_.get(prices, 'netCost'))
                    : (paymentType === 'bank') ? _.get(prices, ['transferPrice']) : _.get(prices, ['cashPrice'])
            })
            const newArray = []
            _.map(products, (obj) => {
                newArray.push(obj)
            })
            changedProducts(newArray)
        },

        handleEdit: props => (listIndex) => {
            const {setEditItem} = props
            const products = _.get(props, ['products', 'input', 'value'])
            const amount = numberWithoutSpaces(_.get(props, ['editAmount', 'input', 'value']))
            const cost = numberWithoutSpaces(_.get(props, ['editCost', 'input', 'value']))
            _.map(products, (item, index) => {
                if (index === listIndex) {
                    if (!_.isEmpty(amount) && item.amount !== amount) {
                        item.amount = numberWithoutSpaces(amount)
                    }
                    if (!_.isEmpty(cost)) {
                        item.cost = numberWithoutSpaces(cost)
                    }
                }
            })
            const fields = ['editAmount', 'editCost']
            for (let i = 0; i < fields.length; i++) {
                let newChange = _.get(props, [fields[i], 'input', 'onChange'])
                props.dispatch(newChange(null))
            }
            setEditItem(null)
        },

        handleRemove: props => (listIndex) => {
            const onChange = _.get(props, ['products', 'input', 'onChange'])
            const products = _(props)
                .get(['products', 'input', 'value'])
                .filter((item, index) => index !== listIndex)

            onChange(products)
        }
    }),

    lifecycle({
        componentDidMount () {
            const cancelBtn = ReactDOM.findDOMNode(this.refs.cancel)
            const confirmBtn = ReactDOM.findDOMNode(this.refs.confirm)
            const confirmDialog = ReactDOM.findDOMNode(this.refs.confirmDialog)
            const cancelBtnPriceList = ReactDOM.findDOMNode(this.refs.cancelPriceList)
            const confirmBtnPriceList = ReactDOM.findDOMNode(this.refs.confirmPriceList)
            const confirmDialogPriceList = ReactDOM.findDOMNode(this.refs.confirmDialogPriceList)
            cancelBtn.addEventListener('click', () => {
                confirmDialog.style.zIndex = '-10'
            })
            confirmBtn.addEventListener('click', () => {
                confirmDialog.style.zIndex = '-10'
            })
            cancelBtnPriceList.addEventListener('click', () => {
                confirmDialogPriceList.style.zIndex = '-10'
            })
            confirmBtnPriceList.addEventListener('click', () => {
                confirmDialogPriceList.style.zIndex = '-10'
            })
        },
        componentWillReceiveProps (props) {
            const confirmDialog = ReactDOM.findDOMNode(this.refs.confirmDialog)
            const confirmDialogPriceList = ReactDOM.findDOMNode(this.refs.confirmDialogPriceList)
            const initialProducts = !_.isEmpty(props.initialProducts)
            const canChangeAnyPrice = props.canChangeAnyPrice
            const loading = _.get(this, ['props', 'changePriceLoading'])
            const nextLoading = _.get(props, 'changePriceLoading')

            const handleChangePT = _.get(props, 'handleChangePT')
            const handleChangePriceList = _.get(props, 'handleChangePriceList')
            if (props.paymentType !== initialPaymentType) {
                if (initialPaymentType && initialProducts && !canChangeAnyPrice) {
                    confirmDialog.style.zIndex = '10'
                } else if (initialPriceList && initialProducts && canChangeAnyPrice) {
                    handleChangePT()
                }
            }
            const formPriceList = _.get(props, ['priceList', 'value'])
            const formCurrencyValue = _.get(props, ['formCurerncy', 'value'])
            if (formPriceList !== initialPriceList && formPriceList) {
                if (initialPriceList && initialProducts && canChangeAnyPrice) {
                    confirmDialogPriceList.style.zIndex = '10'
                }
            }

            if (formCurrencyValue !== initialCurrency && formCurrencyValue) {
                if (initialCurrency && initialProducts && canChangeAnyPrice) {
                    confirmDialogPriceList.style.zIndex = '10'
                }
            }

            if (!canChangeAnyPrice && initialProducts && loading !== nextLoading && nextLoading === false) {
                handleChangePriceList()
            }
        }
    })
)

const iconStyle = {
    button: {
        width: 40,
        height: 40,
        padding: 0
    },
    icon: {
        color: '#666',
        width: 22,
        height: 22
    }
}
const flatButton = {
    label: {
        color: '#12aaeb',
        fontWeight: 600,
        fontSize: '13px'
    }
}
const OrderListProductField = enhance((props) => {
    const {
        classes,
        state,
        dispatch,
        handleAdd,
        handleEdit,
        handleRemove,
        editItem,
        setEditItem,
        measurement,
        customPrice,
        paymentType,
        handleChangePT,
        handleChangePriceList,
        isAdmin,
        editProductsLoading,
        priceList,
        formCurerncy,
        handleOpenAddProduct
    } = props
    const ONE = 1
    const editOnlyCost = _.get(props, 'editOnlyCost')
    const canChangeAnyPrice = _.get(props, 'canChangeAnyPrice')
    const canChangePrice = _.get(props, 'canChangePrice')
    const products = _.get(props, ['products', 'input', 'value']) || []
    const error = _.get(props, ['products', 'meta', 'error'])
    const currency = _.get(formCurerncy, 'text')
    initialPaymentType = paymentType
    initialPriceList = _.get(priceList, 'value')
    initialCurrency = _.get(formCurerncy, 'value')

    const userCanChangePrice = (canChangeAnyPrice || isAdmin)
        ? true
        : Boolean(canChangePrice && customPrice)
    return (
        <div className={classes.wrapper}>
            <div
                ref="confirmDialog"
                className={classes.confirm}
                style={{zIndex: -10}}>
                <div className={classes.confirmButtons}>
                    <div>{t('Цены товаров будут изменены на')} {(paymentType === 'cash' ? t('наличные') : t('банковский счет'))}</div>
                    <FlatButton
                        label={t('Нет')}
                        ref="cancel"
                        labelStyle={flatButton.label}
                        className={classes.actionButton}
                        primary={true}
                    />
                    <FlatButton
                        label={t('Да')}
                        ref="confirm"
                        labelStyle={flatButton.label}
                        className={classes.actionButton}
                        primary={true}
                        onTouchTap={handleChangePT}
                    />
                </div>
            </div>
            <div
                ref="confirmDialogPriceList"
                className={classes.confirm}
                style={{zIndex: -10}}>
                <div className={classes.confirmButtons}>
                    <div>{t('Цены товаров будут изменены на')} {_.get(priceList, 'text')} {_.get(formCurerncy, 'text')}</div>
                    <FlatButton
                        label={t('Нет')}
                        ref="cancelPriceList"
                        labelStyle={flatButton.label}
                        className={classes.actionButton}
                        primary={true}
                    />
                    <FlatButton
                        label={t('Да')}
                        ref="confirmPriceList"
                        labelStyle={flatButton.label}
                        className={classes.actionButton}
                        primary={true}
                        onTouchTap={handleChangePriceList}
                    />
                </div>
            </div>
            <div>
                <div className={classes.headers} style={{marginTop: '-10px'}}>
                    <div className={classes.title}>{t('Список товаров')}</div>
                    <div>
                        {!editOnlyCost && (paymentType && priceList && formCurerncy) && <FlatButton
                            label={t('добавить товар')}
                            labelStyle={{fontSize: '13px', color: '#12aaeb'}}
                            className={classes.span}
                            onTouchTap={() => dispatch({open: !state.open})}
                        />}
                        {!editOnlyCost && (paymentType && priceList && formCurerncy) && handleOpenAddProduct && <FlatButton
                            label={t('добавить из списка')}
                            labelStyle={{fontSize: '13px', color: '#12aaeb'}}
                            className={classes.span}
                            onTouchTap={handleOpenAddProduct}
                        />}
                        {!editOnlyCost && !(paymentType && priceList && formCurerncy) &&
                        <ToolTip position="bottom" text={t('Выберите прайс лист')}>
                            <FlatButton
                                label={'+ ' + t('добавить товар')}
                                disabled={true}
                                labelStyle={{fontSize: '13px', color: '#999'}}
                                className={classes.span}
                            />
                        </ToolTip>}
                    </div>
                </div>
                {state.open && <Row className={classes.background}>
                    <Col xs={3}>
                        <Field
                            label={t('Тип товара')}
                            name="type"
                            component={OrderProductTypeSearchField}
                            pageSize="100000"
                            className={classes.searchFieldCustom}
                            fullWidth={true}
                            {..._.get(props, 'type')}
                        />
                    </Col>
                    <Col xs={3}>
                        <ProductCustomSearchField
                            name="product"
                            label={t('Наименование')}
                            className={classes.searchFieldCustom}
                            fullWidth={true}
                            {..._.get(props, 'product')}
                        />
                    </Col>
                    <Col xs={2}>
                        <Field
                            component={TextField}
                            label={t('Кол-во')}
                            name="amount"
                            type="number"
                            normalize={normalizeNumber}
                            className={classes.inputFieldCustom}
                            fullWidth={true}
                            {..._.get(props, 'amount')}
                        />
                    </Col>
                    <Col xs={1} style={{alignSelf: 'flex-end'}}>
                        <div style={{paddingBottom: '15px'}}>
                            {measurement}
                        </div>
                    </Col>
                    <Col xs={2}>
                        <Field
                            component={TextField}
                            label={t('Сумма за ед')}
                            name="cost"
                            disabled={!userCanChangePrice}
                            className={classes.inputFieldCustom}
                            fullWidth={true}
                            normalize={normalizeNumber}
                            {..._.get(props, 'cost')}
                        />
                    </Col>
                    <Col xs={1} style={{alignSelf: 'center'}}>
                        <IconButton
                            onTouchTap={handleAdd}>
                            <Check color="#12aaeb"/>
                        </IconButton>
                    </Col>
                </Row>}
            </div>
            {error && <div className={classes.error}>{error}</div>}
            {!_.isEmpty(products) ? <div className={classes.table}>
                    {editProductsLoading ? <div className={classes.loader}>
                            <Loader size={0.75}/>
                        </div>
                        : <Table
                            fixedHeader={true}
                            fixedFooter={false}
                            selectable={false}
                            multiSelectable={false}>
                            <TableHeader
                                displaySelectAll={false}
                                adjustForCheckbox={false}
                                enableSelectAll={false}
                                className={classes.title}>
                                <TableRow className={classes.tableRow}>
                                    <TableHeaderColumn
                                        className={classes.tableTitle}>{t('Наименование')}</TableHeaderColumn>
                                    <TableHeaderColumn className={classes.tableTitle}>{t('Кол-во')}</TableHeaderColumn>
                                    <TableHeaderColumn className={classes.tableTitle}>{t('На складе')}</TableHeaderColumn>
                                    <TableHeaderColumn className={classes.tableTitle} style={{textAlign: 'right'}}>{t('Цена')}
                                        ({currency})</TableHeaderColumn>
                                    <TableHeaderColumn className={classes.tableTitle} style={{textAlign: 'right'}}>{t('Всего')}
                                        ({currency})</TableHeaderColumn>
                                    <TableHeaderColumn></TableHeaderColumn>
                                </TableRow>
                            </TableHeader>
                            <TableBody
                                displayRowCheckbox={false}
                                deselectOnClickaway={false}
                                showRowHover={false}
                                stripedRows={false}>
                                {_.map(products, (item, index) => {
                                    const product = _.get(item, ['product', 'value', 'name'])
                                    const itemMeasurement = _.get(item, 'measurement') || _.get(item, ['product', 'value', 'measurement', 'name'])
                                    const cost = _.toNumber(_.get(item, 'cost'))
                                    const amount = _.toNumber(_.get(item, 'amount'))
                                    const balance = _.toNumber(_.get(item, ['product', 'value', 'balance']))
                                    const isEditable = _.get(item, 'customPrice')
                                    if (editItem === index) {
                                        if (canChangeAnyPrice || isAdmin) {
                                            return (
                                                <TableRow key={index} className={classes.tableRow}>
                                                    <TableRowColumn><strong style={{marginRight: '5px'}}>{index + ONE}.</strong> {product}</TableRowColumn>
                                                    {editOnlyCost
                                                        ? <TableRowColumn>{numberFormat(amount, itemMeasurement)}</TableRowColumn>
                                                        : <TableRowColumn style={{padding: 0}}>
                                                            <Field
                                                                name="editAmount"
                                                                component={TextField}
                                                                normalize={normalizeNumber}
                                                                placeholder={amount + ' ' + itemMeasurement}
                                                                className={classes.inputFieldEdit}
                                                                fullWidth={true}
                                                            />
                                                        </TableRowColumn>}
                                                    <TableRowColumn>{numberFormat(balance, itemMeasurement)}</TableRowColumn>

                                                    <TableRowColumn style={{padding: 0, textAlign: 'right'}}>
                                                        <Field
                                                            name="editCost"
                                                            component={TextField}
                                                            normalize={normalizeNumber}
                                                            placeholder={cost}
                                                            className={classes.inputFieldEditRight}
                                                            fullWidth={true}
                                                        />
                                                    </TableRowColumn>
                                                    <TableRowColumn style={{textAlign: 'right'}}>
                                                        {numberFormat(cost * amount)}
                                                    </TableRowColumn>
                                                    <TableRowColumn style={{textAlign: 'right'}}>
                                                        <IconButton
                                                            onTouchTap={() => { handleEdit(index) }}>
                                                            <Check color="#12aaeb"/>
                                                        </IconButton>
                                                    </TableRowColumn>
                                                </TableRow>
                                            )
                                        }
                                        return (
                                            <TableRow key={index} className={classes.tableRow}>
                                                <TableRowColumn><strong style={{marginRight: '5px'}}>{index + ONE}.</strong> {product}</TableRowColumn>
                                                {editOnlyCost
                                                    ? <TableRowColumn>{numberFormat(amount, itemMeasurement)}</TableRowColumn>
                                                    : <TableRowColumn style={{padding: 0}}>
                                                        <Field
                                                            name="editAmount"
                                                            component={TextField}
                                                            normalize={normalizeNumber}
                                                            placeholder={amount + ' ' + itemMeasurement}
                                                            className={classes.inputFieldEdit}
                                                            fullWidth={true}
                                                        />
                                                    </TableRowColumn>}
                                                <TableRowColumn>{numberFormat(balance, itemMeasurement)}</TableRowColumn>
                                                <TableRowColumn style={{padding: 0, textAlign: 'right'}}>
                                                    {isEditable
                                                        ? <Field
                                                            name="editCost"
                                                            component={TextField}
                                                            normalize={normalizeNumber}
                                                            placeholder={cost}
                                                            className={classes.inputFieldEditRight}
                                                            fullWidth={true}
                                                        />
                                                        : numberFormat(cost)}
                                                </TableRowColumn>
                                                <TableRowColumn
                                                    style={{textAlign: 'right'}}>{numberFormat(cost * amount)}</TableRowColumn>
                                                <TableRowColumn style={{textAlign: 'right'}}>
                                                    <IconButton
                                                        onTouchTap={() => { handleEdit(index) }}>
                                                        <Check color="#12aaeb"/>
                                                    </IconButton>
                                                </TableRowColumn>
                                            </TableRow>
                                        )
                                    }

                                    return (
                                        <TableRow key={index} className={classes.tableRow}>
                                            <TableRowColumn><strong style={{marginRight: '5px'}}>{index + ONE}.</strong> {product}</TableRowColumn>
                                            <TableRowColumn><span style={amount > balance ? {color: '#ff2626'} : {}}>{numberFormat(amount, itemMeasurement)}</span></TableRowColumn>
                                            <TableRowColumn>{numberFormat(balance, itemMeasurement)}</TableRowColumn>
                                            <TableRowColumn style={{textAlign: 'right'}}>{numberFormat(cost)}</TableRowColumn>
                                            <TableRowColumn
                                                style={{textAlign: 'right'}}>{numberFormat(cost * amount)}</TableRowColumn>
                                            <TableRowColumn style={{textAlign: 'right'}}>
                                                {canChangeAnyPrice
                                                    ? <IconButton
                                                        onTouchTap={() => setEditItem(index)}
                                                        style={iconStyle.button}
                                                        iconStyle={iconStyle.icon}>
                                                        <EditIcon color="#666666"/>
                                                    </IconButton>
                                                    : <IconButton
                                                        disabled={editOnlyCost && !isEditable}
                                                        onTouchTap={() => setEditItem(index)}
                                                        style={iconStyle.button}
                                                        iconStyle={iconStyle.icon}>
                                                        <EditIcon color="#666666"/>
                                                    </IconButton>}
                                                <IconButton
                                                    disabled={editOnlyCost}
                                                    onTouchTap={() => handleRemove(index)}
                                                    style={iconStyle.button}
                                                    iconStyle={iconStyle.icon}>
                                                    <DeleteIcon color="#666666"/>
                                                </IconButton>
                                            </TableRowColumn>
                                        </TableRow>
                                    )
                                })}
                            </TableBody>
                        </Table>}
                </div>
                : <div className={classes.imagePlaceholder}>
                    <div style={{textAlign: 'center', color: '#adadad'}}>
                        <img src={Groceries} alt=""/>
                        {(paymentType && priceList && formCurerncy)
                            ? <div>{t('Вы еще не выбрали ни одного товара')}. <br/> <a onClick={() => dispatch({open: !state.open})}>{t('Добавить')}</a>
                                {t('товар')}?
                            </div>
                            : <div>{t('Для добавления товаров')}, <br/> {t('выберите тип оплаты, валюту и прайс лист')}</div>}
                    </div>
                </div>
            }
        </div>
    )
})

export default OrderListProductField
