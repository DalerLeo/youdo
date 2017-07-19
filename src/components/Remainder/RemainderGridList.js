import _ from 'lodash'
import React from 'react'
import sprintf from 'sprintf'
import PropTypes from 'prop-types'
import {Row, Col} from 'react-flexbox-grid'
import IconButton from 'material-ui/IconButton'
import * as ROUTES from '../../constants/routes'
import Container from '../Container'
import {Link} from 'react-router'
import SubMenu from '../SubMenu'
import injectSheet from 'react-jss'
import {compose} from 'recompose'
import ArrowDown from 'material-ui/svg-icons/navigation/arrow-drop-down-circle'
import Paper from 'material-ui/Paper'
import RemainderDetails from './RemainderDetails'
import CircularProgress from 'material-ui/CircularProgress'
import numberFormat from '../../helpers/numberFormat'
import RemainderTransferDialog from './RemainderTransferDialog'
import RemainderFilterForm from './RemainderFilterForm'
import RemainderDiscardDialog from './RemainderDiscardDialog'
import MoreHortIcon from 'material-ui/svg-icons/navigation/more-horiz'
import FloatingActionButton from 'material-ui/FloatingActionButton'
import RemoveIcon from 'material-ui/svg-icons/content/remove'
import SwapHorizIcon from 'material-ui/svg-icons/action/swap-horiz'
import Tooltip from '../ToolTip'

const enhance = compose(
    injectSheet({
        listWrapper: {
            '& > div:first-child': {
                marginTop: '0 !important'
            }
        },
        wrapper: {
            position: 'relative',
            padding: '0 30px',
            marginBottom: '5px',
            transition: 'all 400ms ease-out !important',
            '& > a': {
                color: 'inherit'
            },
            '& .row': {
                alignItems: 'center',
                '& div': {
                    lineHeight: '48px'
                }
            }
        },
        wrapperBold: {
            extend: 'wrapper',
            margin: '20px -15px !important',
            transition: 'all 400ms ease-out !important',
            '& .row:first-child': {
                fontWeight: '600'
            }
        },
        headers: {
            padding: '20px 30px 10px',
            '& .row': {
                alignItems: 'center'
            }
        },
        productList: {
            padding: '20px 30px',
            display: 'flex',
            justifyContent: 'space-between'
        },
        products: {
            display: 'flex',
            '& > div': {
                marginRight: '60px',
                '&:last-child': {
                    margin: '0'
                }
            }
        },
        itemData: {
            textAlign: 'left',
            fontWeight: '700',
            fontSize: '16px'
        },
        dropDown: {
            position: 'absolute !important',
            right: '0',
            top: '2px',
            '& > div': {
                height: '45px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }
        },
        dropUp: {
            extend: 'dropDown',
            transform: 'rotate(180deg)'
        },
        loader: {
            display: 'flex',
            height: '400px',
            alignItems: 'center',
            justifyContent: 'center'
        },
        clearBtn: {
            padding: '20px 30px',
            display: 'flex',
            alignItems: 'center',
            color: '#909090',
            '& button': {
                '& > div': {
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                }
            }

        },
        sendButton: {
            '& button': {
                backgroundColor: '#275482 !important'
            }
        },
        sendButtonWrapper: {
            position: 'absolute',
            top: '10px',
            right: '0',
            marginBottom: '0px'
        },
        closeDetail: {
            position: 'absolute',
            left: '0',
            top: '0',
            right: '0',
            bottom: '0',
            cursor: 'pointer',
            zIndex: '1',
            margin: '0 -22px',
            borderBottom: 'solid 1px #efefef'
        }
    })
)

const iconStyle = {
    icon: {
        color: '#61a8e8',
        width: 25,
        height: 25
    },
    button: {
        width: 45,
        height: 45,
        padding: 0
    }
}
const actionIconStyle = {
    icon: {
        width: 30,
        height: 30,
        backgroundColor: 'transparent'
    },
    button: {
        width: 30,
        height: 30,
        padding: 0,
        backgroundColor: '#275482'

    }
}
const RemainderGridList = enhance((props) => {
    const {
        detailData,
        classes,
        filter,
        listData,
        transferDialog,
        submitFilter,
        resetFilter,
        discardDialog,
        handleCloseDetail
    } = props
    const listLoading = _.get(listData, 'listLoading')
    const detailId = _.get(detailData, 'id')
    const listHeader = (
        <div className={classes.headers}>
            <Row>
                <Col xs={3}>Товар</Col>
                <Col xs={3}>Тип товара</Col>
                <Col xs={3} style={{textAlign: 'left'}}>Всего товаров</Col>
                <Col xs={2} style={{textAlign: 'left'}}>Браконный товары</Col>
                <Col xs={1} style={{display: 'none'}}>|</Col>
            </Row>
        </div>
    )

    const listLoader = (
        <Paper className={classes.loader}>
            <CircularProgress size={40} thickness={4}/>
        </Paper>
    )
    const list = (
        <div className={classes.listWrapper}>
            {_.map(_.get(listData, 'data'), (item) => {
                const id = _.get(item, 'id')
                const product = _.get(item, 'title')
                const balance = Number(_.get(item, 'balance')) + Number(_.get(item, 'defects'))
                const defects = _.get(item, 'defects')
                const measurement = _.get(item, ['measurement', 'name'])
                const type = _.get(item, ['type', 'name'])
                if (id === detailId) {
                    return (
                        <Paper key={id} className={classes.wrapperBold}>
                            <Row key={id} style={{position: 'relative'}}>
                                <div className={classes.closeDetail}
                                    onClick={handleCloseDetail}>
                                </div>
                                <Col xs={3}>{product}</Col>
                                <Col xs={3}>{type}</Col>
                                <Col xs={3} className={classes.itemData}>{numberFormat(balance, measurement)}</Col>
                                <Col xs={2} className={classes.itemData}>{numberFormat(defects, measurement)}</Col>
                                <Col xs={1} style={{textAlign: 'right'}}>
                                    <IconButton
                                        className={classes.dropUp}
                                        iconStyle={iconStyle.icon}
                                        style={iconStyle.button}
                                        onTouchTap={handleCloseDetail}>
                                        <ArrowDown/>
                                    </IconButton>
                                </Col>
                            </Row>
                            <RemainderDetails
                                filter={filter}
                                detailData={detailData}
                                handleCloseDetail={handleCloseDetail}
                            />
                        </Paper>
                    )
                }
                return (
                <Paper key={id} className={classes.wrapper}>
                    <Link key={id} to={{
                        pathname: sprintf(ROUTES.REMAINDER_ITEM_PATH, id),
                        query: filter.getParams()
                    }}>
                        <Row style={{position: 'relative'}}>
                            <Col xs={3}>{product}</Col>
                            <Col xs={3}>{type}</Col>
                            <Col xs={3} className={classes.itemData}>{numberFormat(balance, measurement)}</Col>
                            <Col xs={2} className={classes.itemData}>{numberFormat(defects, measurement)}</Col>
                            <Col xs={1} style={{textAlign: 'right'}}>
                                <Link to={{
                                    pathname: sprintf(ROUTES.REMAINDER_ITEM_PATH, id),
                                    query: filter.getParams()
                                }}>
                                    <IconButton
                                        className={classes.dropDown}
                                        iconStyle={iconStyle.icon}
                                        style={iconStyle.button}>
                                        <ArrowDown/>
                                    </IconButton>
                                </Link>
                            </Col>
                        </Row>
                    </Link>
                </Paper>
                )
            })}

        </div>
    )

    return (
        <Container>
            <SubMenu url={ROUTES.REMAINDER_LIST_URL}/>

            <div className="sendButtonWrapper">
                <FloatingActionButton
                    className={classes.sendButton}
                    mini={true}>
                    <MoreHortIcon />
                </FloatingActionButton>

                <ul>
                    <li style={{left: '60px'}}>
                        <Tooltip position="bottom" text="Списание товара">
                            <FloatingActionButton
                                iconStyle={actionIconStyle.icon}
                                style={actionIconStyle.button}
                            onTouchTap={discardDialog.handleOpenDiscardDialog}>
                            <RemoveIcon
                                style={{width: '20px', height: '30px', margin: 'auto'}}/>
                            </FloatingActionButton>
                        </Tooltip>
                    </li>
                    <li style={{left: '70px'}}>
                        <Tooltip position="bottom" text="Передача товаров" >
                            <FloatingActionButton
                                iconStyle={actionIconStyle.icon}
                                style={actionIconStyle.button}
                                onTouchTap={transferDialog.handleOpenTransferDialog}>
                                <SwapHorizIcon style={{width: '20px', height: '30px', margin: 'auto'}}/>
                            </FloatingActionButton>
                        </Tooltip>
                    </li>
                </ul>
            </div>
            <RemainderFilterForm
                onSubmit={submitFilter}
                resetFilter={resetFilter}
                filter={filter}/>
            {listHeader}
            {listLoading ? listLoader : list }

            <RemainderTransferDialog
                open={transferDialog.openTransferDialog}
                onClose={transferDialog.handleCloseTransferDialog}
                onSubmit={transferDialog.handleSubmitTransferDialog}/>
            <RemainderDiscardDialog
                open={discardDialog.openDiscardDialog}
                onClose={discardDialog.handleCloseDiscardDialog}
                onSubmit={discardDialog.handleSubmitDiscardDialog}/>
        </Container>
    )
})

RemainderGridList.propTypes = {
    filter: PropTypes.object.isRequired,
    listData: PropTypes.object,
    detailData: PropTypes.object,
    filterDialog: PropTypes.shape({
        openFilterDialog: PropTypes.bool.isRequired,
        handleCloseFilterDialog: PropTypes.func.isRequired,
        handleOpenFilterDialog: PropTypes.func.isRequired,
        handleSubmitFilterDialog: PropTypes.func.isRequired
    }).isRequired,
    transferDialog: PropTypes.shape({
        openTransferDialog: PropTypes.bool.isRequired,
        handleOpenTransferDialog: PropTypes.func.isRequired,
        handleCloseTransferDialog: PropTypes.func.isRequired,
        handleSubmitTransferDialog: PropTypes.func.isRequired
    }).isRequired,
    discardDialog: PropTypes.shape({
        openDiscardDialog: PropTypes.bool.isRequired,
        handleOpenDiscardDialog: PropTypes.func.isRequired,
        handleCloseDiscardDialog: PropTypes.func.isRequired,
        handleSubmitDiscardDialog: PropTypes.func.isRequired
    }).isRequired
}

export default RemainderGridList
