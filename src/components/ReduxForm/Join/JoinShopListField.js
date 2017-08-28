import _ from 'lodash'
import React from 'react'
import {compose, withState, withReducer, withHandlers} from 'recompose'
import {Row, Col} from 'react-flexbox-grid'
import injectSheet from 'react-jss'
import IconButton from 'material-ui/IconButton'
import Groceries from '../../Images/groceries.svg'
import {connect} from 'react-redux'
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
import DeleteIcon from 'material-ui/svg-icons/action/delete'
import EditIcon from 'material-ui/svg-icons/editor/mode-edit'
import MarketSearchFieldCustom from './MarketSearchFieldCustom'
import {TextField} from '../../ReduxForm'
import Check from 'material-ui/svg-icons/navigation/check'

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
        searchFieldCustom: {
            width: '250px !important',
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
        }
    }),
    connect((state) => {
        const currency = _.get(state, ['form', 'SupplyCreateForm', 'values', 'currency', 'text'])
        const measurement = _.get(state, ['form', 'SupplyCreateForm', 'values', 'product', 'value', 'measurement', 'name'])
        return {
            currency,
            measurement
        }
    }),
    withReducer('state', 'dispatch', (state, action) => {
        return {...state, ...action}
    }, {open: false}),
    withState('editItem', 'setEditItem', null),

    withHandlers({
        handleAdd: props => () => {
            const market = _.get(props, ['market', 'input', 'value'])
            const onChange = _.get(props, ['markets', 'input', 'onChange'])
            const markets = _.get(props, ['markets', 'input', 'value'])
            if (!_.isEmpty(_.get(market, 'value'))) {
                let has = false
                _.map(markets, (item) => {
                    if (_.get(item, 'market') === market) {
                        has = true
                    }
                })
                const fields = ['market']
                for (let i = 0; i < fields.length; i++) {
                    let newChange = _.get(props, [fields[i], 'input', 'onChange'])
                    props.dispatch(newChange(null))
                }

                if (!has) {
                    let newArray = [{market}]
                    _.map(markets, (obj) => {
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

const JoinShopListField = ({classes, state, dispatch, handleAdd, handleEdit, handleRemove, editItem, setEditItem, currency, ...defaultProps}) => {
    const markets = _.get(defaultProps, ['markets', 'input', 'value']) || []
    const error = _.get(defaultProps, ['markets', 'meta', 'error'])
    return (
        <div className={classes.wrapper}>
            <div>
                <Row className={classes.background}>
                    <Col xs={3}>
                        <MarketSearchFieldCustom
                            label="Магазин"
                            className={classes.searchFieldCustom}
                            fullWidth={true}
                            {..._.get(defaultProps, 'market')}
                        />
                    </Col>
                    <Col xs={1}>
                        <IconButton
                            label="Применить"
                            onTouchTap={handleAdd}>
                            <Check color="#12aaeb"/>
                        </IconButton>
                    </Col>
                </Row>
            </div>
            {error && <div className={classes.error}>{error}</div>}
            {!_.isEmpty(markets) ? <div className={classes.table}>
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
                            <TableHeaderColumn className={classes.tableTitle}>Сумма (ед.)</TableHeaderColumn>
                            <TableHeaderColumn className={classes.tableTitle}>Всего</TableHeaderColumn>
                            <TableHeaderColumn></TableHeaderColumn>
                        </TableRow>
                    </TableHeader>
                    <TableBody
                        displayRowCheckbox={false}
                        deselectOnClickaway={false}
                        showRowHover={false}
                        stripedRows={false}>
                        {_.map(markets, (item, index) => {
                            const product = _.get(item, ['product', 'value', 'name'])
                            const itemMeasurement = _.get(item, ['product', 'value', 'measurement', 'name'])
                            const cost = _.toNumber(_.get(item, 'cost'))
                            const amount = _.toNumber(_.get(item, 'amount'))

                            if (editItem === index) {
                                return (
                                    <TableRow key={index} className={classes.tableRow}>
                                        <TableRowColumn>
                                            {product}
                                        </TableRowColumn>
                                        <TableRowColumn>
                                            <TextField
                                                label={amount}
                                                className={classes.inputFieldCustom}
                                                fullWidth={true}
                                                {..._.get(defaultProps, 'editAmount')}
                                            />
                                        </TableRowColumn>
                                        <TableRowColumn>
                                            <TextField
                                                label={cost}
                                                className={classes.inputFieldCustom}
                                                fullWidth={true}
                                                {..._.get(defaultProps, 'editCost')}
                                            />
                                        </TableRowColumn>
                                        <TableRowColumn>{numberFormat(cost * amount, currency)}</TableRowColumn>
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
                                    <TableRowColumn>
                                        {amount} {itemMeasurement}</TableRowColumn>
                                    <TableRowColumn>{numberFormat(cost, currency)}</TableRowColumn>
                                    <TableRowColumn>{numberFormat(cost * amount, currency)}</TableRowColumn>
                                    <TableRowColumn style={{textAlign: 'right'}}>
                                        <IconButton
                                            onTouchTap={() => setEditItem(index)}
                                            style={iconStyle.button}
                                            iconStyle={iconStyle.icon}>
                                            <EditIcon color="#666666"/>
                                        </IconButton>
                                        <IconButton
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
                        <div>Вы еще не выбрали ни одного товара. <br/> <a onClick={() => dispatch({open: !state.open})}>Добавить</a> товар?
                        </div>
                    </div>
                </div>
            }
        </div>
    )
}

export default enhance(JoinShopListField)
