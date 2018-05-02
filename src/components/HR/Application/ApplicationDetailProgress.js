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
import classNames from 'classnames'
import Done from 'material-ui/svg-icons/action/done'
import FlatButton from 'material-ui/FlatButton'
import DownLoadIcon from 'material-ui/svg-icons/file/file-download'
import Notifications from 'material-ui/svg-icons/social/notifications'
import Badge from 'material-ui/Badge'
import {compose, withState} from 'recompose'
import injectSheet from 'react-jss'
import t from '../../../helpers/translate'
import {
    PADDING_STANDART,
    BORDER_STYLE, LINK_COLOR, COLOR_WHITE, COLOR_GREEN
} from '../../../constants/styleConstants'
import _ from 'lodash'
import moment from 'moment'
import * as ROUTE from '../../../constants/routes'
import {Link} from 'react-router'
import dateFormat from '../../../helpers/dateFormat'
import {genderFormat} from '../../../constants/gender'
import {getBackendNames, getYearText} from '../../../helpers/hrcHelpers'
import {HR_EDUCATION, HR_LEVEL_PC, HR_WORK_SCHEDULE} from '../../../constants/backendConstants'
import numberFormat from '../../../helpers/numberFormat'
import getDocument from '../../../helpers/getDocument'
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
                fontSize: '11px !important',
                width: '18px !important',
                height: '18px !important'
            }
        },
        cardWrapper: {
            borderLeft: 'solid 2px #bec6c9',
            marginLeft: '20px',
            marginTop: '-4px'
        },
        cardItem: {
            cursor: 'pointer',
            display: 'flex',
            marginLeft: '-9px',
            paddingTop: '15px',
            '& > span': {
                borderRadius: '50%',
                width: '17px',
                height: '16px',
                backgroundColor: '#7abd7d',
                marginTop: '10px'
            },
            '& > div': {
                backgroundColor: '#fff',
                boxShadow: 'rgba(0, 0, 0, 0.12) 0px 1px 6px 0px, rgba(0, 0, 0, 0.12) 0px 3px 4px 0px',
                borderRadius: '2px',
                marginLeft: '20px',
                minHeight: '35px',
                maxHeight: '100px',
                transition: 'max-height 1s, min-height 1s',
                padding: '10px'
            },
            '& i': {
                fontSize: '11px',
                color: '#999'
            }
        },
        cardContent: {

        },
        actionBtn: {
            backgroundColor: '#fff',
            boxShadow: 'rgba(0, 0, 0, 0.12) 0px 1px 6px 0px, rgba(0, 0, 0, 0.12) 0px 3px 4px 0px',
            padding: '15px 20px',
            marginTop: '15px',
            marginLeft: '-22px'
        },
        buttons: {
            display: 'flex',
            paddingTop: '10px',
            '& > button': {
                marginLeft: '5px !important',
                '&:first-child': {
                    marginLeft: '0 !important'
                }
            }
        },
        download: {
            display: 'flex',
            alignItems: 'center',
            '& > a': {
                fontSize: '12px',
                display: 'flex',
                fontWeight: '600',
                alignItems: 'center',
                marginLeft: '5px'
            }
        }
    }),
    withState('openLogs', 'setOpenLogs', false),
    withState('currentItem', 'setCurrentItem', null)
)

const downIcon = {
    height: '15px',
    width: '15px',
    color: LINK_COLOR,
    fill: 'currentColor'
}
const doneIcon = {
    width: '16px',
    height: '15px'
}

const actButton = {
    label: {
        fontSize: '13px',
        color: COLOR_WHITE,
        textTransform: 'none',
        padding: '5px'
    }
}

const flatButtonStyle = {
    width: '50%',
    lineHeight: 'unset',
    height: 'unset',
    minHeight: '30px'
}

const ApplicationDetailProgress = enhance((props) => {
    const {
        id,
        classes,
        currentItem,
        setCurrentItem,
        showNotify,
        logsData,
        reportUri,
        handleChangeApplicationAction
    } = props

    const logsList = logsData.list
    const lastLogId = _.get(_.last(logsList), 'id')

    const getCardContainer = (content) => {
        return (
            <div className={classes.cardItem}>
                <span><Done color={COLOR_WHITE} style={doneIcon}/></span>
                <div className={classNames(classes.cardContent)}>
                    {content}
                </div>
            </div>
        )
    }
    const getActionContainer = (content, buttons) => {
        const isSingle = _.get(buttons, 'single')
        return (
            <div className={classes.actionBtn}>
                <div>{content}</div>
                {isSingle
                    ? <div className={classes.buttons}>
                        <FlatButton
                            label={buttons.single.text}
                            backgroundColor={COLOR_GREEN}
                            hoverColor={COLOR_GREEN}
                            rippleColor={COLOR_WHITE}
                            style={flatButtonStyle}
                            labelStyle={actButton.label}
                            onClick={buttons.single.action}
                            fullWidth
                        />
                    </div>
                    : <div className={classes.buttons}>
                        <FlatButton
                            label={buttons.left.text}
                            backgroundColor={COLOR_GREEN}
                            hoverColor={COLOR_GREEN}
                            rippleColor={COLOR_WHITE}
                            style={flatButtonStyle}
                            labelStyle={actButton.label}
                            onClick={buttons.left.action}
                        />
                        <FlatButton
                            label={buttons.right.text}
                            backgroundColor={LINK_COLOR}
                            hoverColor={LINK_COLOR}
                            rippleColor={COLOR_WHITE}
                            style={flatButtonStyle}
                            labelStyle={actButton.label}
                            onClick={buttons.right.action}
                        />
                    </div>}
            </div>
        )
    }

    const getActionContent = (action, logId) => {
        switch (action) {
            case 'update': return (
                <div>
                    {getCardContainer('В заявку внесены изменения')}
                    {getCardContainer('Ожидание отчета')}
                </div>
            )
            case 'report_sent_to_manager': return lastLogId === logId
                ? getActionContainer(
                    <div className={classes.download}>
                        <span>Отчет сформирован</span>
                        <a onClick={() => getDocument(reportUri)}>(<DownLoadIcon style={downIcon}/>скачать)</a>
                    </div>,
                    {
                        left: {
                            text: 'Отправить клиенту',
                            action: () => handleChangeApplicationAction('sent_to_client')
                        },
                        right: {
                            text: 'Отклонить',
                            action: () => handleChangeApplicationAction('rejected_by_manager')
                        }
                    })
                : getCardContainer((
                    <div className={classes.download}>
                        <span>Отчет сформирован</span>
                        <a onClick={() => getDocument(reportUri)}>(<DownLoadIcon style={downIcon}/>скачать)</a>
                    </div>
                ))
            case 'sent_to_client': return (
                <div>
                    {getCardContainer('Отчет отправлен клиенту')}
                    {lastLogId === logId
                        ? getActionContainer('Ожидание ответа от клиента по отчету', {
                            left: {
                                text: 'Отчет одобрен',
                                action: () => handleChangeApplicationAction('approval')
                            },
                            right: {
                                text: 'Отчет отклонен',
                                action: () => handleChangeApplicationAction('rejected_by_client')
                            }
                        })
                        : null}
                </div>
            )
            case 'rejected_by_manager': return (
                <div>
                    {getCardContainer('Отчет отклонен менеджером')}
                    {getCardContainer('Ожидание отчета')}
                </div>
            )
            case 'rejected_by_client': return (
                <div>
                    {getCardContainer('Отчет отклонен клиентом')}
                    {getCardContainer('Ожидание отчета')}
                </div>
            )
            case 'approval': return (
                <div>
                    {getCardContainer('Отчет одобрен клиентом')}
                    {getActionContainer('Собеседование с клиентом', {
                        single: {
                            text: 'Указать кандидатов для собеседования',
                            action: () => console.warn('open dialog')
                        }
                    })}
                </div>
            )
            default: return getCardContainer(action)
        }
    }

    const cards = [
        {text: 'Ожидание отчета', type: '1'},
        {text: 'Отчет отправлен клиенту', type: '2'},
        {text: 'Отчет отклонен', type: '6', date: '22 Апр. 2018 | 15:25'},
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
                {getCardContainer('Ожидание отчета')}
                {_.map(logsList, (item) => {
                    const action = _.get(item, 'action')
                    const comment = _.get(item, 'comment')
                    const log = _.get(item, 'log')
                    const logId = _.get(item, 'id')
                    const createdDate = dateFormat(_.get(item, 'createdDate'))
                    const status = _.get(item, 'status')
                    return getActionContent(action, logId)
                })}
            </div>
        </div>
    )
})

ApplicationDetailProgress.propTypes = {
    // Data: PropTypes.object.isRequired,
    // Loading: PropTypes.bool.isRequired
}

export default ApplicationDetailProgress
