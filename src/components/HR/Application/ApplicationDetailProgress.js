// . import _ from 'lodash'
// . import PropTypes from 'prop-types'

/* Import Loader from '../../Loader'
import Edit from 'material-ui/svg-icons/image/edit'
import IconButton from 'material-ui/IconButton'
import Divider from 'material-ui/Divider'
import IconMenu from 'material-ui/IconMenu'
import MenuItem from 'material-ui/MenuItem'
import MoreIcon from 'material-ui/svg-icons/navigation/more-vert'
import ReworkIcon from 'material-ui/svg-icons/content/reply'
import AcceptIcon from 'material-ui/svg-icons/action/done-all'
import dateFormat from '../../../helpers/dateFormat'
import numberFormat from '../../../helpers/numberFormat'
import {getAppStatusName, getBackendNames, getYearText} from '../../../helpers/hrcHelpers' */
import React from 'react'
import LinearProgress from '../../LinearProgress'
import classNames from 'classnames'
import Done from 'material-ui/svg-icons/action/done'
import FlatButton from 'material-ui/FlatButton'
import DownLoadIcon from 'material-ui/svg-icons/file/file-download'
import {hashHistory} from 'react-router'
import Notifications from 'material-ui/svg-icons/social/notifications'
import Badge from 'material-ui/Badge'
import {compose, withState} from 'recompose'
import injectSheet from 'react-jss'
import t from '../../../helpers/translate'
import {
    PADDING_STANDART,
    BORDER_STYLE
} from '../../../constants/styleConstants'
import _ from 'lodash'
// . import getDocuments from '../../../helpers/getDocument'

const enhance = compose(
    injectSheet({
        loader: {
            width: '100%',
            background: '#fff',
            height: '100px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
        },
        wrapper: {
            color: '#333 !important',
            width: '100%'
        },
        title: {
            display: 'flex',
            alignItems: 'center',
            '& span': {
                '&:first-child': {
                    backgroundColor: '#bec6c9',
                    padding: '8px 10px',
                    color: '#fff',
                    marginRight: '10px',
                    fontWeight: '550'
                }
            }
        },
        block: {
            borderLeft: BORDER_STYLE,
            padding: PADDING_STANDART,
            '&:first-child': {
                borderLeft: 'none'
            }
        },
        badge: {
            padding: '7px 5px 4px 0 !important',
            '& span': {
                backgroundColor: '#ef5350 !important',
                width: '20px !important',
                height: '20px !important'
            }
        },
        cardWrapper: {
            borderLeft: 'solid 2px #bec6c9',
            marginLeft: '15px',
            marginTop: '-4px'
        },
        cardItem: {
            cursor: 'pointer',
            display: 'flex',
            marginLeft: '-9px',
            paddingTop: '15px',
            '& > span': {
                borderRadius: '50%',
                width: '16px',
                height: '16px',
                backgroundColor: '#7abd7d',
                marginTop: '10px'
            },
            '& > div': {
                backgroundColor: '#fff',
                boxShadow: 'rgba(0, 0, 0, 0.12) 0px 1px 6px 0px, rgba(0, 0, 0, 0.12) 0px 3px 4px 0px',
                marginLeft: '20px',
                minHeight: '35px',
                maxHeight: '100px',
                transition: 'max-height 1s, min-height 1s',
                padding: '10px'
            },
            '&:last-child': {
                paddingBottom: '15px'
            },
            '& i': {
                fontSize: '11px',
                color: '#999'
            }
        },
        actionBtn: {
            backgroundColor: '#fff',
            boxShadow: 'rgba(0, 0, 0, 0.12) 0px 1px 6px 0px, rgba(0, 0, 0, 0.12) 0px 3px 4px 0px',
            padding: '15px 20px',
            '& > button': {
                width: '50%',
                lineHeight: 'unset',
                height: 'unset',
                minHeight: '36px',
                paddingBottom: '5px'
            }
        },
        buttons: {
            display: 'flex',
            paddingTop: '10px'
        },
        downLoad: {
            transition: 'all 500ms ease',
            maxHeight: '0',
            opacity: '0',
            borderTop: '1px solid #efefef',
            '& a': {
                paddingTop: '5px',
                fontSize: '12px',
                display: 'flex',
                alignItems: 'center'
            }
        },
        notClickable: {
            cursor: 'unset'
        },
        open: {
            marginTop: '10px',
            opacity: '1',
            maxHeight: '40px'
        }

    }),
    withState('openLogs', 'setOpenLogs', false),
    withState('currentItem', 'setCurrentItem', null)
)

const downIcon = {
    height: '15px',
    width: '15px',
    color: '#12aaeb',
    fill: 'currentColor'
}
const doneIcon = {
    width: '16px',
    height: '16px'
}

const actButton = {
    label: {fontSize: '13px', color: '#fff', textTransform: 'none', padding: '5px'}
}

const ApplicationDetailProgress = enhance((props) => {
    const {classes,
        loading,
        currentItem,
        setCurrentItem,
        id,
        showNotify
    } = props

    if (loading) {
        return (
            <div className={classes.loader}>
                <LinearProgress/>
            </div>
        )
    }

    const cards = [
        {text: 'Ожидание отчета', type: '1'},
        {text: 'Отчет отправлен клиенту', type: '2'},
        {text: 'Отчет откланен', type: '6', date: '22 Апр. 2018 | 15:25'},
        {text: 'Отчет одобрен клиентом', type: '3'},
        {text: 'В заявку внесены изменения', type: '3'},
        {text: 'Формиравание отчета', type: '3'},
        {text: 'Отчет отправлен начальнику', type: '3'},
        {text: 'Отчет отправлен клиенту', type: '6', date: '22 Апр. 2018 | 15:25'},
        {text: 'Клиент отклонил отчет', type: '6', date: '22 Апр. 2018 | 15:25'},
        {text: 'В заявку внесены изменения', type: '3'},
        {text: 'Формиравание отчета', type: '3'},
        {text: 'Отчет отправлен начальнику', type: '3'},
        {text: 'Отчет отправлен клиенту', type: '6', date: '22 Апр. 2018 | 15:25'},
        {text: 'Отмеченны кондидаты для собеседования с клиентом', type: '4'},
        {text: 'Время собеседований согласованно', type: '5'},
        {text: 'Заявка закрыта. Клиент принял на работу', type: '5'}
    ]
    return (
        <div className={classes.wrapper}>
            <div className={classes.title}><span>{t('Прогресс')}</span>
                {showNotify &&
                <Badge
                    className={classes.badge}
                    badgeContent={4}
                    primary={true}>
                    <Notifications color="#bec6c9"/>
                </Badge>}

            </div>
            <div className={classes.cardWrapper}>
                {_.map(cards, (item, index) => {
                    if (item.date) {
                        return (
                            <div className={classes.cardItem} onClick={() => setCurrentItem(index)}>
                                <span><Done color="#fff" style={doneIcon}/></span>
                                <div>
                                    <div>Отчет отправлен клиенту <br/>
                                        <i>22 Апр. 2018 | 15:25</i>
                                        <div className={classNames(classes.downLoad, {
                                            [classes.open]: currentItem === index
                                        })}>
                                            <a><DownLoadIcon style={downIcon} /> Скачат отчет</a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    }
                    return (
                        <div className={classes.cardItem} onClick={() => setCurrentItem(index)}>
                            <span><Done color="#fff" style={doneIcon}/></span>
                            <div>{item.text}
                                <div className={classNames(classes.downLoad, {
                                    [classes.open]: currentItem === index
                                })}>
                                    {currentItem === index &&
                                    <a onClick={() => hashHistory.push({pathname: 'hr/long-list', query: {application: id}})}>Проверить
                                    </a>}
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>
            <div className={classes.actionBtn}>
                <div>Lorem ipsum haeds lolermsds sdasd asd asd asd asd asd asd as das dasdasdasdas dasdasdas das</div>
                <div className={classes.buttons}>
                    <FlatButton
                        label={t('Отчет одобрен')}
                        backgroundColor="#81c784"
                        hoverColor="#81c784"
                        style={{marginRight: '5px'}}
                        labelStyle={actButton.label}/>
                    <FlatButton
                        backgroundColor="#13aaeb"
                        hoverColor="#13aaeb"
                        label={t('Отчет отклонен')}
                        style={{marginLeft: '5px'} + actButton.button}
                        labelStyle={actButton.label}/>
                </div>
            </div>
        </div>
    )
})

ApplicationDetailProgress.propTypes = {
    // Data: PropTypes.object.isRequired,
    // Loading: PropTypes.bool.isRequired
}

export default ApplicationDetailProgress
