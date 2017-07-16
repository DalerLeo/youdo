import _ from 'lodash'
import moment from 'moment'
import React from 'react'
import PropTypes from 'prop-types'
import {compose} from 'recompose'
import injectSheet from 'react-jss'
import Dialog from 'material-ui/Dialog'
import CircularProgress from 'material-ui/CircularProgress'
import CloseIcon2 from '../CloseIcon2'
import IconButton from 'material-ui/IconButton'
import MainStyles from '../Styles/MainStyles'
import {Row, Col} from 'react-flexbox-grid'
import Pagination from '../GridList/GridListNavPagination'
import getConfig from '../../helpers/getConfig'
import numberFormat from '../../helpers/numberFormat'

const enhance = compose(
    injectSheet(_.merge(MainStyles, {
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
            justifyContent: 'space-between'
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
            textTransform: 'capitalize',
            lineHeight: '60px',
            padding: '0 30px',
            '& div': {
                display: 'flex',
                alignItems: 'center'
            },
            '& button': {
                display: 'flex!important',
                justifyContent: 'center'
            }

        },
        tableWrapper: {
            padding: '0 30px',
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
        }
    })),
)

const StatMarketDialog = enhance((props) => {
    const {open, loading, onClose, classes, detailData} = props

    const primaryCurrency = getConfig('PRIMARY_CURRENCY')
    const marketName = _.get(detailData, ['marketDetail', 'name'])
    const income = numberFormat(_.get(detailData, ['marketDetail', 'income']), primaryCurrency)
    const fromDate = _.get(detailData, ['filterDateRange', 'fromDate'])
        ? _.get(detailData, ['filterDateRange', 'fromDate']).format('DD.MM.YYYY')
        : null
    const toDate = _.get(detailData, ['filterDateRange', 'toDate'])
        ? _.get(detailData, ['filterDateRange', 'toDate']).format('DD.MM.YYYY')
        : null
    const dateRange = (fromDate && toDate) ? fromDate + ' - ' + toDate : 'Весь'

    const orderList = _.map(_.get(detailData, ['data', 'results']), (item) => {
        const id = _.get(item, 'id')
        const client = _.get(item, ['client', 'name'])
        const totalPrice = _.get(item, 'totalPrice')
        const createdDate = moment(_.get(item, 'createdDate')).format('LL')

        return (
            <Row key={id} className="dottedList">
                <Col xs={2}>{id}</Col>
                <Col xs={4}>{client}</Col>
                <Col xs={3}>{createdDate}</Col>
                <Col xs={3}>{totalPrice} {primaryCurrency}</Col>
            </Row>
        )
    })
    return (
        <Dialog
            modal={true}
            open={open}
            onRequestClose={onClose}
            className={classes.dialog}
            contentStyle={loading ? {width: '400px'} : {width: '700px'}}
            bodyStyle={{minHeight: 'auto'}}
            bodyClassName={classes.popUp}>
            <div className={classes.titleContent}>
                <span>{marketName}</span>
                <IconButton onTouchTap={onClose}>
                    <CloseIcon2 color="#666666"/>
                </IconButton>
            </div>
            <div className={classes.content}>
                <div className={classes.titleSummary}>
                    <div>Период: <strong>{dateRange}</strong></div>
                    <div>Сумма: <strong>{income}</strong></div>
                </div>
                <div className={classes.tableWrapper}>
                    <Row className="dottedList">
                        <Col xs={2}>№ заказа</Col>
                        <Col xs={4}>Агент</Col>
                        <Col xs={3}>Дата</Col>
                        <Col xs={3}>Сумма</Col>
                    </Row>
                    {_.get(detailData, 'detailLoading')
                        ? <div style={{textAlign: 'center'}}>
                            <CircularProgress/>
                        </div>
                        : orderList}
                </div>
                <Pagination filter={_.get(detailData, 'filter')}/>
            </div>
        </Dialog>
    )
})

StatMarketDialog.propTyeps = {
    filter: PropTypes.object.isRequired,
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    loading: PropTypes.bool
}

export default StatMarketDialog
