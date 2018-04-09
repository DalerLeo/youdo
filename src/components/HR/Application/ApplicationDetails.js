import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import {compose, withState} from 'recompose'
import injectSheet from 'react-jss'
import LinearProgress from '../../LinearProgress'
import Edit from 'material-ui/svg-icons/image/edit'
import IconButton from 'material-ui/IconButton'
import IconMenu from 'material-ui/IconMenu'
import MenuItem from 'material-ui/MenuItem'
import Delete from 'material-ui/svg-icons/action/delete'
import MoreIcon from 'material-ui/svg-icons/navigation/more-vert'
import dateFormat from '../../../helpers/dateFormat'
import numberFormat from '../../../helpers/numberFormat'
import {getYearText} from '../../../helpers/hrcHelpers'
import t from '../../../helpers/translate'
import {
    PADDING_STANDART,
    BORDER_STYLE,
    COLOR_GREY_LIGHTEN,
    COLOR_GREY
} from '../../../constants/styleConstants'
import {SUM_CURRENCY} from '../../../constants/backendConstants'

const colorBlue = '#12aaeb !important'
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
                color: colorBlue
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
        container: {
            display: 'flex',
            justifyContent: 'space-between',
            width: '100%',
            '& > div': {
                width: '50%'
            }
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
            fontSize: '14px',
            fontWeight: '600',
            margin: '0 10px'
        },
        bodyTitle: {
            fontWeight: '600',
            marginBottom: '10px'
        },
        closeDetail: {
            position: 'absolute',
            left: '0',
            top: '0',
            right: '0',
            bottom: '0',
            cursor: 'pointer',
            zIndex: '1'
        }
    }),
    withState('openDetails', 'setOpenDetails', false)
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
withState('openDetails', 'setOpenDetails', false)

const ApplicationDetails = enhance((props) => {
    const {classes,
        loading,
        data,
        confirmDialog,
        handleOpenUpdateDialog,
        handleCloseDetail
    } = props

    const applicationId = _.get(data, 'id')
    const ageMin = _.toNumber(_.get(data, 'ageMin'))
    const ageMax = _.toNumber(_.get(data, 'ageMax'))
    const businessTrip = _.get(data, 'businessTrip') ? t('Да') : t('Нет')
    const client = _.get(data, ['contact', 'client', 'name'])
    const contact = _.get(data, ['contact', 'name'])
    const email = _.get(data, ['contact', 'email']) || t('Не указан')
    const phone = _.get(data, ['contact', 'telephone']) || t('Не указан')
    const address = _.get(data, ['contact', 'address']) || t('Не указан')
    const deadline = dateFormat(_.get(data, 'deadline'))
    const education = _.get(data, 'education')
    const experience = _.toNumber(_.get(data, 'experience'))
    const levelPc = _.get(data, 'levelPc')
    const workSchedule = _.get(data, 'mode')
    const planningDate = dateFormat(_.get(data, 'planningDate'))
    const position = _.get(data, ['position', 'name'])
    const privileges = _.get(data, 'privileges')
    const realSalaryMin = numberFormat(_.get(data, 'realSalaryMin'))
    const realSalaryMax = numberFormat(_.get(data, 'realSalaryMax'))
    const recruiter = _.get(data, ['recruiter'])
        ? _.get(data, ['recruiter', 'firstName']) + ' ' + _.get(data, ['recruiter', 'secondName'])
        : t('Не назначен')
    const responsibility = _.get(data, 'responsibility')
    const sex = _.get(data, 'sex')
    const skills = _.get(data, 'skills')
    const languages = _.get(data, 'languages')
    const trialSalaryMin = numberFormat(_.get(data, 'trialSalaryMin'))
    const trialSalaryMax = numberFormat(_.get(data, 'trialSalaryMax'))

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
                    <div className={classes.titleExtra}>{t('Дэдлайн')}: {deadline}</div>
                    <div className={classes.titleExtra}>{t('Рекрутер')}: {recruiter}</div>

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
            <div className={classes.companyInfo}>
                <div className={classes.block}>
                    <div className={classes.bodyTitle}>{t('Описание компании')}</div>
                    <div className={classes.info + ' ' + classes.flexBetween}>
                        <div>{t('Клиент')}: <strong>{client}</strong></div>
                        <div>{t('Контактное лицо')}: <strong>{contact}</strong></div>
                        <div>{t('Телефон')}: <strong>{phone}</strong></div>
                        <div>{t('Адрес')}: <strong>{address}</strong></div>
                        <div>{t('Email')}: <strong>{email}</strong></div>
                    </div>
                </div>
            </div>
            <div className={classes.container}>
                <div className={classes.block}>
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
                </div>
                <div className={classes.block}>
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
