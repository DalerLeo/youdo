import _ from 'lodash'
import React from 'react'
import {compose, withReducer, withHandlers} from 'recompose'
import injectSheet from 'react-jss'
import IconButton from 'material-ui/IconButton'
import FlatButton from 'material-ui/FlatButton'
import Groceries from '../Images/groceries.svg'
import {
    Table,
    TableBody,
    TableHeader,
    TableHeaderColumn,
    TableRow,
    TableRowColumn
} from 'material-ui/Table'
import DeleteIcon from '../DeleteIcon'

import ProductSearchField from './ProductSearchField'
import TextField from './TextField'

const enhance = compose(
    injectSheet({
        wrapper: {
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            position: 'relative'
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
    withReducer('state', 'dispatch', (state, action) => {
        return {...state, ...action}
    }, {open: false}),

    withHandlers({
        handleAdd: props => () => {
            const product = _.get(props, ['product', 'input', 'value'])
            const amount = _.get(props, ['amount', 'input', 'value'])
            const cost = 10000

            const onChange = _.get(props, ['products', 'input', 'onChange'])
            const products = _.get(props, ['products', 'input', 'value'])

            if (!_.isEmpty(product) && amount && cost) {
                onChange(_.union(products, [{product, amount, cost}]))
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

const OrderListReturnField = ({classes, state, dispatch, handleAdd, handleRemove, ...defaultProps}) => {
    const products = _.get(defaultProps, ['products', 'input', 'value']) || []

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
                    <ProductSearchField
                        label="Наименование товара"
                        {..._.get(defaultProps, 'product')}
                    />
                    <TextField
                        label="Кол-во"
                        {..._.get(defaultProps, 'amount')}
                    />
                    <TextField
                        label="Сумма"
                        disabled={true}
                        value={'10000'}
                        {..._.get(defaultProps, 'cost')}
                    />
                    <FlatButton label="Применить" onTouchTap={handleAdd} style={{color: '#12aaeb'}}/>
                </div>}
            </div>
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
                            <TableRow key={index} className={classes.tableRow}>
                                <TableRowColumn>{_.get(item, ['product', 'text'])}</TableRowColumn>
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
                        <div>Вы еще не выбрали ни одного товара. <br/> <a onClick={() => dispatch({open: !state.open})}>Добавить</a> товар?</div>
                    </div>
                </div>
            }
        </div>
    )
}

export default enhance(OrderListReturnField)
