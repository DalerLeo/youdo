import React from 'react'
import {Row, Col} from 'react-flexbox-grid'
import IconButton from 'material-ui/IconButton'
import injectSheet from 'react-jss'
import {compose} from 'recompose'
import Close from 'material-ui/svg-icons/navigation/close'

const enhance = compose(
    injectSheet({
        wrapper: {
            background: '#fff',
            padding: '20px 30px',
            width: '100%',
            height: '100%',
            zIndex: '999',
            overflowY: 'auto',
            boxSizing: 'border-box'
        },
        closeBtn: {
            position: 'absolute !important',
            top: '5px',
            right: '5px',
            opacity: '0'
        },
        item: {
            width: '100%',
            marginBottom: '30px'
        },
        title: {
            display: 'flex',
            justifyContent: 'space-between',
            '& span': {
                fontWeight: 'bold',
                fontSize: '18px !important',
                marginBottom: '10px'
            },
            '& div': {
                fontSize: '11px',
                color: '#999'
            }
        },
        info: {
            display: 'flex',
            justifyContent: 'space-between'
        },
        block: {
            display: 'flex',
            '& ul': {
                marginLeft: '40px',
                '&:first-child': {
                    marginLeft: '0',
                    fontWeight: '600'
                },
                '& li': {
                    lineHeight: '25px'
                }
            }
        },
        products: {
            marginTop: '10px',
            '& .row': {
                padding: '10px 0',
                borderBottom: '1px #efefef solid',
                '&:first-child': {
                    fontWeight: '600'
                },
                '& > div:last-child': {
                    textAlign: 'right'
                },
                '&:after': {
                    left: '0.5rem',
                    right: '0.5rem'
                }
            }
        },
        summary: {
            fontWeight: 'bold',
            padding: '10px 0',
            textAlign: 'right'
        }
    })
)

const OrderPrint = enhance((props) => {
    const {classes, printDialog} = props

    return (
        <div className={classes.wrapper}>
            <IconButton onTouchTap={printDialog.handleClosePrintDialog} className={classes.closeBtn}>
                <Close color="#666"/>
            </IconButton>

            <div className={classes.item}>
                <div className={classes.title}>
                    <span>Заказ №13</span>
                    <div>Добавлено: 12 Апр 2017</div>
                </div>
                <div className={classes.info}>
                    <div className={classes.block}>
                        <ul>
                            <li>Название магазина:</li>
                            <li>Адрес:</li>
                            <li>Ориентир:</li>
                            <li>Телефон:</li>
                            <li>Агент:</li>
                        </ul>
                        <ul>
                            <li>Наименование магазина</li>
                            <li>Адрес Магазина</li>
                            <li>Ориентир магазина</li>
                            <li>Телефон +99856145</li>
                            <li>Хабибуллаев Хамидилла</li>
                        </ul>
                    </div>
                    <div className={classes.block}>
                        <ul>
                            <li>Тип сделки:</li>
                            <li>Дата ожидаемой оплаты:</li>
                            <li>Дата доставки:</li>
                            <li>Тип оплаты:</li>
                        </ul>
                        <ul>
                            <li>Консигнация</li>
                            <li>23 Апр 2017</li>
                            <li>24 Апр 2017</li>
                            <li>Наличными</li>
                        </ul>
                    </div>
                </div>

                <div className={classes.products}>
                    <Row>
                        <Col xs={1}>№</Col>
                        <Col xs={5}>Наименование</Col>
                        <Col xs={2}>Цена (UZS)</Col>
                        <Col xs={2}>Кол-во</Col>
                        <Col xs={2}>Сумма (UZS)</Col>
                    </Row>
                    <Row>
                        <Col xs={1}>12</Col>
                        <Col xs={5}>7 STICK Strawberry (КЛУБНИКА)</Col>
                        <Col xs={2}>2900</Col>
                        <Col xs={2}>4 шт</Col>
                        <Col xs={2}>9 500</Col>
                    </Row>
                    <div className={classes.summary}>Итого: 35 000 UZS</div>
                </div>
            </div>
            <div className={classes.item}>
                <div className={classes.title}>
                    <span>Заказ №13</span>
                    <div>Добавлено: 12 Апр 2017</div>
                </div>
                <div className={classes.info}>
                    <div className={classes.block}>
                        <ul>
                            <li>Название магазина:</li>
                            <li>Адрес:</li>
                            <li>Ориентир:</li>
                            <li>Телефон:</li>
                            <li>Агент:</li>
                        </ul>
                        <ul>
                            <li>Наименование магазина</li>
                            <li>Адрес Магазина</li>
                            <li>Ориентир магазина</li>
                            <li>Телефон +99856145</li>
                            <li>Хабибуллаев Хамидилла</li>
                        </ul>
                    </div>
                    <div className={classes.block}>
                        <ul>
                            <li>Тип сделки:</li>
                            <li>Дата ожидаемой оплаты:</li>
                            <li>Дата доставки:</li>
                            <li>Тип оплаты:</li>
                        </ul>
                        <ul>
                            <li>Консигнация</li>
                            <li>23 Апр 2017</li>
                            <li>24 Апр 2017</li>
                            <li>Наличными</li>
                        </ul>
                    </div>
                </div>

                <div className={classes.products}>
                    <Row>
                        <Col xs={1}>№</Col>
                        <Col xs={5}>Наименование</Col>
                        <Col xs={2}>Цена (UZS)</Col>
                        <Col xs={2}>Кол-во</Col>
                        <Col xs={2}>Сумма (UZS)</Col>
                    </Row>
                    <Row>
                        <Col xs={1}>12</Col>
                        <Col xs={5}>7 STICK Strawberry (КЛУБНИКА)</Col>
                        <Col xs={2}>2900</Col>
                        <Col xs={2}>4 шт</Col>
                        <Col xs={2}>9 500</Col>
                    </Row>
                    <div className={classes.summary}>Итого: 35 000 UZS</div>
                </div>
            </div>
            <div className={classes.item}>
                <div className={classes.title}>
                    <span>Заказ №13</span>
                    <div>Добавлено: 12 Апр 2017</div>
                </div>
                <div className={classes.info}>
                    <div className={classes.block}>
                        <ul>
                            <li>Название магазина:</li>
                            <li>Адрес:</li>
                            <li>Ориентир:</li>
                            <li>Телефон:</li>
                            <li>Агент:</li>
                        </ul>
                        <ul>
                            <li>Наименование магазина</li>
                            <li>Адрес Магазина</li>
                            <li>Ориентир магазина</li>
                            <li>Телефон +99856145</li>
                            <li>Хабибуллаев Хамидилла</li>
                        </ul>
                    </div>
                    <div className={classes.block}>
                        <ul>
                            <li>Тип сделки:</li>
                            <li>Дата ожидаемой оплаты:</li>
                            <li>Дата доставки:</li>
                            <li>Тип оплаты:</li>
                        </ul>
                        <ul>
                            <li>Консигнация</li>
                            <li>23 Апр 2017</li>
                            <li>24 Апр 2017</li>
                            <li>Наличными</li>
                        </ul>
                    </div>
                </div>

                <div className={classes.products}>
                    <Row>
                        <Col xs={1}>№</Col>
                        <Col xs={5}>Наименование</Col>
                        <Col xs={2}>Цена (UZS)</Col>
                        <Col xs={2}>Кол-во</Col>
                        <Col xs={2}>Сумма (UZS)</Col>
                    </Row>
                    <Row>
                        <Col xs={1}>12</Col>
                        <Col xs={5}>7 STICK Strawberry (КЛУБНИКА)</Col>
                        <Col xs={2}>2900</Col>
                        <Col xs={2}>4 шт</Col>
                        <Col xs={2}>9 500</Col>
                    </Row>
                    <div className={classes.summary}>Итого: 35 000 UZS</div>
                </div>
            </div>
            <div className={classes.item}>
                <div className={classes.title}>
                    <span>Заказ №13</span>
                    <div>Добавлено: 12 Апр 2017</div>
                </div>
                <div className={classes.info}>
                    <div className={classes.block}>
                        <ul>
                            <li>Название магазина:</li>
                            <li>Адрес:</li>
                            <li>Ориентир:</li>
                            <li>Телефон:</li>
                            <li>Агент:</li>
                        </ul>
                        <ul>
                            <li>Наименование магазина</li>
                            <li>Адрес Магазина</li>
                            <li>Ориентир магазина</li>
                            <li>Телефон +99856145</li>
                            <li>Хабибуллаев Хамидилла</li>
                        </ul>
                    </div>
                    <div className={classes.block}>
                        <ul>
                            <li>Тип сделки:</li>
                            <li>Дата ожидаемой оплаты:</li>
                            <li>Дата доставки:</li>
                            <li>Тип оплаты:</li>
                        </ul>
                        <ul>
                            <li>Консигнация</li>
                            <li>23 Апр 2017</li>
                            <li>24 Апр 2017</li>
                            <li>Наличными</li>
                        </ul>
                    </div>
                </div>

                <div className={classes.products}>
                    <Row>
                        <Col xs={1}>№</Col>
                        <Col xs={5}>Наименование</Col>
                        <Col xs={2}>Цена (UZS)</Col>
                        <Col xs={2}>Кол-во</Col>
                        <Col xs={2}>Сумма (UZS)</Col>
                    </Row>
                    <Row>
                        <Col xs={1}>12</Col>
                        <Col xs={5}>7 STICK Strawberry (КЛУБНИКА)</Col>
                        <Col xs={2}>2900</Col>
                        <Col xs={2}>4 шт</Col>
                        <Col xs={2}>9 500</Col>
                    </Row>
                    <div className={classes.summary}>Итого: 35 000 UZS</div>
                </div>
            </div>
            <div className={classes.item}>
                <div className={classes.title}>
                    <span>Заказ №13</span>
                    <div>Добавлено: 12 Апр 2017</div>
                </div>
                <div className={classes.info}>
                    <div className={classes.block}>
                        <ul>
                            <li>Название магазина:</li>
                            <li>Адрес:</li>
                            <li>Ориентир:</li>
                            <li>Телефон:</li>
                            <li>Агент:</li>
                        </ul>
                        <ul>
                            <li>Наименование магазина</li>
                            <li>Адрес Магазина</li>
                            <li>Ориентир магазина</li>
                            <li>Телефон +99856145</li>
                            <li>Хабибуллаев Хамидилла</li>
                        </ul>
                    </div>
                    <div className={classes.block}>
                        <ul>
                            <li>Тип сделки:</li>
                            <li>Дата ожидаемой оплаты:</li>
                            <li>Дата доставки:</li>
                            <li>Тип оплаты:</li>
                        </ul>
                        <ul>
                            <li>Консигнация</li>
                            <li>23 Апр 2017</li>
                            <li>24 Апр 2017</li>
                            <li>Наличными</li>
                        </ul>
                    </div>
                </div>

                <div className={classes.products}>
                    <Row>
                        <Col xs={1}>№</Col>
                        <Col xs={5}>Наименование</Col>
                        <Col xs={2}>Цена (UZS)</Col>
                        <Col xs={2}>Кол-во</Col>
                        <Col xs={2}>Сумма (UZS)</Col>
                    </Row>
                    <Row>
                        <Col xs={1}>12</Col>
                        <Col xs={5}>7 STICK Strawberry (КЛУБНИКА)</Col>
                        <Col xs={2}>2900</Col>
                        <Col xs={2}>4 шт</Col>
                        <Col xs={2}>9 500</Col>
                    </Row>
                    <div className={classes.summary}>Итого: 35 000 UZS</div>
                </div>
            </div>
            <div className={classes.item}>
                <div className={classes.title}>
                    <span>Заказ №13</span>
                    <div>Добавлено: 12 Апр 2017</div>
                </div>
                <div className={classes.info}>
                    <div className={classes.block}>
                        <ul>
                            <li>Название магазина:</li>
                            <li>Адрес:</li>
                            <li>Ориентир:</li>
                            <li>Телефон:</li>
                            <li>Агент:</li>
                        </ul>
                        <ul>
                            <li>Наименование магазина</li>
                            <li>Адрес Магазина</li>
                            <li>Ориентир магазина</li>
                            <li>Телефон +99856145</li>
                            <li>Хабибуллаев Хамидилла</li>
                        </ul>
                    </div>
                    <div className={classes.block}>
                        <ul>
                            <li>Тип сделки:</li>
                            <li>Дата ожидаемой оплаты:</li>
                            <li>Дата доставки:</li>
                            <li>Тип оплаты:</li>
                        </ul>
                        <ul>
                            <li>Консигнация</li>
                            <li>23 Апр 2017</li>
                            <li>24 Апр 2017</li>
                            <li>Наличными</li>
                        </ul>
                    </div>
                </div>

                <div className={classes.products}>
                    <Row>
                        <Col xs={1}>№</Col>
                        <Col xs={5}>Наименование</Col>
                        <Col xs={2}>Цена (UZS)</Col>
                        <Col xs={2}>Кол-во</Col>
                        <Col xs={2}>Сумма (UZS)</Col>
                    </Row>
                    <Row>
                        <Col xs={1}>12</Col>
                        <Col xs={5}>7 STICK Strawberry (КЛУБНИКА)</Col>
                        <Col xs={2}>2900</Col>
                        <Col xs={2}>4 шт</Col>
                        <Col xs={2}>9 500</Col>
                    </Row>
                    <div className={classes.summary}>Итого: 35 000 UZS</div>
                </div>
            </div>
            <div className={classes.item}>
                <div className={classes.title}>
                    <span>Заказ №13</span>
                    <div>Добавлено: 12 Апр 2017</div>
                </div>
                <div className={classes.info}>
                    <div className={classes.block}>
                        <ul>
                            <li>Название магазина:</li>
                            <li>Адрес:</li>
                            <li>Ориентир:</li>
                            <li>Телефон:</li>
                            <li>Агент:</li>
                        </ul>
                        <ul>
                            <li>Наименование магазина</li>
                            <li>Адрес Магазина</li>
                            <li>Ориентир магазина</li>
                            <li>Телефон +99856145</li>
                            <li>Хабибуллаев Хамидилла</li>
                        </ul>
                    </div>
                    <div className={classes.block}>
                        <ul>
                            <li>Тип сделки:</li>
                            <li>Дата ожидаемой оплаты:</li>
                            <li>Дата доставки:</li>
                            <li>Тип оплаты:</li>
                        </ul>
                        <ul>
                            <li>Консигнация</li>
                            <li>23 Апр 2017</li>
                            <li>24 Апр 2017</li>
                            <li>Наличными</li>
                        </ul>
                    </div>
                </div>

                <div className={classes.products}>
                    <Row>
                        <Col xs={1}>№</Col>
                        <Col xs={5}>Наименование</Col>
                        <Col xs={2}>Цена (UZS)</Col>
                        <Col xs={2}>Кол-во</Col>
                        <Col xs={2}>Сумма (UZS)</Col>
                    </Row>
                    <Row>
                        <Col xs={1}>12</Col>
                        <Col xs={5}>7 STICK Strawberry (КЛУБНИКА)</Col>
                        <Col xs={2}>2900</Col>
                        <Col xs={2}>4 шт</Col>
                        <Col xs={2}>9 500</Col>
                    </Row>
                    <div className={classes.summary}>Итого: 35 000 UZS</div>
                </div>
            </div>
            <div className={classes.item}>
                <div className={classes.title}>
                    <span>Заказ №13</span>
                    <div>Добавлено: 12 Апр 2017</div>
                </div>
                <div className={classes.info}>
                    <div className={classes.block}>
                        <ul>
                            <li>Название магазина:</li>
                            <li>Адрес:</li>
                            <li>Ориентир:</li>
                            <li>Телефон:</li>
                            <li>Агент:</li>
                        </ul>
                        <ul>
                            <li>Наименование магазина</li>
                            <li>Адрес Магазина</li>
                            <li>Ориентир магазина</li>
                            <li>Телефон +99856145</li>
                            <li>Хабибуллаев Хамидилла</li>
                        </ul>
                    </div>
                    <div className={classes.block}>
                        <ul>
                            <li>Тип сделки:</li>
                            <li>Дата ожидаемой оплаты:</li>
                            <li>Дата доставки:</li>
                            <li>Тип оплаты:</li>
                        </ul>
                        <ul>
                            <li>Консигнация</li>
                            <li>23 Апр 2017</li>
                            <li>24 Апр 2017</li>
                            <li>Наличными</li>
                        </ul>
                    </div>
                </div>

                <div className={classes.products}>
                    <Row>
                        <Col xs={1}>№</Col>
                        <Col xs={5}>Наименование</Col>
                        <Col xs={2}>Цена (UZS)</Col>
                        <Col xs={2}>Кол-во</Col>
                        <Col xs={2}>Сумма (UZS)</Col>
                    </Row>
                    <Row>
                        <Col xs={1}>12</Col>
                        <Col xs={5}>7 STICK Strawberry (КЛУБНИКА)</Col>
                        <Col xs={2}>2900</Col>
                        <Col xs={2}>4 шт</Col>
                        <Col xs={2}>9 500</Col>
                    </Row>
                    <div className={classes.summary}>Итого: 35 000 UZS</div>
                </div>
            </div>
        </div>
    )
})

export default OrderPrint
