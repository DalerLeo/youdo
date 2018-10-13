import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import {Row, Col} from 'react-flexbox-grid'
import injectSheet from 'react-jss'
import {compose} from 'recompose'
import {reduxForm, Field} from 'redux-form'
import ContentAdd from 'material-ui/svg-icons/content/add'
import * as ROUTES from '../../constants/routes'
import Container from '../Container/index'
import ProjectCreateDialog from './ProjectCreateDialog'
import ConfirmDialog from '../ConfirmDialog'
import ToolTip from '../ToolTip'
import SubMenu from '../SubMenu'
import t from '../../helpers/translate'
import IconButton from 'material-ui/IconButton'
import AddIcon from 'material-ui/svg-icons/content/add-circle-outline'
import ProjectDetailDialog from './ProjectDetailDialog'
import {TextField, DateField, UsersSearchField} from '../ReduxForm'
import FloatingActionButton from 'material-ui/FloatingActionButton'
import defaultsPropTypes from '../../constants/propTypes'
import classNames from 'classnames'
import {hashHistory} from 'react-router'
import ChatIcon from 'material-ui/svg-icons/communication/chat'
import Paper from 'material-ui/Paper'
import {DISPLAY_FLEX_CENTER, DISPLAY_FLEX_START, COLOR_GREEN, COLOR_RED} from '../Styles/commonStyles'
import Loader from 'components/Loader/Loader'
import sprintf from 'sprintf'
import dateFormat from 'helpers/dateFormat'

const TWO = 2
const ZERO = 0
const taskEnhancer = compose(
  reduxForm({form: 'TaskForm'}),
)
const TaskForm = taskEnhancer(({classes}) => {
  return (
    <div>
      <Field
        className='input_date_field'
        name={'deadline'}
        fullWidth={true}
        label={'Дедлайн'}
        component={DateField}
      />
      <Field
        className={'input_field'}
        name={'description'}
        label={'Описания'}
        fullWidth={true}
        component={TextField}
      />
      <Field
        label={'Ответственное лицо'}
        name={'responsible'}
        component={UsersSearchField}
      />
    </div>
  )
})

const enhance = compose(
  injectSheet({
    wrap: {
      display: 'flex',
      margin: '0 -28px',
      padding: '0 28px 0 0',
      minHeight: 'calc(100% - 72px)'
    },
    wrapper: {
      height: 'calc(100% + 28px)'
    },
    addButton: {
      '& svg': {
        width: '14px !important',
        height: '14px !important'
      }
    },
    loader: {
      height: '300px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    leftSide: {
      width: '350px',
      minWidth: '350px'
    },
    rightSide: {
      width: 'calc(100% - 350px)',
      marginLeft: '28px'
    },
    outerTitle: {
      height: '40px',
      lineHeight: '40px',
      fontWeight: '600',
      paddingLeft: '30px',
      '& > div': {
        ...DISPLAY_FLEX_CENTER,
        justifyContent: 'space-between'
      },
      '& a': {
        padding: '2px 10px',
        border: '1px solid',
        borderRadius: '2px',
        marginLeft: '12px'
      }
    },
    listWrapper: {
      maxHeight: 'calc(100vh - 120px)',
      overflow: 'auto'
    },
    list: {
      borderBottom: '1px solid #efefef',
      padding: '15px 20px 15px 30px',
      margin: '0',
      cursor: 'pointer',
      position: 'relative'
    },
    title: {
      fontWeight: '600'
    },
    titlePro: {
      extend: 'title',
      display: 'flex',
      alignItems: 'center',
      position: 'relative',
      justifyContent: 'space-between',
      '& > span': {
        marginRight: '8px',
        width: '22px',
        height: '22px',
        fontSize: '11px !important',
        display: 'block',
        padding: '4px 8px',
        background: '#f1f1f1',
        borderRadius: '50%',
        color: '#000'
      },
      '& > div': {
        width: 'calc(100% - 40px)',
        '& > div': {
          fontSize: '12px',
          fontWeight: '400',
          color: '#777'
        }
      }
    },
    activePro: {
      backgroundColor: '#f2f5f8'
    },

    link: {
      position: 'absolute',
      top: '0',
      left: '0',
      right: '0',
      bottom: '0',
      zIndex: '1'
    },
    cardContent: {
      overflow: 'auto',
      maxHeight: 'calc(100vh - 140px)',
      paddingTop: '4px',
      marginTop: '-4px',
      '& > div:first-child': {
        paddingRight: '15px'
      },
      '& > div:last-child': {
        paddingLeft: '15px'
      }
    },
    cardPaper: {
      borderLeft: '2px solid ' + COLOR_RED,
      cursor: 'pointer',
      padding: '10px 20px',
      marginBottom: '20px',
      '&:hover': {
        boxShadow: 'rgba(0, 0, 0, 0.12) 0px 3px 9px, rgba(0, 0, 0, 0.12) 0px 0px 8px !important'
      }
    },
    addCardBtn: {
      cursor: 'pointer',
      padding: '4px 20px',
      marginBottom: '15px',
      textAlign: 'center',
      '&:hover': {
        boxShadow: 'rgba(0, 0, 0, 0.12) 0px 3px 9px, rgba(0, 0, 0, 0.12) 0px 0px 8px !important'
      }
    },
    cardTitle: {
      ...DISPLAY_FLEX_START,
      justifyContent: 'space-between',
      marginBottom: '10px',
      '& > div': {
        fontSize: '13px',
        lineHeight: '20px',
        fontWeight: '600'
      },
      '& > span': {
        display: 'inline-block',
        width: '11px',
        height: '11px',
        background: COLOR_RED,
        borderRadius: '50%'
      }
    },
    cardBody: {
      ...DISPLAY_FLEX_CENTER,
      justifyContent: 'space-between',
      '& span': {
        '&:first-child': {
          ...DISPLAY_FLEX_CENTER,
          fontSize: '12px'
        },
        '&:last-child': {
          color: '#888',
          fontSize: '12px',
          fontWeight: ''
        }
      }
    },
    done: {
      borderColor: `${COLOR_GREEN} !important`
    },
    person: {
      marginRight: '3px',
      display: 'inline-block',
      width: '24px',
      height: '24px',
      borderRadius: '50%',
      background: '#f1f1f1'
    },
    addButtonWrapper: {
      position: 'absolute',
      top: '10px',
      right: '0',
      marginBottom: '0px'
    },
    iconBtn: {
      display: 'flex',
      justifyContent: 'flex-end',
      opacity: '0',
      transition: 'all 200ms ease-out'
    }
  })
)

const iconStyle = {
  comment: {
    color: '#999',
    width: 13,
    height: 13,
    marginLeft: '3px',
    verticalAlign: 'bottom'
  },
  icon: {
    color: '#666',
    width: 22,
    height: 22
  },
  button: {
    width: 30,
    height: 30,
    padding: 0
  }
}
const ProjectGridList = enhance((props) => {
  const {
    filter,
    createDialog,
    updateDialog,
    confirmDialog,
    listData,
    detailData,
    taskDialog,
    classes
  } = props
  const tasks = _.get(taskDialog, 'taskList.list.results')
  const tasksLoading = _.get(taskDialog, 'taskList.loading')
  const projects = _.get(listData, 'data')
  const confirmDetails = _.get(detailData, 'data.id')
  const currentProjectId = _.toNumber(filter.getParam('project'))
  const tasksLeft = _.filter(tasks, (item, i) => !(i % TWO))
  const tasksRight = _.filter(tasks, (item, i) => (i % TWO))
  const currentProject = _.find(projects, {id: currentProjectId})

  const loader = (
    <div className={classes.loader}>
      <Loader size={1}/>
    </div>
  )

  const getCol = (list) => (
    <Row>
      {_.map(list, (task, i) => {
        const name = _.get(task, 'description')
        const id = _.get(task, 'id')
        const fullName = _.get(task, 'worker.fullName')
        const count = i
        const date = dateFormat(_.get(task, 'deadline'))
        const status = _.get(task, 'status')
        return (
          <Col key={id} xs={12}>
            <Paper
              zDepth={1}
              onClick={() => hashHistory.push({
                pathname: sprintf(ROUTES.PROJECT_ITEM_PATH, id),
                query: filter.getParams()
              })}
              className={classNames({
                [classes.cardPaper]: true,
                [classes.done]: status
              })}>
              <div className={classes.cardTitle}>
                <div>{name}</div>
              </div>
              <div className={classes.cardBody}>
                <span>
                  <ToolTip
                    text={fullName}
                    position={'bottom'}>
                    <span className={classes.person}/>
                  </ToolTip>
                  {date}
                </span>
                <span>
                  {count}<ChatIcon style={iconStyle.comment}/>
                </span>
              </div>
            </Paper>
          </Col>
        )
      })
      }
    </Row>
  )
  const taksCards = tasksLoading
    ? loader
    : _.isEmpty(tasksLeft)
      ? 'Empty'
      : (
        <Row className={classes.cardContent}>
          <Col xs={6}>
            <Row>
              <Col xs={12}>
                <Paper
                  zDepth={1}
                  onClick={taskDialog.onOpen}
                  className={classes.addCardBtn}>
                  <ContentAdd style={{verticalAlign: 'middle'}}/>
                </Paper>
              </Col>
            </Row>
            {getCol(tasksLeft)}
          </Col>
          <Col xs={6}>
            {getCol(tasksRight)}
          </Col>
        </Row>
      )

  const projectsList = (
    <div className={classes.leftSide}>
      <div className={classes.outerTitle}>
        <div>
          {t('Проекты')}
          <ToolTip position={'bottom'} text={'Добавить проект'}>
            <IconButton
              iconStyle={iconStyle.icon}
              style={iconStyle.button}
              touch={true}
              onClick={createDialog.onOpen}>
              <AddIcon />
            </IconButton>
          </ToolTip>
        </div>
      </div>
      <Paper zDepth={2} style={{height: '100%'}}>
        <div className={classes.listWrapper}>
          <div className={classes.list}>
            <div className={classes.title}>
              {t('Все')}
            </div>
          </div>
          {_.map(_.get(listData, 'data'), project => {
            const id = _.get(project, 'id')
            const title = _.get(project, 'title')
            const description = _.get(project, 'description')
            const isActive = currentProjectId === id
            return (
              <div
                key={id}
                onClick={() => hashHistory.replace({
                  pathname: ROUTES.PROJECT_LIST_URL,
                  query: filter.getParams({project: id})
                })}
                className={classNames({
                  [classes.list]: true,
                  [classes.activePro]: isActive
                })}>
                <div className={classes.titlePro}>
                  <div>{title} <div dangerouslySetInnerHTML={{__html: description}}/></div>
                  <span>1</span>
                </div>
              </div>
            )
          })}
        </div>
      </Paper>
    </div>
  )

  return (
    <Container>
      <SubMenu url={ROUTES.PROJECT_LIST_URL}/>
      <div className={classes.addButtonWrapper}>
        <ToolTip position="left" text={'добавить соискателя'}>
          <FloatingActionButton
            mini={true}
            zDepth={1}
            backgroundColor="#12aaeb"
            onClick={createDialog.onOpen}>
            <ContentAdd/>
          </FloatingActionButton>
        </ToolTip>
      </div>

      <div className={classes.wrap}>
        {projectsList}
        <div className={classes.rightSide}>
          <div className={classes.outerTitle} style={{paddingLeft: '0'}}>
            {_.get(currentProject, 'title') || 'Выберите проект'}
          </div>
          {taksCards}
        </div>
      </div>

      {createDialog.open &&
      <ProjectCreateDialog
        detailData={_.get(detailData, 'data')}
        initialValues={{isGlobal: 'True'}}
        open={createDialog.open}
        loading={createDialog.loading}
        onClose={createDialog.onClose}
        onSubmit={createDialog.onSubmit}
        errorData={createDialog.errorData}
      />}

      {updateDialog.open &&
      <ProjectCreateDialog
        detailData={_.get(detailData, 'data')}
        initialValues={updateDialog.initialValues}
        isUpdate={true}
        open={updateDialog.open}
        loading={updateDialog.loading}
        onClose={updateDialog.onClose}
        onSubmit={updateDialog.onSubmit}
        errorData={updateDialog.errorData}
      />}

      <ProjectDetailDialog
        detailData={detailData}
        loading={_.get(detailData, 'loading')}
        open={detailData.id > ZERO}
        onComment={_.get(detailData, 'onComment')}
        onClose={() => hashHistory.replace({pathname: ROUTES.PROJECT_LIST_URL, query: filter.getParams()})}
      />

      {detailData.data &&
      <ConfirmDialog
        type="delete"
        message={confirmDetails}
        loading={confirmDialog.confirmLoading}
        onClose={confirmDialog.onClose}
        onSubmit={confirmDialog.onSubmit}
        open={confirmDialog.open}
      />}
      <ConfirmDialog
        type="create"
        customName={'задач'}
        message={<TaskForm/>}
        loading={taskDialog.confirmLoading}
        onClose={taskDialog.onClose}
        onSubmit={taskDialog.onSubmit}
        open={taskDialog.open}
      />
    </Container>
  )
})

ProjectGridList.propTypes = {
  filter: PropTypes.object.isRequired,
  listData: PropTypes.object,
  detailData: PropTypes.object,
  createDialog: PropTypes.shape({
    ...defaultsPropTypes
  }).isRequired,
  confirmDialog: PropTypes.shape({
    ...defaultsPropTypes
  }).isRequired,
  updateDialog: PropTypes.shape({
    ...defaultsPropTypes,
    initialValues: PropTypes.object
  }).isRequired,
  filterDialog: PropTypes.shape({
    ...defaultsPropTypes,
    initialValues: PropTypes.object
  }).isRequired
}

export default ProjectGridList
