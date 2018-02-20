import _ from 'lodash'
import React from 'react'
import {compose, withState} from 'recompose'
import injectSheet from 'react-jss'
import PropTypes from 'prop-types'
import {Row, Col} from 'react-flexbox-grid'
import numberFormat from '../../helpers/numberFormat'
import dateFormat from '../../helpers/dateFormat'
import t from '../../helpers/translate'
import NotFound from '../Images/not-found.png'
import LinearProgress from '../LinearProgress'
import ToolTip from '../ToolTip'
import IconButton from 'material-ui/IconButton'
import CheckCircleIcon from 'material-ui/svg-icons/action/check-circle'

const enhance = compose(
    injectSheet({
        defect: {
            color: '#ff526d !important'
        },
        loader: {
            display: 'flex',
            justifyContent: 'center',
            width: '100%',
            background: '#fff'
        },
        wrapper: {
            width: '100%',
            height: 'auto',
            alignSelf: 'baseline',
            overflowY: 'auto',
            '& .progress': {
                background: 'transparent'
            }
        },
        content: {
            width: '100%',
            overflow: 'hidden',
            display: 'flex'
        },
        leftSide: {
            padding: '20px 30px',
            borderRight: '1px #efefef solid',
            width: '350px',
            '& > div': {
                marginBottom: '5px',
                '&:last-child': {
                    marginBottom: '0'
                }
            }
        },
        rightSide: {
            width: 'calc(100% - 350px)',
            padding: '5px 30px',
            '& .dottedList': {
                margin: '0',
                padding: '15px 0',
                '&:first-child': {
                    fontWeight: '600'
                },
                '& > div': {
                    textAlign: 'right',
                    '&:first-child': {
                        textAlign: 'left',
                        paddingLeft: '0'
                    },
                    '&:last-child': {
                        paddingRight: '0'
                    }
                },
                '&:last-child': {
                    '&:after': {display: 'none'}
                }
            }
        },
        header: {
            display: 'flex',
            alignItems: 'center',
            height: '65px',
            borderBottom: '1px #efefef solid',
            position: 'relative',
            padding: '0 30px',
            width: '100%',
            justifyContent: 'space-between',
            '& span': {
                fontSize: '16px',
                fontWeight: 'bold'
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
        emptyQuery: {
            background: 'url(' + NotFound + ') no-repeat center 20px',
            backgroundSize: '160px',
            padding: '135px 0 20px',
            textAlign: 'center',
            fontSize: '13px',
            color: '#666',
            width: '100%'
        }

    }),
    withState('openDetails', 'setOpenDetails', false)
)
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

const InventoryDetails = enhance((props) => {
    const ZERO = 0
    const {classes, detailData, handleCloseDetail, handleOpenVerifyDialog} = props
    const isLoading = _.get(detailData, 'detailLoading')
    const createdBy = _.get(detailData, ['data', 'createdBy', 'firstName']) + ' ' + _.get(detailData, ['data', 'createdBy', 'secondName'])
    const createdDate = dateFormat(_.get(detailData, ['data', 'createdDate']))
    const stock = _.get(detailData, ['data', 'stock', 'name'])
    const comment = _.get(detailData, ['data', 'comment']) || t('Комментариев нет')
    const products = _.get(detailData, ['data', 'inventoryProducts'])

    if (isLoading) {
        return (
            <div className={classes.loader}>
                <LinearProgress/>
            </div>
        )
    }
    return (
        <div className={classes.wrapper}>
            <div style={{width: '100%'}}>
                <div className={classes.header}>
                    <div className={classes.closeDetail} onClick={handleCloseDetail}/>
                    <span>{createdBy}</span>
                    <ToolTip position="bottom" text={t('Сверить сырье')}>
                        <IconButton
                            iconStyle={iconStyle.icon}
                            style={iconStyle.button}
                            touch={true}
                            onTouchTap={() => handleOpenVerifyDialog()}>
                            <CheckCircleIcon />
                        </IconButton>
                    </ToolTip>
                </div>
                <div className={classes.content}>
                    <div className={classes.leftSide}>
                        <div>{t('Склад')}: <strong>{stock}</strong></div>
                        <div>{t('Дата создания')}: <strong>{createdDate}</strong></div>
                        <div>{t('Комментарий')}: <strong>{comment}</strong></div>
                    </div>
                    {_.isEmpty(_.get(detailData, ['data', 'inventoryProducts']))
                        ? <div className={classes.emptyQuery}>
                            <div>{t('Товаров не найдено')}</div>
                        </div>
                        : <div className={classes.rightSide}>
                            <Row className={'dottedList'}>
                                <Col xs={3}>{t('Наименование')}</Col>
                                <Col xs={3}>{t('Баланс (до)')}</Col>
                                <Col xs={3}>{t('Баланс (после)')}</Col>
                                <Col xs={3}>{t('Разница')}</Col>
                            </Row>
                            {_.map(products, (item) => {
                                const id = _.get(item, 'id')
                                const name = _.get(item, ['product', 'name'])
                                const measurement = _.get(item, ['product', 'measurement', 'name'])
                                const amount = _.toNumber(_.get(item, 'amount'))
                                const defectAmount = _.toNumber(_.get(item, 'defectAmount'))
                                const balanceAmount = _.toNumber(_.get(item, 'balanceAmount'))
                                const balanceDefectAmount = _.toNumber(_.get(item, 'balanceDefectAmount'))
                                const amountDiff = amount - balanceAmount > ZERO ? '+' + amount - balanceAmount : amount - balanceAmount
                                const defectDiff = defectAmount - balanceDefectAmount > ZERO ? '+' + defectAmount - balanceDefectAmount : defectAmount - balanceDefectAmount
                                return (
                                    <Row key={id} className={'dottedList'}>
                                        <Col xs={3}>{name}</Col>
                                        <Col xs={3}>{balanceAmount} / <span className={classes.defect}>{numberFormat(balanceDefectAmount, measurement)}</span></Col>
                                        <Col xs={3}>{amount} / <span className={classes.defect}>{numberFormat(defectAmount, measurement)}</span></Col>
                                        <Col xs={3}>{amountDiff} / <span className={classes.defect}>{numberFormat(defectDiff, measurement)}</span></Col>
                                    </Row>
                                )
                            })}
                        </div>}
                </div>
            </div>
        </div>
    )
})

InventoryDetails.propTypes = {
    detailData: PropTypes.object.isRequired,
    handleCloseDetail: PropTypes.func.isRequired
}

export default InventoryDetails
