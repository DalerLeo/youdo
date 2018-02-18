import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import {compose} from 'recompose'
import injectSheet from 'react-jss'
import Dialog from 'material-ui/Dialog'
import sprintf from 'sprintf'
import {Link} from 'react-router'
import IconButton from 'material-ui/IconButton'
import Loader from '../Loader'
import {Row, Col} from 'react-flexbox-grid'
import NotFound from '../Images/not-found.png'
import CloseIcon from 'material-ui/svg-icons/navigation/close'
import numberFormat from '../../helpers/numberFormat'
import * as ROUTES from '../../constants/routes'
import Pagination from '../ReduxForm/Pagination'
import t from '../../helpers/translate'

export const REMAINDER_RESERVED_DIALOG_OPEN = 'openReservedDialog'
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
        dialog: {
            overflowY: 'auto'
        },
        popUp: {
            color: '#333 !important',
            overflowY: 'hidden !important',
            fontSize: '13px !important',
            position: 'relative',
            padding: '0 !important',
            overflowX: 'hidden',
            maxHeight: 'none !important',
            height: '100%',
            marginBottom: '64px'
        },
        content: {
            width: '100%',
            display: 'block',
            '& > div:last-child': {
                padding: '0 30px'
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
            padding: '0 10px 0 30px',
            height: '60px',
            zIndex: '999'
        },
        tableWrapper: {
            padding: '0 30px',
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
        pagination: {
            borderBottom: '1px #efefef solid',
            margin: '0 -30px',
            padding: '10px 30px'
        },
        emptyQuery: {
            background: 'url(' + NotFound + ') no-repeat center 25px',
            backgroundSize: '200px',
            padding: '170px 0 30px',
            textAlign: 'center',
            fontSize: '13px',
            color: '#999',
            width: '100%',
            '& svg': {
                width: '50px !important',
                height: '50px !important',
                color: '#999 !important'
            }
        }
    }),
)

const RemainderReservedDialog = enhance((props) => {
    const {
        open,
        onClose,
        classes,
        data,
        reservedDetail,
        loading,
        listLoading,
        filterItem
    } = props

    const agentName = _.get(reservedDetail, ['0', 'title'])
    const measurement = _.get(reservedDetail, ['0', 'measurement', 'name'])
    const reservedList = _.map(data, (item) => {
        const amount = numberFormat(_.get(item, ['amount']), measurement)
        const orderId = _.get(item, ['order'])
        const id = _.get(item, ['id'])
        const stock = _.get(item, ['stock', 'name'])

        return (
            <Row key={id} className="dottedList">
                <Col xs={4}><Link to={{
                    pathname: sprintf(ROUTES.ORDER_ITEM_PATH, orderId),
                    query: {search: orderId}
                }} target="_blank">{t('Заказ')} {orderId}</Link></Col>
                <Col xs={4}>{stock}</Col>
                <Col xs={4}>{amount}</Col>
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
            {loading || listLoading ? <div className={classes.loader}>
                <Loader size={0.75}/>
            </div>
                : <div>
                    <div className={classes.titleContent}>
                        <div>{agentName}</div>
                        <IconButton onTouchTap={onClose}>
                            <CloseIcon color="#666666"/>
                        </IconButton>
                    </div>
                    {_.isEmpty(data)
                        ? <div className={classes.emptyQuery}>
                            <div>{t('Забронированных товаров не найдено')}</div>
                        </div>
                        : <div className={classes.content}>
                            <div className={classes.tableWrapper}>
                                <div className={classes.pagination}>
                                    <Pagination filter={filterItem}/>
                                </div>
                                <Row className="dottedList">
                                    <Col xs={4}>{t('№ заказа')}</Col>
                                    <Col xs={4}>{t('Склад')}</Col>
                                    <Col xs={4}>{t('Кол-во')}</Col>
                                </Row>
                                <div>
                                {reservedList}
                                </div>
                            </div>
                          </div>}
                </div>}
        </Dialog>
    )
})

RemainderReservedDialog.propTyeps = {
    filterItem: PropTypes.object.isRequired,
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    loading: PropTypes.bool
}

export default RemainderReservedDialog
