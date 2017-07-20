import _ from 'lodash'
import React from 'react'
import IconButton from 'material-ui/IconButton'
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
        </div>
    )
})

PlanDetails.PropTypes = {
    filter: PropTypes.object,
    detailData: PropTypes.object
}

export default PlanDetails
