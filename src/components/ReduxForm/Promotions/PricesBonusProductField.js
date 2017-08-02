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
import DeleteIcon from '../../DeleteIcon/index'
import ProductTypeSearchField from '../Product/ProductTypeSearchField'
import ProductCustomSearchField from '../Supply/ProductCustomSearchField'
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
            marginTop: '20px',
            '& .row': {
                margin: '0',
                height: '40px',
                '&:first-child': {
                    fontWeight: '600'
                },
                '&:last-child:after': {
                    display: 'none'
                },
                '& > div': {
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    padding: '0 8px',
                    overflow: 'hidden',
                    '&:first-child': {
                        paddingLeft: '0'
                    },
                    '&:last-child': {
                        paddingRight: '0'
                    }
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
            }
        },
        bonusProduct: {
            borderRight: '1px #ccc solid',
            padding: '0 30px',
            width: '40%'
        },
        giftProduct: {
            extend: 'bonusProduct'
        },
        subTitle: {
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
        handleAdd: props => () => {
            const bonusProduct = _.get(props, ['bonusProduct', 'input', 'value'])
            const bonusAmount = _.get(props, ['bonusAmount', 'input', 'value'])
            const giftProduct = _.get(props, ['giftProduct', 'input', 'value'])
            const giftAmount = _.get(props, ['giftAmount', 'input', 'value'])
            const onChange = _.get(props, ['bonusProducts', 'input', 'onChange'])
            const bonusProducts = _.get(props, ['bonusProducts', 'input', 'value'])

            if (!_.isEmpty(bonusProduct) && bonusAmount) {
                let has = false
                _.map(bonusProducts, (item) => {
                    if (_.get(item, 'bonusProduct') === bonusProduct && _.get(item, 'giftProduct') === giftProduct) {
                        item.bonusAmount = _.toInteger(item.bonusAmount) + _.toInteger(bonusAmount)
                        item.giftAmount = _.toInteger(item.giftAmount) + _.toInteger(giftAmount)
                        has = true
                    }
                })
                if (!has) {
                    onChange(_.union(bonusProducts, [{bonusProduct, bonusAmount, giftProduct, giftAmount}]))
                    has = false
                }
            }
        },

        handleRemove: props => (listIndex) => {
            const onChange = _.get(props, ['bonusProducts', 'input', 'onChange'])
            const bonusProducts = _(props)
                .get(['bonusProducts', 'input', 'value'])
                .filter((item, index) => index !== listIndex)

            onChange(bonusProducts)
        }
    })
)

const PricesBonusProductField = ({classes, state, dispatch, handleAdd, handleRemove, ...defaultProps}) => {
    const bonusProducts = _.get(defaultProps, ['bonusProducts', 'input', 'value']) || []
    const error = _.get(defaultProps, ['bonusProducts', 'meta', 'error'])
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
                            name="bonusProductType"
                            component={ProductTypeSearchField}
                            className={classes.inputFieldCustom}
                            fullWidth={true}
                        />
                        <div className={classes.productAmount}>
                            <div style={{width: '70%'}}>
                                <Field
                                    label="Наименование"
                                    name="bonusProduct"
                                    component={ProductCustomSearchField}
                                    className={classes.inputFieldCustom}
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
                    </div>
                    <div className={classes.giftProduct}>
                        <div className={classes.subTitle}>Товар в подарок</div>
                        <Field
                            label="Тип товара"
                            name="giftProductType"
                            component={ProductTypeSearchField}
                            className={classes.inputFieldCustom}
                            fullWidth={true}
                        />
                        <div className={classes.productAmount}>
                            <div style={{width: '70%'}}>
                                <Field
                                    label="Наименование"
                                    name="giftProduct"
                                    component={ProductCustomSearchField}
                                    className={classes.inputFieldCustom}
                                    fullWidth={true}
                                />
                            </div>
                            <div style={{width: '25%'}}>
                                <Field
                                    label="Кол-во"
                                    name="giftAmount"
                                    component={TextField}
                                    className={classes.inputFieldCustom}
                                    fullWidth={true}
                                />
                            </div>
                        </div>
                    </div>
                    <div>
                        <FlatButton
                            label="Добавить"
                            labelStyle={{color: '#12aaeb'}}
                            onTouchTap={handleAdd}/>
                    </div>
                </Row>}
            </div>
            {error && <div className={classes.error}>{error}</div>}
            {!_.isEmpty(bonusProducts)
                ? <div className={classes.table}>
                    <div className={classes.subTitle}>Список бонусных товаров</div>
                    <div>
                        <Row className="dottedList">
                            <Col style={{width: '34%'}}>Бонусный товар</Col>
                            <Col style={{width: '11%'}}>Кол-во</Col>
                            <Col style={{width: '34%'}}>Подарок</Col>
                            <Col style={{width: '11%'}}>Кол-во</Col>
                        </Row>
                        {_.map(bonusProducts, (item, index) => {
                            const bonusProduct = _.get(item, ['bonusProduct', 'value', 'name'])
                            const bonusMeasurement = _.get(item, ['bonusProduct', 'value', 'measurement', 'name'])
                            const bonusAmount = numberFormat(_.get(item, 'bonusAmount'), bonusMeasurement)
                            const giftProduct = _.get(item, ['giftProduct', 'value', 'name'])
                            const giftMeasurement = _.get(item, ['giftProduct', 'value', 'measurement', 'name'])
                            const giftAmount = numberFormat(_.get(item, 'giftAmount'), giftMeasurement)

                            return (
                                <Row key={index} className="dottedList">
                                    <Col style={{width: '34%'}}>{bonusProduct}</Col>
                                    <Col style={{width: '11%'}}>{bonusAmount}</Col>
                                    <Col style={{width: '34%'}}>{giftProduct}</Col>
                                    <Col style={{width: '11%'}}>{giftAmount}</Col>
                                    <Col style={{width: '10%'}}>
                                        <IconButton onTouchTap={() => handleRemove(index)}>
                                            <DeleteIcon color="#666666"/>
                                        </IconButton>
                                    </Col>
                                </Row>
                            )
                        })}
                    </div>
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

export default enhance(PricesBonusProductField)
