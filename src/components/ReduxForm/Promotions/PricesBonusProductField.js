import _ from 'lodash'
import React from 'react'
import {Row} from 'react-flexbox-grid'
import {compose, withReducer, withHandlers} from 'recompose'
import injectSheet from 'react-jss'
import FlatButton from 'material-ui/FlatButton'
import Groceries from '../../Images/groceries.svg'
import {connect} from 'react-redux'
import {Field} from 'redux-form'
import DeleteIcon from 'material-ui/svg-icons/action/delete-forever'
import ProductTypeSearchField from '../Promotions/ProductTypeSearchField'
import ProductCustomGiftSearchField from '../Promotions/ProductCustomGiftSearchField'
import ProductCustomBonusSearchField from '../Promotions/ProductCustomBonusSearchField'
import TextField from '../Basic/TextField'
import numberFormat from '../../../helpers/numberFormat'
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
            background: '#ffebee',
            borderRadius: '2px',
            color: '#f44336',
            fontSize: '13px',
            textAlign: 'center',
            marginTop: '10px',
            padding: '10px 15px'
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
            '& > div': {
                width: '50%',
                padding: '0 30px'
            }
        },
        product: {
            borderRight: '1px #ccc solid'
        },
        addProduct: {
            marginTop: '10px',
            textAlign: 'right'
        },
        subTitle: {
            textAlign: 'left',
            fontWeight: 'bold',
            marginBottom: '5px'
        },
        productAmount: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            '& .Select-control': {
                paddingBottom: '3px'
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
        handleAddBonus: props => () => {
            const product = _.get(props, ['product', 'input', 'value'])
            const onChange = _.get(props, ['products', 'input', 'onChange'])
            const products = _.get(props, ['products', 'input', 'value'])

            if (!_.isEmpty(product)) {
                let has = false
                _.map(products, (item) => {
                    if (_.get(item, 'product') === product) {
                        has = true
                    }
                })
                if (!has) {
                    onChange(_.union(products, [{product}]))
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
            const onChange = _.get(props, ['products', 'input', 'onChange'])
            const products = _(props)
                .get(['products', 'input', 'value'])
                .filter((item, index) => index !== listIndex)

            onChange(products)
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
    const products = _.get(defaultProps, ['products', 'input', 'value']) || []
    const giftProducts = _.get(defaultProps, ['giftProducts', 'input', 'value']) || []
    const error = _.get(defaultProps, ['products', 'meta', 'error', 'products'])
    return (
        <div className={classes.wrapper}>
            <div>
                {!state.open && <div className={classes.headers} style={{marginTop: '-10px'}}>
                    <div className={classes.title}>{t('Список товаров')}</div>
                    <FlatButton
                        label={'+ ' + t('добавить товар')}
                        style={{color: '#12aaeb'}}
                        className={classes.span}
                        labelStyle={{fontSize: '13px'}}
                        onTouchTap={() => dispatch({open: !state.open})}
                    />
                </div>}
                {state.open && <Row className={classes.background}>
                    <div className={classes.product}>
                        <div className={classes.subTitle}>{t('Бонусный товар')}</div>
                        <Field
                            label={t('Тип товара')}
                            name="type"
                            component={ProductTypeSearchField}
                            className={classes.searchFieldCustom}
                            fullWidth={true}
                        />
                        <div className={classes.productAmount}>
                            <div style={{width: '100%'}}>
                                <Field
                                    label={t('Наименование')}
                                    name="product"
                                    component={ProductCustomBonusSearchField}
                                    className={classes.searchFieldCustom}
                                    fullWidth={true}
                                />
                            </div>
                        </div>
                        <div className={classes.addProduct}>
                            <a onClick={handleAddBonus}>{t('Добавить')}</a>
                        </div>
                    </div>
                    <div className={classes.giftProduct}>
                        <div className={classes.subTitle}>{t('Товар в подарок')}</div>
                        <Field
                            label={t('Тип товара')}
                            name="giftType"
                            component={ProductTypeSearchField}
                            className={classes.searchFieldCustom}
                            fullWidth={true}
                        />
                        <div className={classes.productAmount}>
                            <div style={{width: '70%'}}>
                                <Field
                                    label={t('Наименование')}
                                    name="giftProduct"
                                    component={ProductCustomGiftSearchField}
                                    className={classes.searchFieldCustom}
                                    fullWidth={true}
                                />
                            </div>
                            <div style={{width: '25%'}}>
                                <Field
                                    label={t('Кол-во')}
                                    name="giftAmount"
                                    component={TextField}
                                    className={classes.inputFieldCustom}
                                    fullWidth={true}
                                />
                            </div>
                        </div>
                        <div className={classes.addProduct}>
                            <a onClick={handleAddGift}>{t('Добавить')}</a>
                        </div>
                    </div>
                </Row>}
            </div>
            {error && <div className={classes.error}>{error}</div>}
            {(!_.isEmpty(products) || !_.isEmpty(giftProducts))
            ? <div className={classes.table}>
                    {(!_.isEmpty(products)) && <div className={classes.halfTable}>
                        <div className={classes.subTitle}>{t('При покупке')}:</div>
                        {_.map(products, (item, index) => {
                            const product = _.get(item, ['product', 'value', 'name'])
                            return (
                                <div key={index} className="dottedList">
                                    <div>{product}</div>
                                    <DeleteIcon color="#666666" onClick={() => { handleRemoveBonus(index) }}/>
                                </div>
                            )
                        })}
                    </div>}
                    {(!_.isEmpty(giftProducts)) && <div className={classes.halfTable}>
                        <div className={classes.subTitle}>{t('Клиент получает в подарок')}:</div>
                        {_.map(giftProducts, (item, index) => {
                            const giftProduct = _.get(item, ['giftProduct', 'value', 'name'])
                            const giftMeasurement = _.get(item, ['giftProduct', 'value', 'measurement', 'name'])
                            const giftAmount = _.get(item, 'giftAmount')
                            return (
                                <div key={index} className="dottedList">
                                    <div>{giftProduct} {(giftAmount) && <span>- {numberFormat(giftAmount, giftMeasurement)}</span>}</div>
                                    <DeleteIcon color="#666666" onClick={() => { handleRemoveGift(index) }}/>
                                </div>
                            )
                        })}
                    </div>}
                </div>
            : <div className={classes.imagePlaceholder}>
                    <div style={{textAlign: 'center', color: '#adadad'}}>
                        <img src={Groceries} alt=""/>
                        <div>{t('Вы еще не выбрали ни одного товара')}. <br/> <a onClick={() => dispatch({open: !state.open})}>{t('Добавить')}</a> {t('товар')}?
                        </div>
                    </div>
                </div>}
        </div>
    )
}

export default enhance(PricesBonusProductField)
