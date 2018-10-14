import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import {Row, Col} from 'react-flexbox-grid'
import IconButton from 'material-ui/IconButton'
import DeleteIcon from 'material-ui/svg-icons/action/delete'
import * as ROUTES from '../../../constants/routes'
import GridList from '../../GridList'
import Container from '../../Container'
import PostCreateDialog from './PositionCreateDialog'
import ConfirmDialog from '../../ConfirmDialog'
import injectSheet from 'react-jss'
import {compose} from 'recompose'
import FlatButton from 'material-ui/FlatButton'
import ContentAdd from 'material-ui/svg-icons/content/add'
import SettingSideMenu from '../../Settings/SideMenu'
import Edit from 'material-ui/svg-icons/image/edit'
import ToolTip from '../../Utils/ToolTip'
import dateFormat from '../../../helpers/dateFormat'
import defaultPropTypes from '../../../constants/propTypes'
import t from '../../../helpers/translate'

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
    title: t('Наименование')
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
      display: 'flex',
      margin: '0 -28px',
      height: 'calc(100% + 28px)'
    },
    addButtonWrapper: {
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      marginLeft: '-18px'
    },
    rightPanel: {
      background: '#fff',
      flexBasis: 'calc(100% - 225px)',
      maxWidth: 'calc(100% - 225px)',
      paddingTop: '10px',
      overflowY: 'auto',
      overflowX: 'hidden'
    },
    verticalButton: {
      border: '2px #dfdfdf solid !important',
      borderRadius: '50%',
      opacity: '0',
      '& > div': {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }
    },
    listRow: {
      margin: '0 -30px !important',
      width: 'auto !important',
      padding: '0 30px',
      '&:hover > div:last-child > div ': {
        opacity: '1'
      }
    },
    iconBtn: {
      display: 'flex',
      opacity: '0',
      transition: 'all 200ms ease-out'
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

const PostGridList = enhance((props) => {
  const {
    filter,
    createDialog,
    updateDialog,
    confirmDialog,
    listData,
    detailData,
    classes
  } = props

  const postDetail = (
    <span>a</span>
  )

  const postList = _.map(_.get(listData, 'data'), (item) => {
    const id = _.get(item, 'id')
    const name = _.get(item, 'name')
    const createdDate = dateFormat(_.get(item, 'createdAt'))
    return (
      <Row key={id} className={classes.listRow}>
        <Col xs={2}>{id}</Col>
        <Col xs={6}>{name}</Col>
        <Col xs={3}>{createdDate}</Col>
        <Col xs={1} style={{textAlign: 'right'}}>
          <div className={classes.iconBtn}>
            <ToolTip position="bottom" text={t('Изменить')}>
              <IconButton
                iconStyle={iconStyle.icon}
                style={iconStyle.button}
                disableTouchRipple={true}
                touch={true}
                onClick={() => { updateDialog.onOpen(id) }}>
                <Edit />
              </IconButton>
            </ToolTip>
            <ToolTip position="bottom" text={t('Удалить')}>
              <IconButton
                disableTouchRipple={true}
                iconStyle={iconStyle.icon}
                style={iconStyle.button}
                onClick={() => { confirmDialog.onOpen(id) }}
                touch={true}>
                <DeleteIcon />
              </IconButton>
            </ToolTip>
          </div>
        </Col>
      </Row>
    )
  })

  const list = {
    header: listHeader,
    list: postList,
    loading: _.get(listData, 'listLoading')
  }

  const addButton = (
    <div className={classes.addButtonWrapper}>
      <FlatButton
        backgroundColor="#fff"
        labelStyle={{textTransform: 'none', paddingLeft: '2px', color: '#12aaeb', fontSize: '13px'}}
        className={classes.addButton}
        label={t('добавить должность')}
        onClick={createDialog.onOpenCreateDialog}
        icon={<ContentAdd color="#12aaeb"/>}>
      </FlatButton>
    </div>
  )
  return (
    <Container>
      <div className={classes.wrapper}>
        <SettingSideMenu currentUrl={ROUTES.POST_LIST_URL}/>
        <div className={classes.rightPanel}>
          <GridList
            filter={filter}
            list={list}
            detail={postDetail}
            addButton={addButton}
            listShadow={false}
          />
        </div>
      </div>

      <PostCreateDialog
        open={createDialog.open}
        initialValues={updateDialog.initialValues}
        loading={createDialog.loading}
        onClose={createDialog.onClose}
        onSubmit={createDialog.onSubmit}
      />

      <PostCreateDialog
        isUpdate={true}
        initialValues={updateDialog.initialValues}
        open={updateDialog.open}
        loading={updateDialog.loading}
        onClose={updateDialog.onClose}
        onSubmit={updateDialog.onSubmit}
      />

      {detailData.data && <ConfirmDialog
        type="delete"
        message={_.get(detailData, ['data', 'name'])}
        loading={confirmDialog.loading}
        onClose={confirmDialog.onClose}
        onSubmit={confirmDialog.onSubmit}
        open={confirmDialog.open}
      />}
    </Container>
  )
})

PostGridList.propTypes = {
  filter: PropTypes.object.isRequired,
  listData: PropTypes.object,
  detailData: PropTypes.object,
  createDialog: PropTypes.shape({
    ...defaultPropTypes
  }).isRequired,
  confirmDialog: PropTypes.shape({
    ...defaultPropTypes
  }).isRequired,
  updateDialog: PropTypes.shape({
    ...defaultPropTypes
  }).isRequired
}

export default PostGridList
