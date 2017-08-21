import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import {compose, withReducer, withHandlers, withState} from 'recompose'
import injectSheet from 'react-jss'
import {Field} from 'redux-form'
import IconButton from 'material-ui/IconButton'
import FlatButton from 'material-ui/FlatButton'
import Groceries from '../../Images/groceries.svg'
import {connect} from 'react-redux'
import getConfig from '../../../helpers/getConfig'
import numberFormat from '../../../helpers/numberFormat'
import numberWithoutSpaces from '../../../helpers/numberWithoutSpaces'
import {
    Table,
    TableBody,
    TableHeader,
    TableHeaderColumn,
    TableRow,
    TableRowColumn
} from 'material-ui/Table'
import DeleteIcon from '../../DeleteIcon/index'

import OrderReturnMeasurementField from './OrderReturnMeasurementField'
import ReturnProductsSearchField from './ReturnProductsSearchField'
import ProductReturnCostField from './ProductReturnCostField'
import TextField from '../Basic/TextField'
import Check from 'material-ui/svg-icons/navigation/check'
import EditIcon from 'material-ui/svg-icons/editor/mode-edit'

const ZERO = 0
const enhance = compose(
    injectSheet({
        wrapper: {
            display: 'flex',
            flexDirection: 'column',
            minHeight: '407px',
            height: 'calc(100% - 38px)',
            position: 'relative'
        },
        imagePlaceholder: {
            width: '100%',
            height: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            '& img': {
                width: '100px',
                marginBottom: '20px'
            }
        },
        table: {
            marginTop: '20px',
            overflowY: 'auto',
            overflowX: 'hiddent',
            maxHeight: '270px'
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
                textAlign: 'left !important',
                fontWeight: '600 !important'
            },
            '& th': {
                textAlign: 'left !important',
                border: 'none !important',
                height: '40px !important',
                padding: '0 5px !important',
                fontWeight: '600 !important'
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
            padding: '10px 30px',
            margin: '0 -30px',
            marginTop: '5px',
            backgroundColor: '#f1f5f8',
            position: 'relative',
            zIndex: '2'
        },
        inputFieldCustom: {
            fontSize: '13px !important',
            height: '45px !important',
            width: '100% !important',
            marginTop: '7px',
            '& div': {
                fontSize: '13px !important'
            },
            '& label': {
                top: '20px !important',
                lineHeight: '5px !important'
            },
            '& input': {
                marginTop: '0 !important',
                width: '100% !important'
            }
        }
    }),
    connect((state) => {
        const extra = _.get(state, ['product', 'extra', 'data'])
        const productAmount = _.toNumber(_.get(state, ['form', 'OrderReturnForm', 'values', 'product', 'value', 'amount']))
        const returnAmount = _.toNumber(_.get(state, ['form', 'OrderReturnForm', 'values', 'product', 'value', 'returnAmount']))

        return {
            extra,
            productAmount,
            returnAmount
        }
    }),
    withReducer('state', 'dispatch', (state, action) => {
        return {...state, ...action}
    }, {open: false}),
    withState('editItem', 'setEditItem', null),

    withHandlers({
        handleAdd: props => () => {
            const product = _.get(props, ['product', 'input', 'value'])
            const amount = _.get(props, ['amount', 'input', 'value'])
            const extra = _.get(props, ['extra'])
            const onChange = _.get(props, ['returned_products', 'input', 'onChange'])
            const products = _.get(props, ['returned_products', 'input', 'value'])

            if (!_.isEmpty(product) && amount) {
                let has = false
                _.map(products, (item) => {
                    if (_.get(item, 'product') === product) {
                        has = true
                    }
                })
                const fields = ['amount', 'product']
                for (let i = 0; i < fields.length; i++) {
                    let newChange = _.get(props, [fields[i], 'input', 'onChange'])
                    props.dispatch(newChange(null))
                }
                const cost = _.toNumber(_.get(extra, ['product', 'price']) || ZERO) * _.toNumber(amount)
                if (!has) {
                    onChange(_.union(products, [{product, amount, cost}]))
                }
            }
        },
        handleEdit: props => (listIndex) => {
            const {setEditItem} = props
            const products = _.get(props, ['returned_products', 'input', 'value'])
            const amount = numberWithoutSpaces(_.get(props, ['editAmount', 'input', 'value']))
            _.map(products, (item, index) => {
                if (index === listIndex && !_.isEmpty(amount)) {
                    if (_.toNumber(_.get(item, ['product', 'value', 'amount'])) < _.toNumber(amount)) {
                        item.amount = _.get(item, ['product', 'value', 'amount'])
                    } else {
                        item.amount = numberWithoutSpaces(amount)
                    }
                }
            })
            const fields = ['editAmount']
            for (let i = 0; i < fields.length; i++) {
                let newChange = _.get(props, [fields[i], 'input', 'onChange'])
                props.dispatch(newChange(null))
            }
            setEditItem(null)
        },
        handleRemove: props => (listIndex) => {
            const onChange = _.get(props, ['returned_products', 'input', 'onChange'])
            const products = _(props)
                .get(['returned_products', 'input', 'value'])
                .filter((item, index) => index !== listIndex)

            onChange(products)
        }
    })
)

const OrderListReturnField = ({classes, state, dispatch, handleAdd, handleRemove, productAmount, returnAmount, editItem, setEditItem, handleEdit, ...defaultProps}) => {
    const normalizeAmount = productAmount - returnAmount

    const normalizeReturn = value => {
        if (!value) {
            return value
        }

        return value > normalizeAmount ? normalizeAmount : value
    }

    const selectFieldScroll = {
        scrollable: true,
        maxHeight: '300px'
    }

    const products = _.get(defaultProps, ['returned_products', 'input', 'value']) || []
    return (
        <div className={classes.wrapper}>
            <div>
                <div className={classes.headers}>
                    <div className={classes.title}>Список товаров</div>
                    <FlatButton
                        label="+ добавить товар"
                        style={{color: '#12aaeb'}}
                        className={classes.span}
                        onTouchTap={() => dispatch({open: !state.open})}
                    />
                </div>
                {state.open && <div className={classes.background}>
                    <div style={{width: '35%', paddingRight: '20px'}}>
                        <ReturnProductsSearchField
                            name="product"
                            label="Наименование товара"
                            selectFieldScroll={selectFieldScroll}
                            className={classes.inputFieldCustom}
                            style={{width: '100%'}}
                            {..._.get(defaultProps, 'product')}
                        />
                    </div>
                    <div style={{width: '20%', paddingRight: '20px'}}>
                        <Field
                            label="Кол-во"
                            disabled={(normalizeAmount === ZERO || !normalizeAmount)}
                            normalize={normalizeReturn}
                            component={TextField}
                            className={classes.inputFieldCustom}
                            style={{width: '100%'}}
                            name="amount"
                        />
                    </div>
                    <div>
                        <OrderReturnMeasurementField/>
                    </div>
                    <div className="summa" style={{width: '25%', textAlign: 'right', paddingRight: '20px'}}>
                        <ProductReturnCostField />
                    </div>
                    <div style={{width: '20%', textAlign: 'right', paddingTop: '9px'}}>
                        <FlatButton label="Применить" onTouchTap={handleAdd} style={{color: '#12aaeb'}}/>
                    </div>
                </div>}
            </div>
            {!_.isEmpty(products) ? <div className={classes.table}>
                <Table
                    selectable={false}
                    fixedHeader={true}
                    fixedFooter={false}
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
                                <TableHeaderColumn className={classes.tableTitle}>Сумма</TableHeaderColumn>
                                <TableHeaderColumn></TableHeaderColumn>
                            </TableRow>
                        </TableHeader>
                    <TableBody
                        displayRowCheckbox={false}
                        deselectOnClickaway={false}
                        showRowHover={false}
                        stripedRows={false}>
                        {_.map(products, (item, index) => {
                            const product = _.get(item, ['product', 'text'])
                            const amount = numberFormat(_.get(item, 'amount'))
                            const measurement = _.get(item, ['product', 'value', 'product', 'measurement', 'name'])
                            const price = numberFormat((_.get(item, ['product', 'value', 'price']) * (_.get(item, 'amount'))), getConfig('PRIMARY_CURRENCY'))
                            if (editItem === index) {
                                return (
                                    <TableRow key={index} className={classes.tableRow}>
                                        <TableRowColumn>{product}</TableRowColumn>
                                        <TableRowColumn style={{padding: 0}}>
                                            <TextField
                                                placeholder={amount + ' ' + measurement}
                                                className={classes.inputFieldEdit}
                                                fullWidth={true}
                                                {..._.get(defaultProps, 'editAmount')}
                                            />
                                        </TableRowColumn>
                                        <TableRowColumn>{price}</TableRowColumn>
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
                                    <TableRowColumn>{amount} {measurement}</TableRowColumn>
                                    <TableRowColumn>{price}</TableRowColumn>
                                    <TableRowColumn style={{textAlign: 'right'}}>
                                        <IconButton
                                            onTouchTap={() => setEditItem(index)}>
                                            <EditIcon color="#666666"/>
                                        </IconButton>
                                        <IconButton onTouchTap={() => handleRemove(index)}>
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
                        <div>Вы еще не выбрали ни одного товара. <br/> <a onClick={() => dispatch({open: !state.open})}>Добавить</a> товар?</div>
                    </div>
                </div>
            }
        </div>
    )
}
OrderListReturnField.propTyeps = {
    orderData: PropTypes.object.isRequired
}
export default enhance(OrderListReturnField)

