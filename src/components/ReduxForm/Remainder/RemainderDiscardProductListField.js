import _ from 'lodash'
import React from 'react'
import {compose, withReducer, withHandlers, withState} from 'recompose'
import injectSheet from 'react-jss'
import IconButton from 'material-ui/IconButton'
import Check from 'material-ui/svg-icons/navigation/check'
import {Field} from 'redux-form'
import Dot from '../../Images/dot.png'
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
import DiscardProductSearchField from './DiscardProductSearchField'
import {RemainderProductTypeSearchField} from '../index'
import RemainderStatusSearchField from '../../ReduxForm/Remainder/RemainderStatusSearchField'
import TextField from '../Basic/TextField'
import EditIcon from 'material-ui/svg-icons/editor/mode-edit'

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
                fontSize: '13px!important',
                width: '80px'
            },
            '& th:first-child': {
                width: '404px',
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
                width: '404px',
                padding: '0 !important'
            },
            '& tr': {
                border: 'none !important'
            },
            '& td': {
                height: '40px !important',
                padding: '0 10px !important',
                width: '85px'
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
            '&:first-child': {
                padding: '0 !important'
            },
            padding: '0 10px !important'
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
            '& > .wrapper:last-child': {
                width: '100px !important',
                '& > div > div': {
                    width: '100% !important'
                }
            },
            '& > div:first-child': {
                marginTop: '-7px !important',
                width: '200px !important',
                marginRight: '20px',
                '& > div > div': {
                    width: '200px !important'
                }
            },
            '& > div:nth-child(2)': {
                marginTop: '-7px !important',
                width: '200px !important',
                marginRight: '20px',
                '& > div > div': {
                    width: '200px !important'
                }
            },
            '& > div:nth-child(3)': {
                marginTop: '-7px !important',
                width: '70px !important',
                minWidth: '50px !important',
                marginRight: '20px',
                '& > div > div': {
                    width: '70px !important',
                    minWidth: '50px !important'

                }
            },
            '& > div:nth-child(4)': {
                marginTop: '-7px !important',
                width: '100px !important',
                marginRight: '20px',
                '& > div > div': {
                    width: '100px !important'

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
        const measurement = _.get(state, ['form', 'RemainderDiscardForm', 'values', 'product', 'value', 'measurement', 'name'])
        return {
            measurement
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
            const isDefect = _.get(props, ['isDefect', 'input', 'value'])
            const onChange = _.get(props, ['products', 'input', 'onChange'])
            const products = _.get(props, ['products', 'input', 'value'])

            if (!_.isEmpty(product) && amount && isDefect) {
                let has = false
                _.map(products, (item) => {
                    if (_.get(item, 'product') === product && _.get(item, 'isDefect') === isDefect) {
                        item.amount = _.toInteger(item.amount) + _.toInteger(amount)
                        has = true
                    }
                })
                const fields = ['productType', 'product', 'isDefect', 'amount']
                for (let i = 0; i < fields.length; i++) {
                    let newChange = _.get(props, [fields[i], 'input', 'onChange'])
                    props.dispatch(newChange(null))
                }
                if (!has) {
                    onChange(_.union(products, [{product, isDefect, amount}]))
                    has = false
                }
            }
        },

        handleEdit: props => (listIndex) => {
            const {setEditItem} = props
            const products = _.get(props, ['products', 'input', 'value'])
            const amount = (_.get(props, ['editAmount', 'input', 'value']))
            const isDefect = (_.get(props, ['editIsDefect', 'input', 'value']))
            _.map(products, (item, index) => {
                if (index === listIndex) {
                    if (!_.isEmpty(amount)) {
                        item.amount = amount
                    }
                    if (!_.isEmpty(isDefect)) {
                        item.isDefect = isDefect
                    }
                }
            })
            const fields = ['editAmount', 'editIsDefect']
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

const RemainderListProductField = ({classes, handleAdd, handleRemove, measurement, handleEdit, editItem, setEditItem, ...defaultProps}) => {
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
                        component={RemainderProductTypeSearchField}
                        {..._.get(defaultProps, 'productType')}
                    />

                    <DiscardProductSearchField
                        label="Наименование товара"
                        className={classes.inputFieldCustom}
                        {..._.get(defaultProps, 'product')}
                    />
                    <TextField
                        label="Кол-во"
                        {..._.get(defaultProps, 'amount')}
                    />
                    <span style={{margin: '0 20px 0 -10px'}}>{measurement}</span>

                    <Field
                        label="Статус"
                        name="isDefect"
                        className={classes.inputFieldCustom}
                        fullWidth={true}
                        component={RemainderStatusSearchField}
                        {..._.get(defaultProps, 'isDefect')}
                    />
                    <IconButton
                        label="Применить"
                        onTouchTap={handleAdd}>
                        <Check color="#12aaeb"/>
                    </IconButton>
                </div>
            </div>
            {error && <div className={classes.error}>{error}</div>}
            <div className={classes.table}>
                {!_.isEmpty(products) && <Table
                    fixedHeader={true}
                    fixedFooter={false}
                    selectable={false}
                    multiSelectable={false}>
                    <TableHeader
                        displaySelectAll={false}
                        adjustForCheckbox={false}
                        enableSelectAll={false}
                        className={classes.title}>
                        <TableRow className={classes.tableRowHead}>
                            <TableHeaderColumn
                                className={classes.tableTitle}>Наименование</TableHeaderColumn>
                            <TableHeaderColumn className={classes.tableTitle}>Статус</TableHeaderColumn>
                            <TableHeaderColumn className={classes.tableTitle}>Кол-во</TableHeaderColumn>
                            <TableHeaderColumn style={{display: 'none'}}>.</TableHeaderColumn>
                        </TableRow>
                    </TableHeader>
                    <TableBody
                        displayRowCheckbox={false}
                        deselectOnClickaway={false}
                        showRowHover={false}
                        stripedRows={false}>
                        {_.map(products, (item, index) => {
                            const product = _.get(item, ['product', 'value', 'name'])
                            const isDefect = _.get(item, ['isDefect', 'text'])
                            const amount = _.get(item, 'amount')
                            const proMeasurement = _.get(item, ['product', 'value', 'measurement', 'name'])

                            if (editItem === index) {
                                return (
                                    <TableRow key={index} className={classes.tableRow}>
                                        <TableRowColumn>{product}</TableRowColumn>
                                        <TableRowColumn>
                                            <Field
                                                label="Статус"
                                                name="editIsDefect"
                                                className={classes.inputFieldCustom}
                                                fullWidth={true}
                                                component={RemainderStatusSearchField}
                                                {..._.get(defaultProps, 'editIsDefect')}
                                            />
                                        </TableRowColumn>
                                        <TableRowColumn>
                                            <TextField
                                                label={amount}
                                                fullWidth={true}
                                                className={classes.inputFieldCustom}
                                                {..._.get(defaultProps, 'editAmount')}
                                            />
                                        </TableRowColumn>
                                        <TableRowColumn style={{textAlign: 'right', width: '118px'}}>
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
                                    <TableRowColumn>{isDefect}</TableRowColumn>
                                    <TableRowColumn>
                                        {amount} {proMeasurement}
                                    </TableRowColumn>
                                    <TableRowColumn style={{textAlign: 'right'}}>
                                        <IconButton
                                            onTouchTap={() => setEditItem(index)}>
                                            <EditIcon color="#666"/>
                                        </IconButton>
                                        <IconButton onTouchTap={() => handleRemove(index)}>
                                            <DeleteIcon color="#666"/>
                                        </IconButton>
                                    </TableRowColumn>
                                </TableRow>)
                        })}
                    </TableBody>
                </Table>}
            </div>
        </div>
    )
}

export default enhance(RemainderListProductField)
