import _ from 'lodash'
import React from 'react'
import IconButton from 'material-ui/IconButton'
import * as ROUTES from '../../constants/routes'
import {Link} from 'react-router'
import PropTypes from 'prop-types'
import sprintf from 'sprintf'
import injectSheet from 'react-jss'
import {compose} from 'recompose'
import FloatingActionButton from 'material-ui/FloatingActionButton'
import CircularProgress from 'material-ui/CircularProgress'
import ContentAdd from 'material-ui/svg-icons/content/add'
import Tooltip from '../ToolTip'
import CloseIcon2 from '../CloseIcon2'
import Person from '../Images/person.png'
import NoShop from '../Images/no-shop.svg'
import Pagination from '../ReduxForm/Pagination'

const enhance = compose(
    injectSheet({
        detailWrap: {
            height: '100%',
            position: 'relative'
        },
        loader: {
            position: 'absolute',
            width: '100%',
            height: '100%',
            background: '#fff',
            top: '0',
            left: '0',
            alignItems: 'center',
            zIndex: '999',
            justifyContent: 'center',
            display: 'flex'
        },
        addButton: {
            '& button': {
                backgroundColor: '#275482 !important'
            }
        },
        addPerson: {
            boxShadow: 'none !important',
            '& button': {
                background: '#199ee0 !important',
                width: '30px !important',
                height: '30px !important',
                '& svg': {
                    width: '20px !important',
                    height: '30px !important'
                }
            }
        },
        zonesInfo: {
            background: '#fff',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            position: 'absolute',
            width: '450px',
            top: '0',
            bottom: '0',
            transition: 'all 0.3s ease',
            zIndex: '2'
        },
        zonesInfoTitle: {
            display: 'flex',
            padding: '20px 30px',
            borderBottom: '1px #efefef solid',
            position: 'relative',
            '& > div': {
                display: 'flex',
                marginRight: '50px',
                '& big': {
                    fontSize: '28px',
                    lineHeight: '28px',
                    marginRight: '10px'
                },
                '& span': {
                    fontSize: '12px !important',
                    lineHeight: '14px'
                }
            },
            '& > div:last-child': {
                margin: '0'
            }
        },
        zoneInfoName: {
            extend: 'zonesInfo',
            justifyContent: 'flex-start',
            right: '0',
            width: '450px',
            zIndex: '4'
        },
        zoneInfoTitle: {
            extend: 'zonesInfoTitle',
            padding: '20px 0'
        },
        zoneInfoNameTitle: {
            background: '#fff',
            color: '#333',
            fontWeight: '600',
            textTransform: 'uppercase',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: '1px solid #efefef',
            padding: '20px 30px',
            zIndex: '999',
            '& button': {
                right: '13px',
                top: '5px',
                padding: '0 !important',
                position: 'absolute !important'
            }
        },
        zoneInfoContent: {
            padding: '0 30px',
            overflowY: 'auto'
        },
        personal: {
            padding: '20px 0 15px',
            borderBottom: '1px  #efefef solid',
            '& > span': {
                fontWeight: '600',
                display: 'block',
                marginBottom: '12px'
            }
        },
        personalWrap: {
            display: 'flex',
            flexWrap: 'wrap',
            '& > div': {
                width: '30px',
                height: '30px',
                display: 'inline-block',
                marginRight: '10px',
                marginBottom: '5px',
                position: 'relative',
                '& img': {
                    height: '100%',
                    width: '100%',
                    borderRadius: '50%'
                },
                '&:hover > div > div > div': {
                    display: 'flex'
                },
                '&:nth-child(10n)': {
                    margin: '0 !important'
                }
            }
        },
        deletePers: {
            cursor: 'pointer',
            width: '15px',
            height: '15px',
            display: 'none',
            position: 'absolute',
            top: '-5px',
            right: '-5px',
            borderRadius: '50%',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#999',
            '& svg': {
                width: '13px !important',
                height: '15px !important'
            }
        },
        stores: {
            '& span': {
                fontWeight: '600'
            },
            '& .dottedList': {
                padding: '15px 0',
                justifyContent: 'space-between',
                '&:last-child:after': {
                    display: 'none'
                }
            },
            '& a': {
                color: '#333',
                fontWeight: '400',
                '&:hover': {
                    color: '#12aaeb',
                    fontWeight: '600'
                }
            }
        },
        addZoneWrapper: {
            position: 'absolute',
            top: '10px',
            left: '50%',
            marginLeft: '-275px',
            padding: '7px 20px',
            width: '550px',
            height: '60px',
            '& form': {
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: '100%',
                height: '100%'
            }
        },
        inputFieldCustom: {
            flexBasis: '200px',
            fontSize: '13px !important',
            height: '45px !important',
            marginTop: '7px',
            '& div': {
                fontSize: '13px !important'
            },
            '& label': {
                top: '20px !important',
                lineHeight: '5px !important'
            },
            '& input': {
                marginTop: '0 !important'
            }
        },
        actionButton: {
            '& span': {
                color: '#129fdd !important',
                fontWeight: '600 !important'
            }
        },
        addZoneClose: {
            position: 'absolute',
            right: '30px',
            '& button': {
                background: '#fff !important'
            },
            '& svg': {
                fill: '#666 !important'
            }
        },
        noShop: {
            background: 'url(' + NoShop + ') no-repeat center center',
            backgroundSize: '135px',
            padding: '180px 0 0',
            color: '#666',
            textAlign: 'center'
        }
    })
)

const ZoneDetails = enhance((props) => {
    const {
        classes,
        filter,
        shopFilter,
        detailData,
        bindAgent,
        unbindAgent
    } = props

    const loading = _.get(detailData, 'detailLoading')
    const marketsLoading = _.get(detailData, ['shop', 'shopListLoading'])
    const id = _.get(detailData, ['data', 'id'])
    const name = _.get(detailData, ['data', 'properties', 'title'])
    const ZERO = 0
    const marketsCount = _.toInteger(_.get(detailData, ['shop', 'marketsCount']))
    const agentsCount = _.get(detailData, ['data', 'properties', 'agents'])
    return (
        <div className={classes.detailWrap}>
            {(loading || marketsLoading) && <div className={classes.loader}>
                <CircularProgress size={40} thickness={4}/>
            </div>}
            <div className={classes.zoneInfoNameTitle}>
                <span>{name} (Z-{id})</span>
                <Link to={{
                    pathname: sprintf(ROUTES.ZONES_LIST_URL),
                    query: filter.getParams()
                }}>
                    <IconButton>
                        <CloseIcon2 color="#666666"/>
                    </IconButton>
                </Link>
            </div>
            <div className={classes.zoneInfoContent}>
                <div className={classes.zoneInfoTitle}>
                    <div>
                        <big>{marketsCount}</big>
                        <span>всего магазинов <br/> в зоне</span>
                    </div>
                    <div>
                        <big>{!_.isEmpty(agentsCount) ? agentsCount.length : '0'}</big>
                        <span>закреплено <br/> персонал</span>
                    </div>
                </div>
                <div className={classes.personal}>
                    <span>Ответственный персонал:</span>
                    <div className={classes.personalWrap}>
                        {_.map(_.get(detailData, ['data', 'properties', 'agents']), (item) => {
                            const agentId = _.get(item, 'id')
                            const username = _.get(item, 'username')

                            return (
                                <Tooltip key={agentId} position="top" text={username}>
                                    <div className={classes.person}>
                                        <img src={Person} alt=""/>
                                        <div className={classes.deletePers}>
                                            <CloseIcon2
                                                onClick={() => { unbindAgent.handleOpenConfirmDialog(agentId) }}
                                                color="#fff"/>
                                        </div>
                                    </div>
                                </Tooltip>
                            )
                        })}
                        <div className={classes.person} style={{overflow: 'hidden'}}>
                            <Tooltip position="bottom" text="Добавить">
                                <FloatingActionButton
                                    mini={true}
                                    className={classes.addPerson}
                                    onTouchTap={bindAgent.handleOpenBindAgent}>
                                    <ContentAdd />
                                </FloatingActionButton>
                            </Tooltip>
                        </div>
                    </div>
                </div>
                <div className={classes.stores}>
                    <div className="dottedList">
                        <span>Магазины в зоне</span>
                        <Pagination filter={shopFilter}/>
                    </div>

                    {_.map(_.get(detailData, ['shop', 'data']), (item) => {
                        const shopId = _.get(item, 'id')
                        const shopName = _.get(item, 'name')
                        return (
                            <Link key={shopId} target="_blank" to={{pathname: sprintf(ROUTES.SHOP_ITEM_PATH, shopId), query: {search: shopId}}}>
                                <div className="dottedList">{shopName}</div>
                            </Link>
                        )
                    })}
                    {marketsCount === ZERO &&
                    <div className={classes.noShop}>
                        <div>В данной зоне нет магазинов</div>
                    </div>}
                </div>
            </div>
        </div>
    )
})

ZoneDetails.PropTypes = {
    filter: PropTypes.object,
    detailData: PropTypes.object,
    bindAgent: PropTypes.shape({
        openBindAgent: PropTypes.bool.isRequired,
        bindAgentLoading: PropTypes.bool.isRequired,
        handleOpenBindAgent: PropTypes.func.isRequired,
        handleCloseBindAgent: PropTypes.func.isRequired,
        handleSubmitBindAgent: PropTypes.func.isRequired
    }).isRequired,
    unbindAgent: PropTypes.shape({
        openConfirmDialog: PropTypes.bool.isRequired,
        handleOpenConfirmDialog: PropTypes.func.isRequired,
        handleCloseConfirmDialog: PropTypes.func.isRequired,
        handleSendConfirmDialog: PropTypes.func.isRequired
    }).isRequired
}

export default ZoneDetails
