import React from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'
import {compose, withReducer} from 'recompose'
import injectSheet from 'react-jss'
import Dialog from 'material-ui/Dialog'
import Loader from '../Loader'
import {Row, Col} from 'react-flexbox-grid'
import IconButton from 'material-ui/IconButton'
import CloseIcon from 'material-ui/svg-icons/navigation/close'
import numberFormat from '../../helpers/numberFormat'
import getConfig from '../../helpers/getConfig'
import t from '../../helpers/translate'

const ZERO = 0
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
            justifyContent: 'center',
            display: 'flex'
        },
        popUp: {
            color: '#333 !important',
            overflowY: 'hidden !important',
            fontSize: '13px !important',
            position: 'relative',
            padding: '0 !important',
            overflowX: 'hidden',
            height: '100%',
            maxHeight: 'none !important'
        },
        dialog: {
            '& > div:first-child > div:first-child': {
                transform: 'translate(0px, 0px) !important'
            }
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
        inContent: {
            display: 'flex',
            maxHeight: '86vh',
            minHeight: '184px',
            overflow: 'auto',
            padding: '0 30px',
            color: '#333'
        },
        bodyContent: {
            width: '100%'
        },
        returnInfo: {
            padding: '25px 0',
            borderBottom: '1px #efefef solid',
            '& span': {
                display: 'block',
                '&:first-child': {
                    fontWeight: '600'
                }
            }
        },
        flex: {
            alignItems: 'initial',
            '& > div:first-child': {
                maxWidth: '60%'
            }
        },
        list: {
            width: '100%',
            padding: '10px 0',
            '& .row': {
                padding: '0',
                height: '45px',
                alignItems: 'center',
                '&:after': {
                    left: '0.5rem',
                    right: '0.5rem'
                },
                '&:first-child': {
                    fontWeight: '600'
                },
                '&:last-child:after': {
                    display: 'none'
                },
                '& > div:last-child': {
                    textAlign: 'right'
                }
            }
        },
        details: {
            background: '#f2f5f8',
            margin: '0 -30px',
            padding: '0 30px',
            boxSizing: 'content-box',
            '& .row': {
                margin: '0',
                '&:first-child': {
                    color: '#333',
                    borderBottom: '1px #dedede solid'
                },
                '& > div:first-child': {
                    paddingLeft: '0'
                },
                '& > div:last-child': {
                    paddingRight: '0'
                }
            }
        },
        semibold: {
            fontWeight: '600'
        },
        detailsRow: {
            margin: '0 10px !important',
            color: '#666 !important',
            '&:last-child': {
                borderBottom: 'none'
            },
            '& > div:last-child': {
                textAlign: 'right'
            }
        },
        closeDetail: {
            position: 'absolute',
            left: '0',
            top: '0',
            right: '0',
            bottom: '0',
            cursor: 'pointer',
            zIndex: '1'
        },
        noData: {
            textAlign: 'center',
            padding: '20px'
        }
    }),
    withReducer('state', 'dispatch', (state, action) => {
        return {...state, ...action}
    }, {open: false}),
)
const TWO = 2
const THREE = 3
const FOUR = 4

const TransactionInfoDialog = enhance((props) => {
    const {
        open,
        loading,
        onClose,
        classes,
        data,
        hasMarket
    } = props

    const primaryCurrency = getConfig('PRIMARY_CURRENCY')
    return (
        <Dialog
            modal={true}
            contentStyle={loading ? {width: '500px'} : {width: '1000px', maxWidth: 'unset'}}
            open={open > ZERO}
            onRequestClose={onClose}
            className={classes.dialog}
            bodyClassName={classes.popUp}
            autoScrollBodyContent={true}>
            <div className={classes.titleContent}>
                <span>{t('Транзакция')} №{open}</span>
                <IconButton onTouchTap={onClose}>
                    <CloseIcon color="#666666"/>
                </IconButton>
            </div>
            <div className={classes.bodyContent}>
                {loading && <div className={classes.loader}>
                    <Loader size={0.75}/>
                </div>}
                <div className={classes.inContent} style={{minHeight: 'initial'}}>
                    <div className={classes.list}>
                        <Row className="dottedList">
                            <Col xs={hasMarket ? THREE : FOUR}>{t('Клиент')}</Col>
                            <Col xs={hasMarket ? TWO : THREE}>{t('Организация')}</Col>
                            {hasMarket && <Col xs={3}>{t('Магазин')}</Col>}
                            <Col xs={hasMarket ? TWO : THREE}>№ {t('заказа')} </Col>
                            <Col xs={2}>{t('Сумма')}</Col>
                        </Row>
                        {_.map(data, (item) => {
                            const clientName = _.get(item, ['client', 'name'])
                            const marketName = _.get(item, ['market', 'name']) || 'Не определен'
                            const currency = _.get(item, ['currency', 'name'])
                            const division = _.get(item, ['division', 'name'])
                            const order = _.get(item, 'order') || 'Не определен'
                            const customRate = _.get(item, ['customRate'])
                            const internal = _.toNumber(_.get(item, 'internal'))
                            const amount = _.toNumber(_.get(item, 'amount'))
                            return (
                                <Row key={_.get(item, 'id')} className='dottedList'>
                                    <Col xs={hasMarket ? THREE : FOUR}>{clientName}</Col>
                                    <Col xs={2}>{division}</Col>
                                    {hasMarket && <Col xs={3}>{marketName}</Col>}
                                    <Col xs={hasMarket ? TWO : THREE}>{order}</Col>
                                    <Col xs={2}>
                                        <div style={{fontWeight: '600'}}>{numberFormat(amount, currency)}</div>
                                        <div>{currency !== primaryCurrency
                                            ? customRate
                                                ? '( ' + t('Курс') + '  ' + numberFormat(customRate) + ')'
                                                 : '( ' + t('Курс') + '  ' + numberFormat((amount / internal)) + ')'
                                            : null }</div>
                                    </Col>
                                </Row>

                            )
                        })}
                        {_.isEmpty(data) &&
                        <div className={classes.noData}><h3>{t('Никакой платеж не произведен')}</h3></div>}
                    </div>
                </div>
            </div>
        </Dialog>
    )
})
TransactionInfoDialog.propTyeps = {
    open: PropTypes.number.isRequired,
    onClose: PropTypes.func.isRequired,
    loading: PropTypes.bool.isRequired,
    data: PropTypes.array
}
export default TransactionInfoDialog
