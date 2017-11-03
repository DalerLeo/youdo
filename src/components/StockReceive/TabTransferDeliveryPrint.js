import React from 'react'
import {Row, Col} from 'react-flexbox-grid'
import IconButton from 'material-ui/IconButton'
import injectSheet from 'react-jss'
import _ from 'lodash'
import {compose} from 'recompose'
import Close from 'material-ui/svg-icons/navigation/close'
import Loader from '../Loader'
import numberFormat from '../../helpers/numberFormat'

const enhance = compose(
    injectSheet({
        loader: {
            width: '100vw',
            height: '100vh',
            background: '#fff',
            alignItems: 'center',
            zIndex: '999',
            justifyContent: 'center',
            display: 'flex'
        },
        wrapper: {
            background: '#fff',
            fontSize: '14px',
            width: '100%',
            height: '100%',
            zIndex: '999',
            overflowY: 'auto',
            '& .printItem': {
                borderBottom: 'none'
            }
        },
        closeBtn: {
            position: 'absolute !important',
            top: '5px',
            right: '5px',
            opacity: '0'
        },
        item: {
            width: '100%',
            marginBottom: '30px',
            borderBottom: 'dashed 1px',
            '&:last-child': {
                borderBottom: 'none',
                marginBottom: '0'

            }
        },
        title: {
            display: 'flex',
            justifyContent: 'space-between',
            '& span': {
                fontWeight: 'bold',
                fontSize: '18px !important',
                marginBottom: '10px'
            },
            '& div:last-child': {
                fontSize: '12px',
                color: '#777',
                fontWeight: '600',
                marginRight: '30px'
            }
        },
        products: {
            marginTop: '10px',
            width: '100%',
            display: 'table',
            borderCollapse: 'collapse',
            position: 'relative',
            '& .row': {
                height: '25px',
                border: '1px #555 solid',
                display: 'table-row',
                pageBreakInside: 'avoid',
                '&:first-child': {
                    fontWeight: 'bold'
                },
                '& > div': {
                    verticalAlign: 'middle',
                    display: 'table-cell',
                    border: '1px #555 solid'
                },
                '& > div:last-child': {
                    textAlign: 'right'
                },
                '&:after': {
                    left: '0.5rem',
                    right: '0.5rem'
                }
            }
        }

    })
)

const TabTransferDeliveryPrint = enhance((props) => {
    const {classes, deliveryDetailsData} = props
    const loading = _.get(deliveryDetailsData, 'deliveryDetailLoading')
    const deliveryMan = _.get(deliveryDetailsData, ['data', 'deliveryMan'])
    const deliveryManName = deliveryMan
        ? _.get(deliveryMan, 'firstName') + ' ' + _.get(deliveryMan, 'secondName')
        : 'Доставщик не определен'
    if (loading) {
        return (
            <div className={classes.loader}>
                <Loader size={0.75}/>
            </div>
        )
    }
    return (
        <div className={classes.wrapper}>
            <div className="printItem">
                <div className={classes.title}>
                    <span>{deliveryManName}</span>
                </div>

                <div className={classes.products}>
                    <Row>
                        <Col xs={4}>Наименование</Col>
                        <Col xs={4}>Тип товара</Col>
                        <Col xs={4}>Кол-во</Col>
                    </Row>
                    {_.map(_.get(deliveryDetailsData, ['data', 'products']), (item) => {
                        const productId = _.get(item, 'id')
                        const measurment = _.get(item, ['measurement', 'name'])
                        const name = _.get(item, 'name')
                        const type = _.get(item, ['type', 'name'])
                        const amount = numberFormat(_.get(item, 'count'), measurment)

                        return (
                            <Row key={productId}>
                                <Col xs={4}>{name}</Col>
                                <Col xs={4}>{type}</Col>
                                <Col xs={4}>{amount}</Col>
                            </Row>
                        )
                    })}
                </div>
            </div>
            <IconButton onTouchTap={deliveryDetailsData.handleCloseDeliveryPrintDialog} className="printCloseBtn">
                <Close color="#666"/>
            </IconButton>
        </div>
    )
})

export default TabTransferDeliveryPrint
