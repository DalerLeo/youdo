import _ from 'lodash'
import React from 'react'
import {hashHistory, Link} from 'react-router'
import IconButton from 'material-ui/IconButton'
import sprintf from 'sprintf'
import PropTypes from 'prop-types'
import DeleteIcon from 'material-ui/svg-icons/action/delete'
import * as ROUTES from '../../constants/routes'
import {reduxForm} from 'redux-form'
import CircularProgress from 'material-ui/CircularProgress'
import TextFieldSearch from 'material-ui/TextField'
import SearchIcon from 'material-ui/svg-icons/action/search'
import Container from '../Container'
import SubMenu from '../SubMenu'
import injectSheet from 'react-jss'
import {Row, Col} from 'react-flexbox-grid'
import {compose, withState, withHandlers} from 'recompose'
import FloatingActionButton from 'material-ui/FloatingActionButton'
import ContentAdd from 'material-ui/svg-icons/content/add'
import IconMenu from 'material-ui/IconMenu'
import MenuItem from 'material-ui/MenuItem'
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert'
import Edit from 'material-ui/svg-icons/image/edit'
import Tooltip from '../ToolTip'
import Arrow from 'material-ui/svg-icons/navigation/arrow-drop-down'
import GoogleCustomMap from './GoogleMapCustom'
import BindAgentDialog from './ZoneBindAgentDialog'
import ConfirmDialog from '../ConfirmDialog'
import ZoneDetails from './ZoneDetails'
import NotFound from '../Images/not-found.png'

const enhance = compose(
    injectSheet({
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
        addButtonWrapper: {
            position: 'absolute',
            top: '10px',
            right: '0',
            marginBottom: '0px'
        },
        zonesWrapper: {
            background: '#f2f5f8',
            position: 'relative',
            overflowX: 'hidden',
            margin: '0 -28px',
            minHeight: 'calc(100% - 32px)',
            boxShadow: 'rgba(0, 0, 0, 0.09) 0px -2px 5px, rgba(0, 0, 0, 0.05) 0px -2px 6px',
            '& > div:first-child': {
                position: 'absolute',
                top: '0',
                left: '0',
                right: '0',
                bottom: '0'
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
        toggleButton: {
            position: 'absolute',
            left: '-24px',
            top: '18px',
            padding: '8px 0',
            background: '#fff',
            cursor: 'pointer'
        },
        expanded: {
            display: 'flex',
            alignItems: 'center',
            '& svg': {
                transform: 'rotate(-90deg)',
                position: 'relative',
                left: '1px'
            }
        },
        collapsed: {
            extend: 'expanded',
            '& svg': {
                transform: 'rotate(90deg)',
                position: 'relative',
                left: '1px'
            }
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
        zonesInfoFooter: {
            extend: 'zonesInfoTitle',
            borderBottom: 'none',
            borderTop: '1px #efefef solid',
            '& > div big': {
                color: '#ff7374'
            }
        },
        list: {
            height: 'calc(100% - 138px)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            '& .row': {
                alignItems: 'center',
                margin: '0',
                paddingLeft: '22px',
                height: '50px',
                '& > div:last-child': {
                    paddingRight: '0'
                },
                '& > div:nth-child(3)': {
                    textAlign: 'center'
                },
                '& button > div': {
                    display: 'flex'
                }
            }
        },
        listHeader: {
            background: '#5d6474',
            color: '#fff',
            fontWeight: 'bold',
            height: '57px !important'
        },
        listTitle: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 30px',
            height: '57px',
            '& > span': {
                fontWeight: '600'
            }
        },
        itemList: {
            height: '100%',
            overflowY: 'auto',
            position: 'relative'
        },
        search: {
            position: 'relative',
            display: 'flex',
            width: '100%',
            '& > div': {
                paddingRight: '35px'
            }
        },
        searchField: {
            fontSize: '13px !important',
            width: '100%',
            marginLeft: '50px'
        },
        searchButton: {
            position: 'absolute !important',
            right: '-10px'
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
        emptyQuery: {
            background: 'url(' + NotFound + ') no-repeat center center',
            backgroundSize: '200px',
            padding: '200px 0 0',
            textAlign: 'center',
            fontSize: '13px',
            color: '#666',
            '& svg': {
                width: '50px !important',
                height: '50px !important',
                color: '#999 !important'
            }
        }
    }),
    reduxForm({
        form: 'ZoneCreateForm',
        enableReinitialize: true
    }),
    withState('search', 'setSearch', ({filter}) => filter.getParam('search')),
    withHandlers({
        onSubmit: props => (event) => {
            const {search, filter} = props
            event.preventDefault()

            hashHistory.push(filter.createURL({search}))
        }
    })
)

const iconStyle = {
    icon: {
        color: '#666'
    },
    button: {
        width: 45,
        height: 45,
        padding: '0 12px'
    }
}

const ZonesWrapper = enhance((props) => {
    const {
        filter,
        listData,
        statData,
        classes,
        addZone,
        updateZone,
        deleteZone,
        detailData,
        toggle,
        search,
        setSearch,
        onSubmit,
        bindAgent,
        unbindAgent,
        draw
    } = props

    const ZERO = 0
    const ONE = 1
    const isOpenToggle = toggle.openToggle
    const isOpenAddZone = addZone.openAddZone
    const isOpenUpdateZone = updateZone.openUpdateZone
    const isLoadingList = _.get(listData, 'listLoading')
    const isListEmpty = _.isEmpty(_.get(listData, 'data'))

    const openDetail = (_.get(detailData, 'openDetail') > ZERO)

    const isLoadingStat = _.get(statData, 'statLoading')
    const activeZones = _.get(statData, ['data', 'activeBorders'])
    const boundMarkets = _.get(statData, ['data', 'boundMarkets'])
    const passiveMarkets = _.get(statData, ['data', 'passiveMarkets'])
    const passiveAgents = _.get(statData, ['data', 'passiveAgents'])

    let isOpenConfirm = false
    if (_.get(unbindAgent, 'openConfirmDialog') > ZERO) {
        isOpenConfirm = true
    }

    const iconButton = (
        <IconButton
            iconStyle={iconStyle.icon}
            style={iconStyle.button}>
            <MoreVertIcon/>
        </IconButton>
    )

    const zoneInfoToggle = (
        <div className={classes.zonesInfo} style={isOpenToggle ? {right: '0'} : {right: '-450px'}}>
            <div className={classes.toggleButton}>
                {isOpenToggle ? <div className={classes.expanded} onClick={toggle.handleCollapseInfo}><Arrow/></div>
                    : <div className={classes.collapsed} onClick={toggle.handleExpandInfo}><Arrow/></div>}
            </div>
            {!openDetail ? <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%'}}>
                <div className={classes.zonesInfoTitle}>
                    {isLoadingStat &&
                    <div className={classes.loader}>
                        <CircularProgress size={25} thickness={3}/>
                    </div>}
                    <div>
                        <big>{activeZones}</big>
                        <span>{(activeZones === ONE) ? 'активная' : 'активных'} <br/> {(activeZones === ONE) ? 'зона' : 'зон'}</span>
                    </div>
                    <div>
                        <big>{boundMarkets}</big>
                        <span>магазинов <br/> в зонах</span>
                    </div>
                </div>

                <div className={classes.list}>
                    <div className={classes.listTitle}>
                        <span>Зоны</span>
                        <div className={classes.searchField}>
                            <form onSubmit={onSubmit}>
                                <div className={classes.search}>
                                    <TextFieldSearch
                                        fullWidth={true}
                                        hintText="Поиск"
                                        className={classes.searchField}
                                        value={search}
                                        onChange={(event) => setSearch(event.target.value)}
                                    />
                                    <IconButton
                                        iconStyle={{color: '#ccc'}}
                                        className={classes.searchButton}
                                        disableTouchRipple={true}>
                                        <SearchIcon />
                                    </IconButton>
                                </div>
                            </form>
                        </div>
                    </div>
                    <Row className={classes.listHeader}>
                        <Col xs={2}>ID</Col>
                        <Col xs={6}>Наименование зоны</Col>
                        <Col xs={2}>Магазины</Col>
                    </Row>
                    <div className={classes.itemList}>
                        {isLoadingList &&
                        <div className={classes.loader}>
                            <CircularProgress size={40} thickness={4}/>
                        </div>}
                        {!isListEmpty ? _.map(_.get(listData, 'data'), (item) => {
                            const id = _.get(item, 'id')
                            const marketsCount = _.get(item, 'marketsCount')
                            const name = _.get(item, 'title')
                            return (
                                <Row key={id}>
                                    <Col xs={2} style={{color: '#237bde'}}>Z-{id}</Col>
                                    <Col xs={6}>
                                        <Link to={{
                                            pathname: sprintf(ROUTES.ZONES_ITEM_PATH, id),
                                            query: filter.getParams()
                                        }}>{name}</Link>
                                    </Col>
                                    <Col xs={2}>{marketsCount}</Col>
                                    <Col xs={2} style={{textAlign: 'right'}}>
                                        <IconMenu
                                            iconButtonElement={iconButton}
                                            menuItemStyle={{fontSize: '13px'}}
                                            anchorOrigin={{horizontal: 'right', vertical: 'top'}}
                                            targetOrigin={{horizontal: 'right', vertical: 'top'}}>
                                            <MenuItem
                                                primaryText="Изменить"
                                                onTouchTap={() => { updateZone.handleOpenUpdateZone(id) }}
                                                leftIcon={<Edit />}
                                            />
                                            <MenuItem
                                                primaryText="Удалить"
                                                onTouchTap={() => { deleteZone.handleOpenDeleteZone(id) }}
                                                leftIcon={<DeleteIcon />}
                                            />
                                        </IconMenu>
                                    </Col>
                                </Row>
                            )
                        })
                        : <div className={classes.emptyQuery}>
                                <div>По вашему запросу ничего не найдено</div>
                            </div>}
                    </div>
                </div>

                <div className={classes.zonesInfoFooter}>
                    {isLoadingStat &&
                    <div className={classes.loader}>
                        <CircularProgress size={25} thickness={3}/>
                    </div>}
                    <div>
                        <big>{passiveMarkets}</big>
                        <span>магазинов <br/> не распределено</span>
                    </div>
                    <div>
                        <big>{passiveAgents}</big>
                        <span>агентов <br/> не распределено</span>
                    </div>
                </div>
            </div>
            : <ZoneDetails
                    detailData={detailData}
                    bindAgent={bindAgent}
                    unbindAgent={unbindAgent}
                    filter={filter}
                />}
        </div>
    )

    return (
        <Container>
            <SubMenu url={ROUTES.ZONES_LIST_URL}/>

            {(!isOpenAddZone && !isOpenUpdateZone) && <div className={classes.addButtonWrapper}>
                <Tooltip position="left" text="Добавить зону">
                    <FloatingActionButton
                        mini={true}
                        zDepth={1}
                        backgroundColor="#12aaeb"
                        className={classes.addButton}
                        onTouchTap={addZone.handleOpenAddZone}>
                        <ContentAdd />
                    </FloatingActionButton>
                </Tooltip>
            </div>}

            <div className={classes.zonesWrapper}>
                <GoogleCustomMap
                    listData={listData}
                    drawer={draw.openDraw}
                    isOpenAddZone={isOpenAddZone}
                    filter={filter}
                    addZone={addZone}
                    updateZone={updateZone}
                    isOpenUpdateZone={isOpenUpdateZone}
                    id={_.get(detailData, 'id')}
                    zoneId={_.get(detailData, 'zoneId')}
                    deleteId={_.get(deleteZone, 'openDeleteZone')}
                    deleteZone={deleteZone}
                />

                <BindAgentDialog
                    open={bindAgent.openBindAgent}
                    loading={bindAgent.bindAgentLoading}
                    onClose={bindAgent.handleCloseBindAgent}
                    onSubmit={bindAgent.handleSubmitBindAgent}
                />
                <ConfirmDialog
                    open={isOpenConfirm}
                    onClose={unbindAgent.handleCloseConfirmDialog}
                    onSubmit={unbindAgent.handleSendConfirmDialog}
                    message="Открепить данного агента?"
                    type="submit"
                />

                {zoneInfoToggle}
            </div>
        </Container>
    )
})

ZonesWrapper.PropTypes = {
    filter: PropTypes.object,
    listData: PropTypes.object,
    detailData: PropTypes.object,
    statData: PropTypes.object,
    addZone: PropTypes.shape({
        openAddZone: PropTypes.bool.isRequired,
        createLoading: PropTypes.bool.isRequired,
        handleOpenAddZone: PropTypes.func.isRequired,
        handleCloseAddZone: PropTypes.func.isRequired,
        handleSubmitAddZone: PropTypes.func.isRequired
    }).isRequired,
    updateZone: PropTypes.shape({
        openUpdateZone: PropTypes.bool.isRequired,
        updateLoading: PropTypes.bool.isRequired,
        handleOpenUpdateZone: PropTypes.func.isRequired,
        handleCloseUpdateZone: PropTypes.func.isRequired,
        handleSubmitUpdateZone: PropTypes.func.isRequired
    }).isRequired,
    deleteZone: PropTypes.shape({
        openDeleteZone: PropTypes.bool.isRequired,
        handleOpenDeleteZone: PropTypes.func.isRequired,
        handleCloseDeleteZone: PropTypes.func.isRequired,
        handleSendDeleteZone: PropTypes.func.isRequired
    }).isRequired,
    toggle: PropTypes.shape({
        openToggle: PropTypes.bool.isRequired,
        handleExpandInfo: PropTypes.func.isRequired,
        handleCollapseInfo: PropTypes.func.isRequired
    }).isRequired,
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

export default ZonesWrapper
