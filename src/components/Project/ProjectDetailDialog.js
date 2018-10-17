import React from 'react'
import PropTypes from 'prop-types'
import {compose} from 'recompose'
import injectSheet from 'react-jss'
import Dialog from 'material-ui/Dialog'
import {Field, reduxForm} from 'redux-form'
import CloseIcon from 'material-ui/svg-icons/navigation/close'
import DeadlineIcon from 'material-ui/svg-icons/notification/event-note'
import IconButton from 'material-ui/IconButton'
import {DateCustomField} from 'components/ReduxForm'

import _ from 'lodash'
import {
  BORDER_STYLE,
  COLOR_WHITE,
  COLOR_DEFAULT
} from '../../constants/styleConstants'
import Loader from '../Loader'
import {Editor, TextFieldInlineEdit, UsersSearchInlineField} from '../ReduxForm'
import dateFormat from '../../helpers/dateFormat'
import FlatButton from 'material-ui/FlatButton'
import EmptyQuery from 'components/Utils/EmptyQuery'
import Loading from 'components/Utils/Loading'
import {LINK_COLOR} from 'constants/styleConstants'

const enhance = compose(
  injectSheet({
    dialog: {
      overflowY: 'auto',
      paddingTop: '0 !important'
    },
    loader: {
      position: 'absolute',
      width: '100%',
      height: '100%',
      background: COLOR_WHITE,
      top: '0',
      left: '0',
      alignItems: 'center',
      zIndex: '999',
      justifyContent: 'center',
      display: ({loading}) => loading ? 'flex' : 'none'
    },
    customLoader: {
      background: COLOR_WHITE,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px 0'
    },
    popUp: {
      color: '#333 !important',
      overflowY: 'unset !important',
      overflowX: 'unset !important',
      fontSize: '13px !important',
      position: 'relative',
      padding: '0 !important',
      height: '100%',
      maxHeight: 'none !important',
      marginBottom: '64px'
    },
    titleContent: {
      background: COLOR_WHITE,
      color: COLOR_DEFAULT,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderBottom: BORDER_STYLE,
      padding: '0 10px 0 30px',
      height: '60px',
      zIndex: '999',
      '& > div': {
        display: 'flex',
        width: '80%',
        alignItems: 'center'

      }
    },
    img: {
      width: '30px',
      height: '30px',
      background: '#efefef',
      borderRadius: '50%'
    },
    response: {
      '& $img': {
        marginRight: '10px'
      },
      width: '200px',
      display: 'flex',
      alignItems: 'center',
      '& > div': {
        width: 'calc(100% - 30px)'
      }
    },
    deadline: {
      marginLeft: '40px',
      display: 'flex',
      alignItems: 'center'
    },
    proTitle: {
      borderBottom: '1px solid #efefef',
      paddingBottom: '10px',
      display: 'flex',
      flexDirection: 'column',
      '& > span': {
        fontSize: '14px',
        fontWeight: '500',
        color: '#777'
      }
    },
    commentWrap: {
      display: 'flex',
      padding: '12px 0',
      '& > div': {
        marginLeft: '8px'
      }
    },
    commentName: {
      fontWeight: '600'
    },
    commentDate: {
      marginLeft: '7px',
      color: '#9ca6af',
      fontWeight: '600',
      fontSize: '12px'
    },
    commentBody: {
      marginTop: '5px'
    },
    commentFile: {
      cursor: 'pointer',
      color: LINK_COLOR,
      fontSize: '12px',
      fontWeight: '600',
      marginTop: '3px'
    },
    bottomButton: {
      bottom: '0',
      left: '0',
      right: '0',
      padding: '10px',
      zIndex: '999',
      borderTop: BORDER_STYLE,
      background: COLOR_WHITE,
      textAlign: 'right',
      '& span': {
        fontSize: '13px !important',
        fontWeight: '600 !important',
        color: '#129fdd',
        verticalAlign: 'inherit !important'
      }
    },
    actionButton: {
      fontSize: '13px !important',
      margin: '0 !important',
      position: 'absolute!important',
      right: '15px',
      top: '5px'
    },
    commentField: {
      display: 'flex',
      padding: '15px 30px 30px',
      margin: '10px -30px -30px',
      background: '#f6f8f9',
      '& > div': {
        width: 'calc(100% - 10px)',
        marginLeft: '10px'
      }
    }
  }),
  reduxForm({
    form: 'ProjectDetailForm',
    enableReinitialize: true
  })
)
const icon = {
  color: '#888',
  width: 30,
  height: 30,
  marginRight: '8px'
}

const ProjectDetailDialog = enhance((props) => {
  const {
    open,
    handleSubmit,
    onClose,
    classes,
    detailData,
    loading
  } = props

  const formNames = [
    'manager',
    'salesAmount',
    'comment'
  ]
  const onComment = handleSubmit(() => props.onComment(formNames))
  const onSubmit = handleSubmit(() => props.onSubmit(formNames))

  const title = _.get(detailData, 'data.project.title')
  const pId = _.get(detailData, 'data.project.id')

  const comment = _.get(detailData, 'comment')
  const commentLoading = _.get(detailData, 'commentLoading')
  return (
    <Dialog
      modal={true}
      open={open}
      onRequestClose={onClose}
      className={classes.dialog}
      contentStyle={{width: loading ? '550px' : '700px', maxWidth: 'none'}}
      bodyClassName={classes.popUp}>

      <div className={classes.titleContent}>
        <div>
          <div className={classes.response}>
            <span className={classes.img}/>
            <Field
              label={'Ответственное лицо'}
              name={'worker'}
              pId={pId}
              onSubmit={onSubmit}
              component={UsersSearchInlineField}
            />
          </div>
          <div className={classes.deadline}>
            <DeadlineIcon style={icon}/>
            <Field
              label={'Дедлайн'}
              name={'deadline'}
              onSubmit={onSubmit}
              component={DateCustomField}
            />
          </div>
        </div>
        <IconButton onClick={onClose}>
          <CloseIcon color="#666666"/>
        </IconButton>
      </div>
      <div className={classes.bodyContent}>
        <form onSubmit={onComment} className={classes.form}>
          <div className={classes.loader}>
            <Loader size={0.75}/>
          </div>
          <div className={classes.inContent} style={{padding: '20px 30px 30px'}}>
            <div className={classes.proTitle}>
              <span>{title}</span>
              <Field
                name={'description'}
                fullWidth={true}
                fontSize={'18px'}
                onSubmit={onSubmit}
                component={TextFieldInlineEdit}
              />
            </div>
            <div>
              <EmptyQuery
                size={160}
                list={comment}
                text={'Комментов нет'}
                loading={commentLoading}
              />
              <Loading
                size={0.55}
                height={50}
                loading={commentLoading}/>
              {_.map(comment, item => {
                const id = _.get(item, 'id')
                const createdDate = dateFormat(_.get(item, 'createdDate'), true)
                const comments = _.get(item, 'comment')
                const fullName = _.get(item, 'worker.fullName')
                const file = _.get(item, 'file.file')
                const format = _.get(item, 'file.contentType')
                return (
                  <div key={id} className={classes.commentWrap}>
                    <span className={classes.img}/>
                    <div>
                      <span className={classes.commentName}>{fullName}</span>
                      <span className={classes.commentDate}>{createdDate}</span>
                      <div className={classes.commentBody} dangerouslySetInnerHTML={{__html: comments}}/>
                      {file && <a href={file} target={'_blank'} className={classes.commentFile}>file.{format}</a>}
                    </div>
                  </div>
                )
              })}
            </div>
            <div className={classes.commentField}>
              <span className={classes.img}/>
              <Field
                name="comment"
                component={Editor}
                file={true}
                className={classes.inputFieldCustom}
                button={(
                  <FlatButton
                    label={'Отправить'}
                    className={classes.actionButton}
                    primary={true}
                    type="submit"
                  />
                )}
                fullWidth={true}/>

            </div>
          </div>
        </form>
      </div>
    </Dialog>
  )
})

ProjectDetailDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired
}

ProjectDetailDialog.defaultProps = {
  isUpdate: false
}

export default ProjectDetailDialog
