import _ from 'lodash'
import React from 'react'
import {compose, withReducer, withState, withHandlers} from 'recompose'
import injectSheet from 'react-jss'
import {Row, Col} from 'react-flexbox-grid'
import IconButton from 'material-ui/IconButton'
import {Field} from 'redux-form'
import Groceries from '../../Images/groceries.svg'
import {
    Table,
    TableBody,
    TableHeader,
    TableHeaderColumn,
    TableRow,
    TableRowColumn
} from 'material-ui/Table'
import ImageCheck from 'material-ui/svg-icons/navigation/check'
import DeleteIcon from 'material-ui/svg-icons/action/delete-forever'
import EditIcon from 'material-ui/svg-icons/editor/mode-edit'
import ContentAdd from 'material-ui/svg-icons/content/add'
import ProductCustomSearchField from './ProductCustomSearchField'
import TextField from '../Basic/TextField'
import {connect} from 'react-redux'
import numberWithoutSpaces from '../../../helpers/numberWithoutSpaces'
import numberFormat from '../../../helpers/numberFormat'
import normalizeNumber from '../normalizers/normalizeNumber'
import t from '../../../helpers/translate'

const enhance = compose(
    injectSheet({
        wrapper: {
            display: 'flex',
            flexDirection: 'column'
        },
        imagePlaceholder: {
            width: '100%',
            height: '100%',
            display: 'flex',
            margin: '20px 0',
            justifyContent: 'center',
            alignItems: 'center',
            '& img': {
                width: '70px',
                marginBottom: '20px',
                marginTop: '25px'
            }
        },
        table: {
            margin: '20px 0 10px'
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
        titleAdd: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: '20px'
        },
        addRaw: {
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            margin: '5px -7px'
        }
    }),
    withState('openAddMaterials', 'setOpenAddMaterials', false),
    withReducer('state', 'dispatch', (state, action) => {
        return {...state, ...action}
    }, {open: false}),
    connect((state) => {
        const measurementName = _.get(state, ['product', 'extra', 'data', 'measurement', 'name'])
        const product = _.get(state, ['form', 'ManufactureAddProductForm', 'values', 'product', 'value'])
        return {
            product,
            measurementName
        }
    }),
    withState('editItem', 'setEditItem', null),
    withHandlers({
        handleAdd: props => (product) => {
            const ingredient = _.get(props, ['ingredient', 'input', 'value'])
            const amount = _.get(props, ['amount', 'input', 'value'])
            const measurement = _.get(props, 'measurementName')
            const onChange = _.get(props, ['ingredients', 'input', 'onChange'])
            const ingredients = _.get(props, ['ingredients', 'input', 'value'])
            if (!_.isEmpty(ingredient) && !_.isEmpty(amount)) {
                let has = false
                _.map(ingredients, (item) => {
                    if (_.get(item, ['ingredient', 'value', 'id']) === _.get(ingredient, ['value', 'id']) || product === ingredient) {
                        has = true
                    }
                })
                const fields = ['ingredient', 'amount']
                for (let i = 0; i < fields.length; i++) {
                    const newChange = _.get(props, [fields[i], 'input', 'onChange'])
                    newChange(null)
                }

                if (!has && product !== _.get(ingredient, ['value', 'id'])) {
                    let newArray = [{ingredient, amount, measurement}]
                    _.map(ingredients, (obj) => {
                        newArray.push(obj)
                    })
                    onChange(newArray)
                    has = false
                }
            }
        },

        handleEdit: props => (listIndex) => {
            const {setEditItem} = props
            const ingredients = _.get(props, ['ingredients', 'input', 'value'])
            const amount = numberWithoutSpaces(_.get(props, ['editAmount', 'input', 'value']))
            _.map(ingredients, (item, index) => {
                if (index === listIndex) {
                    if (!_.isEmpty(amount)) {
                        item.amount = numberWithoutSpaces(amount)
                    }
                }
            })
            setEditItem(null)
        },

        handleRemove: props => (listIndex) => {
            const onChange = _.get(props, ['ingredients', 'input', 'onChange'])
            const ingredients = _(props)
                .get(['ingredients', 'input', 'value'])
                .filter((item, index) => index !== listIndex)

            onChange(ingredients)
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

const ManufactureListMaterialField = ({classes, measurementName, handleAdd, product, handleEdit, editItem, setEditItem, handleRemove, openAddMaterials, setOpenAddMaterials, ...defaultProps}) => {
    const ingredients = _.get(defaultProps, ['ingredients', 'input', 'value']) || []

    return (
        <div className={classes.wrapper}>
            <div className={classes.titleAdd}>
                <h3>{t('Сырье')}</h3>
                <a onClick={() => { setOpenAddMaterials(!openAddMaterials) }}>
                    <ContentAdd style={{height: '13px', width: '13px', color: 'rgb(18, 170, 235)'}}
                                viewBox="0 0 24 15"/>
                    <span>{t('добавить сырье')}</span>
                </a>
            </div>
            {openAddMaterials && <div className={classes.addMaterials}>
                <Row className={classes.addRaw}>
                    <Col xs={7}>
                        <Field
                            component={ProductCustomSearchField}
                            label={t('Наименование товара')}
                            name="ingredient"
                            className={classes.searchFieldCustom}
                            fullWidth={true}
                            {..._.get(defaultProps, 'ingredient')}
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
                    <Col xs={1} style={{height: '32px'}}>
                        {measurementName}
                    </Col>
                    <IconButton onTouchTap={() => { handleAdd(product) }}>
                        <ImageCheck color="#129fdd"/>
                    </IconButton>
                </Row>
            </div>}
            {!_.isEmpty(ingredients) ? <div className={classes.table}>
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
                                <TableHeaderColumn className={classes.tableTitle}>{t('Ед')}</TableHeaderColumn>
                                <TableHeaderColumn/>
                            </TableRow>
                        </TableHeader>
                        <TableBody
                            displayRowCheckbox={false}
                            deselectOnClickaway={false}
                            showRowHover={false}
                            stripedRows={false}>
                            {_.map(ingredients, (item, index) => {
                                const ingredient = _.get(item, ['ingredient', 'value', 'name'])
                                const amount = numberFormat(_.get(item, 'amount'))
                                const itemMeasurement = _.get(item, 'measurement')
                                if (editItem === index) {
                                    return (
                                        <TableRow key={index} className={classes.tableRow}>
                                            <TableRowColumn>{ingredient}</TableRowColumn>
                                            <TableRowColumn>
                                                <Field
                                                    name={'editAmount'}
                                                    placeholder={amount}
                                                    component={TextField}
                                                    className={classes.inputFieldEdit}
                                                    normalize={normalizeNumber}
                                                    {..._.get(defaultProps, 'editAmount')}
                                                />
                                            </TableRowColumn>
                                            <TableRowColumn>{itemMeasurement}</TableRowColumn>
                                            <TableRowColumn style={{textAlign: 'right'}}>
                                                <IconButton
                                                    onTouchTap={() => { handleEdit(index) }}>
                                                    <ImageCheck color="#12aaeb"/>
                                                </IconButton>
                                            </TableRowColumn>
                                        </TableRow>
                                    )
                                }
                                return (
                                    <TableRow key={index} className={classes.tableRow}>
                                        <TableRowColumn>{ingredient}</TableRowColumn>
                                        <TableRowColumn>{amount}</TableRowColumn>
                                        <TableRowColumn>{itemMeasurement}</TableRowColumn>
                                        <TableRowColumn style={{textAlign: 'right'}}>
                                            <IconButton
                                                onTouchTap={() => setEditItem(index)}
                                                style={iconStyle.button}
                                                iconStyle={iconStyle.icon}>
                                                <EditIcon/>
                                            </IconButton>
                                            <IconButton
                                                style={iconStyle.button}
                                                iconStyle={iconStyle.icon}
                                                onTouchTap={() => handleRemove(index)}>
                                                <DeleteIcon/>
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
                        <div>{t('Вы еще не выбрали')} <br/> {t('ни одного сырья')}</div>
                    </div>
                </div>
            }
        </div>
    )
}

export default enhance(ManufactureListMaterialField)
