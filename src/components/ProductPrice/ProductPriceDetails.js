import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import {compose, withState} from 'recompose'
import injectSheet from 'react-jss'
import CircularProgress from 'material-ui/CircularProgress'
import {Col} from 'react-flexbox-grid'
import Popover from 'material-ui/Popover'

const enhance = compose(
    injectSheet({
        loader: {
            position: 'absolute',
            display: 'flex',
            justifyContent: 'center',
            width: '100%'
        },
        dottedList: {
            padding: '20px 0'
        },
        wrapper: {
            width: '100%'
        },
        title: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            height: '65px',
            padding: '0 30px',
            borderBottom: '1px #efefef solid'
        },
        titleLabel: {
            fontSize: '18px',
            color: '#333',
            fontWeight: '600',
            cursor: 'pointer'
        },
        buttons: {
            display: 'flex',
            justifyContent: 'flex-end'
        },
        bodyTitle: {
            fontWeight: '600',
            marginBottom: '10px'
        },
        containerPrice: {
            display: 'flex'
        },
        leftPrSide: {
            padding: '20px 30px',
            flexBasis: '30%',
            borderRight: '1px solid #efefef'
        },
        aboutPrice: {
            padding: '20px 0',
            '& span': {
                color: '#999'
            },
            '& p': {
                display: 'inline-block',
                '& span': {
                    fontSize: '11px !important'
                }
            },
            '& p:last-child': {
                fontWeight: '600',
                paddingLeft: '15px'
            }
        },
        rightPrSide: {
            padding: '20px 30px',
            flexBasis: '70%'
        },
        rawMaterials: {
            '& .dottedList': {
                padding: '10px 0'
            },
            '& li:last-child:after': {
                backgroundImage: 'none'
            },
            '& li div:last-child': {
                textAlign: 'right',
                paddingRight: '10px'
            },
            '& a': {
                borderBottom: '1px dashed'
            }
        },
        changePrice: {
            background: '#f1f5f8',
            margin: '0 -30px 0',
            padding: '20px 30px'
        },
        addPrice: {
            display: 'flex',
            alignItems: 'baseline',
            justifyContent: 'space-between'
        },
        popoverMode: {
            padding: '10px 30px',
            boxShadow: 'none !important',
            '& h4': {
                padding: '10px 0'
            },
            '& div p': {
                display: 'inline-block'
            },
            '& div p:first-child': {
                width: '120px'
            }
        }
    }),
    withState('openDetails', 'setOpenDetails', false),
    withState('showAddPrice', 'setShowAddPrice', false),
    withState('priceDetailsOpen', 'setPriceDetailsOpen', false),
    withState('anchorEl', 'setAnchorEl', (<div></div>)),
)

const ProductPriceDetails = enhance((props) => {
    const {classes,
        loading,
        data,
        updateDialog,
        anchorEl,
        handleOpenDetails,
        handleCloseDetails,
        priceDetailsOpen,
        handleCloseDetail
    } = props
    const detId = _.get(data, 'id')
    const detnName = _.get(data, 'name')
    if (loading) {
        return (
            <div className={classes.loader}>
                <div>
                    <CircularProgress size={40} thickness={4}/>
                </div>
            </div>
        )
    }

    return (
        <div className={classes.wrapper}>
            <div className={classes.title}>
                <div className={classes.titleLabel}
                onClick={handleCloseDetail}>{detnName}</div>
            </div>
            <div className={classes.containerPrice}>
                <div className={classes.leftPrSide}>
                    <div>Расчет произведен на 1 еденицу продукта</div>
                    <div className={classes.aboutPrice}>
                        <p className={classes.priceLabel}>Cебестоимость:</p>
                        <p className={classes.priceCost}>20 000 UZS <span>(22 Апр, 2017)</span></p>
                    </div>
                    <hr className="lineDote"/>
                    <div className={classes.aboutPrice}>
                        <p className={classes.priceLabel}>Рыночная цена:</p>
                        <p className={classes.priceCost}>30 000 UZS <span>(22 Апр, 2017)</span></p>
                    </div>
                    <div className={classes.changePrice}>
                        <a onClick={() => { updateDialog.handleOpenUpdateDialog(detId) }}>Изменить рыночную стоимость</a>
                    </div>
                </div>
                <div className={classes.rightPrSide}>
                    <ul className={classes.rawMaterials}>
                        <li className="dottedList">
                            <Col xs={7}><b>Сырье</b></Col>
                            <Col xs={2}><b>Обьем</b></Col>
                            <Col xs={3}><b>Стоимость</b></Col>
                        </li>
                        <li className="dottedList">
                            <Col xs={7}>Дистилированная вода</Col>
                            <Col xs={2}>100 л</Col>
                            <Col xs={3}>
                                <a onClick={handleOpenDetails}>1 000 000 UZS</a>
                            </Col>
                        </li>
                        <li className="dottedList">
                            <Col xs={7}>Дистилированная вода</Col>
                            <Col xs={2}>100 л</Col>
                            <Col xs={3}>
                                <a onClick={handleOpenDetails}>1 000 000 UZS</a>
                            </Col>
                        </li>
                        <li className="dottedList">
                            <Col xs={7}>Дистилированная вода</Col>
                            <Col xs={2}>100 л</Col>
                            <Col xs={3}>
                                <a onClick={handleOpenDetails}>1 000 000 UZS</a>
                            </Col>
                        </li>
                        <li className="dottedList">
                            <Col xs={7}>Дистилированная вода</Col>
                            <Col xs={2}>100 л</Col>
                            <Col xs={3}>
                                <a onClick={handleOpenDetails}>1 000 000 UZS</a>
                            </Col>
                        </li>
                        <li className="dottedList">
                            <Col xs={7}>Дистилированная вода</Col>
                            <Col xs={2}>100 л</Col>
                            <Col xs={3}>
                                <a onClick={handleOpenDetails}>1 000 000 UZS</a>
                            </Col>
                        </li>
                        <li className="dottedList">
                            <Col xs={7}>Дистилированная вода</Col>
                            <Col xs={2}>100 л</Col>
                            <Col xs={3}>
                                <a onClick={handleOpenDetails}>1 000 000 UZS</a>
                            </Col>
                        </li>
                    </ul>
                </div>
            </div>
            <Popover
                open={priceDetailsOpen}
                anchorEl={anchorEl}
                anchorOrigin={{horizontal: 'right', vertical: 'bottom'}}
                targetOrigin={{horizontal: 'right', vertical: 'top'}}
                onRequestClose={handleCloseDetails}>
                <div className={classes.popoverMode}>
                    <h4>Дистилированая вода</h4>
                    <div>
                        <p>Объем:</p>
                        <p>100 л</p>
                    </div>
                    <div>
                        <p>Стоимость:</p>
                        <p>500 000 UZS</p>
                    </div>
                    <div>
                        <p>Доп. расход:</p>
                        <p>100 000 UZS</p>
                    </div>
                    <h4><i>Примерная стоимость 1 л = 6 000 UZS</i></h4>
                </div>
            </Popover>
        </div>
    )
})

ProductPriceDetails.propTypes = {
    data: PropTypes.object.isRequired,
    loading: PropTypes.bool.isRequired,
    detailData: PropTypes.object,
    updateDialog: PropTypes.shape({
        updateLoading: PropTypes.bool.isRequired,
        openUpdateDialog: PropTypes.bool.isRequired,
        handleOpenUpdateDialog: PropTypes.func.isRequired,
        handleCloseUpdateDialog: PropTypes.func.isRequired,
        handleSubmitUpdateDialog: PropTypes.func.isRequired
    }).isRequired
}

export default ProductPriceDetails
