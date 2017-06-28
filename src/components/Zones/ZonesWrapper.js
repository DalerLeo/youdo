import React from 'react'
import IconButton from 'material-ui/IconButton'
import Paper from 'material-ui/Paper'
import DeleteIcon from 'material-ui/svg-icons/action/delete'
import * as ROUTES from '../../constants/routes'
import {Field, reduxForm} from 'redux-form'
import TextFieldSearch from 'material-ui/TextField'
import FlatButton from 'material-ui/FlatButton'
import {TextField} from '../ReduxForm'
import SearchIcon from 'material-ui/svg-icons/action/search'
import Container from '../Container'
import SubMenu from '../SubMenu'
import injectSheet from 'react-jss'
import {Row, Col} from 'react-flexbox-grid'
import {compose, withState} from 'recompose'
import FloatingActionButton from 'material-ui/FloatingActionButton'
import ContentAdd from 'material-ui/svg-icons/content/add'
import IconMenu from 'material-ui/IconMenu'
import MenuItem from 'material-ui/MenuItem'
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert'
import Edit from 'material-ui/svg-icons/image/edit'
import Tooltip from '../ToolTip'
import Arrow from 'material-ui/svg-icons/navigation/arrow-drop-down'
import CloseIcon2 from '../CloseIcon2'
import Person from '../Images/person.png'
import Timeline from 'material-ui/svg-icons/action/timeline'
import Touch from 'material-ui/svg-icons/action/touch-app'
import ZoneMap from './ZoneMap'

const enhance = compose(
    injectSheet({
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
            minHeight: 'calc(100% - 4px)',
            boxShadow: 'rgba(0, 0, 0, 0.09) 0px -2px 5px, rgba(0, 0, 0, 0.05) 0px -2px 6px'
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
            overflowY: 'auto'
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

        zoneInfoName: {
            extend: 'zonesInfo',
            justifyContent: 'flex-start',
            right: '0',
            width: '450px',
            zIndex: '4'
        },
        zoneInfoTitle: {
            extend: 'zonesInfoTitle',
            padding: '20px 0',
            justifyContent: 'space-between',
            '& > div': {
                marginRight: '0'
            }
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
            flexWrap: 'wrap'
        },
        person: {
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
            '&:hover > div': {
                display: 'flex'
            },
            '&:nth-child(10n)': {
                margin: '0 !important'
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
        }
    }),
    reduxForm({
        form: 'ZoneCreateForm',
        enableReinitialize: true
    }),
    withState('expandInfo', 'setExpandInfo', false),
    withState('zoneInfo', 'setZoneInfo', false)
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
        classes,
        expandInfo,
        setExpandInfo,
        zoneInfo,
        setZoneInfo
    } = props

    const iconButton = (
        <IconButton
            iconStyle={iconStyle.icon}
            style={iconStyle.button}>
            <MoreVertIcon/>
        </IconButton>
    )

    const addZone = (
        <div>
            <Paper zDepth={1} className={classes.addZoneWrapper}>
                <form action="">
                    <Field
                        name="zoneName"
                        component={TextField}
                        className={classes.inputFieldCustom}
                        label="Наименование зоны"
                        fullWidth={true}/>
                    <div className={classes.buttons}>
                        <IconButton>
                            <Timeline color="#666"/>
                        </IconButton>

                        <IconButton>
                            <Touch color="#666"/>
                        </IconButton>

                        <IconButton>
                            <DeleteIcon color="#666"/>
                        </IconButton>
                    </div>
                    <FlatButton
                        label="Сохранить"
                        className={classes.actionButton}
                        primary={true}
                        type="submit"
                    />
                </form>
            </Paper>

            <div className={classes.addZoneClose}>
                <Tooltip position="left" text="Закрыть">
                    <FloatingActionButton
                        mini={true}>
                        <CloseIcon2/>
                    </FloatingActionButton>
                </Tooltip>
            </div>
        </div>
    )

    const zoneInfoToggle = (
        <div className={classes.zonesInfo} style={expandInfo ? {right: '0'} : {right: '-450px'}}>
            <div className={classes.toggleButton}>
                {expandInfo ? <div className={classes.expanded} onClick={() => { setExpandInfo(false) }}><Arrow/></div>
                    : <div className={classes.collapsed} onClick={() => { setExpandInfo(true) }}><Arrow/></div>}
            </div>
            {!zoneInfo ? <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%'}}>
                <div className={classes.zonesInfoTitle}>
                    <div>
                        <big>8</big>
                        <span>активных <br/> зон</span>
                    </div>
                    <div>
                        <big>240</big>
                        <span>магазинов <br/> в зонах</span>
                    </div>
                </div>

                <div className={classes.list}>
                    <div className={classes.listTitle}>
                        <span>Зоны</span>
                        <div className={classes.searchField}>
                            <form>
                                <div className={classes.search}>
                                    <TextFieldSearch
                                        fullWidth={true}
                                        hintText="Поиск"
                                        className={classes.searchField}
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
                        <Row>
                            <Col xs={2} style={{color: '#237bde'}}>Z-244</Col>
                            <Col xs={6}>Название зоны продаж</Col>
                            <Col xs={2}>48</Col>
                            <Col xs={2} style={{textAlign: 'right'}}>
                                <IconMenu
                                    iconButtonElement={iconButton}
                                    anchorOrigin={{horizontal: 'right', vertical: 'top'}}
                                    targetOrigin={{horizontal: 'right', vertical: 'top'}}>
                                    <MenuItem
                                        primaryText="Изменить"
                                        leftIcon={<Edit />}
                                    />
                                    <MenuItem
                                        primaryText="Удалить "
                                        leftIcon={<DeleteIcon />}
                                    />
                                </IconMenu>
                            </Col>
                        </Row>
                    </div>
                </div>

                <div className={classes.zonesInfoFooter}>
                    <div>
                        <big>24</big>
                        <span>магазинов <br/> не распределено</span>
                    </div>
                    <div>
                        <big>11</big>
                        <span>агентов <br/> не распределено</span>
                    </div>
                </div>
            </div>
            : <div>
                    <div className={classes.zoneInfoNameTitle}>
                        <span>Название зоны (Z-244)</span>
                        <IconButton onTouchTap={() => { setZoneInfo(false) }}>
                            <CloseIcon2 color="#666666"/>
                        </IconButton>
                    </div>
                    <div className={classes.zoneInfoContent}>
                        <div className={classes.zoneInfoTitle}>
                            <div>
                                <big>24</big>
                                <span>всего магазинов <br/> в зоне</span>
                            </div>
                            <div>
                                <big>4</big>
                                <span>закреплено <br/> агентов</span>
                            </div>
                            <div>
                                <big>2</big>
                                <span>закреплено <br/> инкассаторов</span>
                            </div>
                        </div>
                        <div className={classes.personal}>
                            <span>Ответственный персонал:</span>
                            <div className={classes.personalWrap}>
                                <div className={classes.person}>
                                    <img src={Person} alt=""/>
                                    <div className={classes.deletePers}>
                                        <CloseIcon2 color="#fff"/>
                                    </div>
                                </div>
                                <div className={classes.person}>
                                    <img src={Person} alt=""/>
                                    <div className={classes.deletePers}>
                                        <CloseIcon2 color="#fff"/>
                                    </div>
                                </div>
                                <div className={classes.person}>
                                    <img src={Person} alt=""/>
                                    <div className={classes.deletePers}>
                                        <CloseIcon2 color="#fff"/>
                                    </div>
                                </div>
                                <div className={classes.person}>
                                    <img src={Person} alt=""/>
                                    <div className={classes.deletePers}>
                                        <CloseIcon2 color="#fff"/>
                                    </div>
                                </div>
                                <div className={classes.person}>
                                    <img src={Person} alt=""/>
                                    <div className={classes.deletePers}>
                                        <CloseIcon2 color="#fff"/>
                                    </div>
                                </div>
                                <div className={classes.person} style={{overflow: 'hidden'}}>
                                    <Tooltip position="bottom" text="Добавить">
                                        <FloatingActionButton
                                            mini={true}
                                            className={classes.addPerson}>
                                            <ContentAdd />
                                        </FloatingActionButton>
                                    </Tooltip>
                                </div>
                            </div>
                        </div>
                        <div className={classes.stores}>
                            <div className="dottedList">
                                <span>Магазины в зоне</span>
                                <a>+ добавить</a>
                            </div>
                            <div className="dottedList">OOO Angels Food</div>
                            <div className="dottedList">OOO Angels Food</div>
                            <div className="dottedList">OOO Angels Food</div>
                            <div className="dottedList">OOO Angels Food</div>
                            <div className="dottedList">OOO Angels Food</div>
                            <div className="dottedList">OOO Angels Food</div>
                            <div className="dottedList">OOO Angels Food</div>
                            <div className="dottedList">OOO Angels Food</div>
                        </div>
                    </div>
                </div>}
        </div>
    )

    return (
        <Container>
            <SubMenu url={ROUTES.ZONES_LIST_URL}/>

            <div className={classes.addButtonWrapper}>
                <Tooltip position="left" text="Добавить зону">
                    <FloatingActionButton
                        mini={true}
                        className={classes.addButton}>
                        <ContentAdd />
                    </FloatingActionButton>
                </Tooltip>
            </div>
            <ZoneMap />

            <div className={classes.zonesWrapper}>
                <a onClick={() => { setZoneInfo(true) }}>CLick MEeeee</a>
                {addZone}
                {zoneInfoToggle}
            </div>
        </Container>
    )
})

export default ZonesWrapper
