import React from 'react'
import injectSheet from 'react-jss'
import {compose} from 'recompose'
import Person from '../Images/person.png'
import {Row} from 'react-flexbox-grid'

const enhance = compose(
    injectSheet({
        content: {
            padding: '20px 0'
        },
        topInfo: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
        },
        info: {
            display: 'flex',
            alignItems: 'center'
        },
        details: {
            extend: 'info',
            '&:first-child': {
                marginRight: '60px'
            },
            '& span': {
                fontWeight: '600',
                marginRight: '5px'
            },
            '& img': {
                width: '30px',
                height: '30px',
                borderRadius: '50%'
            }
        },
        dropdown: {
            position: 'relative',
            paddingRight: '18px',
            fontWeight: '600',
            zIndex: '10',
            '&:after': {
                top: '8px',
                right: '4px',
                content: '""',
                position: 'absolute',
                borderTop: '4px solid',
                borderLeft: '4px solid transparent',
                borderRight: '4px solid transparent'
            }
        },
        status: {
            fontWeight: '600',
            '& span:first-child': {
                marginRight: '5px'
            }
        },
        order: {
            marginTop: '10px',
            '& .dottedList': {
                padding: '10px 0',
                margin: '0',
                '&:first-child': {
                    fontWeight: '600'
                },
                '&:last-child:after': {
                    display: 'none'
                }
            }
        },
        customColumn: {
            flexBasis: 'calc(100% / 7)',
            maxWidth: 'calc(100% / 7)'
        }
    })
)

const ShopDetailsActivity = enhance((props) => {
    const {classes} = props
    return (
        <div className={classes.content}>
            <div className={classes.topInfo}>
                <div className={classes.info}>
                    <div className={classes.details}>
                        <span>Действующий агент:</span>
                        <img src={Person} alt=""/>
                    </div>
                    <div className={classes.details}>
                        <span>Частота посещений:</span>
                        <a className={classes.dropdown}>1 раз в неделю</a>
                    </div>
                </div>
                <div className={classes.status}>
                    <span>Статус магазина:</span>
                    <span className="greenFont">Активен</span>
                </div>
            </div>
            <div className={classes.order}>
                <Row className="dottedList">
                    <div className={classes.customColumn}>Заказ №</div>
                    <div className={classes.customColumn}>Дата доставки</div>
                    <div className={classes.customColumn}>Сумма заказа</div>
                    <div className={classes.customColumn}>Оплачено</div>
                    <div className={classes.customColumn}>Баланс</div>
                    <div className={classes.customColumn}>Дата создания</div>
                    <div className={classes.customColumn}>Статус</div>
                </Row>
                <Row className="dottedList">
                    <div className={classes.customColumn}>120</div>
                    <div className={classes.customColumn}>22 Апр, 2017</div>
                    <div className={classes.customColumn}>1 600 000 UZS</div>
                    <div className={classes.customColumn}>1 000 000 UZS</div>
                    <div className={classes.customColumn}><span className="redFont">600 000 UZS</span></div>
                    <div className={classes.customColumn}>15 Апр, 2017</div>
                    <div className={classes.customColumn}>доставлен</div>
                </Row>
                <Row className="dottedList">
                    <div className={classes.customColumn}>120</div>
                    <div className={classes.customColumn}>22 Апр, 2017</div>
                    <div className={classes.customColumn}>1 600 000 UZS</div>
                    <div className={classes.customColumn}>1 600 000 UZS</div>
                    <div className={classes.customColumn}>0 UZS</div>
                    <div className={classes.customColumn}>15 Апр, 2017</div>
                    <div className={classes.customColumn}>доставлен</div>
                </Row>
            </div>
        </div>
    )
})

export default ShopDetailsActivity
