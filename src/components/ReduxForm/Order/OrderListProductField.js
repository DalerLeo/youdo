import _ from 'lodash'
import React from 'react'
import {compose, withState, withReducer, withHandlers} from 'recompose'
import {Row, Col} from 'react-flexbox-grid'
import injectSheet from 'react-jss'
import {Field} from 'redux-form'
import IconButton from 'material-ui/IconButton'
import FlatButton from 'material-ui/FlatButton'
import Groceries from '../../Images/groceries.svg'
import {connect} from 'react-redux'
import numberFormat from '../../../helpers/numberFormat'
import getConfig from '../../../helpers/getConfig'
import numberWithoutSpaces from '../../../helpers/numberWithoutSpaces'
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

const enhance = compose(
    injectSheet({
        wrapper: {
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            position: 'relative'
        },
        error: {
            textAlign: 'center',
            fontSize: '14px',
            color: 'red'
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
                width: '250px'
            },
            '& tr': {
                border: 'none !important'
            },
            '& td': {
                height: '40px !important',
                padding: '0 5px !important'
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
            alignItems: 'flex-start',
            padding: '10px',
            margin: '5px -30px 0',
            backgroundColor: '#f1f5f8',
            position: 'relative',
            zIndex: '2',
            '& > div': {
                marginTop: '-2px !important'
            },
            '& > button > div > span': {
                padding: '0 !important'
            },
            '& button': {
                alignSelf: 'center'
            },
            '& > div > div > div:first-child': {
                overflow: 'hidden'
            }
        },
        confirm: {
            background: '#fff',
            position: 'absolute',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            top: '0',
            left: '0',
            right: '0',
            bottom: '0',
            zIndex: '10'
        },
        confirmButtons: {
            marginTop: '-35px',
            textAlign: 'center',
            '& > div:first-child': {
                fontWeight: '600',
                fontSize: '15px',
                marginBottom: '15px'
            }
        }
    }),
    connect((state) => {
        const measurement = _.get(state, ['product', 'extra', 'data', 'measurement', 'name'])
        const customPrice = _.get(state, ['product', 'extra', 'data', 'custom_price'])
        const cashPrice = _.get(state, ['product', 'extra', 'data', 'cash_price'])
        const paymentType = _.get(state, ['form', 'OrderCreateForm', 'values', 'paymentType'])
        const initialPaymentType = _.get(state, ['form', 'OrderCreateForm', 'initial', 'paymentType'])
        return {
            measurement,
            customPrice,
            cashPrice,
            paymentType,
            initialPaymentType
        }
    }),
    withReducer('state', 'dispatch', (state, action) => {
        return {...state, ...action}
    }, {open: false}),
    withState('editItem', 'setEditItem', null),
    withState('openConfirmPT', 'setOpenConfirmPT', false),

    withHandlers({
        handleAdd: props => () => {
            const product = _.get(props, ['product', 'input', 'value'])
            const cashPrice = _.get(props, ['cashPrice'])
            const amount = numberWithoutSpaces(_.get(props, ['amount', 'input', 'value']))
            const cost = numberWithoutSpaces(_.get(props, ['cost', 'input', 'value'])) || cashPrice
            const measurement = _.get(props, ['measurement'])
            const customPrice = _.get(props, ['customPrice'])
            const onChange = _.get(props, ['products', 'input', 'onChange'])
            const products = _.get(props, ['products', 'input', 'value'])
            if (!_.isEmpty(_.get(product, 'value')) && amount && cost) {
                let has = Boolean(_(products)
                    .filter(item => _.get(item, 'product') === product)
                    .first())
                const fields = ['amount', 'cost', 'product']
                for (let i = 0; i < fields.length; i++) {
                    let newChange = _.get(props, [fields[i], 'input', 'onChange'])
                    props.dispatch(newChange(null))
                }

                if (!has) {
                    let newArray = [{product, amount, cost, measurement, customPrice}]
                    _.map(products, (obj) => {
                        newArray.push(obj)
                    })
                    onChange(newArray)
                    has = false
                }
            }
        },

        handleEdit: props => (listIndex) => {
            const {setEditItem} = props
            const products = _.get(props, ['products', 'input', 'value'])
            const amount = numberWithoutSpaces(_.get(props, ['editAmount', 'input', 'value']))
            const cost = numberWithoutSpaces(_.get(props, ['editCost', 'input', 'value']))
            _.map(products, (item, index) => {
                if (index === listIndex) {
                    if (!_.isEmpty(amount) && item.amount > amount) {
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

const OrderListProductField = ({classes, state, dispatch, handleAdd, handleEdit, handleRemove, editItem, setEditItem, measurement, customPrice, openConfirmPT, setOpenConfirmPT, paymentType, ...defaultProps}) => {
    const editOnlyCost = _.get(defaultProps, 'editOnlyCost')
    const canChangeAnyPrice = _.get(defaultProps, 'canChangeAnyPrice')
    const products = _.get(defaultProps, ['products', 'input', 'value']) || []
    const error = _.get(defaultProps, ['products', 'meta', 'error'])
    const currency = getConfig('PRIMARY_CURRENCY')
    return (
        <div className={classes.wrapper}>
            {openConfirmPT && <div className={classes.confirm}>
                <div className={classes.confirmButtons}>
                    <div>Цены товаров будут изменены на {(paymentType === 'cash' ? 'наличные' : 'банковский счет')}</div>
                    <FlatButton
                        label="Нет"
                        labelStyle={flatButton.label}
                        onTouchTap={() => { setOpenConfirmPT(false) }}
                        className={classes.actionButton}
                        primary={true}
                    />
                    <FlatButton
                        label="Да"
                        labelStyle={flatButton.label}
                        className={classes.actionButton}
                        primary={true}
                        // OnTouchTap={customSubmit}
                    />
                </div>
            </div>}
            <div>
                <div className={classes.headers} style={{marginTop: '-10px'}}>
                    <div className={classes.title}>Список товаров</div>
                    {!editOnlyCost && <FlatButton
                        label="+ добавить товар"
                        style={{color: '#12aaeb'}}
                        labelStyle={{fontSize: '13px'}}
                        className={classes.span}
                        onTouchTap={() => dispatch({open: !state.open})}
                    />}
                </div>
                {state.open && <Row className={classes.background}>
                    <Col xs={3}>
                        <Field
                            label="Тип товара"
                            name="type"
                            component={OrderProductTypeSearchField}
                            className={classes.searchFieldCustom}
                            fullWidth={true}
                            {..._.get(defaultProps, 'type')}
                        />
                    </Col>
                    <Col xs={3}>
                        <ProductCustomSearchField
                            name="product"
                            label="Наименование"
                            className={classes.searchFieldCustom}
                            fullWidth={true}
                            {..._.get(defaultProps, 'product')}
                        />
                    </Col>
                    <Col xs={2}>
                        <Field
                            component={TextField}
                            label="Кол-во"
                            name="amount"
                            className={classes.inputFieldCustom}
                            fullWidth={true}
                            {..._.get(defaultProps, 'amount')}
                        />
                    </Col>
                    <Col xs={1} style={{alignSelf: 'flex-end'}}>
                        <div style={{paddingBottom: '15px'}}>
                            {measurement}
                        </div>
                    </Col>
                    <Col xs={2}>
                        {customPrice && <Field
                            component={TextField}
                            label="Сумма за ед"
                            name="cost"
                            disabled={!customPrice && true}
                            className={classes.inputFieldCustom}
                            fullWidth={true}
                            normalize={normalizeNumber}
                            {..._.get(defaultProps, 'cost')}
                        />}
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
                    <Table
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
                                    className={classes.tableTitle}>Наименование</TableHeaderColumn>
                                <TableHeaderColumn className={classes.tableTitle}>Кол-во</TableHeaderColumn>
                                <TableHeaderColumn className={classes.tableTitle} style={{textAlign: 'right'}}>Цена
                                    ({currency})</TableHeaderColumn>
                                <TableHeaderColumn className={classes.tableTitle} style={{textAlign: 'right'}}>Всего
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
                                const itemMeasurement = _.get(item, 'measurement') || ''
                                const cost = _.toNumber(_.get(item, 'cost'))
                                const amount = _.toNumber(_.get(item, 'amount'))
                                const isEditable = _.get(item, 'customPrice')

                                if (editItem === index) {
                                    if (canChangeAnyPrice) {
                                        return (
                                            <TableRow key={index} className={classes.tableRow}>
                                                <TableRowColumn>{product}</TableRowColumn>
                                                {editOnlyCost
                                                    ? <TableRowColumn>{amount} {itemMeasurement}</TableRowColumn>
                                                    : <TableRowColumn style={{padding: 0}}>
                                                        <TextField
                                                            placeholder={amount + ' ' + itemMeasurement}
                                                            className={classes.inputFieldEdit}
                                                            fullWidth={true}
                                                            {..._.get(defaultProps, 'editAmount')}
                                                        />
                                                    </TableRowColumn>}
                                                <TableRowColumn style={{padding: 0, textAlign: 'right'}}>
                                                    <TextField
                                                        placeholder={cost}
                                                        className={classes.inputFieldEditRight}
                                                        fullWidth={true}
                                                        {..._.get(defaultProps, 'editCost')}
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
                                            <TableRowColumn>{product}</TableRowColumn>
                                            {editOnlyCost
                                                ? <TableRowColumn>{amount} {itemMeasurement}</TableRowColumn>
                                                : <TableRowColumn style={{padding: 0}}>
                                                    <TextField
                                                        placeholder={amount + ' ' + itemMeasurement}
                                                        className={classes.inputFieldEdit}
                                                        fullWidth={true}
                                                        {..._.get(defaultProps, 'editAmount')}
                                                    />
                                                </TableRowColumn>}
                                            <TableRowColumn style={{padding: 0, textAlign: 'right'}}>
                                                {isEditable
                                                    ? <TextField
                                                        placeholder={cost}
                                                        className={classes.inputFieldEditRight}
                                                        fullWidth={true}
                                                        {..._.get(defaultProps, 'editCost')}
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
                                        <TableRowColumn>{product}</TableRowColumn>
                                        <TableRowColumn>{amount} {itemMeasurement}</TableRowColumn>
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
                    </Table>
                </div>
                : <div className={classes.imagePlaceholder}>
                    <div style={{textAlign: 'center', color: '#adadad'}}>
                        <img src={Groceries} alt=""/>
                        <div>Вы еще не выбрали ни одного товара. <br/> <a onClick={() => dispatch({open: !state.open})}>Добавить</a>
                            товар?
                        </div>
                    </div>
                </div>
            }
        </div>
    )
}

export default enhance(OrderListProductField)
