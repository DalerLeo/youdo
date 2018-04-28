import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import {compose, withState} from 'recompose'
import injectSheet from 'react-jss'
import classNames from 'classnames'
import LinearProgress from '../../LinearProgress'
import Loader from '../../Loader'
import Edit from 'material-ui/svg-icons/image/edit'
import IconButton from 'material-ui/IconButton'
import IconMenu from 'material-ui/IconMenu'
import ApplicationDetailProgress from './ApplicationDetailProgress'
import MenuItem from 'material-ui/MenuItem'
import Divider from 'material-ui/Divider'
import FlatButton from 'material-ui/FlatButton'
import Delete from 'material-ui/svg-icons/action/delete'
import MoreIcon from 'material-ui/svg-icons/navigation/more-vert'
import ReworkIcon from 'material-ui/svg-icons/content/reply'
import AcceptIcon from 'material-ui/svg-icons/action/done-all'
import dateFormat from '../../../helpers/dateFormat'
import numberFormat from '../../../helpers/numberFormat'
import {getAppStatusName, getBackendNames, getYearText} from '../../../helpers/hrcHelpers'
import t from '../../../helpers/translate'
import {
    PADDING_STANDART,
    BORDER_STYLE,
    COLOR_GREY_LIGHTEN,
    COLOR_GREY,
    COLOR_WHITE,
    LINK_COLOR
} from '../../../constants/styleConstants'
import {
    SUM_CURRENCY,
    HR_WORK_SCHEDULE,
    HR_EDUCATION,
    HR_GENDER,
    HR_LEVEL_PC
} from '../../../constants/backendConstants'
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
            width: '100%',
            display: 'flex',
            flexWrap: 'wrap',
            '& a': {
                color: LINK_COLOR
            }
        },
        title: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%',
            height: '65px',
            padding: '0 30px',
            borderBottom: '1px #efefef solid',
            position: 'relative'
        },
        createdDate: {
            fontSize: '12px',
            color: '#999'
        },
        tab: {
            height: '100%',
            width: '100%'
        },
        container: {
            display: 'flex',
            justifyContent: 'space-between',
            position: 'relative',
            overflow: 'hidden',
            width: '100%',
            '& > div': {
                '&:first-child': {
                    width: '25%'
                },
                '&:nt-child(2)': {
                    width: '35%'
                },
                '&:nt-child(3)': {
                    width: '40%'
                }
            }
        },
        logs: {
            background: COLOR_WHITE,
            opacity: '0',
            position: 'absolute',
            padding: PADDING_STANDART,
            boxShadow: '3px 0px 5px rgba(0, 0, 0, 0.22)',
            top: '-100%',
            left: '0',
            right: '0',
            zIndex: '2',
            height: '100%',
            width: '500px !important',
            transition: 'all 300ms ease'
        },
        logsOpen: {
            top: '0 !important',
            opacity: '1 !important'
        },
        log: {
            display: 'flex',
            alignItems: 'center',
            marginBottom: '15px',
            '&:last-child': {
                marginBottom: '0'
            }
        },
        logDate: {
            marginRight: '15px'
        },
        logStatus: {
            fontWeight: '600'
        },
        companyInfo: {
            borderBottom: BORDER_STYLE,
            width: '100%'
        },
        block: {
            borderLeft: BORDER_STYLE,
            padding: PADDING_STANDART,
            '&:first-child': {
                borderLeft: 'none'
            }
        },
        info: {
            '& > div': {
                marginBottom: '10px',
                '&:last-child': {
                    margin: '0'
                }
            }
        },
        flexBetween: {
            display: 'flex',
            justifyContent: 'space-between',
            flexWrap: 'wrap'
        },
        skill: {
            fontWeight: '600',
            marginLeft: '5px',
            '&:after': {
                content: '","'
            },
            '&:last-child:after': {
                display: 'none'
            },
            '& strong': {
                color: COLOR_GREY_LIGHTEN
            }
        },
        lowercase: {
            textTransform: 'lowercase'
        },
        titleLabel: {
            fontSize: '18px',
            color: '#333',
            fontWeight: '600',
            cursor: 'pointer'
        },
        titleButtons: {
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'center',
            zIndex: '2'
        },
        titleExtra: {
            fontSize: '13px',
            color: COLOR_GREY,
            margin: '0 10px',
            '& span': {
                fontWeight: '550'
            }
        },
        bodyTitle: {
            fontSize: '14px',
            fontWeight: '600',
            marginBottom: '15px',
            marginTop: '20px',
            '&:first-child': {
                marginTop: '0'
            }
        },
        closeDetail: {
            position: 'absolute',
            left: '0',
            top: '0',
            right: '0',
            bottom: '0',
            cursor: 'pointer',
            zIndex: '1'
        },
        subTitle: {
            display: 'flex',
            borderBottom: BORDER_STYLE,
            padding: '0 30px',
            alignItems: 'center',
            justifyContent: 'space-between',
            height: '55px',
            width: '100%'
        },
        status: {
            fontWeight: '600'
        },
        buttons: {
            display: 'flex',
            alignItems: 'center'
        },
        button: {
            fontWeight: '600',
            fontSize: '14px',
            marginRight: '20px'
        },
        moreDetails: {
            textAlign: 'right',
            marginTop: '10px'
        },
        progress: {
            backgroundColor: '#efefef',
            maxHeight: '360px',
            overflowY: 'auto'
        }
    }),
    withState('openLogs', 'setOpenLogs', false),
    withState('moreDetails', 'setMoreDetails', false)
)

const iconStyle = {
    icon: {
        color: COLOR_GREY,
        width: 24,
        height: 24
    },
    button: {
        width: 48,
        height: 48,
        padding: 12
    }
}
const popoverStyle = {
    menuItem: {
        fontSize: '13px',
        minHeight: '36px',
        lineHeight: '36px'
    },
    innerDiv: {
        padding: '0px 16px 0px 60px'
    },
    icon: {
        margin: '7px',
        width: '22px',
        height: '22px'
    }
}

const ApplicationDetails = enhance((props) => {
    const {classes,
        loading,
        data,
        confirmDialog,
        handleOpenUpdateDialog,
        handleCloseDetail,
        openLogs,
// .        setOpenLogs,
        logsData,
        moreDetails,
        setMoreDetails,
        filter
    } = props

    const applicationId = _.get(data, 'id')
    const ageMin = _.toNumber(_.get(data, 'ageMin'))
    const ageMax = _.toNumber(_.get(data, 'ageMax'))
    const businessTrip = _.get(data, 'businessTrip') ? t('Да') : t('Нет')
    const client = _.get(data, ['contact', 'client', 'name'])
    const sphere = _.get(data, ['contact', 'client', 'sphere']) || t('Не указана')
    const contact = _.get(data, ['contact', 'name'])
    const email = _.get(data, ['contact', 'email']) || t('Не указан')
    const phone = _.get(data, ['contact', 'telephone']) || t('Не указан')
    const address = _.get(data, ['contact', 'address']) || t('Не указан')
    const deadline = dateFormat(_.get(data, 'deadline'))
    const education = getBackendNames(HR_EDUCATION, _.get(data, 'education'))
    const experience = _.toNumber(_.get(data, 'experience'))
    const levelPc = getBackendNames(HR_LEVEL_PC, _.get(data, 'levelPc'))
    const workSchedule = getBackendNames(HR_WORK_SCHEDULE, _.get(data, 'mode'))
    const planningDate = dateFormat(_.get(data, 'planningDate'))
    const position = _.get(data, ['position', 'name'])
    const privileges = _.get(data, 'privileges')
    const realSalaryMin = numberFormat(_.get(data, 'realSalaryMin'))
    const realSalaryMax = numberFormat(_.get(data, 'realSalaryMax'))
    const recruiter = _.get(data, ['recruiter'])
        ? _.get(data, ['recruiter', 'firstName']) + ' ' + _.get(data, ['recruiter', 'secondName'])
        : t('Не назначен')
    const responsibility = _.get(data, 'responsibility')
    const sex = getBackendNames(HR_GENDER, _.get(data, 'sex'))
    const skills = _.get(data, 'skills')
    const status = _.get(data, 'status')
    const languages = _.get(data, 'languages')
    const trialSalaryMin = numberFormat(_.get(data, 'trialSalaryMin'))
    const trialSalaryMax = numberFormat(_.get(data, 'trialSalaryMax'))
    // . const reportDownloadLink = _.get(data, 'downloadReport')
    /*            <div className={classes.subTitle}>
     <div className={classes.buttons}>
     <a className={classNames(classes.button)} onClick={() => { setOpenLogs(!openLogs) }}>
     {openLogs ? t('Закрыть логи') : t('Посмотреть логи')}
     </a>
     {reportDownloadLink &&
     <a onClick={() => { getDocuments(reportDownloadLink) }} className={classNames(classes.button)}>{t('Скачать отчет')}</a>}
     </div>
     </div> */
    if (loading) {
        return (
            <div className={classes.loader}>
                <LinearProgress/>
            </div>
        )
    }

    return (
        <div className={classes.wrapper} key={_.get(data, 'id')}>
            <div className={classes.title}>
                <div className={classes.titleLabel}>{t('Заявка')} №{applicationId}</div>
                <div className={classes.closeDetail}
                     onClick={handleCloseDetail}>
                </div>
                <div className={classes.titleButtons}>
                    <div className={classes.titleExtra}>{t('Дэдлайн')}: <span>{deadline}</span></div>
                    <div className={classes.titleExtra}>{t('Рекрутер')}: <span>{recruiter}</span></div>

                    <IconMenu
                        className={classes.popover}
                        iconButtonElement={
                            <IconButton iconStyle={iconStyle.icon} style={iconStyle.button}>
                                <MoreIcon/>
                            </IconButton>
                        }
                        anchorOrigin={{horizontal: 'right', vertical: 'top'}}
                        targetOrigin={{horizontal: 'right', vertical: 'top'}}>
                        <MenuItem
                            style={popoverStyle.menuItem}
                            innerDivStyle={popoverStyle.innerDiv}
                            leftIcon={<ReworkIcon style={popoverStyle.icon}/>}
                            primaryText={t('Отправить на доработку')}/>
                        <MenuItem
                            style={popoverStyle.menuItem}
                            innerDivStyle={popoverStyle.innerDiv}
                            leftIcon={<AcceptIcon style={popoverStyle.icon}/>}
                            primaryText={t('Принять заявку')}/>
                        <Divider/>
                        <MenuItem
                            style={popoverStyle.menuItem}
                            innerDivStyle={popoverStyle.innerDiv}
                            leftIcon={<Edit style={popoverStyle.icon}/>}
                            onTouchTap={() => { handleOpenUpdateDialog(applicationId) }}
                            primaryText={t('Изменить')}/>
                        <MenuItem
                            style={popoverStyle.menuItem}
                            innerDivStyle={popoverStyle.innerDiv}
                            leftIcon={<Delete style={popoverStyle.icon}/>}
                            onTouchTap={() => { confirmDialog.handleOpenConfirmDialog(applicationId) }}
                            primaryText={t('Удалить')}/>
                    </IconMenu>
                </div>
            </div>
            <div className={classes.container}>
                <div className={classes.block}>
                    <div className={classes.bodyTitle}>{t('Описание компании')}</div>
                    <div className={classes.info}>
                        <div>{t('Клиент')}: <strong>{client}</strong></div>
                        <div>{t('Контактное лицо')}: <strong>{contact}</strong></div>
                        <div>{t('Телефон')}: <strong>{phone}</strong></div>
                        <div>{t('Адрес')}: <strong>{address}</strong></div>
                        <div>{t('Email')}: <strong>{email}</strong></div>
                    </div>
                    <div className={classes.bodyTitle}>{t('Деятельность компании')}</div>
                    <div className={classes.info}>{sphere}</div>
                </div>
                <div className={classes.block} style={{minHeight: moreDetails ? '500px' : '300px', maxHeight: moreDetails ? '700px' : '400px', transition: 'min-height 400ms, max-height 500ms'}}>
                    <div className={classes.bodyTitle}>{t('Описание вакантной должности')}</div>
                    <div className={classes.info}>
                        <div>{t('Наименование должности')}: <strong>{position}</strong></div>
                        <div>{t('З/п на испытательный срок')}: <strong>{trialSalaryMin} - {trialSalaryMax} {SUM_CURRENCY}</strong></div>
                        <div>{t('З/п после испытательного срока')}: <strong>{realSalaryMin} - {realSalaryMax} {SUM_CURRENCY}</strong></div>
                        <div>{t('Предоставляемые льготы')}:
                            {_.map(privileges, (item) => {
                                const id = _.get(item, 'id')
                                const name = _.get(item, 'name')
                                return (
                                    <span key={id} className={classes.skill}>{name}</span>
                                )
                            })}
                        </div>
                        <div>{t('Режим работы')}: <strong>{workSchedule}</strong></div>
                        <div>{t('Наличие командировок')}: <strong>{businessTrip}</strong></div>
                        <div>{t('Функциональные обязанности')}: <strong>{responsibility}</strong></div>
                        <div>{t('Дата планируемого приема на работу')}: <strong>{planningDate}</strong></div>
                    </div>
                    {moreDetails && <div style={{marginTop: '15px'}}>
                        <div className={classes.bodyTitle}>{t('Требования к кандидату')}</div>
                        <div className={classes.info}>
                            <div>{t('Возраст')}: <strong>{ageMin} - {getYearText(ageMax)}</strong></div>
                            <div>{t('Пол')}: <strong>{sex}</strong></div>
                            <div>{t('Образование')}: <strong>{education}</strong></div>
                            <div>{t('Знание ПК')}: <strong>{levelPc}</strong></div>
                            <div>{t('Знание языков')}:
                                {_.isEmpty(languages)
                                    ? <strong> {t('Не указано')}</strong>
                                    : _.map(languages, (item) => {
                                        const id = _.get(item, 'id')
                                        const name = _.get(item, ['language', 'name'])
                                        const level = _.get(item, ['level', 'name'])
                                        return (
                                            <span key={id} className={classes.skill}>{name} <strong className={classes.lowercase}>({level})</strong></span>
                                        )
                                    })}
                            </div>
                            <div>{t('Минимальный опыт работы по специальности')}: <strong>{getYearText(experience)}</strong></div>
                            <div>{t('Профессиональные навыки')}:
                                {_.isEmpty(skills)
                                    ? <strong> {t('Не указаны')}</strong>
                                    : _.map(skills, (item) => {
                                        const id = _.get(item, 'id')
                                        const name = _.get(item, 'name')
                                        return (
                                            <span key={id} className={classes.skill}>{name}</span>
                                        )
                                    })}
                            </div>
                        </div>
                    </div>}
                    <div className={classes.moreDetails}>
                        <FlatButton
                            label={moreDetails ? 'Cкрыть' : 'Далее'}
                            primary={true}
                            backgroundColor="#efefef"
                            onTouchTap={() => setMoreDetails(!moreDetails)}/>
                    </div>
                </div>
                <div className={classNames(classes.block, classes.progress)}>
                    <ApplicationDetailProgress
                        status={status}
                        filter={filter}
                        showNotify={true}
                        id={applicationId}
                    />
                </div>

                <div className={classNames(classes.logs, {
                    [classes.logsOpen]: openLogs
                })}>
                    {logsData.loading
                        ? <div className={classes.loader}>
                            <Loader size={0.75}/>
                        </div>
                        : !_.isEmpty(logsData.list)
                            ? _.map(logsData.list, (item) => {
                                const createdDate = dateFormat(_.get(item, 'createdDate'), true)
                                const logStatus = _.get(item, 'status')
                                const id = _.get(item, 'id')
                                return (
                                    <div key={id} className={classes.log}>
                                        <div className={classes.logDate}>{createdDate}</div>
                                        <div className={classes.logStatus}>{getAppStatusName(logStatus)}</div>
                                    </div>
                                )
                            })
                            : <div>{t('Нет активности по этой заявке')}</div>}
                </div>
            </div>
        </div>
    )
})

ApplicationDetails.propTypes = {
    data: PropTypes.object.isRequired,
    loading: PropTypes.bool.isRequired,
    confirmDialog: PropTypes.shape({
        openConfirmDialog: PropTypes.bool.isRequired,
        handleOpenConfirmDialog: PropTypes.func.isRequired,
        handleCloseConfirmDialog: PropTypes.func.isRequired,
        handleSendConfirmDialog: PropTypes.func.isRequired
    })
}

export default ApplicationDetails
