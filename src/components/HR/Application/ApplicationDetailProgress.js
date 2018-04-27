// . import _ from 'lodash'
// . import PropTypes from 'prop-types'

/* Import Loader from '../../Loader'
import Edit from 'material-ui/svg-icons/image/edit'
import IconButton from 'material-ui/IconButton'
import Divider from 'material-ui/Divider'
import IconMenu from 'material-ui/IconMenu'
import MenuItem from 'material-ui/MenuItem'
import classNames from 'classnames'
import MoreIcon from 'material-ui/svg-icons/navigation/more-vert'
import ReworkIcon from 'material-ui/svg-icons/content/reply'
import AcceptIcon from 'material-ui/svg-icons/action/done-all'
import dateFormat from '../../../helpers/dateFormat'
import numberFormat from '../../../helpers/numberFormat'
import {getAppStatusName, getBackendNames, getYearText} from '../../../helpers/hrcHelpers' */
import React from 'react'
import LinearProgress from '../../LinearProgress'
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
    BORDER_STYLE
} from '../../../constants/styleConstants'
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
                marginLeft: '20px',
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
            padding: '15px 20px'
        },
        buttons: {
            display: 'flex',
            paddingTop: '10px'
        },
        downLoad: {
            borderTop: '1px solid #efefef',
            marginTop: '10px',
            '& a': {
                paddingTop: '5px',
                fontSize: '12px',
                display: 'flex',
                alignItems: 'center'
            }
        }
    }),
    withState('openLogs', 'setOpenLogs', false),
    withState('moreDetails', 'setMoreDetails', false)
)

const downIcon = {
    height: '15px',
    width: '15px',
    color: '#12aaeb',
    fill: 'currentColor'
}
const ApplicationDetailProgress = enhance((props) => {
    const {classes,
        loading
    } = props

    if (loading) {
        return (
            <div className={classes.loader}>
                <LinearProgress/>
            </div>
        )
    }

    return (
        <div className={classes.wrapper}>
            <div className={classes.title}><span>{t('Прогресс')}</span>
                <Badge
                    className={classes.badge}
                    badgeContent={4}
                    primary={true}>
                    <Notifications color="#bec6c9"/>
                </Badge>

            </div>
            <div className={classes.cardWrapper}>
                <div className={classes.cardItem}>
                    <span><Done color="#fff" style={{width: '16px', height: '15px'}}/></span>
                    <div>Ожидание отчета</div>
                </div>
                <div className={classes.cardItem}>
                    <span><Done color="#fff" style={{width: '16px', height: '15px'}}/></span>
                    <div>
                        Отчет отправлен клиенту <br/>
                        <i>22 Апр. 2018 | 15:25</i>
                        <div className={classes.downLoad}><a><DownLoadIcon style={downIcon} /> Скачат отчет</a></div>
                    </div>
                </div>
            </div>
            <div className={classes.actionBtn}>
                <div>Lorem ipsum haeds lolermsds sdasd asd asd asd asd asd asd as das dasdasdasdas dasdasdas das</div>
                <div className={classes.buttons}>
                    <FlatButton
                        label={t('Отчет одобрен')}
                        backgroundColor="#81c784"
                        hoverColor="#81c784"
                        style={{marginRight: '5px', width: '50%'}}
                        labelStyle={{fontSize: '13px', color: '#fff', textTransform: 'none'}}/>
                    <FlatButton
                        backgroundColor="#13aaeb"
                        hoverColor="#13aaeb"
                        label={t('Отчет отклонен')}
                        style={{marginLeft: '5px', width: '50%'}}
                        labelStyle={{fontSize: '13px', color: '#fff', textTransform: 'none'}}/>
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
