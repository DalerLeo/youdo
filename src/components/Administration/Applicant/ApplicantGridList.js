import _ from 'lodash'
import fp from 'lodash/fp'
import React from 'react'
import PropTypes from 'prop-types'
import {Row, Col} from 'react-flexbox-grid'
import IconButton from 'material-ui/IconButton'
import injectSheet from 'react-jss'
import {compose} from 'recompose'
import FlatButton from 'material-ui/FlatButton'
import ContentAdd from 'material-ui/svg-icons/content/add'
import Edit from 'material-ui/svg-icons/image/edit'
import * as ROUTES from '../../../constants/routes'
import GridList from '../../GridList/index'
import Container from '../../Container/index'
import ApplicantCreateDialog from './ApplicantCreateDialog'
import ConfirmDialog from '../../ConfirmDialog/index'
import SubMenu from '../../SubMenu'
import ToolTip from '../../ToolTip/index'
import t from '../../../helpers/translate'
import {APPLICANT_STATUS} from '../../../constants/backendConstants'

const enhance = compose(
  injectSheet({
    wrapper: {
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
      overflowY: 'auto',
      overflowX: 'hidden',
      boxShadow: 'rgba(0, 0, 0, 0.12) 0px 1px 6px, rgba(0, 0, 0, 0.12) 0px 1px 4px'
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
        textOverflow: 'ellipsis',
        '&:last-child': {
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }

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
    height: 30,
    padding: 0
  }
}
const findItem = (item) => _.find(APPLICANT_STATUS, {value: _.get(item, 'status')})

const ApplicantGridList = enhance((props) => {
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
      title: 'ФИО',
      xs: 3
    },
    {
      sorting: false,
      name: 'resume_num',
      title: t('Кол-во резюме'),
      xs: 2
    },
    {
      sorting: false,
      name: 'modified_date',
      title: t('Дата обновления'),
      xs: 3
    },
    {
      sorting: false,
      name: 'created_date',
      title: t('Дата создания'),
      xs: 2
    },
    {
      sorting: false,
      name: 'balance',
      title: t('Балансе'),
      xs: 2
    }
  ]

  const applicantList = _.map(_.get(listData, 'data'), (item) => {
    const id = _.get(item, 'id')
    const status = fp.flow(findItem, fp.get('name'))
    const username = _.get(item, 'email')
    const phone = _.get(item, 'phoneNumber')
    const firstName = _.get(item, 'firstNameRu') || _.get(item, 'firstNameEn')
    const lastName = _.get(item, 'lastNameRu') || _.get(item, 'lastNameEn')
    const permissions = _.get(item, ['groups', '0', 'name'])
    return (
      <Row key={id} className={classes.listRow}>
        <Col xs={3}>{id}</Col>
        <Col xs={2}>{`${firstName} ${lastName}`}</Col>
        <Col xs={3}>{username}</Col>
        <Col xs={2} style={{textAlign: 'right'}}>{phone}</Col>
        <Col xs={2}>{permissions}
          <div className={classes.iconBtn}>
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
          </div>
        </Col>

      </Row>
    )
  })

  const list = {
    header: listHeader,
    list: applicantList,
    loading: _.get(listData, 'listLoading')
  }

  const addButton = (
    <div className={classes.addButtonWrapper}>
      <FlatButton
        backgroundColor="#fff"
        labelStyle={{textTransform: 'none', paddingLeft: '2px', color: '#12aaeb'}}
        className={classes.addButton}
        label={t('добавить соискателя')}
        onTouchTap={createDialog.onOpenCreateDialog}
        icon={<ContentAdd color="#12aaeb"/>}>
      </FlatButton>
    </div>
  )

  const currentDetail = _.find(_.get(listData, 'data'), {'id': _.toInteger(_.get(detailData, 'id'))})
  const currentName = `${_.get(currentDetail, 'firstName')} ${_.get(currentDetail, 'lastName')}`
  return (
    <Container>
      <div className={classes.wrapper}>
        <SubMenu url={ROUTES.APPLICANT_LIST_URL}/>
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

      {createDialog.openCreateDialog &&
      <ApplicantCreateDialog
        detailData={_.get(detailData, 'data')}
        initialValues={updateDialog.initialValues}
        open={createDialog.openCreateDialog}
        loading={createDialog.createLoading}
        onClose={createDialog.onCloseCreateDialog}
        onSubmit={createDialog.onSubmitCreateDialog}
        errorData={createDialog.errorData}
      />}

      {updateDialog.openUpdateDialog &&
      <ApplicantCreateDialog
        detailData={_.get(detailData, 'data')}
        initialValues={updateDialog.initialValues}
        isUpdate={true}
        open={updateDialog.openUpdateDialog}
        loading={updateDialog.updateLoading}
        onClose={updateDialog.handleCloseUpdateDialog}
        onSubmit={updateDialog.handleSubmitUpdateDialog}
        errorData={updateDialog.errorData}
      />}

      {detailData.data && <ConfirmDialog
        type="delete"
        message={currentName}
        loading={confirmDialog.confirmLoading}
        onClose={confirmDialog.handleCloseConfirmDialog}
        onSubmit={confirmDialog.handleSendConfirmDialog}
        open={confirmDialog.openConfirmDialog}
      />}
    </Container>
  )
})

ApplicantGridList.propTypes = {
  filter: PropTypes.object.isRequired,
  listData: PropTypes.object,
  detailData: PropTypes.object,
  createDialog: PropTypes.shape({
    createLoading: PropTypes.bool.isRequired,
    openCreateDialog: PropTypes.bool.isRequired,
    onOpenCreateDialog: PropTypes.func.isRequired,
    onCloseCreateDialog: PropTypes.func.isRequired,
    onSubmitCreateDialog: PropTypes.func.isRequired
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
  }).isRequired,
  filterDialog: PropTypes.shape({
    initialValues: PropTypes.object,
    filterLoading: PropTypes.bool,
    openFilterDialog: PropTypes.bool.isRequired,
    handleOpenFilterDialog: PropTypes.func.isRequired,
    handleCloseFilterDialog: PropTypes.func.isRequired,
    handleSubmitFilterDialog: PropTypes.func.isRequired
  }).isRequired
}

export default ApplicantGridList
