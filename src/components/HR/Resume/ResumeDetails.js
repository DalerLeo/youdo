import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import {compose, withState} from 'recompose'
import injectSheet from 'react-jss'
import LinearProgress from '../../LinearProgress'
import Edit from 'material-ui/svg-icons/image/edit'
import IconButton from 'material-ui/IconButton'
import Delete from 'material-ui/svg-icons/action/delete'
import ToolTip from '../../ToolTip'
import dateFormat from '../../../helpers/dateFormat'
import {genderFormat} from '../../../constants/gender'
import t from '../../../helpers/translate'
import {
    PADDING_STANDART,
    BORDER_STYLE,
    COLOR_GREY_LIGHTEN
} from '../../../constants/styleConstants'

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
            marginLeft: '10px',
            color: '#999'
        },
        container: {
            display: 'flex',
            justifyContent: 'space-between',
            borderBottom: BORDER_STYLE,
            width: '100%',
            '&:last-child': {
                borderBottom: 'none'
            },
            '& > div': {
                borderLeft: BORDER_STYLE,
                width: '50%',
                '&:first-child': {
                    borderLeft: 'none'
                }
            }
        },
        containerBlock: {
            extend: 'container',
            display: 'block',
            '& > div': {
                border: 'none',
                width: '100%'
            }
        },
        block: {
            padding: PADDING_STANDART
        },
        info: {
            '& > div': {
                marginBottom: '10px',
                lineHeight: '1.5',
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
            '& strong': {
                color: COLOR_GREY_LIGHTEN
            },
            '&:after': {
                content: '","'
            },
            '&:last-child:after': {
                display: 'none'
            }
        },
        titleLabel: {
            fontSize: '18px',
            color: '#333',
            fontWeight: '600',
            cursor: 'pointer'
        },
        titleButtons: {
            display: 'flex',
            justifyContent: 'flex-end'
        },
        lowercase: {
            textTransform: 'lowercase'
        },
        bodyTitle: {
            fontSize: '14px',
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
        },
        experience: {
            display: 'flex',
            marginBottom: '15px',
            paddingBottom: '15px',
            borderBottom: BORDER_STYLE,
            '&:last-child': {
                padding: '0',
                margin: '0',
                border: 'none'
            }
        },
        expDates: {
            width: '250px'
        },
        expInfo: {
            width: 'calc(100% - 250px)'
        },
        expOrganization: {
            fontWeight: '600',
            marginBottom: '10px',
            '& strong': {
                color: COLOR_GREY_LIGHTEN,
                marginRight: '5px',
                '&:after': {
                    content: '":"'
                }
            }
        },
        expResponsibility: {
            '& h4': {
                fontWeight: '600',
                marginBottom: '5px'
            }
        },
        education: {extend: 'experience'},
        eduDates: {extend: 'expDates'},
        eduInfo: {extend: 'expInfo'},
        eduInstitution: {extend: 'expOrganization'},
        eduSpeciality: {extend: 'expResponsibility'}
    }),
    withState('openDetails', 'setOpenDetails', false)
)

const iconStyle = {
    icon: {
        color: '#666',
        width: 20,
        height: 20
    },
    button: {
        width: 48,
        height: 48,
        padding: 0
    }
}
withState('openDetails', 'setOpenDetails', false)

const familyStatusText = (gender, status) => {
    if (gender === 'male') {
        switch (status) {
            case 'single': return t('Не женат')
            case 'married': return t('Женат')
            default: return t('Не указано')
        }
    }
    if (gender === 'female') {
        switch (status) {
            case 'single': return t('Не замужем')
            case 'married': return t('Замужем')
            default: return t('Не указано')
        }
    }
    return t('Не указано')
}

const ResumeDetails = enhance((props) => {
    const {classes,
        loading,
        data,
        confirmDialog,
        handleOpenUpdateDialog,
        handleCloseDetail
    } = props

    // PERSONAL INFO
    const resumeId = _.get(data, ['id'])
    const fullName = _.get(data, ['fullName'])
    const address = _.get(data, ['address'])
    const sex = _.get(data, ['sex'])
    const dateOfBirth = dateFormat(_.get(data, ['dateOfBirth']))
    const phone = _.get(data, ['phone'])
    const email = _.get(data, ['email'])
    const familyStatus = _.get(data, ['familyStatus'])
    const position = _.get(data, ['position', 'name'])
    const country = _.get(data, ['country', 'name'])
    const city = _.get(data, ['city', 'name'])

    const experiences = _.get(data, 'experiences')
    const educations = _.get(data, 'educations')

    const languagesLevel = _.get(data, 'languages')
    const hobby = _.get(data, 'hobby') || t('Не указан')
    const driverLicense = _.join(_.map(_.get(data, 'driverLicense'), item => {
        return _.get(item, 'name')
    }), ', ') || t('нет водительских прав')

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
                <div className={classes.titleLabel}>{fullName}<span className={classes.createdDate}>({position})</span></div>
                <div className={classes.closeDetail} onClick={handleCloseDetail}/>
                <div className={classes.titleButtons}>
                    <ToolTip position="bottom" text={t('Изменить')}>
                        <IconButton
                            iconStyle={iconStyle.icon}
                            style={iconStyle.button}
                            touch={true}
                            onTouchTap={() => { handleOpenUpdateDialog(resumeId) }}>
                            <Edit />
                        </IconButton>
                    </ToolTip>
                    <ToolTip position="bottom" text={t('Удалить')}>
                        <IconButton
                            iconStyle={iconStyle.icon}
                            style={iconStyle.button}
                            touch={true}
                            onTouchTap={() => { confirmDialog.handleOpenConfirmDialog(resumeId) }}>
                            <Delete />
                        </IconButton>
                    </ToolTip>
                </div>
            </div>
            <div className={classes.container}>
                <div className={classes.block}>
                    <div className={classes.bodyTitle}>{t('Личные данные')}</div>
                    <div className={classes.info}>
                        <div>{t('Дата рождения')}: <strong>{dateOfBirth}</strong></div>
                        <div>{t('Пол')}: <strong className={classes.lowercase}>{genderFormat[sex]}</strong></div>
                        <div>{t('Семейное положение')}: <strong className={classes.lowercase}>{familyStatusText(sex, familyStatus)}</strong></div>
                        <div>{t('Адрес')}: <strong>{address}</strong></div>
                        <div>{t('Телефон')}: <strong>{phone}</strong></div>
                        <div>{t('Email')}: <strong>{email}</strong></div>
                        <div>{t('Страна проживания')}: {(country && city) ? <strong>{country}, {city}</strong> : <strong>{t('Не указана')}</strong>}</div>
                    </div>
                </div>
                <div className={classes.block}>
                    <div className={classes.bodyTitle}>{t('Навыки и умения')}</div>
                    <div className={classes.info}>
                        <div>{t('Знание языков')}:
                            {_.map(languagesLevel, (item) => {
                                const id = _.get(item, ['id'])
                                const name = _.get(item, ['language', 'name'])
                                const level = _.get(item, ['level', 'name'])
                                return <span key={id} className={classes.skill}>{name} <strong className={classes.lowercase}>{level && <span>({level})</span>}</strong></span>
                            })}
                        </div>
                        <div>{t('Водительские права')}: <strong>{driverLicense}</strong></div>
                        <div>{t('Уровень владения ПК')}: <strong>{}</strong></div>
                        <div>{t('Интересы и хобби')}: <strong>{hobby}</strong></div>
                    </div>
                </div>
            </div>
            <div className={classes.containerBlock}>
                <div className={classes.block}>
                    <div className={classes.bodyTitle}>{t('Опыт работы')}</div>
                    {_.isEmpty(experiences)
                        ? t('Нет опыта работы')
                        : _.map(experiences, (item, index) => {
                            const workStart = dateFormat(_.get(item, 'workStart'))
                            const workTillNow = _.get(item, 'workTillNow')
                            const workEnd = workTillNow
                                ? t('По сегодняшний день')
                                : dateFormat(_.get(item, 'workEnd'))
                            const organization = _.get(item, 'organization')
                            const expPosition = _.get(item, ['position', 'name'])
                            const responsibility = _.get(item, 'responsibility')
                            return (
                                <div key={index} className={classes.experience}>
                                    <div className={classes.expDates}>{workStart} - {workEnd}</div>
                                    <div className={classes.expInfo}>
                                        <div className={classes.expOrganization}>
                                            <strong>{t('Организация')}</strong>{organization}</div>
                                        <div className={classes.expResponsibility}>
                                            <h4>{expPosition}</h4>
                                            <div>{responsibility}</div>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                </div>
            </div>
            <div className={classes.containerBlock}>
                <div className={classes.block}>
                    <div className={classes.bodyTitle}>{t('Образование')}</div>
                    {_.isEmpty(educations)
                        ? t('Нет образования')
                        : _.map(educations, (item, index) => {
                            const studyStart = dateFormat(_.get(item, 'studyStart'))
                            const studyTillNow = _.get(item, 'studyTillNow')
                            const studyEnd = studyTillNow
                                ? t('По сегодняшний день')
                                : dateFormat(_.get(item, 'studyEnd'))
                            const institution = _.get(item, 'institution')
                            const speciality = _.get(item, 'speciality')
                            const eduCountry = _.get(item, ['country', 'name'])
                            const eduCity = _.get(item, ['city', 'name'])
                            return (
                                <div key={index} className={classes.education}>
                                    <div className={classes.eduDates}>{studyStart} - {studyEnd}</div>
                                    <div className={classes.eduInfo}>
                                        <div className={classes.eduInstitution}><strong>{t('Учебное заведение')}</strong>{institution}</div>
                                        <div className={classes.eduSpeciality}>
                                            <h4>{speciality}</h4>
                                            <div>{eduCountry}, {eduCity}</div>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                </div>
            </div>
        </div>
    )
})

ResumeDetails.propTypes = {
    data: PropTypes.object.isRequired,
    loading: PropTypes.bool.isRequired,
    confirmDialog: PropTypes.shape({
        openConfirmDialog: PropTypes.bool.isRequired,
        handleOpenConfirmDialog: PropTypes.func.isRequired,
        handleCloseConfirmDialog: PropTypes.func.isRequired,
        handleSendConfirmDialog: PropTypes.func.isRequired
    })
}

export default ResumeDetails
