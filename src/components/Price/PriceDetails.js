import React from 'react'
import _ from 'lodash'
// Import moment from 'moment'
import {compose} from 'recompose'
import injectSheet from 'react-jss'
import PropTypes from 'prop-types'
import CircularProgress from 'material-ui/CircularProgress'
import Edit from 'material-ui/svg-icons/image/edit'
// Import Delete from 'material-ui/svg-icons/action/delete'
import IconButton from 'material-ui/IconButton'
import CloseIcon2 from '../CloseIcon'
import {Row, Col} from 'react-flexbox-grid'
import Tooltip from '../ToolTip'
import PriceSetForm from './PriceSetForm'

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
        dottedList: {
            padding: '15px 0'
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
            padding: '0 40px',
            borderBottom: '1px #efefef solid'
        },
        titleLabel: {
            fontSize: '18px',
            color: '#333',
            fontWeight: '700'
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
            height: '25px'
        },
        content: {
            display: 'flex',
            width: '100%'
        },

        subBlock: {
            padding: '20px 40px',
            '&:last-child': {
                border: 'none'
            }
        },
        leftSide: {
            extend: 'subBlock',
            flexBasis: '40%',
            maxWidth: '40%',
            borderRight: '1px #efefef solid'

        },
        rightSide: {
            position: 'relative',
            extend: 'subBlock',
            flexBasis: '60%',
            maxWidth: '60%'
        },
        rightSideTitleDate: {
            fontWeight: '600',
            fontSize: '12px!important',
            color: '#a5a1a0'
        },
        tableContent: {
            '& .row:first-child': {
                fontWeight: '600'
            },
            '& .row': {
                '& > div': {
                    textAlign: 'right'
                },
                '& > div:first-child': {
                    textAlign: 'left'
                }
            },
            overflowY: 'auto',
            overflowX: 'hidden'
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
        handleCloseDetail

    } = props
    const marketTypeIsLoading = _.get(detailData, 'marketTypeLoading')
    const marketTypes = _.get(detailData, ['marketTypeList', 'results'])
    const priceListItemsIsLoading = _.get(detailData, 'priceListItemsLoading')
    const iconStyle = {
        icon: {
            color: '#666',
            width: 20,
            height: 20
        },
        button: {
            width: 48,
            height: 25,
            padding: 0
        }
    }
    return (
        <div className={classes.wrapper}>
            <div className={classes.title}>
                <div className={classes.titleLabel}>Стиральный порошек Миф</div>
                <div className={classes.titleButtons}>
                    <Tooltip position="bottom" text="Закрыть">
                        <IconButton
                            iconStyle={iconStyle.icon}
                            style={iconStyle.button}
                            touch={true}
                            onTouchTap={handleCloseDetail}>
                            <CloseIcon2 />
                        </IconButton>
                    </Tooltip>
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
                            <div className={classes.average}> Усредненная себестоимость
                                <span className={classes.averagePrice}>100 000 UZS</span>
                            </div>
                        </div>
                    </div>
                    <div className={classes.rightSide}>
                        {(marketTypeIsLoading || priceListItemsIsLoading) && <div className={classes.loader}>
                                                <CircularProgress size={60} thickness={5} />
                                        </div>}
                        {priceSetForm.openPriceSetForm && <PriceSetForm
                            // Loading={createDialog.createLoading}
                            // CreateClientDialog={createClientDialog}
                            onClose={priceSetForm.handleClosePriceSetForm}
                            onSubmit={priceSetForm.handleSubmitPriceSetForm}
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
                                <Row>
                                    <Col xs={6}>Тип обьекта</Col>
                                    <Col style={{textAlign: 'left'}} xs={3}>Нал</Col>
                                    <Col style={{textAlign: 'left'}} xs={3}>Безнал</Col>
                                </Row>
                                {_.map(marketTypes, (item, index) => {
                                    const marketName = _.get(item, 'name')
                                    return (
                                        <Row className="dottedList" key={index}>
                                            <Col xs={6}> {marketName}</Col>
                                            <Col style={{textAlign: 'left'}} xs={3}>20 000 UZS</Col>
                                            <Col style={{textAlign: 'left'}} xs={3}>20 000 UZS </Col>
                                        </Row>
                                    )
                                })}
                            </div>
                        </div>}
                    </div>
            </div>

        </div>)
})

PriceDetails.PropTypes = {
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
