import _ from 'lodash'
import React from 'react'
import {Row} from 'react-flexbox-grid'
import {compose, withReducer, withHandlers} from 'recompose'
import injectSheet from 'react-jss'
import FlatButton from 'material-ui/FlatButton'
import Groceries from '../../Images/groceries.svg'
import {connect} from 'react-redux'
import {Field} from 'redux-form'
import DeleteIcon from '../../DeleteIcon/index'
import ProductTypeSearchField from '../Promotions/ProductTypeSearchField'
import ProductCustomGiftSearchField from '../Promotions/ProductCustomGiftSearchField'
import ProductCustomBonusSearchField from '../Promotions/ProductCustomBonusSearchField'
import TextField from '../Basic/TextField'
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
            display: 'flex',
            margin: '0 -30px',
            '& .dottedList': {
                '& svg': {
                    position: 'absolute',
                    right: '-10px',
                    width: '22px !important',
                    opacity: '0',
                    cursor: 'pointer'
                },
                '&:hover svg': {
                    opacity: '1'
                }
            }
        },
        halfTable: {
            width: '50%',
            padding: '20px 30px',
            '& .dottedList': {
                margin: '10px 0',
                padding: '0',
                '&:after': {
                    display: 'none'
                }
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
            padding: '20px 0',
            margin: '-20px -30px 0',
            backgroundColor: '#f1f5f8',
            position: 'relative',
            '& > div:last-child': {
                alignSelf: 'center',
                textAlign: 'center',
                width: '20%'
            },
            '& > div': {
                textAlign: 'right',
                width: '50%',
                padding: '0 30px'
            },
            '& > div > div > div:first-child': {
                overflow: 'hidden'
            }
        },
        bonusProduct: {
            borderRight: '1px #ccc solid'
        },
        addProduct: {
            marginTop: '10px'
        },
        subTitle: {
            textAlign: 'left',
            fontWeight: 'bold',
            marginBottom: '5px'
        },
        productAmount: {
            display: 'flex',
            justifyContent: 'space-between'
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
        handleAddBonus: props => () => {
            const bonusProduct = _.get(props, ['bonusProduct', 'input', 'value'])
            const bonusAmount = _.get(props, ['bonusAmount', 'input', 'value'])
            const onChange = _.get(props, ['bonusProducts', 'input', 'onChange'])
            const bonusProducts = _.get(props, ['bonusProducts', 'input', 'value'])

            if (!_.isEmpty(bonusProduct) && bonusAmount) {
                let has = false
                _.map(bonusProducts, (item) => {
                    if (_.get(item, 'bonusProduct') === bonusProduct) {
                        item.bonusAmount = _.toInteger(item.bonusAmount) + _.toInteger(bonusAmount)
                        item.giftAmount = _.toInteger(item.giftAmount)
                        has = true
                    }
                })
                if (!has) {
                    onChange(_.union(bonusProducts, [{bonusProduct, bonusAmount}]))
                    has = false
                }
            }
        },

        handleAddGift: props => () => {
            const giftProduct = _.get(props, ['giftProduct', 'input', 'value'])
            const giftAmount = _.get(props, ['giftAmount', 'input', 'value'])
            const onChange = _.get(props, ['giftProducts', 'input', 'onChange'])
            const giftProducts = _.get(props, ['giftProducts', 'input', 'value'])

            if (!_.isEmpty(giftProduct) && giftAmount) {
                let has = false
                _.map(giftProducts, (item) => {
                    if (_.get(item, 'giftProduct') === giftProduct) {
                        item.giftAmount = _.toInteger(item.giftAmount) + _.toInteger(giftAmount)
                        item.giftAmount = _.toInteger(item.giftAmount)
                        has = true
                    }
                })
                if (!has) {
                    onChange(_.union(giftProducts, [{giftProduct, giftAmount}]))
                    has = false
                }
            }
        },

        handleRemoveBonus: props => (listIndex) => {
            const onChange = _.get(props, ['bonusProducts', 'input', 'onChange'])
            const bonusProducts = _(props)
                .get(['bonusProducts', 'input', 'value'])
                .filter((item, index) => index !== listIndex)

            onChange(bonusProducts)
        },

        handleRemoveGift: props => (listIndex) => {
            const onChange = _.get(props, ['giftProducts', 'input', 'onChange'])
            const giftProducts = _(props)
                .get(['giftProducts', 'input', 'value'])
                .filter((item, index) => index !== listIndex)

            onChange(giftProducts)
        }
    })
)

const PricesBonusProductField = ({classes, state, dispatch, handleAddBonus, handleAddGift, handleRemoveBonus, handleRemoveGift, ...defaultProps}) => {
    const bonusProducts = _.get(defaultProps, ['bonusProducts', 'input', 'value']) || []
    const giftProducts = _.get(defaultProps, ['giftProducts', 'input', 'value']) || []
    return (
        <div className={classes.wrapper}>
            <div>
                {!state.open && <div className={classes.headers} style={{marginTop: '-10px'}}>
                    <div className={classes.title}>Список товаров</div>
                    <FlatButton
                        label="+ добавить товар"
                        style={{color: '#12aaeb'}}
                        className={classes.span}
                        onTouchTap={() => dispatch({open: !state.open})}
                    />
                </div>}
                {state.open && <Row className={classes.background}>
                    <div className={classes.bonusProduct}>
                        <div className={classes.subTitle}>Бонусный товар</div>
                        <Field
                            label="Тип товара"
                            name="bonusType"
                            component={ProductTypeSearchField}
                            className={classes.searchFieldCustom}
                            fullWidth={true}
                        />
                        <div className={classes.productAmount}>
                            <div style={{width: '70%'}}>
                                <Field
                                    label="Наименование"
                                    name="bonusProduct"
                                    component={ProductCustomBonusSearchField}
                                    className={classes.searchFieldCustom}
                                    fullWidth={true}
                                />
                            </div>
                            <div style={{width: '25%'}}>
                                <Field
                                    label="Кол-во"
                                    name="bonusAmount"
                                    component={TextField}
                                    className={classes.inputFieldCustom}
                                    fullWidth={true}
                                />
                            </div>
                        </div>
                        <div className={classes.addProduct}>
                            <a onClick={handleAddBonus}>Добавить</a>
                        </div>
                    </div>
                    <div className={classes.giftProduct}>
                        <div className={classes.subTitle}>Товар в подарок</div>
                        <Field
                            label="Тип товара"
                            name="giftType"
                            component={ProductTypeSearchField}
                            className={classes.searchFieldCustom}
                            fullWidth={true}
                        />
                        <div className={classes.productAmount}>
                            <div style={{width: '100%'}}>
                                <Field
                                    label="Наименование"
                                    name="giftProduct"
                                    component={ProductCustomGiftSearchField}
                                    className={classes.searchFieldCustom}
                                    fullWidth={true}
                                />
                            </div>
                        </div>
                        <div className={classes.addProduct}>
                            <a onClick={handleAddGift}>Добавить</a>
                        </div>
                    </div>
                </Row>}
            </div>
            {(!_.isEmpty(bonusProducts) || !_.isEmpty(giftProducts))
            ? <div className={classes.table}>
                    {(!_.isEmpty(bonusProducts)) && <div className={classes.halfTable}>
                        <div className={classes.subTitle}>При покупке:</div>
                        {_.map(bonusProducts, (item, index) => {
                            const bonusProduct = _.get(item, ['bonusProduct', 'value', 'name'])
                            const bonusMeasurement = _.get(item, ['bonusProduct', 'value', 'measurement', 'name'])
                            const bonusAmount = numberFormat(_.get(item, 'bonusAmount'), bonusMeasurement)
                            return (
                                <div key={index} className="dottedList">
                                    <div>{bonusProduct} - {bonusAmount}</div>
                                    <DeleteIcon color="#666666" onClick={() => { handleRemoveBonus(index) }}/>
                                </div>
                            )
                        })}
                    </div>}
                    {(!_.isEmpty(giftProducts)) && <div className={classes.halfTable}>
                        <div className={classes.subTitle}>Клиент получает в подарок:</div>
                        {_.map(giftProducts, (item, index) => {
                            const giftProduct = _.get(item, ['giftProduct', 'value', 'name'])
                            const giftMeasurement = _.get(item, ['giftProduct', 'value', 'measurement', 'name'])
                            const giftAmount = numberFormat(_.get(item, 'giftAmount'), giftMeasurement)
                            return (
                                <div key={index} className="dottedList">
                                    <div>{giftProduct} - {giftAmount}</div>
                                    <DeleteIcon color="#666666" onClick={() => { handleRemoveGift(index) }}/>
                                </div>
                            )
                        })}
                    </div>}
                </div>
            : <div className={classes.imagePlaceholder}>
                    <div style={{textAlign: 'center', color: '#adadad'}}>
                        <img src={Groceries} alt=""/>
                        <div>Вы еще не выбрали ни одного товара. <br/> <a onClick={() => dispatch({open: !state.open})}>Добавить</a>
                            товар?
                        </div>
                    </div>
                </div>}
        </div>
    )
}

export default enhance(PricesBonusProductField)
