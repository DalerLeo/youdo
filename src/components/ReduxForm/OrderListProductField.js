import _ from 'lodash'
import React from 'react'
import {compose, withHandlers, withReducer, withState} from 'recompose'
import injectSheet from 'react-jss'
import IconButton from 'material-ui/IconButton'
import FlatButton from 'material-ui/FlatButton'
import Groceries from '../Images/groceries.svg'
import {connect} from 'react-redux'
import {
    Table,
    TableBody,
    TableHeader,
    TableHeaderColumn,
    TableRow,
    TableRowColumn
} from 'material-ui/Table'
import DeleteIcon from '../DeleteIcon'

import OrderProductSearchField from './OrderProductSearchField'
import TextField from './TextField'
import ProductCostField from '../ReduxForm/ProductCostField'

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
            position: 'absolute',
            bottom: '0',
            left: '0',
            width: '100%',
            height: 'calc(100% - 100px)',
            display: 'block',
            justifyContent: 'center',
            alignItems: 'center',
            '& img': {
                width: '70px',
                marginBottom: '20px'
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
        inputFieldCustom: {
            fontSize: '13px !important',
            height: '45px !important',
            marginTop: '7px',
            width: '100% !important',
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
        }
    }),
    withState('openAddProducts', 'setOpenAddProducts', false),
    connect((state) => {
        const extra = _.get(state, ['product', 'extra', 'data'])
        return {
            extra
        }
    }),
    withReducer('state', 'dispatch', (state, action) => {
        return {...state, ...action}
    }, {open: false}),

    withHandlers({
        handleAdd: props => () => {
            const product = _.get(props, ['product', 'input', 'value'])
            const amount = _.get(props, ['amount', 'input', 'value'])
            const onChange = _.get(props, ['products', 'input', 'onChange'])
            const products = _.get(props, ['products', 'input', 'value'])
            const extra = _.get(props, ['extra'])
            const ZERO = 0

            if (!_.isEmpty(product) && amount) {
                const cost = _.toNumber(_.get(extra, ['product', 'price']) || ZERO) * _.toNumber(amount)
                const balance = _.toNumber(_.get(extra, 'balance'))
                const foundIndex = _.findIndex(products,
                    (item) => {
                        return _.get(item, ['product', 'value']) === _.get(product, ['value'])
                    })
                const NOT_FOUND = -1

                if (foundIndex > NOT_FOUND) {
                    _.update(products, foundIndex, (foundObject) => {
                        return {
                            amount: _.toNumber(_.get(foundObject, 'amount')) + _.toNumber(amount),
                            balance: _.get(foundObject, 'balance'),
                            cost: _.toNumber(_.get(foundObject, 'cost')) + cost,
                            product: _.get(foundObject, 'product')
                        }
                    })
                    onChange(_.union(products, [{product, amount, cost, balance}]))
                } else {
                    onChange(_.union(products, [{product, amount, cost, balance}]))
                }
            }
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

const OrderListProductField = ({classes, state, dispatch, handleAdd, handleRemove, openAddProducts, setOpenAddProducts, ...defaultProps}) => {
    const products = _.get(defaultProps, ['products', 'input', 'value']) || []
    const error = _.get(defaultProps, ['products', 'meta', 'error'])
    const stockMin = true
    return (
        <div className={classes.wrapper}>
            <div>
                <div className={classes.headers} style={{marginTop: '-10px'}}>
                    <div className={classes.title}>Список товаров</div>
                    <FlatButton
                        label="+ добавить товар"
                        style={{color: '#12aaeb'}}
                        className={classes.span}
                        onTouchTap={() => setOpenAddProducts(!openAddProducts)}
                    />
                </div>
                {openAddProducts && <div className={classes.background}>
                    <div style={{width: '35%', paddingRight: '20px'}}>
                        <OrderProductSearchField
                            label="Наименование товара"
                            className={classes.inputFieldCustom}
                            style={{width: '100% !mportant'}}
                            {..._.get(defaultProps, 'product')}
                        />
                    </div>
                    <div style={{width: '20%', paddingRight: '20px'}}>
                        <TextField
                            label="Кол-во"
                            className={classes.inputFieldCustom}
                            style={{width: '100% !mportant'}}
                            {..._.get(defaultProps, 'amount')}
                        />
                    </div>
                    <div className="summa" style={{width: '25%', textAlign: 'right', paddingRight: '20px'}}>
                        <ProductCostField />
                    </div>
                    <div style={{width: '20%', textAlign: 'right', paddingTop: '9px'}}>
                        <FlatButton label="Применить" onTouchTap={handleAdd} style={{color: '#12aaeb'}}/>
                    </div>
                </div>}
            </div>
            {error && <div className={classes.error}>{error}</div>}
            {!_.isEmpty(products) ? <div className={classes.table}>
                <Table
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
                                <TableHeaderColumn className={classes.tableTitle}>На складе</TableHeaderColumn>
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
                        {_.map(products, (item, index) => (
                            <TableRow key={index} className={classes.tableRow} style={{background: (stockMin) ? '#ffecec' : 'transparent'}}>stockMin
                                <TableRowColumn>{_.get(item, ['product', 'text'])}</TableRowColumn>
                                <TableRowColumn>{_.get(item, 'balance')}</TableRowColumn>
                                <TableRowColumn>{_.get(item, 'amount')}</TableRowColumn>
                                <TableRowColumn>{_.get(item, 'cost')}</TableRowColumn>
                                <TableRowColumn style={{textAlign: 'right'}}>
                                    <IconButton onTouchTap={() => handleRemove(index)}>
                                        <DeleteIcon color="#666666"/>
                                    </IconButton>
                                </TableRowColumn>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
                : <div className={classes.imagePlaceholder}>
                    <div style={{textAlign: 'center', color: '#adadad', marginTop: '60px'}}>
                        <img src={Groceries} alt=""/>
                        <div>Вы еще не выбрали ни одного товара. <br/> <a onClick={() => dispatch({open: !state.open})}>Добавить</a> товар?</div>
                    </div>
                </div>
            }
        </div>
    )
}

export default enhance(OrderListProductField)
