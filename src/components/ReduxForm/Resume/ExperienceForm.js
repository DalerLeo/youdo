import _ from 'lodash'
import React from 'react'
import {compose} from 'recompose'
import injectSheet from 'react-jss'
import LinearProgress from '../../LinearProgress/index'
import t from '../../../helpers/translate'
import {reduxForm} from 'redux-form'
import {
  PADDING_STANDART,
  BORDER_STYLE
} from '../../../constants/styleConstants'

const validate = values => {
  const formNames = [
    'workStart',
    'organization',
    'position',
    'responsibility'
  ]
  const errors = {}
  const experienceArrayErrors = []
  const initialValues = _.isEmpty(values) ? {experiences: [{}]} : values
  const getError = (field, experience, index, experienceErrors) => {
    if (!_.get(experience, field)) {
      experienceErrors[field] = t('Обязательное поле')
      experienceArrayErrors[index] = experienceErrors
    }
  }
  _.forEach(_.get(initialValues, 'experiences'), (exp, index) => {
    const experienceErrors = {}
    _.map(formNames, (item) => {
      getError(item, exp, index, experienceErrors)
    })
  })
  errors.experiences = experienceArrayErrors
  return errors
}
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
    form: 'ResumeExperienceForm',
    enableReinitialize: true,
    validate
  }),
)

const ResumeEducationForm = enhance((props) => {
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

  return props.children
})

export default ResumeEducationForm
