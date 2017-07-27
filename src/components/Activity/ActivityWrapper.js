import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import * as ROUTES from '../../constants/routes'
import Container from '../Container'
import SubMenu from '../SubMenu'
import Tooltip from '../ToolTip'
import ActivityCreateDialog from './ActivityCreateDialog'
import injectSheet from 'react-jss'
import {compose} from 'recompose'
import moment from 'moment'
import CircularProgress from 'material-ui/CircularProgress'
import Paper from 'material-ui/Paper'
import FloatingActionButton from 'material-ui/FloatingActionButton'
import ContentAdd from 'material-ui/svg-icons/content/add'
import NotFound from '../Images/not-found.png'
import ActivityCalendar from './ActivityCalendar'

const enhance = compose(
    injectSheet({
        loader: {
            width: '100%',
            height: '250px',
            background: '#fff',
            alignItems: 'center',
            zIndex: '999',
            justifyContent: 'center',
            display: 'flex'
        },
        wrapper: {
            height: 'calc(100% - 32px)',
            margin: '0 -28px'
        },
        padding: {
            padding: '20px 30px'
        },
        addButton: {
            '& button': {
                backgroundColor: '#275482 !important'
            }
        },
        addButtonWrapper: {
            position: 'absolute',
            top: '10px',
            right: '0',
            marginBottom: '0px'
        },
        tubeWrapper: {
            padding: '0 30px 25px',
            marginTop: '10px',
            height: 'calc(100% - 85px)'
        },
        horizontal: {
            display: 'flex',
            position: 'relative',
            height: 'calc(100% + 16px)',
            margin: '0 -30px',
            padding: '0 30px',
            overflowX: 'auto',
            zIndex: '2'
        },
        block: {
            paddingRight: '20px'
        },
        blockTitle: {
            padding: '15px 0',
            fontWeight: 'bold'
        },
        blockItems: {
            overflowY: 'auto',
            height: 'calc(100% - 80px)',
            paddingRight: '10px'
        },
        tube: {
            padding: '20px 15px',
            marginBottom: '10px',
            width: '300px'
        },
        tubeTitle: {
            fontWeight: '600',
            display: 'flex',
            justifyContent: 'space-between'
        },
        tubeTime: {
            fontSize: '10px',
            color: '#999'
        },
        status: {
            borderRadius: '2px',
            height: '4px',
            width: '30px'
        },
        statusGreen: {
            extend: 'status',
            background: '#92ce95'
        },
        statusRed: {
            extend: 'status',
            background: '#e57373'
        },
        tubeImg: {
            marginTop: '10px',
            '& img': {
                width: '100%',
                display: 'block',
                cursor: 'pointer'
            }
        },
        tubeImgDouble: {
            extend: 'tubeImg',
            display: 'flex',
            justifyContent: 'space-between',
            '& > div': {
                width: 'calc(50% - 4px)',
                position: 'relative',
                '&:after': {
                    content: '""',
                    position: 'absolute',
                    top: '8px',
                    left: '8px',
                    padding: '2px 8px',
                    color: '#fff',
                    background: '#333',
                    opacity: '0.8',
                    fontSize: '11px',
                    fontWeight: '600'
                },
                '&:first-child:after': {
                    content: '"до"'
                },
                '&:last-child:after': {
                    content: '"после"'
                }
            }
        },
        tubeInfo: {
            marginTop: '10px',
            lineHeight: '15px'
        },
        horizontalScroll: {
            position: 'fixed',
            height: '25px',
            left: '0',
            right: '0',
            bottom: '0',
            zIndex: '0',
            transform: 'rotate(180deg)'
        },
        emptyQuery: {
            background: 'url(' + NotFound + ') no-repeat center center',
            backgroundSize: '150px',
            padding: '165px 0 0',
            width: '170px',
            margin: 'auto',
            textAlign: 'center',
            fontSize: '13px',
            color: '#666',
            '& svg': {
                width: '50px !important',
                height: '50px !important',
                color: '#999 !important'
            }
        }
    })
)

const iconStyle = {
    icon: {
        color: '#fff',
        width: 22,
        height: 22
    },
    button: {
        width: 40,
        height: 40,
        padding: 0,
        display: 'flex',
        margin: '0 10px'
    }
}

const ActivityWrapper = enhance((props) => {
    const {
        filter,
        usersList,
        detailData,
        classes,
        addActivity,
        calendar,
        handleClickDay
    } = props

    const tubeWrapper = (
        <div className={classes.tubeWrapper}>
            <div className={classes.horizontal}>
                <div className={classes.block}>
                    <div className={classes.blockTitle}>Визиты и сделки</div>
                    <div className={classes.blockItems}>
                        <Paper zDepth={1} className={classes.tube}>
                            <div className={classes.tubeTitle}>
                                <span>Хабибулло Насруллоев</span>
                                <div className={classes.statusGreen}> </div>
                            </div>
                            <div className={classes.tubeTime}>10 Апр, 2017 - 09:10</div>
                            <div className={classes.tubeInfo}>Заключение сделки (Z-025852) с название
                                магазина или наименование клиента.</div>
                        </Paper>
                        <Paper zDepth={1} className={classes.tube}>
                            <div className={classes.tubeTitle}>
                                <span>Хабибулло Насруллоев</span>
                                <div className={classes.statusGreen}> </div>
                            </div>
                            <div className={classes.tubeTime}>10 Апр, 2017 - 09:10</div>
                            <div className={classes.tubeInfo}>Заключение сделки (Z-025852) с название
                                магазина или наименование клиента.</div>
                        </Paper>
                    </div>
                </div>
                <div className={classes.block}>
                    <div className={classes.blockTitle}>Отчеты</div>
                    <div className={classes.blockItems}>
                        <Paper zDepth={1} className={classes.tube}>
                            <div className={classes.tubeTitle}>
                                <span>Хабибулло Насруллоев</span>
                                <div className={classes.statusRed}> </div>
                            </div>
                            <div className={classes.tubeTime}>10 Апр, 2017 - 09:10</div>
                            <div className={classes.tubeImg}>
                                <div><img src="http://pulson.ru/wp-content/uploads/2012/05/headache590.jpg" alt=""/></div>
                            </div>
                            <div className={classes.tubeInfo}>Отчет № 121312. Комментарий от
                                мерчендайзера</div>
                        </Paper>
                        <Paper zDepth={1} className={classes.tube}>
                            <div className={classes.tubeTitle}>
                                <span>Хабибулло Насруллоев</span>
                                <div className={classes.statusRed}> </div>
                            </div>
                            <div className={classes.tubeTime}>10 Апр, 2017 - 09:10</div>
                            <div className={classes.tubeImgDouble}>
                                <div><img src="http://pulson.ru/wp-content/uploads/2012/05/headache590.jpg" alt=""/></div>
                                <div><img src="http://pulson.ru/wp-content/uploads/2012/05/headache590.jpg" alt=""/></div>
                            </div>
                            <div className={classes.tubeInfo}>Отчет № 121312. Комментарий от
                                мерчендайзера</div>
                        </Paper>
                    </div>
                </div>
                <div className={classes.block}>
                    <div className={classes.blockTitle}>Доставка</div>
                    <div className={classes.blockItems}>
                        <Paper zDepth={1} className={classes.tube}>
                            <div className={classes.tubeTitle}>
                                <span>Хабибулло Насруллоев</span>
                                <div className={classes.statusGreen}> </div>
                            </div>
                            <div className={classes.tubeTime}>10 Апр, 2017 - 09:10</div>
                            <div className={classes.tubeInfo}>Заключение сделки (Z-025852) с название
                                магазина или наименование клиента.</div>
                        </Paper>
                        <Paper zDepth={1} className={classes.tube}>
                            <div className={classes.tubeTitle}>
                                <span>Хабибулло Насруллоев</span>
                                <div className={classes.statusGreen}> </div>
                            </div>
                            <div className={classes.tubeTime}>10 Апр, 2017 - 09:10</div>
                            <div className={classes.tubeInfo}>Заключение сделки (Z-025852) с название
                                магазина или наименование клиента.</div>
                        </Paper>
                    </div>
                </div>
                <div className={classes.block}>
                    <div className={classes.blockTitle}>Сбор денег</div>
                    <div className={classes.blockItems}>
                        <Paper zDepth={1} className={classes.tube}>
                            <div className={classes.tubeTitle}>
                                <span>Хабибулло Насруллоев</span>
                                <div className={classes.statusGreen}> </div>
                            </div>
                            <div className={classes.tubeTime}>10 Апр, 2017 - 09:10</div>
                            <div className={classes.tubeInfo}>Заключение сделки (Z-025852) с название
                                магазина или наименование клиента.</div>
                        </Paper>
                        <Paper zDepth={1} className={classes.tube}>
                            <div className={classes.tubeTitle}>
                                <span>Хабибулло Насруллоев</span>
                                <div className={classes.statusGreen}> </div>
                            </div>
                            <div className={classes.tubeTime}>10 Апр, 2017 - 09:10</div>
                            <div className={classes.tubeInfo}>Заключение сделки (Z-025852) с название
                                магазина или наименование клиента.</div>
                        </Paper>
                    </div>
                </div>
                <div className={classes.block}>
                    <div className={classes.blockTitle}>Визиты и сделки</div>
                    <div className={classes.blockItems}>
                        <Paper zDepth={1} className={classes.tube}>
                            <div className={classes.tubeTitle}>
                                <span>Хабибулло Насруллоев</span>
                                <div className={classes.statusGreen}> </div>
                            </div>
                            <div className={classes.tubeTime}>10 Апр, 2017 - 09:10</div>
                            <div className={classes.tubeInfo}>Заключение сделки (Z-025852) с название
                                магазина или наименование клиента.</div>
                        </Paper>
                        <Paper zDepth={1} className={classes.tube}>
                            <div className={classes.tubeTitle}>
                                <span>Хабибулло Насруллоев</span>
                                <div className={classes.statusGreen}> </div>
                            </div>
                            <div className={classes.tubeTime}>10 Апр, 2017 - 09:10</div>
                            <div className={classes.tubeInfo}>Заключение сделки (Z-025852) с название
                                магазина или наименование клиента.</div>
                        </Paper>
                    </div>
                </div>
            </div>
            <Paper className={classes.horizontalScroll}>
            </Paper>
        </div>
    )

    return (
        <Container>
            <SubMenu url={ROUTES.ACTIVITY_LIST_URL}/>

            <div className={classes.addButtonWrapper}>
                <Tooltip position="left" text="Составить план">
                    <FloatingActionButton
                        mini={true}
                        className={classes.addButton}
                        onTouchTap={addActivity.handleOpenAddActivity}>
                        <ContentAdd />
                    </FloatingActionButton>
                </Tooltip>
            </div>

            <div className={classes.wrapper}>
                <ActivityCalendar
                    calendar={calendar}
                    handleClickDay={handleClickDay}
                />
                {tubeWrapper}
            </div>

            <ActivityCreateDialog
                open={addActivity.openAddActivity}
                onClose={addActivity.handleCloseAddActivity}
                onSubmit={addActivity.handleSubmitAddActivity}
                zonesList={addActivity.zonesList}
                zonesLoading={addActivity.zonesLoading}
            />
        </Container>
    )
})

ActivityWrapper.PropTypes = {
    filter: PropTypes.object,
    usersList: PropTypes.object,
    detailData: PropTypes.object,
    addActivity: PropTypes.shape({
        openAddActivity: PropTypes.bool.isRequired,
        handleOpenAddActivity: PropTypes.func.isRequired,
        handleCloseAddActivity: PropTypes.func.isRequired,
        handleSubmitAddActivity: PropTypes.func.isRequired
    }).isRequired
}

export default ActivityWrapper
