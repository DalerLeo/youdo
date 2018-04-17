import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import {compose, withState} from 'recompose'
import injectSheet from 'react-jss'
import LinearProgress from '../../LinearProgress'
import {Field, reduxForm} from 'redux-form'
import Edit from 'material-ui/svg-icons/image/edit'
import IconButton from 'material-ui/IconButton'
import Delete from 'material-ui/svg-icons/action/delete'
import ToolTip from '../../ToolTip'
import {TextField, DateField, GenderSearchField, LanguageField, CountrySearchField, MaritalStatusSearchField} from '../../ReduxForm'
import dateFormat from '../../../helpers/dateFormat'
import {genderFormat} from '../../../constants/gender'
import t from '../../../helpers/translate'
import {
    PADDING_STANDART,
    BORDER_STYLE
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
        innerBlock: {
            marginBottom: '20px',
            paddingBottom: '20px',
            borderBottom: BORDER_STYLE,
            '&:last-child': {
                marginBottom: '0',
                paddingBottom: '0',
                borderBottom: 'none'
            }
        },
        info: {
            display: 'flex',
            '& > ul': {
                marginRight: '40px',
                lineHeight: '22px',
                minWidth: '160px',
                '&:last-child': {
                    margin: '0'
                },
                '& > li': {
                    height: '45px'
                }
            }
        },
        flexBetween: {
            display: 'flex',
            justifyContent: 'space-between',
            flexWrap: 'wrap'
        },
        skills: {
            display: 'flex',
            flexWrap: 'wrap'
        },
        skill: {
            margin: '0 8px 8px 0',
            padding: '3px 10px',
            background: '#e8e8e8'
        },
        lang: {
            listStyle: 'disc inside',
            lineHeight: '25px'
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
            zIndex: '2'
        },
        lowercase: {
            textTransform: 'lowercase'
        },
        bodyTitle: {
            fontSize: '16px',
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
            marginBottom: '25px',
            '&:last-child': {
                marginBottom: '0'
            }
        },
        condition: {
            marginBottom: '10px',
            '&:last-child': {
                marginBottom: '0'
            },
            '& h3': {
                fontSize: '15px',
                fontWeight: '600'
            },
            '& h4': {
                fontWeight: '600'
            }
        },
        overflowText: {
            display: '-webkit-box',
            WebkitLineClamp: '3',
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
        },
        inputFieldCustom: {
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
        inputDateCustom: {
            fontSize: '13px !important',
            height: '45px !important',
            marginTop: '7px',
            '& > div:first-child': {
                fontSize: '13px !important'
            },
            '& label': {
                top: '20px !important',
                lineHeight: '5px !important'
            },
            '& input': {
                marginTop: '0 !important'
            },
            '& div:first-child': {
                height: '45px !important'
            },
            '& hr': {
                bottom: '3px!important'
            }
        },
        label: {
            '& li': {
                display: 'flex',
                alignItems: 'flex-end',
                '& > div': {
                    marginTop: '0!important'
                }
            }
        },
        fields: {
            '& li': {
                '& > div': {
                 //   marginTop: '0!important'
                }
            }
        }
    }),
    reduxForm({
        form: 'ResumeDetailsEditForm',
        enableReinitialize: true
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

const ResumeDetailsEditForm = enhance((props) => {
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
    const country = _.get(data, ['country', 'name'])
    const city = _.get(data, ['city', 'name'])

    const experiences = _.get(data, 'experiences')
    const educations = _.get(data, 'educations')

    const languagesLevel = _.get(data, 'languages')
    const levelPc = _.get(data, 'levelPc')
    const hobby = _.get(data, 'hobby') || t('Не указано')
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

    const skills = _.isEmpty(_.get(data, 'skills'))
        ? <span> {t('Не указаны')}</span>
        : _.map(_.get(data, 'skills'), (item) => {
            const id = _.get(item, 'id')
            const name = _.get(item, 'name')
            return (
                <span key={id} className={classes.skill}>{name}</span>
            )
        })

    return (
        <div className={classes.wrapper} key={_.get(data, 'id')}>
            <div className={classes.title}>
                <div className={classes.titleLabel}>{fullName}</div>
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
                    <div className={classes.innerBlock}>
                        <div className={classes.bodyTitle}>{t('Личные данные')}</div>
                        <div className={classes.info}>
                            <ul className={classes.label}>
                                <li>{t('Дата рождения')}:</li>
                                <li style={{marginTop: '5px'}}>{t('Пол')}:</li>
                                <li style={{marginTop: '5px'}}>{t('Семейное положение')}:</li>
                                <li>{t('Телефон')}:</li>
                                <li>{t('Email')}:</li>
                                <li style={{marginTop: '5px'}}>{t('Страна проживания')}:</li>
                                <li>{t('Адрес')}:</li>
                            </ul>
                            <ul className={classes.fields}>
                                <li>
                                    <Field
                                        name="dateOfBirth"
                                        label={t('Дата рождения')}
                                        component={DateField}
                                        className={classes.inputDateCustom}
                                        errorStyle={{bottom: 2}}
                                        fullWidth={true}/>
                                </li>
                                <li>
                                    <Field
                                        name="sex"
                                        label={t('Пол')}
                                        component={GenderSearchField}
                                        className={classes.inputFieldCustom}
                                        removeNoMatter={true}
                                        fullWidth={true}/>
                                </li>
                                <li>
                                    <Field
                                        name="familyStatus"
                                        label={t('Семейное положение')}
                                        component={MaritalStatusSearchField}
                                        className={classes.inputFieldCustom}
                                        fullWidth={true}/>
                                </li>
                                <li>
                                    <Field
                                        name="phone"
                                        label={t('Телефонный номер')}
                                        component={TextField}
                                        className={classes.inputFieldCustom}
                                        style={{marginTop: '5px !important'}}
                                        fullWidth={true}/>
                                </li>
                                <li>
                                    <Field
                                        name="email"
                                        label={t('Email адрес')}
                                        component={TextField}
                                        className={classes.inputFieldCustom}
                                        fullWidth={true}/>
                                </li>
                                <li>
                                    <Field
                                        name="country"
                                        label={t('Страна проживания')}
                                        component={CountrySearchField}
                                        className={classes.inputFieldCustom}
                                        fullWidth={true}/>
                                </li>
                                <li>
                                    <Field
                                        name="address"
                                        label={t('Адрес проживания')}
                                        component={TextField}
                                        className={classes.inputFieldCustom}
                                        fullWidth={true}/>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className={classes.innerBlock}>
                        <div className={classes.bodyTitle}>{t('Навыки и умения')}</div>
                        <div className={classes.skills}>{skills}</div>
                    </div>
                    <div className={classes.innerBlock}>
                        <div className={classes.bodyTitle}>{t('Знание языков')}</div>
                        <ul>
                            {_.map(languagesLevel, (item) => {
                                const id = _.get(item, ['id'])
                                const name = _.get(item, ['language', 'name'])
                                const level = _.get(item, ['level', 'name'])
                                return <li key={id} className={classes.lang}>{name} {level && <span className={classes.lowercase}>({level})</span>}</li>
                            })}
                        </ul>
                    </div>
                    <div className={classes.innerBlock}>
                        <div className={classes.bodyTitle}>{t('Дополнительная информация')}</div>
                        <div className={classes.info}>
                            <ul>
                                <li>{t('Водительские права')}:</li>
                                <li>{t('Уровень владения ПК')}:</li>
                            </ul>
                            <ul>
                                <li>{driverLicense}</li>
                                <li>{levelPc}</li>
                            </ul>
                        </div>
                    </div>
                    <div className={classes.innerBlock}>
                        <div className={classes.bodyTitle}>{t('Интересы и хобби')}</div>
                        <div>{hobby}</div>
                    </div>
                </div>
                <div className={classes.block}>
                    <div className={classes.innerBlock}>
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
                                        <div className={classes.condition}>
                                            <h3>{expPosition}</h3>
                                        </div>
                                        <div className={classes.condition}>
                                            <h4>{organization}</h4>
                                        </div>
                                        <div className={classes.condition}>
                                            <div>{t('Период')}: {workStart} - {workEnd}</div>
                                        </div>
                                        <div className={classes.condition}>
                                            <h4>{t('Должностные обязанности')}</h4>
                                            <div className={classes.overflowText}>{responsibility}</div>
                                        </div>
                                    </div>
                                )
                            })}
                    </div>
                    <div className={classes.innerBlock}>
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
                                    <div key={index} className={classes.experience}>
                                        <div className={classes.condition}>
                                            <h4>{t('Учебное заведение')}</h4>
                                            <div>{institution}</div>
                                        </div>
                                        <div className={classes.condition}>
                                            <h4>{t('Специальность')}</h4>
                                            <div>{speciality}</div>
                                        </div>
                                        <div className={classes.condition}>
                                            <div>{t('Период')}: {studyStart} - {studyEnd}</div>
                                        </div>
                                        <div className={classes.condition}>
                                            <h4>{t('Страна обучения')}</h4>
                                            <div>{eduCountry}, {eduCity}</div>
                                        </div>
                                    </div>
                                )
                            })}
                    </div>
                </div>
            </div>
        </div>
    )
})

ResumeDetailsEditForm.propTypes = {
    data: PropTypes.object.isRequired,
    loading: PropTypes.bool.isRequired,
    confirmDialog: PropTypes.shape({
        openConfirmDialog: PropTypes.bool.isRequired,
        handleOpenConfirmDialog: PropTypes.func.isRequired,
        handleCloseConfirmDialog: PropTypes.func.isRequired,
        handleSendConfirmDialog: PropTypes.func.isRequired
    })
}

export default ResumeDetailsEditForm
