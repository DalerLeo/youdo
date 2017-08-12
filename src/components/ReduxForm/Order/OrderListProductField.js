import _ from 'lodash'
import React from 'react'
import {compose, withHandlers, withReducer, withState} from 'recompose'
import {Field} from 'redux-form'
import injectSheet from 'react-jss'
import {Row, Col} from 'react-flexbox-grid'
import IconButton from 'material-ui/IconButton'
import FlatButton from 'material-ui/FlatButton'
import Tooltip from '../../ToolTip'
import Groceries from '../../Images/groceries.svg'
import {connect} from 'react-redux'
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
import TextField from '../Basic/TextField'
import ProductCostField from '../Product/ProductCostField'
import OrderProductMeasurementField from './OrderProductMeasurementField'
import OrderProductTypeSearchField from './OrderProductTypeSearchField'
import ProductCustomSearchField from './ProductCustomSearchField'
import getConfig from '../../../helpers/getConfig'
import numberFormat from '../../../helpers/numberFormat'
import numberWithoutSpaces from '../../../helpers/numberWithoutSpaces'
import Done from 'material-ui/svg-icons/action/done'

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
                width: '220px'
            },
            '& tr': {
                border: 'none !important'
            },
            '& td': {
                height: '40px !important',
                padding: '0 5px !important'
            },
            '& th:first-child': {
                width: '220px',
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
            marginTop: '0',
            paddingBottom: '7px'
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
            padding: '10px 30px',
            margin: '0 -30px',
            marginTop: '5px',
            backgroundColor: '#f1f5f8',
            position: 'relative',
            zIndex: '2',
            justifyContent: 'space-between',
            '& > button div': {
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            },
            '& > div > div > div:first-child': {
                overflow: 'hidden'
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
    withReducer('state', 'dispatch', (state, action) => {
        return {...state, ...action}
    }, {open: false}),
    withState('editItem', 'setEditItem', null),

    withHandlers({
        handleAdd: props => () => {
            const product = _.get(props, ['product', 'input', 'value'])
            const amount = _.get(props, ['amount', 'input', 'value'])
            const onChange = _.get(props, ['products', 'input', 'onChange'])
            const products = _.get(props, ['products', 'input', 'value'])
            const extra = _.get(props, ['extra'])
            const measurement = _.get(extra, ['product', 'measurement', 'name'])
            const ZERO = 0

            if (!_.isEmpty(product) && amount) {
                const cost = _.toNumber(_.get(extra, ['product', 'price']) || ZERO) * _.toNumber(amount)
                const foundIndex = _.findIndex(products,
                    (item) => {
                        return _.get(item, ['product', 'value']) === _.get(product, ['value'])
                    })
                const NOT_FOUND = -1

                if (foundIndex === NOT_FOUND) {
                    onChange(_.union(products, [{product, amount, cost, measurement, extra}]))
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
                    if (!_.isEmpty(amount)) {
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
    icon: {
        color: '#12aaeb',
        width: 20,
        height: 20
    },
    button: {
        width: 48,
        height: 48,
        padding: 0
    }
}

const productIconStyle = {
    icon: {
        color: '#666',
        width: 20,
        height: 20
    },
    button: {
        width: 40,
        height: 40,
        padding: 0
    }
}

const OrderListProductField = ({classes, handleAdd, handleEdit, handleRemove, openAddProducts, setOpenAddProducts, editItem, setEditItem, ...defaultProps}) => {
    const products = _.get(defaultProps, ['products', 'input', 'value']) || []
    const error = _.get(defaultProps, ['products', 'meta', 'error'])
    const tableProducts = _.map(products, (item, index) => {
        const product = _.get(item, ['product', 'text'])
        const cost = _.toNumber(_.get(item, 'cost'))
        const currency = getConfig('PRIMARY_CURRENCY')
        const balance = _.toNumber(_.get(item, ['extra', 'balance']))
        const amount = _.toNumber(_.get(item, 'amount'))
        const measurement = _.get(item, 'measurement')
        const summary = 'Итого: ' + (amount * cost) + ' ' + currency

        if (editItem === index) {
            return (
                <TableRow className={classes.tableRow}>
                    <TableRowColumn>{product}</TableRowColumn>
                    <TableRowColumn>{numberFormat(balance)}</TableRowColumn>
                    <TableRowColumn>
                        <TextField
                            hintText={numberFormat(amount, measurement)}
                            className={classes.inputFieldEdit}
                            fullWidth={true}
                            {..._.get(defaultProps, 'editAmount')}
                        />
                    </TableRowColumn>
                    <TableRowColumn>{numberFormat(cost, currency)}</TableRowColumn>
                    <TableRowColumn style={{textAlign: 'right', padding: '0'}}>
                        <IconButton
                            style={productIconStyle.button}
                            iconStyle={productIconStyle.icon}
                            onTouchTap={() => { handleEdit(index) }}>
                            <Done color="#12aaeb"/>
                        </IconButton>
                    </TableRowColumn>
                </TableRow>
            )
        }

        return (
            <TableRow key={index} className={classes.tableRow}
                      style={{background: (balance < amount) ? '#ffecec' : 'transparent'}}>
                <TableRowColumn>{product}</TableRowColumn>
                <TableRowColumn>{numberFormat(balance)}</TableRowColumn>
                <TableRowColumn>{numberFormat(amount)} {measurement}</TableRowColumn>
                <TableRowColumn>
                    <Tooltip position="bottom" text={numberFormat(cost, currency)}>{summary}</Tooltip>
                </TableRowColumn>
                <TableRowColumn style={{textAlign: 'right'}}>
                    <IconButton
                        style={productIconStyle.button}
                        iconStyle={productIconStyle.icon}
                        onTouchTap={() => setEditItem(index)}>
                        <EditIcon color="#666666"/>
                    </IconButton>
                    <IconButton
                        style={productIconStyle.button}
                        iconStyle={productIconStyle.icon}
                        onTouchTap={() => handleRemove(index)}>
                        <DeleteIcon color="#666666"/>
                    </IconButton>
                </TableRowColumn>
            </TableRow>
        )
    })
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
                {openAddProducts &&
                <Row className={classes.background}>
                    <Col xs={3}>
                        <Field
                            label="Тип товара"
                            name="type"
                            component={OrderProductTypeSearchField}
                            className={classes.searchFieldCustom}
                            fullWidth={true}
                        />
                    </Col>
                    <Col xs={3}>
                        <Field
                            label="Наименование"
                            name="product"
                            component={ProductCustomSearchField}
                            className={classes.searchFieldCustom}
                            fullWidth={true}
                        />
                    </Col>
                    <Col xs={2}>
                        <Field
                            label="Кол-во"
                            name="amount"
                            component={TextField}
                            className={classes.inputFieldCustom}
                            fullWidth={true}
                        />
                    </Col>
                    <Col xs={1}>
                        <OrderProductMeasurementField/>
                    </Col>
                    <div className="summa" style={{width: '10%', textAlign: 'right', paddingRight: '20px'}}>
                        <ProductCostField />
                    </div>
                    <IconButton
                        iconStyle={iconStyle.icon}
                        style={iconStyle.button}
                        onTouchTap={handleAdd}>
                        <Done/>
                    </IconButton>
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
                                <TableHeaderColumn className={classes.tableTitle}>На складе</TableHeaderColumn>
                                <TableHeaderColumn className={classes.tableTitle}>Кол-во</TableHeaderColumn>
                                <TableHeaderColumn className={classes.tableTitle}>Итого</TableHeaderColumn>
                                <TableHeaderColumn></TableHeaderColumn>
                            </TableRow>
                        </TableHeader>
                    <TableBody
                        displayRowCheckbox={false}
                        deselectOnClickaway={false}
                        showRowHover={false}
                        stripedRows={false}>
                        {tableProducts}
                    </TableBody>
                </Table>
            </div>
                : <div className={classes.imagePlaceholder}>
                    <div style={{textAlign: 'center', color: '#adadad'}}>
                        <img src={Groceries} alt=""/>
                        <div>Вы еще не выбрали ни одного товара. <br/> <a onClick={() => setOpenAddProducts(!openAddProducts)}>Добавить</a> товар?</div>
                    </div>
                </div>
            }
        </div>
    )
}

export default enhance(OrderListProductField)
