import _ from 'lodash'
import moment from 'moment'
import React from 'react'
import PropTypes from 'prop-types'
import {compose} from 'recompose'
import {Link} from 'react-router'
import injectSheet from 'react-jss'
import Dialog from 'material-ui/Dialog'
import CloseIcon from 'material-ui/svg-icons/navigation/close'
import IconButton from 'material-ui/IconButton'
import Loader from '../../Loader'
import {Row, Col} from 'react-flexbox-grid'
import sprintf from 'sprintf'
import Pagination from '../../GridList/GridListNavPagination/index'
import * as ROUTES from '../../../constants/routes'
import getConfig from '../../../helpers/getConfig'
import numberFormat from '../../../helpers/numberFormat'
import t from '../../../helpers/translate'
import dateTimeFormat from '../../../helpers/dateTimeFormat'
import NotFound from '../../Images/not-found.png'

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
            padding: '0 10px 0 30px',
            height: '60px',
            zIndex: '999'
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

const CANCELED = 4
const StatProviderDialog = enhance((props) => {
    const {
        open,
        onClose,
        classes,
        salesSummary,
        detailData
    } = props
    const loading = _.get(detailData, 'detailLoading')
    const primaryCurrency = getConfig('PRIMARY_CURRENCY')
    const agentName = _.get(detailData, ['agentDetail', '0', 'name'])
    const beginDate = moment(_.get(detailData, 'beginDate')).locale('ru').format('MMMM YYYY')
    const endDate = moment(_.get(detailData, 'endDate')).locale('ru').format('MMMM YYYY')
    const filteredData = _.filter(_.get(detailData, ['data', 'results']), (item) => {
        const status = _.toInteger(_.get(item, 'status'))
        return status !== CANCELED
    })
    const orderList = _.map(filteredData, (item) => {
        const id = _.get(item, 'id')
        const market = _.get(item, ['market', 'name'])
        const totalPrice = _.get(item, 'totalPrice')
        const paymentType = _.get(item, 'paymentType') === 'cash' ? t('Наличные') : t('Перечисление')
        const createdDate = dateTimeFormat(_.get(item, 'createdDate'))

        return (
            <Row key={id} className="dottedList">
                <Col xs={2}>
                    <Link to={{
                        pathname: sprintf(ROUTES.ORDER_ITEM_PATH, id),
                        query: {search: id}
                    }} target="_blank">{t('Заказ')} {id}</Link></Col>
                <Col xs={4}>{market}</Col>
                <Col xs={2}>{createdDate}</Col>
                <Col xs={2} style={{textAlign: 'right'}}>{paymentType}</Col>
                <Col xs={2}>{numberFormat(totalPrice, primaryCurrency)}</Col>
            </Row>
        )
    })

    return (
        <Dialog
            modal={true}
            open={open}
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
                            <div>{agentName}</div>
                        </div>
                        <IconButton onTouchTap={onClose}>
                            <CloseIcon color="#666666"/>
                        </IconButton>
                    </div>
                    <div className={classes.content}>
                        <div className={classes.titleSummary}>
                            <div>{t('Период')}: <strong>{beginDate} - {endDate}</strong></div>
                            <div>{t('Сумма')}: <strong>{salesSummary}</strong></div>
                        </div>
                        <div className={classes.tableWrapper}>
                            <Row className="dottedList">
                                <Col xs={2}>{t('№ заказа')}</Col>
                                <Col xs={4}>{t('Магазин')}</Col>
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
                        <Pagination filter={_.get(detailData, 'filter')}/>
                    </div>
                </div>}
        </Dialog>
    )
})

StatProviderDialog.propTyeps = {
    filter: PropTypes.object.isRequired,
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    loading: PropTypes.bool
}

export default StatProviderDialog
