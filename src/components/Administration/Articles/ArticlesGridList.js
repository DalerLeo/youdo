import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import {Row, Col} from 'react-flexbox-grid'
import IconButton from 'material-ui/IconButton'
import DeleteIcon from 'material-ui/svg-icons/action/delete'
import * as ROUTES from '../../../constants/routes'
import GridList from '../../GridList'
import Container from '../../Container'
import ArticlesCreateDialog from './ArticlesCreateDialog'
import ArticlesDetails from './ArticlesDetails'
import ConfirmDialog from '../../ConfirmDialog'
import injectSheet from 'react-jss'
import {compose} from 'recompose'
import FlatButton from 'material-ui/FlatButton'
import ContentAdd from 'material-ui/svg-icons/content/add'
import SubMenu from '../../SubMenu'
import Edit from 'material-ui/svg-icons/image/edit'
import ToolTip from '../../ToolTip'
import {Link} from 'react-router'
import dateFormat from '../../../helpers/dateFormat'
import t from '../../../helpers/translate'
import {COLOR_WHITE, LINK_COLOR} from '../../../constants/styleConstants'
import sprintf from 'sprintf'

const listHeader = [
  {
    sorting: true,
    name: 'id',
    xs: 2,
    title: 'Id'
  },
  {
    sorting: false,
    name: 'name',
    xs: 6,
    title: t('Заголовок')
  },
  {
    sorting: true,
    xs: 3,
    name: 'created_date',
    title: t('Дата создания')
  },
  {
    sorting: false,
    xs: 1,
    name: 'actions',
    title: ''
  }
]

const enhance = compose(
  injectSheet({
    addButton: {
      '& svg': {
        width: '14px !important',
        height: '14px !important'
      }
    },
    wrapper: {
      height: 'calc(100% + 28px)'
    },
    addButtonWrapper: {
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      marginLeft: '-18px'
    },
    listRow: {
      margin: '0 -30px !important',
      width: 'auto !important',
      padding: '0 30px',
      position: 'relative',
      '&:hover > div:last-child > div ': {
        opacity: '1'
      }
    },
    link: {
      position: 'absolute',
      top: '0',
      left: '0',
      right: '0',
      bottom: '0',
      zIndex: '1'
    },
    iconBtn: {
      opacity: '0',
      transition: 'all 200ms ease-out'
    },
    actionButtons: {
      display: 'flex',
      justifyContent: 'flex-end',
      zIndex: '2'
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
    width: 30,
    height: 25,
    padding: 0
  }
}

const ArticlesGridList = enhance((props) => {
  const {
    filter,
    createDialog,
    updateDialog,
    confirmDialog,
    listData,
    detailData,
    classes
  } = props

  const actionButtons = (id) => {
    return (
      <div className={classes.actionButtons}>
        <ToolTip position="bottom" text={t('Изменить')}>
          <IconButton
            iconStyle={iconStyle.icon}
            style={iconStyle.button}
            disableTouchRipple={true}
            touch={true}
            onTouchTap={() => { updateDialog.handleOpenUpdateDialog(id) }}>
            <Edit />
          </IconButton>
        </ToolTip>
        <ToolTip position="bottom" text={t('Удалить')}>
          <IconButton
            disableTouchRipple={true}
            iconStyle={iconStyle.icon}
            style={iconStyle.button}
            onTouchTap={() => { confirmDialog.handleOpenConfirmDialog(id) }}
            touch={true}>
            <DeleteIcon />
          </IconButton>
        </ToolTip>
      </div>
    )
  }

  const articlesDetail = (
    <ArticlesDetails
      filter={filter}
      key={_.get(detailData, 'id')}
      data={_.get(detailData, 'data') || {}}
      loading={_.get(detailData, 'detailLoading')}
      actionButtons={actionButtons}/>
  )

  const articlesList = _.map(_.get(listData, 'data'), (item) => {
    const id = _.get(item, 'id')
    const title = _.get(item, 'title')
    const createdDate = dateFormat(_.get(item, 'createdAt'))
    return (
      <Row key={id} className={classes.listRow}>
        <Col xs={2}>{id}</Col>
        <Link className={classes.link} to={{
          pathname: sprintf(ROUTES.ARTICLES_ITEM_PATH, id),
          query: filter.getParams()
        }}/>
        <Col xs={6}>{title}</Col>
        <Col xs={3}>{createdDate}</Col>
        <Col xs={1} style={{textAlign: 'right'}}>
          <div className={classes.iconBtn}>{actionButtons(id)}</div>
        </Col>
      </Row>
    )
  })

  const list = {
    header: listHeader,
    list: articlesList,
    loading: _.get(listData, 'listLoading')
  }

  const addButton = (
    <div className={classes.addButtonWrapper}>
      <FlatButton
        backgroundColor={COLOR_WHITE}
        labelStyle={{textTransform: 'none', paddingLeft: '2px', color: LINK_COLOR, fontSize: '13px'}}
        className={classes.addButton}
        label={t('добавить статью')}
        onTouchTap={createDialog.handleOpenCreateDialog}
        icon={<ContentAdd color={LINK_COLOR}/>}>
      </FlatButton>
    </div>
  )
  return (
    <Container>
      <div className={classes.wrapper}>
        <SubMenu url={ROUTES.ARTICLES_LIST_URL}/>
        <GridList
          filter={filter}
          list={list}
          detail={articlesDetail}
          addButton={addButton}
          detailTransform={false}
        />
      </div>

      <ArticlesCreateDialog
        open={createDialog.openCreateDialog}
        loading={createDialog.createLoading}
        onClose={createDialog.handleCloseCreateDialog}
        onSubmit={createDialog.handleSubmitCreateDialog}
      />

      <ArticlesCreateDialog
        isUpdate={true}
        initialValues={updateDialog.initialValues}
        open={updateDialog.openUpdateDialog}
        loading={updateDialog.updateLoading}
        onClose={updateDialog.handleCloseUpdateDialog}
        onSubmit={updateDialog.handleSubmitUpdateDialog}
      />

      {detailData.data && <ConfirmDialog
        type="delete"
        message={_.get(detailData, ['data', 'name'])}
        loading={confirmDialog.confirmLoading}
        onClose={confirmDialog.handleCloseConfirmDialog}
        onSubmit={confirmDialog.handleSendConfirmDialog}
        open={confirmDialog.openConfirmDialog}
      />}
    </Container>
  )
})

ArticlesGridList.propTypes = {
  filter: PropTypes.object.isRequired,
  listData: PropTypes.object,
  detailData: PropTypes.object,
  createDialog: PropTypes.shape({
    createLoading: PropTypes.bool.isRequired,
    openCreateDialog: PropTypes.bool.isRequired,
    handleOpenCreateDialog: PropTypes.func.isRequired,
    handleCloseCreateDialog: PropTypes.func.isRequired,
    handleSubmitCreateDialog: PropTypes.func.isRequired
  }).isRequired,
  confirmDialog: PropTypes.shape({
    confirmLoading: PropTypes.bool.isRequired,
    openConfirmDialog: PropTypes.bool.isRequired,
    handleOpenConfirmDialog: PropTypes.func.isRequired,
    handleCloseConfirmDialog: PropTypes.func.isRequired,
    handleSendConfirmDialog: PropTypes.func.isRequired
  }).isRequired,
  updateDialog: PropTypes.shape({
    updateLoading: PropTypes.bool.isRequired,
    openUpdateDialog: PropTypes.bool.isRequired,
    handleOpenUpdateDialog: PropTypes.func.isRequired,
    handleCloseUpdateDialog: PropTypes.func.isRequired,
    handleSubmitUpdateDialog: PropTypes.func.isRequired
  }).isRequired
}

export default ArticlesGridList
