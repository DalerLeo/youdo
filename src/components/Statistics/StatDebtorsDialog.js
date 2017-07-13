import React from 'react'
import PropTypes from 'prop-types'
import {compose} from 'recompose'
import injectSheet from 'react-jss'
import Dialog from 'material-ui/Dialog'
import CloseIcon2 from '../CloseIcon2'
import IconButton from 'material-ui/IconButton'
import {Row, Col} from 'react-flexbox-grid'

const enhance = compose(
    injectSheet({
        loader: {
            position: 'absolute',
            width: '100%',
            height: '100%',
            background: '#fff',
            top: '0',
            left: '0',
            alignItems: 'center',
            zIndex: '999',
            textAlign: 'center',
            display: ({loading}) => loading ? 'flex' : 'none'
        },
        popUp: {
            color: '#333 !important',
            overflowY: 'hidden !important',
            fontSize: '13px !important',
            position: 'relative',
            padding: '0 !important',
            overflowX: 'hidden',
            height: '100%'
        },
        titleContent: {
            background: '#fff',
            color: '#333',
            fontWeight: 'bold',
            textTransform: 'uppercase',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: '1px solid #efefef',
            padding: '20px 30px',
            zIndex: '999',
            '& button': {
                right: '13px',
                padding: '0 !important',
                position: 'absolute !important'
            }
        },
        content: {
            width: '100%',
            display: 'flex'
        },
        link: {
            borderBottom: '1px dashed',
            fontWeight: '600'
        },
        leftSide: {
            maxWidth: '30%',
            flexBasis: '30%',
            padding: '20px 30px',
            borderRight: '1px #efefef solid'
        },
        subtitle: {
            display: 'flex',
            justifyContent: 'space-between',
            fontWeight: '600',
            marginBottom: '10px'
        },
        block: {
            marginBottom: '20px',
            '& ul': {
                display: 'inline-block',
                width: '50%',
                '& li': {
                    lineHeight: '25px'
                }
            }
        },
        rightSide: {
            maxWidth: '70%',
            flexBasis: '70%',
            padding: '20px 30px'
        },
        tableWrapper: {
            '& .row': {
                padding: '0',
                height: '40px',
                '& > div': {
                    textAlign: 'right',
                    '&:first-child': {
                        textAlign: 'left'
                    }
                },
                '&:first-child': {
                    fontWeight: '600'
                },
                '&:last-child:after': {
                    display: 'none'
                }
            }
        }
    }),
)

const StatDebtorsDialog = enhance((props) => {
    const {open, loading, onClose, classes} = props

    return (
        <Dialog
            modal={true}
            open={open}
            onRequestClose={onClose}
            className={classes.dialog}
            contentStyle={loading ? {width: '400px'} : {width: '950px', maxWidth: 'none'}}
            bodyStyle={{minHeight: 'auto'}}
            bodyClassName={classes.popUp}>
            <div className={classes.titleContent}>
                <span>Детализация задолжности</span>
                <IconButton onTouchTap={onClose}>
                    <CloseIcon2 color="#666666"/>
                </IconButton>
            </div>
            <div className={classes.content}>
                <div className={classes.leftSide}>
                    <div className={classes.block}>
                        <div className={classes.subtitle}>
                            <div>Клиент</div>
                            <a className={classes.link}>контакты</a>
                        </div>
                        <div>Наименование клиента</div>
                    </div>
                    <div className={classes.block}>
                        <div className={classes.subtitle}>
                            <div>Заказ</div>
                            <div>№321</div>
                        </div>
                        <ul>
                            <li>Тип оплаты</li>
                            <li>Дата оплаты</li>
                            <li>Стоимость</li>
                            <li>Скидка (0%)</li>
                            <li>Оплачено</li>
                            <li>Остаток</li>
                            <li>Статус</li>
                        </ul>
                        <ul>
                            <li>Перечисление</li>
                            <li>22 Апр, 2017</li>
                            <li>10 000 000 UZS</li>
                            <li>0 UZS</li>
                            <li>8 000 000 UZS</li>
                            <li>2 000 000 UZS</li>
                            <li>Доставлен</li>
                        </ul>
                    </div>
                </div>
                <div className={classes.rightSide}>
                    <div className={classes.tableWrapper}>
                        <Row className="dottedList">
                            <Col xs={7}>Наименование</Col>
                            <Col xs={2}>Кол-во</Col>
                            <Col xs={3}>Сумма</Col>
                        </Row>
                        <Row className="dottedList">
                            <Col xs={7}>Миф морозная свежесть</Col>
                            <Col xs={2}>50 шт</Col>
                            <Col xs={3}>758 000 UZS</Col>
                        </Row>
                        <Row className="dottedList">
                            <Col xs={7}>Миф морозная свежесть</Col>
                            <Col xs={2}>50 шт</Col>
                            <Col xs={3}>758 000 UZS</Col>
                        </Row>
                    </div>
                </div>
            </div>
        </Dialog>
    )
})

StatDebtorsDialog.propTyeps = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    loading: PropTypes.bool
}

export default StatDebtorsDialog
