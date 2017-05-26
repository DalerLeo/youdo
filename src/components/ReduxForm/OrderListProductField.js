import _ from 'lodash'
import React from 'react'
import {compose, withHandlers, withState} from 'recompose'
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
            maxHeight: '300px',
            overflow: 'auto'
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
            backgroundColor: '#f1f5f8',
            display: 'flex',
            padding: '10px',
            marginTop: '20px',
            '& > div': {
                marginTop: '-20px !important',
                marginRight: '20px',
                height: '72px !important',
                '& input': {
                    height: '75px !important'
                }
            },
            '& > button > div > span': {
                padding: '0 !important'
            },
            '& > div:last-child': {
                width: '100% !important'
            },
            '& button': {
                marginTop: '10px !important'
            }
        }
    }),
    withState('openAddProducts', 'setOpenAddProducts', false),
    connect((state) => {
        const extra = _.get(state, ['product', 'extra', 'data'])
        return {
            extra
        }
    }),
    withHandlers({
        handleAdd: props => () => {
            const product = _.get(props, ['product', 'input', 'value'])
            const amount = _.get(props, ['amount', 'input', 'value'])
            const onChange = _.get(props, ['products', 'input', 'onChange'])
            const products = _.get(props, ['products', 'input', 'value'])
            const extra = _.get(props, ['extra'])

            if (!_.isEmpty(product) && amount && _.get(extra, ['product', 'price'])) {
                const cost = _.toNumber(_.get(extra, ['product', 'price'])) * _.toNumber(amount)
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
                    onChange([])
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

const OrderListProductField = ({classes, handleAdd, handleRemove, openAddProducts, setOpenAddProducts, ...defaultProps}) => {
    const products = _.get(defaultProps, ['products', 'input', 'value']) || []
    const error = _.get(defaultProps, ['products', 'meta', 'error'])
    const stockMin = true
    return (
        <div className={classes.wrapper}>
            <div>
                <div className={classes.headers}>
                    <div className={classes.title}>Список товаров</div>
                    <FlatButton
                        label="+ добавить товар"
                        style={{color: '#12aaeb'}}
                        className={classes.span}
                        onTouchTap={() => setOpenAddProducts(!openAddProducts)}
                    />
                </div>
                {openAddProducts && <div className={classes.background}>
                    <OrderProductSearchField
                        label="Наименование товара"
                        {..._.get(defaultProps, 'product')}
                    />
                    <TextField
                        label="Кол-во"
                        {..._.get(defaultProps, 'amount')}
                    />
                    <div className="summa">
                        <ProductCostField />
                    </div>
                    <FlatButton label="Применить" onTouchTap={handleAdd} style={{color: '#12aaeb'}}/>
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
                    <div style={{textAlign: 'center', color: '#adadad'}}>
                        <img src={Groceries} alt=""/>
                        <div>Вы еще не выбрали ни одного товара. <br/> <a onClick={() => setOpenAddProducts(true)}>Добавить</a> товар?</div>
                    </div>
                </div>
            }
        </div>
    )
}

export default enhance(OrderListProductField)
