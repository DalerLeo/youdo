import _ from 'lodash'
import React from 'react'
import {compose, withReducer, withHandlers, withState} from 'recompose'
import injectSheet from 'react-jss'
import {Row, Col} from 'react-flexbox-grid'
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
import ProductCustomSearchField from './ProductCustomSearchField'
import {RemainderProductTypeSearchField} from '../index'
import TextField from '../Basic/TextField'
import EditIcon from 'material-ui/svg-icons/editor/mode-edit'
import numberFormat from '../../../helpers/numberFormat'

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
            '& > div': {
                overflow: 'unset !important',
                '& > div:nth-child(2)': {
                    overflow: 'unset !important'
                }
            }
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
                width: '85px',
                overflow: 'unset !important'
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
            margin: '0',
            alignItems: 'flex-end',
            position: 'relative',
            zIndex: '2',
            '& > div': {
                marginTop: '-7px !important',
                display: 'flex'
            },
            '& > button > div > span': {
                padding: '0 !important'
            },
            '& button': {
                marginTop: '10px !important'
            },
            '& .Select-control': {
                paddingBottom: '4px'
            }
        },
        searchFieldCustom: {
            width: '250px !important',
            extend: 'inputFieldCustom',
            position: 'initial !important',
            '& label': {
                lineHeight: 'auto !important'
            }
        }
    }),
    connect((state) => {
        const measurement = _.get(state, ['form', 'RemainderTransferForm', 'values', 'product', 'value', 'measurement', 'name'])
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
            const defect = _.get(props, ['defect', 'input', 'value'])
            const onChange = _.get(props, ['products', 'input', 'onChange'])
            const products = _.get(props, ['products', 'input', 'value'])

            if (!_.isEmpty(_.get(product, 'value')) && (amount || defect)) {
                let has = false
                _.map(products, (item) => {
                    if (_.get(item, 'product') === product) {
                        has = true
                    }
                })
                const fields = ['productType', 'product', 'defect', 'amount']
                for (let i = 0; i < fields.length; i++) {
                    let newChange = _.get(props, [fields[i], 'input', 'onChange'])
                    props.dispatch(newChange(null))
                }
                if (!has) {
                    let newArray = [{product, defect, amount}]
                    _.map(products, (obj) => {
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
            const amount = (_.get(props, ['editAmount', 'input', 'value']))
            const defect = (_.get(props, ['editDefect', 'input', 'value']))
            _.map(products, (item, index) => {
                if (index === listIndex) {
                    if (!_.isEmpty(amount)) {
                        item.amount = amount
                    }
                    if (!_.isEmpty(defect)) {
                        item.defect = defect
                    }
                }
            })
            const fields = ['editAmount', 'editDefect']
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
                <Row className={classes.background}>
                    <Col xs={3}>
                        <Field
                            label="Тип товара"
                            name="productType"
                            className={classes.searchFieldCustom}
                            fullWidth={true}
                            component={RemainderProductTypeSearchField}
                            {..._.get(defaultProps, 'productType')}
                        />
                    </Col>

                    <Col xs={4}>
                        <ProductCustomSearchField
                            label="Наименование"
                            className={classes.searchFieldCustom}
                            fullWidth={true}
                            {..._.get(defaultProps, 'product')}
                        />
                    </Col>
                    <Col xs={2}>
                        <TextField
                            label="Кол-во"
                            fullWidth={true}
                            {..._.get(defaultProps, 'amount')}
                        />
                        <span style={{margin: '15px 0 15px 15px', alignSelf: 'flex-end'}}>{measurement}</span>
                    </Col>
                    <Col xs={2}>
                        <TextField
                            label="Брак"
                            fullWidth={true}
                            {..._.get(defaultProps, 'defect')}
                        />
                        <span style={{margin: '15px 0 15px 15px', alignSelf: 'flex-end'}}>{measurement}</span>
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
            <div className={classes.table}>
                {!_.isEmpty(products) && <Table
                    fixedHeader={true}
                    fixedFooter={false}
                    multiSelectable={false}
                    selectable={false}>
                    <TableHeader
                        displaySelectAll={false}
                        adjustForCheckbox={false}
                        enableSelectAll={false}
                        className={classes.title}>
                        <TableRow className={classes.tableRowHead}>
                            <TableHeaderColumn
                                className={classes.tableTitle}>Наименование</TableHeaderColumn>
                            <TableHeaderColumn className={classes.tableTitle}>Брак</TableHeaderColumn>
                            <TableHeaderColumn className={classes.tableTitle}>ОК</TableHeaderColumn>
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
                            const defect = _.get(item, 'defect')
                            const amount = _.get(item, 'amount')
                            const proMeasurement = _.get(item, ['product', 'value', 'measurement', 'name'])

                            if (editItem === index) {
                                return (
                                    <TableRow key={index} className={classes.tableRow}>
                                        <TableRowColumn>{product}</TableRowColumn>
                                        <TableRowColumn>
                                            <TextField
                                                name="editDefect"
                                                hintText={defect}
                                                fullWidth={true}
                                                className={classes.inputFieldCustom}
                                                {..._.get(defaultProps, 'editDefect')}
                                            />
                                        </TableRowColumn>
                                        <TableRowColumn>
                                            <TextField
                                                name="editAmount"
                                                hintText={amount}
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
                                    <TableRowColumn>{numberFormat(defect, proMeasurement)}</TableRowColumn>
                                    <TableRowColumn>{numberFormat(amount, proMeasurement)}</TableRowColumn>
                                    <TableRowColumn style={{textAlign: 'right'}}>
                                        <IconButton
                                            onTouchTap={() => setEditItem(index)}>
                                            <EditIcon color="#666666"/>
                                        </IconButton>
                                        <IconButton onTouchTap={() => handleRemove(index)}>
                                            <DeleteIcon color="#666666"/>
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
