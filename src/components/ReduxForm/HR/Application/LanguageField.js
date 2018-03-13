import React from 'react'
import {compose} from 'recompose'
import injectSheet from 'react-jss'
import {Field} from 'redux-form'
import t from '../../../../helpers/translate'
import {TextField} from '../../../ReduxForm'
import LanguageLevelSearchField from './LanguageLevelSearchField'
import ContentRemove from 'material-ui/svg-icons/content/remove-circle-outline'
import IconButton from 'material-ui/IconButton'

const enhance = compose(
    injectSheet({
        salaryWrapper: {
            position: 'relative',
            paddingBottom: '36px',
            zIndex: '2'
        },
        usersLoader: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%'
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
        subTitle: {
            paddingTop: '10px'
        },
        flex: {
            display: 'flex',
            '& > div': {
                marginRight: '10px',
                width: '100% !important'
            }
        },
        detail: {
            display: 'flex',
            alignItems: 'center',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            '& > div:first-child': {
                width: 'calc(100% - 40px)'
            }
        },
        addAnother: {
            width: '100%',
            margin: '10px 0',
            position: 'absolute',
            bottom: '0',
            zIndex: '5',
            '& a': {
                fontWeight: '600'
            }
        }
    })
)

const iconStyle = {
    icon: {
        color: '#666',
        width: 22,
        height: 22
    },
    button: {
        width: 40,
        height: 40,
        padding: 9
    }
}

const LanguageField = enhance((props) => {
    const {
        fields,
        classes
    } = props

    const handleTouchTap = (index, addAnother) => {
        if (addAnother) {
            return fields.push({})
        }
        return fields.remove(index)
    }

    const details = fields.map((detail, index) => {
        return (
            <div key={index} className={classes.detail}>
                <div>
                    <div className={classes.flex}>
                        <Field
                            hintText={t('Язык')}
                            name={`${detail}.name`}
                            component={TextField}
                            className={classes.inputFieldCustom}/>
                        <Field
                            label={t('Уровень')}
                            name={`${detail}.level`}
                            component={LanguageLevelSearchField}
                            className={classes.inputFieldCustom}/>
                    </div>
                </div>
                <IconButton
                    onTouchTap={() => handleTouchTap(index, false)}
                    disableTouchRipple={true}
                    iconStyle={iconStyle.icon}
                    style={iconStyle.button}>
                    <ContentRemove/>
                </IconButton>
            </div>
        )
    })

    return (
        <div className={classes.salaryWrapper}>
            <div className={classes.subTitle}>{t('Знание языков')}</div>
            {details}
            <div className={classes.addAnother}>
                <a onClick={() => handleTouchTap(null, true)}>{t('Добавить язык')}</a>
            </div>
        </div>
    )
})

export default LanguageField
