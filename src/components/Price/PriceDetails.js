import React from 'react'
import _ from 'lodash'
import {compose} from 'recompose'
import injectSheet from 'react-jss'
import PropTypes from 'prop-types'
import CircularProgress from 'material-ui/CircularProgress'
import Edit from 'material-ui/svg-icons/image/edit'
import IconButton from 'material-ui/IconButton'
import CloseIcon2 from '../CloseIcon2'
import {Row, Col} from 'react-flexbox-grid'
import Tooltip from '../ToolTip'
import PriceSetForm from './PriceSetForm'
import getConfig from '../../helpers/getConfig'
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
            borderBottom: '1px #efefef solid'
        },
        titleLabel: {
            fontSize: '18px',
            color: '#333',
            fontWeight: '700',
            cursor: 'pointer'
        },
        titleButtons: {
            display: 'flex'
        },
        bodyTitle: {
            display: 'flex',
            fontWeight: '700',
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
            extend: 'subBlock',
            flexBasis: '45%',
            maxWidth: '45%',
            borderRight: '1px #efefef solid'
        },
        rightSide: {
            position: 'relative',
            extend: 'subBlock',
            flexBasis: '55%',
            maxWidth: '55%'
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
                    textAlign: 'left'
                }
            },
            overflowY: 'auto',
            overflowX: 'hidden',
            margin: '0 -0.5rem'
        },
        average: {
            fontWeight: '600',
            marginTop: '20px',
            marginBottom: '20px',
            textAlign: 'right'
        },
        averagePrice: {
            fontWeight: '700',
            paddingLeft: '20px'
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
        mergedList
    } = props
    const loading = _.get(detailData, 'detailLoading')
    const marketTypeIsLoading = _.get(detailData, 'marketTypeLoading')
    const priceListItemsIsLoading = _.get(detailData, 'priceListItemsLoading')
    const priceList = _.get(detailData, 'priceListItemsList')
    const name = _.get(detailData, ['data', 'name'])
    const iconStyle = {
        icon: {
            color: '#666',
            width: 20,
            height: 20
        },
        button: {
            width: 48,
            height: 48,
            padding: 0
        }
    }
    if (loading) {
        return (
            <div className={classes.loader}>
                <div>
                    <CircularProgress size={100} thickness={6}/>
                </div>
            </div>
        )
    }
    return (
        <div className={classes.wrapper}>
            <div className={classes.title}>
                <div className={classes.titleLabel}
                     onTouchTap={handleCloseDetail}>
                    {name}</div>
                <div className={classes.titleButtons}>
                    {!priceSetForm.openPriceSetForm && <Tooltip position="bottom" text="Закрыть">
                        <IconButton
                            iconStyle={iconStyle.icon}
                            style={iconStyle.button}
                            touch={true}
                            onTouchTap={handleCloseDetail}>
                            <CloseIcon2 />
                        </IconButton>
                    </Tooltip>}
                </div>
            </div>
            <div className={classes.content}>
                <div className={classes.leftSide}>
                    <div className={classes.bodyTitle}>Поставки</div>
                    <div className={classes.tableContent}>
                        <Row>
                            <Col xs={2} style={{fontSize: '15px'}}>&#8470;</Col>
                            <Col style={{textAlign: 'left'}} xs={3}>Дата</Col>
                            <Col style={{textAlign: 'left'}} xs={3}>Количество</Col>
                            <Col xs={4}>Себестоимость</Col>
                        </Row>
                        <Row className="dottedList">
                            <Col xs={2}>
                                <a onClick={priceSupplyDialog.handleOpenSupplyDialog} className={classes.link}>
                                    P-1121
                                </a>
                            </Col>
                            <Col style={{textAlign: 'left'}} xs={3}>23 апр, 2017</Col>
                            <Col style={{textAlign: 'left'}} xs={3}>200 кг</Col>
                            <Col xs={4}>90 000 UZS</Col>
                        </Row>
                        <div className={classes.average}> Усредненная себестоимость:
                            <span className={classes.averagePrice}>100 000 UZS</span>
                        </div>
                    </div>
                </div>
                <div className={classes.rightSide}>
                    {(marketTypeIsLoading || priceListItemsIsLoading) && <div className={classes.loader}>
                        <CircularProgress size={60} thickness={5} />
                    </div>}
                    {priceSetForm.openPriceSetForm && <PriceSetForm
                        initialValues={priceSetForm.initialValues}
                        onClose={priceSetForm.handleClosePriceSetForm}
                        onSubmit={priceSetForm.handleSubmitPriceSetForm}
                        priceList={priceList}
                        mergedList={mergedList}
                    />
                    }
                    {(!marketTypeIsLoading && !priceListItemsIsLoading && !priceSetForm.openPriceSetForm) && <div>
                        <div className={classes.bodyTitle}>
                            <div>Цены на товар
                                <span className={classes.rightSideTitleDate}> (23 апр, 2017)</span>
                            </div>
                            <div className={classes.titleButtons}>
                                <Tooltip position="bottom" text="Изменить">
                                    <IconButton
                                        iconStyle={iconStyle.icon}
                                        style={iconStyle.button}
                                        touch={true}
                                        onTouchTap={priceSetForm.handleOpenPriceSetForm}
                                    >
                                        <Edit />
                                    </IconButton>
                                </Tooltip>
                            </div>
                        </div>
                        <div className={classes.tableContent}>
                            <Row className="dottedList">
                                <Col xs={6}>Тип обьекта</Col>
                                <Col style={{textAlign: 'left'}} xs={3}>Нал</Col>
                                <Col style={{textAlign: 'left'}} xs={3}>Безнал</Col>
                            </Row>
                            {_.map(mergedList, (item) => {
                                const id = _.get(item, 'marketTypeId')
                                const marketName = _.get(item, 'marketTypeName')
                                const cashPrice = _.get(item, 'cash_price') + ' ' + getConfig('PRIMARY_CURRENCY_NAME')
                                const transferPrice = _.get(item, 'transfer_price') + ' ' + getConfig('PRIMARY_CURRENCY_NAME')
                                return (
                                    <Row className="dottedList" key={id}>
                                        <Col xs={6}> {marketName}</Col>
                                        <Col style={{textAlign: 'left'}} xs={3}>{cashPrice}</Col>
                                        <Col style={{textAlign: 'left'}} xs={3}>{transferPrice}</Col>
                                    </Row>
                                )
                            })}
                        </div>
                    </div> }
                </div>
            </div>
        </div>)
})
PriceDetails.PropTypes = {
    mergedList: PropTypes.func.isRequired,
    priceSupplyDialog: PropTypes.shape({
        openPriceSupplyDialog: PropTypes.bool.isRequired,
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
