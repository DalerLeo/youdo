import React from 'react'
import {compose} from 'recompose'
import injectSheet from 'react-jss'
import {Field} from 'redux-form'
import t from '../../../../helpers/translate'
import ContentRemove from 'material-ui/svg-icons/content/remove-circle-outline'
import IconButton from 'material-ui/IconButton'
import TextField from '../../Basic/TextField'

const enhance = compose(
    injectSheet({
        wrapper: {
            margin: '15px -30px 0',
            padding: '15px 30px 0',
            borderTop: '1px #e0e0e0 solid',
            position: 'relative',
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
        textFieldArea: {
            top: '-5px !important',
            lineHeight: '20px !important',
            fontSize: '13px !important'
        },
        subTitle: {
            fontWeight: '600'
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
            alignItems: 'flex-end',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            marginTop: '10px',
            '&:first-child': {
                marginTop: '0'
            },
            '& > div:first-child': {
                width: 'calc(100% - 40px)'
            }
        },
        addAnother: {
            width: '100%',
            margin: '5px 0 0',
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

const ResumeNewQuestionsField = enhance((props) => {
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
                    <Field
                        label={t('Вопрос')}
                        name={`${detail}.question`}
                        component={TextField}
                        className={classes.inputFieldCustom}
                        fullWidth={true}/>
                    <Field
                        label={t('Ответ')}
                        name={`${detail}.answer`}
                        component={TextField}
                        className={classes.textFieldArea}
                        multiLine
                        rows={1}
                        rowsMax={4}
                        fullWidth/>
                </div>
                <IconButton
                    onTouchTap={() => handleTouchTap(index, false)}
                    iconStyle={iconStyle.icon}
                    style={iconStyle.button}>
                    <ContentRemove/>
                </IconButton>
            </div>
        )
    })

    return (
        <div className={classes.wrapper}>
            {details}
            <div className={classes.addAnother}>
                <a onClick={() => handleTouchTap(null, true)}>{t('Добавить вопрос')}</a>
            </div>
        </div>
    )
})

export default ResumeNewQuestionsField
