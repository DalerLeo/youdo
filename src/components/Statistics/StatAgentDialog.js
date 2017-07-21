import _ from 'lodash'
import moment from 'moment'
import React from 'react'
import PropTypes from 'prop-types'
import {compose} from 'recompose'
import injectSheet from 'react-jss'
import Dialog from 'material-ui/Dialog'
import CloseIcon2 from '../CloseIcon2'
import IconButton from 'material-ui/IconButton'
import CircularProgress from 'material-ui/CircularProgress'
import {Row, Col} from 'react-flexbox-grid'
import Person from '../Images/person.png'
import Pagination from '../GridList/GridListNavPagination'
import getConfig from '../../helpers/getConfig'
import numberFormat from '../../helpers/numberFormat.js'

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
            height: '100%'
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
            }
        }
    }),
)

const StatAgentDialog = enhance((props) => {
    const {
        open,
        onClose,
        classes,
        detailData
    } = props
    const loading = _.get(detailData, 'detailLoading')
    const primaryCurrency = getConfig('PRIMARY_CURRENCY')
    const agentName = _.get(detailData, ['agentDetail', '0', 'name'])
    const income = numberFormat(_.get(detailData, ['agentDetail', '0', 'income']), primaryCurrency)
    const fromDate = _.get(detailData, ['filterDateRange', 'fromDate'])
                                            ? _.get(detailData, ['filterDateRange', 'fromDate']).format('DD.MM.YYYY')
                                            : null
    const toDate = _.get(detailData, ['filterDateRange', 'toDate'])
                                            ? _.get(detailData, ['filterDateRange', 'toDate']).format('DD.MM.YYYY')
                                            : null
    const dateRange = (fromDate && toDate) ? fromDate + ' - ' + toDate : 'Весь'

    const orderList = _.map(_.get(detailData, ['data', 'results']), (item) => {
        const id = _.get(item, 'id')
        const market = _.get(item, ['market', 'name'])
        const totalPrice = _.get(item, 'totalPrice')
        const createdDate = moment(_.get(item, 'createdDate')).format('LL')

        return (
            <Row key={id} className="dottedList">
                <Col xs={2}>{id}</Col>
                <Col xs={6}>{market}</Col>
                <Col xs={2}>{createdDate}</Col>
                <Col xs={2}>{totalPrice} {primaryCurrency}</Col>
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
            {loading ? <div className={classes.loader}>
                <CircularProgress/>
            </div>
            : <div>
                    <div className={classes.titleContent}>
                        <div>
                            <div className="personImage">
                                <img src={Person} alt=""/>
                            </div>
                            <div>{agentName}</div>
                        </div>
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
                                <Col xs={6}>Магазин</Col>
                                <Col xs={2}>Дата</Col>
                                <Col xs={2}>Сумма</Col>
                            </Row>
                            {orderList}
                        </div>
                        <Pagination filter={_.get(detailData, 'filter')}/>
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
