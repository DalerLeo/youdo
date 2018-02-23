import _ from 'lodash'
import React from 'react'
import {compose, withReducer, withHandlers, withState} from 'recompose'
import injectSheet from 'react-jss'
import {Row, Col} from 'react-flexbox-grid'
import IconButton from 'material-ui/IconButton'
import Check from 'material-ui/svg-icons/navigation/check'
import DeleteIcon from 'material-ui/svg-icons/action/delete-forever'
import TextField from '../Basic/TextField'
import EditIcon from 'material-ui/svg-icons/editor/mode-edit'
import numberFormat from '../../../helpers/numberFormat'
import t from '../../../helpers/translate'
import Groceries from '../../Images/groceries.svg'
import {TYPE_PRODUCT} from '../../Manufacture'

const enhance = compose(
    injectSheet({
        productsList: {
            padding: '0 30px',
            '& .row': {
                margin: '0',
                padding: '0',
                height: '50px',
                '&:first-child': {fontWeight: '600'},
                '&:last-child:after': {display: 'none'},
                '& > div': {
                    '&:first-child': {paddingLeft: '0'},
                    '&:last-child': {paddingRight: '0'}
                }
            }
        },
        alignRight: {
            textAlign: 'right'
        },
        imagePlaceholder: {
            padding: '50px 0',
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            '& > div': {
                textAlign: 'center',
                color: '#adadad'
            },
            '& img': {
                width: '70px',
                marginBottom: '20px',
                marginTop: '25px'
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
        buttons: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end'
        }
    }),
    withReducer('state', 'dispatch', (state, action) => {
        return {...state, ...action}
    }, {open: false}),
    withState('editItem', 'setEditItem', null),

    withHandlers({
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
                const newChange = _.get(props, [fields[i], 'input', 'onChange'])
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

const THREE = 3
const FIVE = 5
const ShipmentProductsMaterialsList = ({dialogType, classes, handleRemove, handleEdit, editItem, setEditItem, handleOpenAddProduct, ...defaultProps}) => {
    const products = _.get(defaultProps, ['products', 'input', 'value']) || []
    const iconStyle = {
        button: {
            width: 22,
            height: 22,
            padding: 0,
            marginLeft: 10
        },
        icon: {
            width: 22,
            height: 22
        }
    }
    return !_.isEmpty(products)
        ? (
            <div className={classes.productsList}>
                <Row className="dottedList">
                    <Col xs={dialogType === TYPE_PRODUCT ? THREE : FIVE}>{t('Наименование')}</Col>
                    <Col xs={3}>{t('Тип')}</Col>
                    <Col xs={2} className={classes.alignRight}>{dialogType === TYPE_PRODUCT ? 'ОК' : t('Кол-во')}</Col>
                    {dialogType === TYPE_PRODUCT && <Col xs={2} className={classes.alignRight}>{t('Брак')}</Col>}
                    <Col xs={2}/>
                </Row>
                {_.map(products, (item, index) => {
                    const product = _.get(item, ['product', 'value', 'name'])
                    const type = _.get(item, ['product', 'value', 'type'])
                    const measurement = _.get(item, ['product', 'value', 'measurement', 'name'])
                    const defect = numberFormat(_.get(item, 'defect'), measurement)
                    const amount = numberFormat(_.get(item, 'amount'), measurement)

                    if (editItem === index) {
                        return (
                            <Row key={index} className="dottedList">
                                <Col xs={dialogType === TYPE_PRODUCT ? THREE : FIVE}>{product}</Col>
                                <Col xs={3}>{type}</Col>
                                <Col xs={2} className={classes.alignRight}>
                                    <TextField
                                        name="editAmount"
                                        hintText={amount}
                                        hintStyle={{right: 0}}
                                        inputStyle={{textAlign: 'right'}}
                                        fullWidth={true}
                                        className={classes.inputFieldCustom}
                                        {..._.get(defaultProps, 'editAmount')}/>
                                </Col>
                                {dialogType === TYPE_PRODUCT &&
                                <Col xs={2} className={classes.alignRight}>
                                    <TextField
                                        name="editDefect"
                                        hintText={defect}
                                        hintStyle={{right: 0}}
                                        inputStyle={{textAlign: 'right'}}
                                        fullWidth={true}
                                        className={classes.inputFieldCustom}
                                        {..._.get(defaultProps, 'editDefect')}/>
                                </Col>}
                                <Col xs={2} style={{textAlign: 'right', width: '118px'}}>
                                    <IconButton
                                        onTouchTap={() => { handleEdit(index) }}>
                                        <Check color="#12aaeb"/>
                                    </IconButton>
                                </Col>
                            </Row>
                        )
                    }
                    return (
                        <Row key={index} className="dottedList">
                            <Col xs={dialogType === TYPE_PRODUCT ? THREE : FIVE}>{product}</Col>
                            <Col xs={3}>{type}</Col>
                            <Col xs={2} className={classes.alignRight}>{amount}</Col>
                            {dialogType === TYPE_PRODUCT && <Col xs={2} className={classes.alignRight}>{defect}</Col>}
                            <Col xs={2} className={classes.buttons}>
                                <IconButton
                                    style={iconStyle.button}
                                    iconStyle={iconStyle.icon}
                                    disableTouchRipple={true}
                                    onTouchTap={() => setEditItem(index)}>
                                    <EditIcon color="#666666"/>
                                </IconButton>
                                <IconButton
                                    style={iconStyle.button}
                                    iconStyle={iconStyle.icon}
                                    disableTouchRipple={true}
                                    onTouchTap={() => handleRemove(index)}>
                                    <DeleteIcon color="#666666"/>
                                </IconButton>
                            </Col>
                        </Row>
                    )
                })}
            </div>
        )
        : (
            <div className={classes.imagePlaceholder}>
                <div>
                    <img src={Groceries} alt=""/>
                    <div>{t('Вы еще не выбрали ни одного товара')}...<br/>
                        <a onClick={handleOpenAddProduct}>{t('добавить товары')}?</a>
                    </div>
                </div>
            </div>
        )
}

export default enhance(ShipmentProductsMaterialsList)
