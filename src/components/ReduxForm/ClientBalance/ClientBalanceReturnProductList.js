import _ from 'lodash'
import React from 'react'
import {compose, withState, withReducer, withHandlers} from 'recompose'
import {Row, Col} from 'react-flexbox-grid'
import injectSheet from 'react-jss'
import {Field} from 'redux-form'
import IconButton from 'material-ui/IconButton'
import FlatButton from 'material-ui/FlatButton'
import Groceries from '../../Images/groceries.svg'
import {connect} from 'react-redux'
import getConfig from '../../../helpers/getConfig'
import toBoolean from '../../../helpers/toBoolean'
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
import ProductCustomSearchField from './ProductCustomSearchField'
import {TextField} from '../../ReduxForm'
import ClientBalanceProductTypeSearchField from './ClientBalanceProductTypeSearchField'
import Check from 'material-ui/svg-icons/navigation/check'
import t from '../../../helpers/translate'

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
                width: '400px'
            },
            '& tr': {
                border: 'none !important'
            },
            '& td': {
                height: '40px !important',
                padding: '0 5px !important'
            },
            '& th:first-child': {
                width: '400px',
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
            alignItems: 'flex-end',
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
            }
        }
    }),
    connect((state) => {
        const currency = _.get(state, ['form', 'ReturnCreateForm', 'values', 'currency', 'text'])
        const client = _.get(state, ['form', 'ReturnCreateForm', 'values', 'client', 'value'])
        const measurement = _.get(state, ['form', 'ReturnCreateForm', 'values', 'product', 'value', 'measurement', 'name'])
        const market = _.get(state, ['form', 'ReturnCreateForm', 'values', 'market', 'value'])
        return {
            currency,
            measurement,
            market,
            client
        }
    }),
    withReducer('state', 'dispatch', (state, action) => {
        return {...state, ...action}
    }, {open: false}),
    withState('editItem', 'setEditItem', null),

    withHandlers({
        handleAdd: props => () => {
            const product = _.get(props, ['product', 'input', 'value'])
            const amount = numberWithoutSpaces(_.get(props, ['amount', 'input', 'value']))
            const currency = _.get(props, 'currency')
            const measurement = _.get(props, ['measurement'])
            const onChange = _.get(props, ['products', 'input', 'onChange'])
            const products = _.get(props, ['products', 'input', 'value'])
            if (!_.isEmpty(_.get(product, 'value')) && amount) {
                let has = false
                _.map(products, (item) => {
                    if (_.get(item, 'product') === product) {
                        has = true
                    }
                })
                const fields = ['amount', 'product']
                for (let i = 0; i < fields.length; i++) {
                    let newChange = _.get(props, [fields[i], 'input', 'onChange'])
                    props.dispatch(newChange(null))
                }

                if (!has) {
                    let newArray = [{product, amount, currency, measurement}]
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
            const amount = numberWithoutSpaces(_.get(props, ['editAmount', 'input', 'value']))
            _.map(products, (item, index) => {
                if (index === listIndex) {
                    if (!_.isEmpty(amount) && item.amount !== amount) {
                        item.amount = _.toNumber(amount)
                    }
                }
            })
            const fields = ['editAmount']
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

const ClientBalanceReturnProductField = ({classes, state, dispatch, handleAdd, handleEdit, handleRemove, editItem, setEditItem, measurement, isUpdate, editOnlyCost, market, currency, client, handleOpenAddProduct, ...defaultProps}) => {
    const products = _.get(defaultProps, ['products', 'input', 'value']) || []
    const error = _.get(defaultProps, ['products', 'meta', 'error'])
    const configMarkets = toBoolean(getConfig('MARKETS_MODULE'))
    const withMarket = configMarkets ? market : true
    return (
        <div className={classes.wrapper}>
            <div>
                <div className={classes.headers} style={{marginTop: '-10px'}}>
                    <div className={classes.title}>{t('Список товаров')}</div>
                    {!isUpdate && (withMarket && client) &&
                    <div>
                        <FlatButton
                            label={'+ ' + t('добавить товар')}
                            style={{color: '#12aaeb'}}
                            labelStyle={{fontSize: '13px'}}
                            className={classes.span}
                            onTouchTap={() => dispatch({open: !state.open})}
                        />
                        <FlatButton
                            label={'+ ' + t('добавить из списка')}
                            style={{color: '#12aaeb'}}
                            labelStyle={{fontSize: '13px'}}
                            className={classes.span}
                            onTouchTap={handleOpenAddProduct}
                        />
                    </div>}
                </div>
                {state.open && <Row className={classes.background}>
                    <Col xs={3}>
                        <Field
                            label={t('Тип товара')}
                            name="type"
                            component={ClientBalanceProductTypeSearchField}
                            className={classes.searchFieldCustom}
                            fullWidth={true}
                            {..._.get(defaultProps, 'type')}
                        />
                    </Col>
                    <Col xs={3}>
                        <ProductCustomSearchField
                            name="product"
                            label={t('Наименование')}
                            className={classes.searchFieldCustom}
                            addProduct={true}
                            fullWidth={true}
                            {..._.get(defaultProps, 'product')}
                        />
                    </Col>
                    <Col xs={2}>
                        <Field
                            component={TextField}
                            label={t('Кол-во')}
                            name="amount"
                            className={classes.inputFieldCustom}
                            fullWidth={true}
                            {..._.get(defaultProps, 'amount')}
                        />
                    </Col>
                    <Col xs={1} style={{alignSelf: 'flex-end'}}>
                        <div style={{paddingBottom: '15px'}}>
                            {measurement}
                        </div>
                    </Col>
                    <Col xs={1}>
                        <IconButton
                            label={t('Применить')}
                            onTouchTap={handleAdd}>
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
                    selectable={false}
                    multiSelectable={false}>
                    <TableHeader
                        displaySelectAll={false}
                        adjustForCheckbox={false}
                        enableSelectAll={false}
                        className={classes.title}>
                        <TableRow className={classes.tableRow}>
                            <TableHeaderColumn
                                className={classes.tableTitle}>{t('Наименование')}</TableHeaderColumn>
                            <TableHeaderColumn className={classes.tableTitle}>{t('Кол-во')}</TableHeaderColumn>
                            <TableHeaderColumn/>
                        </TableRow>
                    </TableHeader>
                    <TableBody
                        displayRowCheckbox={false}
                        deselectOnClickaway={false}
                        showRowHover={false}
                        stripedRows={false}>
                        {_.map(products, (item, index) => {
                            const product = _.get(item, ['product', 'value', 'name'])
                            const itemMeasurement = _.get(item, ['product', 'value', 'measurement', 'name'])
                            const amount = _.toNumber(_.get(item, 'amount'))

                            if (editItem === index) {
                                return (
                                    <TableRow key={index} className={classes.tableRow}>
                                        <TableRowColumn>{product}</TableRowColumn>
                                        <TableRowColumn>
                                            {!editOnlyCost
                                            // If RETURN NOT COMPLETED can change amount otherwise only PRICE
                                            ? <TextField
                                                hintText={amount}
                                                className={classes.inputFieldCustom}
                                                fullWidth={true}
                                                {..._.get(defaultProps, 'editAmount')}
                                            />
                                            : <TableRowColumn>{amount} {itemMeasurement}</TableRowColumn>}
                                        </TableRowColumn>
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
                                    <TableRowColumn>{amount} {itemMeasurement}</TableRowColumn>
                                    <TableRowColumn style={{textAlign: 'right'}}>
                                        <IconButton
                                            onTouchTap={() => setEditItem(index)}
                                            style={iconStyle.button}
                                            iconStyle={iconStyle.icon}>
                                            <EditIcon color="#666666"/>
                                        </IconButton>
                                        <IconButton
                                            disabled={editOnlyCost}
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
                        {isUpdate
                            ? <div>{t('Список возвращаемого товара пуст')}.</div>
                            : (withMarket && currency && client)
                                ? <div>{t('Вы еще не выбрали ни одного товара')}. <br/> <a onClick={() => dispatch({open: !state.open})}>{t('Добавить')}</a> {t('товар')}?</div>
                                : <div>{t('Для добавления товаров')} <br/>{t('выберите магазин и прайс-лист')}.</div>}
                    </div>
                </div>
            }
        </div>
    )
}

export default enhance(ClientBalanceReturnProductField)
