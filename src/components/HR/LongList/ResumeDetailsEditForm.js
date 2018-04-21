import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import {compose, withState} from 'recompose'
import injectSheet from 'react-jss'
import LinearProgress from '../../LinearProgress'
import {Field, reduxForm, FieldArray} from 'redux-form'
import Edit from 'material-ui/svg-icons/image/edit'
import IconButton from 'material-ui/IconButton'
import FlatButton from 'material-ui/FlatButton'
import ResumeDetailsEditFo from './ResumeEducationFor'
import Delete from 'material-ui/svg-icons/action/delete'
import ToolTip from '../../ToolTip'
import {
    TextField,
    DateField,
    GenderSearchField,
    LanguageField,
    ComputerLevelSearchField,
    DriverLicenceCheck,
    CountrySearchField,
    MaritalStatusSearchField,
    SkillsTagSearchField,
    ExperiencesField,
    EducationsField
} from '../../ReduxForm'
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
                marginRight: '18px',
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
                fontSize: '13px !important',
                '& > div:first-child': {
                    height: '30px!important',
                    bottom: '0!important'
                }
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
                }
            }
        },
        license: {
            marginBottom: '10px',
            '& > div': {
                display: 'unset',
                '& h4': {
                    marginBottom: '10px'
                },
                '& > div': {
                    width: '340px !important'
                }
            }
        },
        pcSkills: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            '& > div': {
                width: '180px',
                marginTop: '0!important'
            }
        },
        expField: {
            '& > div > div:first-child': {
                padding: '0 0 10px 0',
                fontSize: '16px'
            },
            '& .exp-wrapper': {
                '& > div': {
                    alignItems: 'baseline'
                },
                '& > div:first-child > div': {
                    '&:first-child': {
                        width: '150px !important'
                    },
                    '&:nth-child(2)': {
                        width: '200px !important'
                    }
                }
            }
        },
        eduField: {
            '& > div > div:first-child': {
                padding: 0,
                fontSize: '16px'
            },
            '& .edu-wrapper': {
                '& > div': {
                    alignItems: 'baseline'
                },
                '& > div:nth-child(2) > div': {
                    '&:first-child': {
                        width: '150px !important'
                    },
                    '&:nth-child(2)': {
                        width: '200px !important'
                    }
                }
            }
        },
        bottomButton: {
            width: '100%',
            padding: '10px',
            borderTop: '1px solid #efefef',
            background: '#fff',
            textAlign: 'right',
            '& span': {
                fontSize: '13px !important',
                fontWeight: '600 !important',
                color: '#129fdd',
                verticalAlign: 'inherit !important'
            }
        }
    }),
    reduxForm({
        form: 'ResumeDetailsEditForm',
        enableReinitialize: true
    }),
    withState('openDetails', 'setOpenDetails', false),
    withState('experienceError', 'updateExperienceError', false),
    withState('educationError', 'updateEducationError', false),
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

const ResumeDetailsEditForm = enhance((props) => {
    const {classes,
        loading,
        data,
        confirmDialog,
        handleOpenUpdateDialog,
        handleCloseDetail,
        updateExperienceError,
        updateEducationError,
        editResumeDetails
    } = props

    // PERSONAL INFO
    const resumeId = _.get(data, ['id'])
    const fullName = _.get(data, ['fullName'])
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
                                        hintText={t('Дата рождения')}
                                        component={DateField}
                                        className={classes.inputDateCustom}
                                        errorStyle={{bottom: 2}}
                                        fullWidth={true}/>
                                </li>
                                <li>
                                    <Field
                                        name="sex"
                                        placeHolder={t('Пол')}
                                        component={GenderSearchField}
                                        className={classes.inputFieldCustom}
                                        removeNoMatter={true}
                                        fullWidth={true}/>
                                </li>
                                <li>
                                    <Field
                                        name="familyStatus"
                                        placeHolder={t('Семейное положение')}
                                        component={MaritalStatusSearchField}
                                        className={classes.inputFieldCustom}
                                        fullWidth={true}/>
                                </li>
                                <li>
                                    <Field
                                        name="phone"
                                        hintText={t('Телефонный номер')}
                                        component={TextField}
                                        className={classes.inputFieldCustom}
                                        style={{marginTop: '5px !important'}}
                                        fullWidth={true}/>
                                </li>
                                <li>
                                    <Field
                                        name="email"
                                        hintText={t('Email адрес')}
                                        component={TextField}
                                        className={classes.inputFieldCustom}
                                        fullWidth={true}/>
                                </li>
                                <li>
                                    <Field
                                        name="country"
                                        placeHolder={t('Страна проживания')}
                                        component={CountrySearchField}
                                        className={classes.inputFieldCustom}
                                        fullWidth={true}/>
                                </li>
                                <li>
                                    <Field
                                        name="address"
                                        hintText={t('Адрес проживания')}
                                        component={TextField}
                                        className={classes.inputFieldCustom}
                                        fullWidth={true}/>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className={classes.innerBlock}>
                        <div className={classes.bodyTitle}>{t('Навыки и умения')}</div>
                        <div className={classes.skills}>
                            <Field
                                name="skills"
                                component={SkillsTagSearchField}
                                className={classes.inputFieldCustom}
                                label={t('Профессиональные навыки')}
                                fullWidth={true}/>
                        </div>
                    </div>
                    <div className={classes.innerBlock}>
                        <FieldArray
                            name="languagesLevel"
                            component={LanguageField}
                        />
                    </div>
                    <div className={classes.innerBlock}>
                        <div className={classes.bodyTitle}>{t('Дополнительная информация')}</div>
                        <div className={classes.info} style={{display: 'unset'}}>
                            <div className={classes.license}>
                                <Field
                                name="driverLicense"
                                component={DriverLicenceCheck}/>
                            </div>
                            <div className={classes.pcSkills}>
                                <span>{t('Уровень владения ПК')}:</span>
                                <Field
                                    name="levelPc"
                                    component={ComputerLevelSearchField}
                                    className={classes.inputFieldCustom}
                                    placeHolder={t('Уровень владения ПК')}
                                    fullWidth={true}/>
                            </div>
                        </div>
                    </div>
                    <div className={classes.innerBlock}>
                        <div className={classes.bodyTitle}>{t('Интересы и хобби')}</div>
                        <Field
                            name="hobby"
                            hintText={t('...')}
                            component={TextField}
                            className={classes.inputFieldCustom}
                            fullWidth={true}/>
                    </div>
                </div>
                <div className={classes.block}>
                    <div className={classes.innerBlock}>
                        <div className={classes.expField}>
                            <FieldArray
                                name="experiences"
                                component={ExperiencesField}
                                initialValues={{organization: 'HELLO'}}
                                updateExperienceError={updateExperienceError}
                                />
                        </div>
                    </div>
                    <div className={classes.innerBlock}>
                        <div className={classes.eduField}>
                            <ResumeDetailsEditFo>
                                <FieldArray
                                    name="educations"
                                    component={EducationsField}
                                    updateEducationError={updateEducationError}
                                />
                            </ResumeDetailsEditFo>
                        </div>
                    </div>
                </div>
            </div>
            <div className={classes.bottomButton}>
                <FlatButton
                    label={t('Отменить')}
                    labelStyle={{fontSize: '13px', color: 'rgb(255, 64, 129)'}}
                    onTouchTap={() => editResumeDetails.handleClose() }/>
                <FlatButton
                    label={t('Сохранить')}
                    labelStyle={{fontSize: '13px'}}
                    onTouchTap={() => editResumeDetails.handleSubmit() }
                    primary={true}/>
            </div>
        </div>
    )
})

ResumeDetailsEditForm.propTypes = {
    editResumeDetails: PropTypes.object.isRequired
}

export default ResumeDetailsEditForm
