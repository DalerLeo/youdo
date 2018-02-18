import React from 'react'
import _ from 'lodash'
import {compose} from 'recompose'
import injectSheet from 'react-jss'
import PropTypes from 'prop-types'
import LinearProgress from '../LinearProgress'
import Edit from 'material-ui/svg-icons/image/edit'
import IconButton from 'material-ui/IconButton'
import CloseIcon from 'material-ui/svg-icons/navigation/close'
import {Row, Col} from 'react-flexbox-grid'
import ToolTip from '../ToolTip'
import PriceSetForm from './PriceSetForm'
import getConfig from '../../helpers/getConfig'
import * as ROUTES from '../../constants/routes'
import moment from 'moment'
import Loader from '../Loader'
import PriceSetDefaultDialog from './PriceSetDefaultDialog'
import numberFormat from '../../helpers/numberFormat'
import NotFound from '../Images/not-found.png'
import {Link} from 'react-router'
import dateFomat from '../../helpers/dateFormat'
import t from '../../helpers/translate'

const enhance = compose(
    injectSheet({
        loader: {
            display: 'flex',
            position: 'absolute',
            top: '0',
            left: '0',
            right: '0',
            bottom: '0',
            alignItems: 'center',
            background: '#fff',
            justifyContent: 'space-around'
        },
        wrapper: {
            color: '#333 !important',
            width: '100%',
            display: 'flex',
            flexWrap: 'wrap'
        },
        title: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%',
            height: '60px',
            padding: '0 30px',
            borderBottom: '1px #efefef solid',
            position: 'relative'
        },
        titleLabel: {
            fontSize: '18px',
            color: '#333',
            fontWeight: '600',
            cursor: 'pointer'
        },
        titleButtons: {
            display: 'flex'
        },
        bodyTitle: {
            display: 'flex',
            fontWeight: '600',
            marginBottom: '25px',
            fontSize: '14px',
            justifyContent: 'space-between',
            height: '25px',
            alignItems: 'center !important'
        },
        content: {
            display: 'flex',
            width: '100%'
        },
        subBlock: {
            padding: '20px 30px',
            '&:last-child': {
                border: 'none'
            }
        },
        leftSide: {
            position: 'relative',
            extend: 'subBlock',
            flexBasis: '50%',
            maxWidth: '50%',
            borderRight: '1px #efefef solid'
        },
        rightSide: {
            position: 'relative',
            extend: 'subBlock',
            flexBasis: '50%',
            maxWidth: '50%'
        },
        rightSideTitleDate: {
            fontWeight: '600',
            fontSize: '12px!important',
            color: '#a5a1a0'
        },
        tableContent: {
            '& .row:first-child': {
                fontWeight: '600',
                '&:after': {
                    display: 'none'
                }
            },
            '& .row': {
                margin: '0',
                padding: '0 !important',
                alignItems: 'center',
                height: '40px',
                '& > div': {
                    textAlign: 'right'
                },
                '& > div:first-child': {
                    textAlign: 'left',
                    padding: '0!important'
                },
                '& > div:last-child': {
                    padding: '0!important'
                }
            },
            overflowY: 'auto',
            overflowX: 'hidden'
        },
        agentCanSet: {
            margin: '-10px -30px 10px',
            padding: '10px 30px',
            background: '#f2f5f8',
            fontWeight: '600',
            height: '55px'
        },
        average: {
            fontWeight: '600',
            marginTop: '20px',
            marginBottom: '20px',
            textAlign: 'right'
        },
        averagePrice: {
            fontWeight: '600',
            paddingLeft: '20px'
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
        emptyQuery: {
            background: 'url(' + NotFound + ') no-repeat center center',
            backgroundSize: '180px',
            padding: '140px 0 0',
            textAlign: 'center',
            fontSize: '13px',
            color: '#666'
        },
        noSupply: {
            textAlign: 'center'
        },
        netCost: {
            extend: 'agentCanSet',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            '& > div': {
                display: 'inherit',
                alignItems: 'inherit'
            }

        }
    })
)
const PriceDetails = enhance((props) => {
    const {
        classes,
        priceSupplyDialog,
        priceSetForm,
        detailData,
        handleCloseDetail,
        mergedList,
        listDetailData,
        defaultDialog
    } = props
    const loading = _.get(detailData, 'detailLoading')
    const priceListIsLoading = _.get(detailData, 'priceListLoading')
    const priceListItemsIsLoading = _.get(detailData, 'priceListItemsLoading')
    const priceHistoryList = _.get(detailData, 'priceItemHistoryList')
    const priceHistoryLoading = _.get(detailData, 'priceItemHistoryLoading')
    const name = _.get(detailData, ['data', 'name'])
    const measurement = _.get(detailData, ['data', 'measurement', 'name'])
    const priceUpdated = _.get(listDetailData, ['0', 'priceUpdated']) ? moment(_.get(listDetailData, ['0', 'priceUpdated'])).format('DD.MM.YYYY') : t('Не установлены')
    const averageCost = _.get(listDetailData, ['0', 'netCost'])
    const minPrice = numberFormat(_.get(detailData, ['data', 'minPrice']))
    const maxPrice = numberFormat(_.get(detailData, ['data', 'maxPrice']))
    const customPrice = _.get(detailData, ['data', 'customPrice'])
    const currencyName = _.get(detailData, ['data', 'currencyName'])
    const defaultNetCost = _.get(detailData, 'defaultNetCost')
    const iconStyle = {
        icon: {
            color: '#666',
            width: 20,
            height: 20
        },
        button: {
            width: 20,
            height: 20,
            padding: 0
        }
    }
    const iconStyle2 = {
        icon: {
            color: '#666',
            width: 20,
            height: 20
        },
        button: {
            width: 40,
            height: 40,
            padding: 0
        }
    }

    const emptySupplyList = (
        <div>
            <div className={classes.emptyQuery}>
            </div>
            {_.get(defaultNetCost, 'cost')
                ? <div className={classes.noSupply}>
                    {t('Постaвок не найдено')}, <Link to={{
                        pathname: ROUTES.SUPPLY_LIST_URL,
                        query: {openCreateDialog: true}
                    }} target='_blank'>{t('добавить поставку')}</Link>
                </div>
                : <div className={classes.noSupply}>
                    {t('Постaвок не найдено')}, <Link to={{
                        pathname: ROUTES.SUPPLY_LIST_URL,
                        query: {openCreateDialog: true}
                    }} target='_blank'>{t('добавьте поставку')}</Link>
                    <br/>{t('или')} <a onClick={defaultDialog.handleOpen}>{t('добавьте себестоимость')} </a> {t('по умолчанию')}
                </div>}

        </div>
    )
    if (loading) {
        return (
            <div className={classes.loader}>
                <div>
                    <LinearProgress/>
                </div>
            </div>
        )
    }
    return (
        <div className={classes.wrapper}>
            <div className={classes.title}>
                <div className={classes.titleLabel}>{name}</div>
                <div className={classes.closeDetail}
                     onClick={handleCloseDetail}>
                </div>
                <div className={classes.titleButtons}>
                    {!priceSetForm.openPriceSetForm && <ToolTip position="bottom" text={t('Закрыть')}>
                        <IconButton
                            iconStyle={iconStyle.icon}
                            style={iconStyle.button}
                            disableTouchRipple={true}
                            touch={true}
                            onTouchTap={handleCloseDetail}>
                            <CloseIcon />
                        </IconButton>
                    </ToolTip>}
                </div>
            </div>
            <div className={classes.content}>

                <div className={classes.leftSide}>
                    {(!_.isEmpty(priceHistoryList) || _.get(defaultNetCost, 'cost')) && <div className={classes.bodyTitle}>{t('Поставки')}</div> }
                    {priceHistoryLoading &&
                    <div className={classes.loader}>
                        <div>
                            <Loader size={0.75}/>
                        </div>
                    </div>}

                    {!priceHistoryLoading && (_.isEmpty(priceHistoryList) && !_.get(defaultNetCost, 'cost')) &&
                        // If default net cost is not set and supply list is empty show this element
                        emptySupplyList
                    }
                    {!priceHistoryLoading && _.get(defaultNetCost, 'cost') &&
                        // If net_cost set show it
                        <div className={classes.netCost}>
                            <span>{t('Себестоимость по умолчанию')}:</span>
                            <div>{numberFormat(_.get(defaultNetCost, 'cost'), getConfig('PRIMARY_CURRENCY'))}
                                <div className={classes.titleButtons}>
                                    <ToolTip position="bottom" text={t('Изменить')}>
                                        <IconButton
                                            iconStyle={iconStyle2.icon}
                                            style={iconStyle2.button}
                                            touch={true}
                                            onTouchTap={defaultDialog.handleOpen}>
                                            <Edit />
                                        </IconButton>
                                    </ToolTip>
                                </div>
                            </div>
                        </div>
                    }
                    {!priceHistoryLoading && _.get(defaultNetCost, 'cost') && _.isEmpty(priceHistoryList) &&
                        // If net_cost set but supply list is empty
                        emptySupplyList
                    }

                    {!priceHistoryLoading && (!_.isEmpty(priceHistoryList))
                        ? <div className={classes.tableContent}>
                            <Row>
                                <Col xs={1} style={{fontSize: '15px'}}>№</Col>
                                <Col style={{textAlign: 'left'}} xs={3}>{t('Дата')}</Col>
                                <Col style={{textAlign: 'left'}} xs={3}>{t('Кол-во')}</Col>
                                <Col style={{textAlign: 'left'}} xs={2}>{t('На складе')}</Col>
                                <Col xs={3}>{t('Себест')}.</Col>
                            </Row>

                            {_.map(priceHistoryList, (item) => {
                                const amount = _.get(item, 'amount')
                                const balance = _.get(item, 'balance')
                                const netCost = _.get(item, 'netCost')
                                const date = dateFomat(_.get(item, 'createdDate'))
                                const id = _.get(item, 'id')
                                const supplyId = _.get(item, 'supplyId')
                                return (
                                    <Row key={id} className="dottedList">
                                        <Col xs={1}>
                                            <a onClick={ () => { priceSupplyDialog.handleOpenSupplyDialog(id) }} className={classes.link}>
                                                {supplyId}
                                            </a>
                                        </Col>
                                        <Col style={{textAlign: 'left'}} xs={3}>{date}</Col>
                                        <Col style={{textAlign: 'left'}} xs={3}>{numberFormat(amount, measurement)}</Col>
                                        <Col style={{textAlign: 'left'}} xs={2}>{numberFormat(balance, measurement)}</Col>
                                        <Col xs={3}>{numberFormat(netCost, getConfig('PRIMARY_CURRENCY'))}</Col>
                                    </Row>
                                )
                            })}

                            <div className={classes.average}> {t('Усредненная себестоимость')}:
                                <span className={classes.averagePrice}>{numberFormat(averageCost, getConfig('PRIMARY_CURRENCY'))}</span>
                            </div>
                        </div>
                        : null
                    }

                </div>

                <div className={classes.rightSide}>
                    {(priceListIsLoading || priceListItemsIsLoading) && <div className={classes.loader}>
                        <Loader size={0.75}/>
                    </div>}
                    {!priceListIsLoading && !priceListItemsIsLoading && priceSetForm.openPriceSetForm &&
                        <PriceSetForm
                            initialValues={priceSetForm.initialValues}
                            onClose={priceSetForm.handleClosePriceSetForm}
                            onSubmit={priceSetForm.handleSubmitPriceSetForm}
                            mergedList={mergedList}
                            priceUpdatedDate={priceUpdated}
                            priceHolder={priceSetForm.initialValues}
                        />
                    }
                    {(!priceListIsLoading && !priceListItemsIsLoading && !priceSetForm.openPriceSetForm) && <div>
                        <div className={classes.bodyTitle}>
                            <div>{t('Цены на товар')}
                                <span className={classes.rightSideTitleDate}> ({priceUpdated})</span>
                            </div>
                            <div className={classes.titleButtons}>
                                <ToolTip position="bottom" text={t('Изменить')}>
                                    <IconButton
                                        iconStyle={iconStyle.icon}
                                        style={iconStyle.button}
                                        touch={true}
                                        disableTouchRipple={true}
                                        onTouchTap={priceSetForm.handleOpenPriceSetForm}>
                                        <Edit />
                                    </IconButton>
                                </ToolTip>
                            </div>
                        </div>
                        {customPrice && <div className={classes.agentCanSet}>{t('Агент может устанавливать цены')}. <br/> {t('Минимальная / максимальная стоимость')}: {minPrice} / {maxPrice} {currencyName}</div>}
                        <div className={classes.tableContent}>
                            <Row className="dottedList">
                                <Col xs={6}>{t('Тип обьекта')}</Col>
                                <Col xs={3}>{t('Нал')}</Col>
                                <Col xs={3}>{t('Безнал')}</Col>
                            </Row>
                            {_.map(mergedList, (item) => {
                                const id = _.get(item, 'priceListId')
                                const priceListName = _.get(item, 'priceListName')
                                const transferCurrency = _.get(item, ['transferCurrency', 'name']) || ' '
                                const cashCurrency = _.get(item, ['cashCurrency', 'name']) || ' '
                                const cashPrice = _.get(item, 'cash_price') + ' ' + cashCurrency
                                const transferPrice = _.get(item, 'transfer_price') + ' ' + transferCurrency
                                return (
                                    <Row className="dottedList" key={id}>
                                        <Col xs={6}> {priceListName}</Col>
                                        <Col xs={3}>{cashPrice}</Col>
                                        <Col xs={3}>{transferPrice}</Col>
                                    </Row>
                                )
                            })}
                        </div>
                    </div> }
                </div>
            </div>

            <PriceSetDefaultDialog
                onClose={defaultDialog.handleClose}
                initialValues={{amount: numberFormat(_.get(defaultNetCost, 'cost'))}}
                open={defaultDialog.open}
                onSubmit={defaultDialog.handleSubmit}
            />

        </div>)
})
PriceDetails.PropTypes = {
    mergedList: PropTypes.func.isRequired,
    priceSupplyDialog: PropTypes.shape({
        openPriceSupplyDialog: PropTypes.number.isRequired,
        handleOpenSupplyDialog: PropTypes.func.isRequired,
        handleCloseSupplyDialog: PropTypes.func.isRequired
    }).isRequired,
    priceSetForm: PropTypes.shape({
        openPriceSetForm: PropTypes.bool.isRequired,
        handleOpenPriceSetForm: PropTypes.func.isRequired,
        handleClosePriceSetForm: PropTypes.func.isRequired,
        handleSubmitPriceSetForm: PropTypes.func.isRequired
    })
}
export default PriceDetails
