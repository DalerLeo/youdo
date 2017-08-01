import _ from 'lodash'
import React from 'react'
import {compose, withReducer, withHandlers} from 'recompose'
import injectSheet from 'react-jss'
import IconButton from 'material-ui/IconButton'
import FlatButton from 'material-ui/FlatButton'
import Groceries from '../../Images/groceries.svg'
import {connect} from 'react-redux'
import numberFormat from '../../../helpers/numberFormat'
import {
    Table,
    TableBody,
    TableHeader,
    TableHeaderColumn,
    TableRow,
    TableRowColumn
} from 'material-ui/Table'
import DeleteIcon from '../../DeleteIcon/index'
import normalizeNumber from '../normalizers/normalizeNumber'
import ProductCustomSearchField from '../Supply/ProductCustomSearchField'
import TextField from '../Basic/TextField'
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
        inputFieldCustom2: {
            fontSize: '13px !important',
            height: '45px !important',
            '& div': {
                fontSize: '13px !important'
            },
            '& label': {
                top: '20px !important',
                lineHeight: '5px !important'
            },
            '& input': {
                marginTop: '5px !important'
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
            marginTop: '5px',
            backgroundColor: '#f1f5f8',
            position: 'relative',
            zIndex: '2',
            '& > div': {
                marginTop: '-2px !important',
                marginRight: '20px'
            },
            '& > button > div > span': {
                padding: '0 !important'
            },
            '& > div:last-child': {
                width: '100% !important'
            },
            '& button': {
                alignSelf: 'center'
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

    withHandlers({
        handleAdd: props => () => {
            const product = _.get(props, ['product', 'input', 'value'])
            const amount = _.get(props, ['amount', 'input', 'value'])
            const cost = _.get(props, ['cost', 'input', 'value'])
            const currency = _.get(props, ['currency'])
            const measurement = _.get(props, ['measurement'])
            const onChange = _.get(props, ['products', 'input', 'onChange'])
            const products = _.get(props, ['products', 'input', 'value'])

            if (!_.isEmpty(product) && amount && cost) {
                let has = false
                _.map(products, (item) => {
                    if (_.get(item, 'product') === product) {
                        item.amount = _.toInteger(item.amount) + _.toInteger(amount)
                        item.cost = _.toInteger(item.cost) + _.toInteger(cost)
                        has = true
                    }
                })
                const fields = ['product', 'amount', 'cost']
                for (let i = 0; i < fields.length; i++) {
                    let newChange = _.get(props, [fields[i], 'input', 'onChange'])
                    props.dispatch(newChange(null))
                }

                if (!has) {
                    onChange(_.union(products, [{product, amount, cost, currency, measurement}]))
                    has = false
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

const SupplyListProductField = ({classes, state, dispatch, handleAdd, handleRemove, currency, measurement, ...defaultProps}) => {
    const products = _.get(defaultProps, ['products', 'input', 'value']) || []
    const error = _.get(defaultProps, ['products', 'meta', 'error'])
    return (
        <div className={classes.wrapper}>
            <div>
                <div className={classes.headers} style={{marginTop: '-10px'}}>
                    <div className={classes.title}>Список товаров</div>
                    <FlatButton
                        label="+ добавить товар"
                        style={{color: '#12aaeb'}}
                        className={classes.span}
                        onTouchTap={() => dispatch({open: !state.open})}
                    />
                </div>
                {state.open && <div className={classes.background}>
                    <ProductCustomSearchField
                        label="Наименование товара"
                        className={classes.inputFieldCustom}
                        {..._.get(defaultProps, 'product')}
                    />
                    <TextField
                        label="Кол-во"
                        className={classes.inputFieldCustom2}
                        {..._.get(defaultProps, 'amount')}
                    />
                    <div style={{paddingBottom: '15px'}}>
                        {measurement}
                    </div>
                    <TextField
                        label="Сумма за ед"
                        className={classes.inputFieldCustom2}
                        normalize={normalizeNumber}
                        {..._.get(defaultProps, 'cost')}
                    />
                    <IconButton
                        label="Применить"
                        onTouchTap={handleAdd}>
                        <Check color="#12aaeb"/>
                    </IconButton>
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
                        {_.map(products, (item, index) => (
                            <TableRow key={index} className={classes.tableRow}>
                                <TableRowColumn>{_.get(item, ['product', 'value', 'name'])}</TableRowColumn>
                                <TableRowColumn>
                                    {_.get(item, 'amount')} {_.get(item, ['product', 'value', 'measurement', 'name'])}</TableRowColumn>
                                <TableRowColumn>{numberFormat(_.get(item, 'cost'), currency)}</TableRowColumn>
                                <TableRowColumn>{numberFormat(_.get(item, 'cost') * _.get(item, 'amount'), currency)}</TableRowColumn>
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
                        <div>Вы еще не выбрали ни одного товара. <br/> <a onClick={() => dispatch({open: !state.open})}>Добавить</a>
                            товар?
                        </div>
                    </div>
                </div>
            }
        </div>
    )
}

export default enhance(SupplyListProductField)
