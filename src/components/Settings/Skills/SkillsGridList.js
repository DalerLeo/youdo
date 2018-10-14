import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import {Row, Col} from 'react-flexbox-grid'
import IconButton from 'material-ui/IconButton'
import DeleteIcon from 'material-ui/svg-icons/action/delete'
import injectSheet from 'react-jss'
import {compose} from 'recompose'
import FlatButton from 'material-ui/FlatButton'
import ContentAdd from 'material-ui/svg-icons/content/add'
import Edit from 'material-ui/svg-icons/image/edit'
import * as ROUTES from '../../../constants/routes'
import GridList from '../../GridList/index'
import Container from '../../Container/index'
import SkillsCreateDialog from './SkillsCreateDialog'
import ConfirmDialog from '../../ConfirmDialog/index'
import SideMenu from '../SideMenu'
import ToolTip from '../../Utils/ToolTip/index'
import t from '../../../helpers/translate'

const enhance = compose(
  injectSheet({
    wrapper: {
      display: 'flex',
      margin: '0 -28px',
      height: 'calc(100% + 28px)'
    },
    addButton: {
      '& svg': {
        width: '14px !important',
        height: '14px !important'
      }
    },
    addButtonWrapper: {
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      marginLeft: '-18px'
    },
    rightPanel: {
      background: '#fff',
      flexBasis: '100%',
      width: '100%',
      paddingTop: '10px',
      overflowY: 'auto',
      overflowX: 'hidden'
    },
    iconBtn: {
      display: 'flex',
      justifyContent: 'flex-end',
      opacity: '0',
      transition: 'all 200ms ease-out'
    },
    listRow: {
      margin: '0 -30px !important',
      width: 'auto !important',
      padding: '0 30px',
      '&:hover > div:last-child > div ': {
        opacity: '1'
      },
      '& > div': {
        overflow: 'hidden',
        wordBreak: 'normal',
        textOverflow: 'ellipsis'
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
    width: 30,
    height: 25,
    padding: 0
  }
}

const SkillsGridList = enhance((props) => {
  const {
    filter,
    createDialog,
    updateDialog,
    confirmDialog,
    listData,
    detailData,
    classes
  } = props

  const listHeader = [
    {
      sorting: false,
      name: 'name',
      title: t('Название'),
      xs: 10
    }
  ]

  const skillsList = _.map(_.get(listData, 'data'), (item) => {
    const id = _.get(item, 'id')
    const name = _.get(item, 'name')
    return (
      <Row key={id} className={classes.listRow}>
        <Col xs={10}>{name}</Col>
        <Col xs={2}>
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
    list: skillsList,
    loading: _.get(listData, 'listLoading')
  }

  const addButton = (
    <div className={classes.addButtonWrapper}>
      <FlatButton
        backgroundColor="#fff"
        labelStyle={{textTransform: 'none', paddingLeft: '2px', color: '#12aaeb'}}
        className={classes.addButton}
        label={t('добавить навык')}
        onClick={createDialog.onOpen}
        icon={<ContentAdd color="#12aaeb"/>}>
      </FlatButton>
    </div>
  )

  return (
    <Container>
      <div className={classes.wrapper}>
        <SideMenu currentUrl={ROUTES.SKILLS_LIST_URL}/>
        <div className={classes.rightPanel}>
          <GridList
            filter={filter}
            list={list}
            listShadow={false}
            detail={<span/>}
            actionsDialog={<span/>}
            addButton={addButton}
          />
        </div>
      </div>

      {createDialog.open &&
        <SkillsCreateDialog
          detailData={_.get(detailData, 'data')}
          initialValues={updateDialog.initialValues}
          open={createDialog.open}
          loading={createDialog.loading}
          onClose={createDialog.onClose}
          onSubmit={createDialog.onSubmit}
        />}

      {updateDialog.open &&
        <SkillsCreateDialog
          detailData={_.get(detailData, 'data')}
          initialValues={updateDialog.initialValues}
          isUpdate={true}
          open={updateDialog.open}
          loading={updateDialog.loading}
          onClose={updateDialog.onClose}
          onSubmit={updateDialog.onSubmit}
        />}

      {detailData.data && <ConfirmDialog
        type="delete"
        message={''}
        loading={confirmDialog.loading}
        onClose={confirmDialog.onClose}
        onSubmit={confirmDialog.onSubmit}
        open={confirmDialog.open}
      />}
    </Container>
  )
})

SkillsGridList.propTypes = {
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

export default SkillsGridList
