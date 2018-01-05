import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import {compose} from 'recompose'
import injectSheet from 'react-jss'
import Dialog from 'material-ui/Dialog'
import CloseIcon from 'material-ui/svg-icons/navigation/close'
import IconButton from 'material-ui/IconButton'
import Loader from '../Loader'
import sprintf from 'sprintf'
import {Link} from 'react-router'
import ToolTip from '../ToolTip'
import {Row, Col} from 'react-flexbox-grid'
import Pagination from '../GridList/GridListNavPagination/index'
import getConfig from '../../helpers/getConfig'
import * as ROUTES from '../../constants/routes'
import numberFormat from '../../helpers/numberFormat'
import dateTimeFormat from '../../helpers/dateTimeFormat'
import Accepted from 'material-ui/svg-icons/action/done-all'
import Rejected from 'material-ui/svg-icons/content/block'
import Requested from 'material-ui/svg-icons/action/schedule'
import NotFound from '../Images/not-found.png'
import {
    REQUESTED,
    CONFIRMED,
    REJECTED,
    AUTO
} from '../ClientTransaction'
import t from '../../helpers/translate'

export const TELEGRAM_LOGS_DIALOG_OPEN = 'openLogsDialog'
const enhance = compose(
    injectSheet({
        loader: {
            width: '100%',
            height: '400px',
            background: '#fff',
            alignItems: 'center',
            zIndex: '999',
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
            marginBottom: '64px'
        },
        content: {
            width: '100%',
            display: 'block',
            '& > div:last-child': {
                padding: '0 30px',
                borderTop: '1px #efefef solid'
            }
        },
        titleSummary: {
            padding: '20px 30px',
            display: 'flex',
            justifyContent: 'space-between',
            borderBottom: '1px solid #efefef',
            textTransform: 'capitalize'
        },
        downBlock: {
            padding: '20px 30px',
            '& .row': {
                lineHeight: '35px',
                padding: '0 10px',
                display: 'flex',
                justifyContent: 'space-between',
                '& > div:last-child': {
                    textAlign: 'right',
                    fontWeight: '600'
                }
            },
            '& .row:last-child': {
                fontWeight: '600',
                borderTop: '1px #efefef solid'
            }
        },
        subTitle: {
            paddingBottom: '8px',
            fontStyle: 'italic',
            fontWeight: '400'
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
            padding: '0 30px',
            height: '59px',
            zIndex: '999',
            '& button': {
                right: '13px',
                position: 'absolute !important'
            },
            '& div': {
                display: 'flex',
                alignItems: 'center'
            },
            '& .personImage': {
                borderRadius: '50%',
                overflow: 'hidden',
                flexBasis: '35px',
                height: '35px',
                minWidth: '30px',
                width: '35px',
                marginRight: '10px',
                '& img': {
                    display: 'flex',
                    height: '100%',
                    width: '100%'
                }
            }
        },
        tableWrapper: {
            padding: '0 30px',
            maxHeight: '424px',
            overflowY: 'auto',
            '& .row': {
                '&:first-child': {
                    fontWeight: '600'
                }
            },
            '& .dottedList': {
                padding: '15px 0',
                '& > div:last-child': {
                    textAlign: 'right'
                },
                '&:last-child:after': {
                    display: 'none'
                }
            },
            '& svg': {
                width: '20px !important',
                height: '20px !important'
            }
        },
        emptyQuery: {
            marginBottom: '15px',
            background: 'url(' + NotFound + ') no-repeat center center',
            backgroundSize: '200px',
            padding: '200px 0 0',
            textAlign: 'center',
            fontSize: '13px',
            color: '#666',
            '& svg': {
                width: '50px !important',
                height: '50px !important',
                color: '#999 !important'
            }
        }
    }),
)
const ZERO = 0
const StatAgentDialog = enhance((props) => {
    const {
        open,
        onClose,
        classes,
        filter,
        data,
        loading,
        details
    } = props
    const statusIcon = (status) => {
        switch (status) {
            case CONFIRMED: return <ToolTip position={'right'} text={t('Подтвержден')}>
                <Accepted color={'#81c784'}/>
            </ToolTip>
            case REJECTED: return <ToolTip position={'right'} text={t('Отменен')}>
                <Rejected color={'#e57373'}/>
            </ToolTip>
            case REQUESTED: return <ToolTip position={'right'} text={t('В ожидании')}>
                <Requested color={'#f0ad4e'}/>
            </ToolTip>
            case AUTO: return <ToolTip position={'right'} text={t('Автоматически подтвержден системой')}>
                <AutoAccepted color={'#12aaeb'}/>
            </ToolTip>
            default: return null
        }
    }
    const primaryCurrency = getConfig('PRIMARY_CURRENCY')
    const name = _.get(details, ['firstName']) + ' ' + _.get(details, ['lastName'])
    const orderList = _.map(data, (item, index) => {
        const transId = _.get(item, ['clientTransaction', 'id'])
        const status = _.get(item, 'status')
        const paymentType = _.get(item, ['clientTransaction', 'paymentType']) === 'cash' ? t('Наличные') : t('Перечисление')
        const amount = _.get(item, ['clientTransaction', 'amount'])
        const internal = _.get(item, ['clientTransaction', 'internal'])
        const customRate = _.get(item, ['clientTransaction', 'customRate'])
        const type = _.get(item, ['clientTransaction', 'type'])
        const currency = _.get(item, ['clientTransaction', 'currency', 'name'])
        const username = _.get(item, ['clientTransaction', 'user', 'firstName']) + ' ' + _.get(item, ['clientTransaction', 'user', 'secondName'])
        const createdDate = dateTimeFormat(_.get(item, 'createdDate'))

        return (
            <Row key={index} className="dottedList">
                <Col xs={1}>{statusIcon(status)}</Col>
                <Col xs={3}>{username}</Col>
                <Col xs={2}><Link to={{
                    pathname: sprintf(ROUTES.CLIENT_TRANSACTION_LIST_URL, transId),
                    query: {search: transId}
                }} target="_blank">{transId}</Link></Col>
                <Col xs={2}>{createdDate}</Col>
                <Col xs={2} style={{textAlign: 'right'}}>{paymentType}</Col>
                <Col style={{textAlign: 'right'}} className={type >= ZERO ? classes.green : classes.red} xs={2}>
                    <span style={amount > ZERO ? {color: '#81c784'} : {color: '#e57373'}}>{numberFormat(amount, currency)}</span>
                    {currency !== primaryCurrency &&
                    <div>
                        <div>{numberFormat(internal, primaryCurrency)} <span
                            style={{fontSize: 11, color: '#666'}}>({customRate})</span></div>
                    </div>}
                </Col>
            </Row>
        )
    })

    return (
        <Dialog
            modal={true}
            open={open > ZERO}
            onRequestClose={onClose}
            className={classes.dialog}
            contentStyle={loading ? {width: '600px'} : {width: '900px', maxWidth: 'unset'}}
            bodyStyle={{minHeight: 'auto'}}
            bodyClassName={classes.popUp}>
            {loading ? <div className={classes.loader}>
                <Loader size={0.75}/>
            </div>
                : <div>
                    <div className={classes.titleContent}>
                        <div>
                            <div>{name}</div>
                        </div>
                        <IconButton onTouchTap={onClose}>
                            <CloseIcon color="#666666"/>
                        </IconButton>
                    </div>
                    <div className={classes.content}>
                        <div className={classes.tableWrapper}>
                            <Row className="dottedList">
                                <Col xs={1}>{t('Статус')}</Col>
                                <Col xs={3}>{t('Кто')}</Col>
                                <Col xs={2}>№ {t('транзакции')}</Col>
                                <Col xs={2}>{t('Дата')}</Col>
                                <Col xs={2} style={{textAlign: 'right'}}>{t('Тип оплаты')}</Col>
                                <Col xs={2}>{t('Сумма')}</Col>
                            </Row>
                            {_.isEmpty(orderList)
                                ? <div className={classes.emptyQuery}>
                                    <div>{t('У данного агента в этом периоде нет заказов')}</div>
                                </div>
                                : orderList}
                        </div>
                        <Pagination filter={filter}/>
                    </div>
                </div>}
        </Dialog>
    )
})

StatAgentDialog.propTyeps = {
    filter: PropTypes.object.isRequired,
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    loading: PropTypes.bool
}

export default StatAgentDialog
