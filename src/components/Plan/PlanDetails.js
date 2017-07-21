import React from 'react'
import FlatButton from 'material-ui/FlatButton'
import Paper from 'material-ui/Paper'
import PropTypes from 'prop-types'
import injectSheet from 'react-jss'
import {compose} from 'recompose'
import Person from '../Images/person.png'
import Add from 'material-ui/svg-icons/content/add'
import Place from 'material-ui/svg-icons/maps/place'
import Balance from 'material-ui/svg-icons/action/account-balance-wallet'
import Delivery from 'material-ui/svg-icons/maps/local-shipping'
import Assignment from 'material-ui/svg-icons/action/assignment'
import Warning from 'material-ui/svg-icons/alert/error-outline'
import Checked from 'material-ui/svg-icons/toggle/check-box'
import Indeterminate from 'material-ui/svg-icons/toggle/indeterminate-check-box'
import CheckOutline from 'material-ui/svg-icons/toggle/check-box-outline-blank'

const timelineColor = '#22a6c6'
const enhance = compose(
    injectSheet({
        padding: {
            padding: '20px 30px'
        },
        wrapper: {
            background: '#f4f4f4 !important',
            width: 'calc(100% - 350px)',
            extend: 'padding',
            zIndex: '2',
            boxShadow: '-3px -2px 12px 0px rgba(0, 0, 0, 0.07), -4px -4px 16px 0px rgba(0, 0, 0, 0.08)'
        },
        agentInfo: {
            border: '1px #e9e9e9 solid',
            '& > div': {
                padding: '15px 20px'
            }
        },
        header: {
            background: '#e3e3e3',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            '& button > div': {
                display: 'flex',
                alignItems: 'center'
            }
        },
        info: {
            '& > span': {
                display: 'block',
                lineHeight: '1.2'
            }
        },
        agent: {
            display: 'flex',
            alignItems: 'center',
            fontWeight: '600',
            '& img': {
                borderRadius: '50%',
                width: '32px',
                minWidth: '32px',
                height: '32px',
                marginRight: '10px'
            }
        },
        achieves: {
            extend: 'header',
            background: '#fff'
        },
        done: {
            display: 'flex',
            alignItems: 'center',
            '& > div': {
                display: 'flex',
                alignItems: 'center',
                marginRight: '50px',
                '& span': {
                    display: 'block',
                    lineHeight: '1.2',
                    color: '#666',
                    fontSize: '14px !important',
                    fontWeight: '600'
                },
                '&:last-child': {
                    margin: '0'
                }
            }
        },
        warning: {
            extend: 'done'
        },
        timelineWrapper: {
            margin: '30px -30px 0',
            padding: '0 30px',
            height: 'calc(100% - 140px)',
            overflowY: 'auto',
            position: 'relative',
            '&:after': {
                background: 'linear-gradient(to bottom, rgba(255,255,255,0) 0%,rgba(244,244,244,1)' +
                ' 80%,rgba(244,244,244,1) 100%)',
                content: '""',
                position: 'fixed',
                bottom: '0',
                right: '0',
                left: '415px',
                height: '50px',
                zIndex: '6'
            },
            '&::-webkit-scrollbar': {
                width: '0'
            }
        },
        timeline: {
            position: 'relative',
            marginTop: '10px',
            padding: '0 25px 20px'
        },
        timelineBlockWrapper: {
            '& > div:first-child': {
                '&:before': {
                    height: 'calc(100% + 20px)',
                    bottom: '0'
                }
            },
            '& > div:last-child': {
                '&:before': {
                    height: 'calc(100% + 20px)',
                    top: '0'
                }
            }
        },
        timelineDate: {
            background: timelineColor,
            color: '#fff',
            fontWeight: '600',
            borderRadius: '2px',
            margin: '0 auto 30px',
            width: '110px',
            textAlign: 'center',
            padding: '6px 0'
        },
        timelineBlock: {
            position: 'relative',
            marginBottom: '10px',
            '&:before': {
                content: '""',
                position: 'absolute',
                left: 'calc(50% - 2px)',
                width: '4px',
                height: '100%',
                background: timelineColor
            },
            '&:nth-child(even)': {
                '& > div:last-child': {
                    float: 'right',
                    textAlign: 'left',
                    '&:before': {
                        content: '""',
                        position: 'absolute',
                        top: '15px',
                        left: '-13px',
                        right: 'auto',
                        borderTop: '8px solid transparent',
                        borderLeft: 'none',
                        borderRight: '11px solid rgba(0, 0, 0, 0.12)',
                        borderBottom: '8px solid transparent',
                        filter: 'blur(1px)',
                        zIndex: '1'
                    },
                    '&:after': {
                        content: '""',
                        position: 'absolute',
                        top: '13px',
                        right: 'auto',
                        left: '-12px',
                        borderTop: '10px solid transparent',
                        borderRight: '12px solid #fff',
                        borderLeft: 'none',
                        borderBottom: '10px solid transparent',
                        zIndex: '3'
                    },
                    '& li': {
                        justifyContent: 'flex-end',
                        flexDirection: 'row-reverse',
                        '& svg': {
                            marginLeft: '0',
                            marginRight: '10px'
                        }
                    },
                    '& > span': {
                        right: 'auto',
                        left: '-95px'
                    }
                },
                '&:after': {
                    content: '""',
                    display: 'table',
                    clear: 'both'
                }
            },
            '&:last-child': {
                marginBottom: '0'
            }
        },
        timelineBlockPassive: {
            extend: 'timelineBlock',
            '&:before': {
                background: '#ccc'
            },
            '& > div:first-child': {
                background: '#ccc'
            }
        },
        timelineDot: {
            background: timelineColor,
            width: '16px',
            height: '16px',
            top: '15px',
            left: 'calc(50% - 8px)',
            position: 'absolute',
            borderRadius: '50%',
            outline: '2px #f4f4f4 solid'
        },
        timelineContent: {
            boxSizing: 'border-box',
            borderRadius: '2px',
            background: '#fff',
            color: '#666 !important',
            padding: '15px 20px',
            position: 'relative',
            width: 'calc(50% - 30px)',
            zIndex: '3',
            textAlign: 'right',
            '&:before': {
                content: '""',
                position: 'absolute',
                top: '15px',
                right: '-13px',
                borderTop: '8px solid transparent',
                borderLeft: '11px solid rgba(0, 0, 0, 0.12)',
                borderBottom: '8px solid transparent',
                filter: 'blur(1px)',
                zIndex: '1'
            },
            '&:after': {
                content: '""',
                position: 'absolute',
                top: '13px',
                right: '-12px',
                borderTop: '10px solid transparent',
                borderLeft: '12px solid #fff',
                borderBottom: '10px solid transparent',
                zIndex: '3'
            },
            '& h2': {
                fontSize: '16px',
                lineHeight: '14px',
                marginBottom: '10px'
            },
            '& li': {
                lineHeight: '25px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
                '& svg': {
                    width: '20px !important',
                    height: '20px !important',
                    marginLeft: '10px'
                }
            },
            '& > span': {
                position: 'absolute',
                top: '12px',
                right: '-95px',
                fontSize: '16px !important',
                fontWeight: 'bold'
            }
        }
    })
)

const PlanDetails = enhance((props) => {
    const {classes} = props
    const buttonStyle = {
        button: {
            height: '28px',
            lineHeight: '28px'
        },
        icon: {
            color: '#fff',
            fill: '#fff',
            width: 16,
            height: 16
        }
    }
    const achieveIcon = {
        basic: {
            color: '#999',
            width: 32,
            minWidth: 32,
            height: 32,
            marginRight: 5
        },
        error: {
            width: 32,
            minWidth: 32,
            height: 32,
            marginRight: 5,
            color: '#ef5350'
        }
    }

    return (
        <div className={classes.wrapper}>
            <div className={classes.agentInfo}>
                <div className={classes.header}>
                    <div className={classes.info}>
                        <span>Агент</span>
                        <span>Название зоны</span>
                    </div>
                    <div className={classes.agent}>
                        <img src={Person} alt=""/>
                        <div>Бердиев <br/> Абдупахмон</div>
                    </div>
                    <FlatButton
                        label="Добавить задание"
                        backgroundColor="rgb(18, 170, 235)"
                        style={buttonStyle.button}
                        rippleColor="#fff"
                        hoverColor="rgba(18, 170, 235, 0.7)"
                        labelStyle={{textTransform: 'none', color: '#fff'}}
                        icon={<Add style={buttonStyle.icon}/>}
                    />
                </div>
                <div className={classes.achieves}>
                    <div className={classes.done}>
                        <div>
                            <Place style={achieveIcon.basic}/>
                            <div>
                                <span>10 / 20</span>
                                <span>посещено</span>
                            </div>
                        </div>
                        <div>
                            <Balance style={achieveIcon.basic}/>
                            <div>
                                <span>5</span>
                                <span>сделки</span>
                            </div>
                        </div>
                        <div>
                            <Delivery style={achieveIcon.basic}/>
                            <div>
                                <span>3 / 3</span>
                                <span>доставки</span>
                            </div>
                        </div>
                        <div>
                            <Assignment style={achieveIcon.basic}/>
                            <div>
                                <span>3 / 3</span>
                                <span>отчеты</span>
                            </div>
                        </div>
                    </div>
                    <div className={classes.warning}>
                        <div>
                            <Warning style={achieveIcon.error}/>
                            <div>
                                <span>10</span>
                                <span>не выполнено</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className={classes.timelineWrapper}>
                <div className={classes.timeline}>
                    <div className={classes.timelineDate}>22 Апр, 2017</div>
                    <div className={classes.timelineBlockWrapper}>
                        <div className={classes.timelineBlock}>
                            <div className={classes.timelineDot}>
                            </div>

                            <Paper className={classes.timelineContent}>
                                <h2>Title of section 1</h2>
                                <ul>
                                    <li>Посещение магазина <Checked color="#92ce95"/></li>
                                    <li>Заключение сделки <Checked color="#92ce95"/></li>
                                    <li>Посещение магазина <Checked color="#92ce95"/></li>

                                </ul>
                                <span className={classes.date}>10:56</span>
                            </Paper>
                        </div>

                        <div className={classes.timelineBlock}>
                            <div className={classes.timelineDot}>
                            </div>

                            <Paper className={classes.timelineContent}>
                                <h2>Title of section 2</h2>
                                <ul>
                                    <li>Посещение магазина <Checked color="#92ce95"/></li>
                                    <li>Заключение сделки <Indeterminate color="#e57373"/></li>
                                    <li>Посещение магазина <CheckOutline color="#999"/></li>
                                </ul>
                                <span className={classes.date}>11:42</span>
                            </Paper>
                        </div>

                        <div className={classes.timelineBlockPassive}>
                            <div className={classes.timelineDot}>
                            </div>

                            <Paper className={classes.timelineContent}>
                                <h2>Title of section 1</h2>
                                <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Iusto, optio, dolorum provident rerum aut hic quasi placeat iure tempora
                                    laudantium ipsa ad debitis unde? Iste voluptatibus minus veritatis qui ut.</p>
                            </Paper>
                        </div>
                    </div>
                </div>
                <div className={classes.timeline}>
                    <div className={classes.timelineDate}>22 Апр, 2017</div>
                    <div className={classes.timelineBlockWrapper}>
                        <div className={classes.timelineBlock}>
                            <div className={classes.timelineDot}>
                            </div>

                            <Paper className={classes.timelineContent}>
                                <h2>Title of section 1</h2>
                                <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Iusto, optio, dolorum provident rerum aut hic quasi placeat iure tempora
                                    laudantium ipsa ad debitis unde? Iste voluptatibus minus veritatis qui ut.</p>
                                <span className={classes.date}>10:56</span>
                            </Paper>
                        </div>

                        <div className={classes.timelineBlock}>
                            <div className={classes.timelineDot}>
                            </div>

                            <Paper className={classes.timelineContent}>
                                <h2>Title of section 2</h2>
                                <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Iusto, optio, dolorum provident rerum aut?</p>
                                <span className={classes.date}>11:42</span>
                            </Paper>
                        </div>

                        <div className={classes.timelineBlockPassive}>
                            <div className={classes.timelineDot}>
                            </div>

                            <Paper className={classes.timelineContent}>
                                <h2>Title of section 1</h2>
                                <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Iusto, optio, dolorum provident rerum aut hic quasi placeat iure tempora
                                    laudantium ipsa ad debitis unde? Iste voluptatibus minus veritatis qui ut.</p>
                            </Paper>
                        </div>
                    </div>
                </div>
            </div>
            </div>
    )
})

PlanDetails.PropTypes = {
    filter: PropTypes.object,
    detailData: PropTypes.object
}

export default PlanDetails
