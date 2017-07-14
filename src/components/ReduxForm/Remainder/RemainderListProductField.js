import _ from 'lodash'
import React from 'react'
import {compose, withReducer, withHandlers} from 'recompose'
import injectSheet from 'react-jss'
import IconButton from 'material-ui/IconButton'
import FlatButton from 'material-ui/FlatButton'
import {connect} from 'react-redux'
import {Field} from 'redux-form'
import Dot from '../../Images/dot.png'
import {
    Table,
    TableBody,
    TableHeader,
    TableHeaderColumn,
    TableRow,
    TableRowColumn
} from 'material-ui/Table'
import DeleteIcon from '../../DeleteIcon/index'
import ProductCustomSearchField from './ProductCustomSearchField'

import ProductTypeSearchField from '../Product/ProductTypeSearchField'
import TextField from '../Basic/TextField'

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
            padding: '10px 30px !important',
            maxHeight: '200px',
            minHeight: '200px',
            overflowY: 'auto'
        },
        tableRowHead: {
            height: '50px !important',
            border: 'none !important',
            display: 'table',
            width: '100%',
            alignItems: 'center',
            position: 'relative',
            '&:after': {
                content: '" "',
                backgroundImage: 'url(' + Dot + ')',
                position: 'absolute',
                bottom: '0',
                height: '2px',
                left: '0',
                right: '0'
            },
            '& th': {
                textAlign: 'left !important',
                border: 'none !important',
                height: '40px !important',
                fontWeight: '600 !important',
                fontSize: '13px!important'
            },
            '& th:first-child': {
                width: '80%',
                textAlign: 'left !important',
                fontWeight: '600 !important'
            }
        },
        tableRow: {
            height: '50px !important',
            border: 'none !important',
            display: 'table',
            width: '100%',
            alignItems: 'center',
            position: 'relative',
            '&:after': {
                content: '" "',
                backgroundImage: 'url(' + Dot + ')',
                position: 'absolute',
                bottom: '0',
                height: '2px',
                left: '0',
                right: '0'
            },
            '&:last-child:after': {
                content: '""',
                backgroundImage: 'none'
            },
            '& td:first-child': {
                width: '80%'
            },
            '& tr': {
                border: 'none !important'
            },
            '& td': {
                height: '40px !important',
                padding: '0 !important'
            },
            '& th:first-child': {
                width: '80%',
                textAlign: 'left !important',
                fontWeight: '600 !important'
            },
            '& th': {
                textAlign: 'left !important',
                border: 'none !important',
                height: '40px !important',
                fontWeight: '600 !important',
                fontSize: '13px!important'
            }
        },
        tableTitle: {
            fontWeight: '600',
            color: '#333 !important',
            textAlign: 'left',
            padding: '0 !important'
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
            padding: '0 30px 10px',
            backgroundColor: '#f1f5f8',
            alignItems: 'baseline',
            position: 'relative',
            zIndex: '2',
            '& > div': {
                marginTop: '-7px !important',
                width: '200px !important',
                marginRight: '20px',
                '& > div > div': {
                    width: '200px !important'
                }
            },
            '& > button > div > span': {
                padding: '0 !important'
            },
            '& button': {
                marginTop: '10px !important'
            }
        }
    }),
    connect((state) => {
        const currency = _.get(state, ['form', 'SupplyCreateForm', 'values', 'currency', 'text'])
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

const RemainderListProductField = ({classes, state, dispatch, handleAdd, handleRemove, currency, ...defaultProps}) => {
    const products = _.get(defaultProps, ['products', 'input', 'value']) || []
    const error = _.get(defaultProps, ['products', 'meta', 'error'])
    return (
        <div className={classes.wrapper}>
            <div>
                <div className={classes.background}>
                    <Field
                        label="Отфильтровать по типу"
                        name="productType"
                        className={classes.inputFieldCustom}
                        component={ProductTypeSearchField}
                        {..._.get(defaultProps, 'productType')}
                    />

                    <ProductCustomSearchField
                        label="Наименование товара"
                        className={classes.inputFieldCustom}
                        {..._.get(defaultProps, 'product')}
                    />
                    <TextField
                        label="Кол-во"
                        {..._.get(defaultProps, 'amount')}
                    />
                    <FlatButton label="Добавить" onTouchTap={handleAdd} style={{color: '#12aaeb', textTransform: 'uppercase'}}/>
                </div>
            </div>
            {error && <div className={classes.error}>{error}</div>}
            <div className={classes.table}>
                 {!_.isEmpty(products) && <Table
                    fixedHeader={true}
                    fixedFooter={false}
                    multiSelectable={false}>
                    <TableHeader
                        displaySelectAll={false}
                        adjustForCheckbox={false}
                        enableSelectAll={false}
                        className={classes.title}>
                        <TableRow className={classes.tableRowHead}>
                            <TableHeaderColumn
                                className={classes.tableTitle}>Наименование</TableHeaderColumn>
                            <TableHeaderColumn className={classes.tableTitle}>Кол-во</TableHeaderColumn>
                            <TableHeaderColumn style={{display: 'none'}}>.</TableHeaderColumn>
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
                                    {_.get(item, 'amount')} {_.get(item, ['product', 'value', 'measurement', 'name'])}
                                </TableRowColumn>
                                <TableRowColumn style={{textAlign: 'right'}}>
                                    <IconButton onTouchTap={() => handleRemove(index)}>
                                        <DeleteIcon color="#666666"/>
                                    </IconButton>
                                </TableRowColumn>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>}
            </div>
        </div>
    )
}

export default enhance(RemainderListProductField)
