import _ from 'lodash'
import React from 'react'
import {Row, Col} from 'react-flexbox-grid'
import {compose, withReducer, withHandlers} from 'recompose'
import injectSheet from 'react-jss'
import IconButton from 'material-ui/IconButton'
import FlatButton from 'material-ui/FlatButton'
import Groceries from '../../Images/groceries.svg'
import {connect} from 'react-redux'
import {Field} from 'redux-form'
import {
    Table,
    TableBody,
    TableHeader,
    TableHeaderColumn,
    TableRow,
    TableRowColumn
} from 'material-ui/Table'
import DeleteIcon from '../../DeleteIcon/index'
import ProductTypeSearchField from '../Product/ProductTypeSearchField'
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
            padding: '10px',
            margin: '5px -30px 0',
            backgroundColor: '#f1f5f8',
            position: 'relative',
            zIndex: '2',
            '& > div': {
                marginTop: '-2px !important',
                width: '30%'
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
    connect((state) => {
        const currency = _.get(state, ['form', 'PricesCreateForm', 'values', 'currency', 'text'])
        return {
            currency
        }
    }),
    withReducer('state', 'dispatch', (state, action) => {
        return {...state, ...action}
    }, {open: false}),

    withHandlers({
        handleAdd: props => () => {
            const product = _.get(props, ['product', 'input', 'value'])
            const amount = _.get(props, ['amount', 'input', 'value'])
            const currency = _.get(props, ['currency'])
            const onChange = _.get(props, ['products', 'input', 'onChange'])
            const products = _.get(props, ['products', 'input', 'value'])

            if (!_.isEmpty(product) && amount) {
                let has = false
                _.map(products, (item) => {
                    if (_.get(item, 'product') === product) {
                        item.amount = _.toInteger(item.amount) + _.toInteger(amount)
                        has = true
                    }
                })
                if (!has) {
                    onChange(_.union(products, [{product, amount, currency}]))
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

const PricesListProductField = ({classes, state, dispatch, handleAdd, handleRemove, ...defaultProps}) => {
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
                {state.open && <Row className={classes.background}>
                    <Col xs={4}>
                        <Field
                            label="Тип товара"
                            name="type"
                            component={ProductTypeSearchField}
                            className={classes.inputFieldCustom}
                            fullWidth={true}
                            />
                    </Col>
                    <Col xs={5}>
                        <Field
                            label="Наименование"
                            name="product"
                            component={ProductCustomSearchField}
                            className={classes.inputFieldCustom}
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
                        <IconButton onTouchTap={handleAdd} disableTouchRipple={true}>
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

export default enhance(PricesListProductField)
