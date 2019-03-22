import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import injectSheet from 'react-jss'
import {compose} from 'recompose'
import {Row, Col} from 'react-flexbox-grid'
import IconButton from 'material-ui/IconButton'
import ModEditorIcon from 'material-ui/svg-icons/editor/mode-edit'
import DeleteIcon from 'material-ui/svg-icons/action/delete'
import FlatButton from 'material-ui/FlatButton'
import ContentAdd from 'material-ui/svg-icons/content/add'
import Edit from 'material-ui/svg-icons/image/edit'
import * as ROUTES from '../../../constants/routes'
import dateFormat from '../../../helpers/dateFormat'
import GridList from '../../GridList'
import Container from '../../Container'
import CompanyTypeCreateDialog from './CompanyTypeCreateDialog'
import ConfirmDialog from '../../ConfirmDialog'
import SubMenu from '../../SubMenu'
import defaultPropTypes from '../../../constants/propTypes'
import Dot from '../../Images/dot.png'
import t from '../../../helpers/translate'
import numberFormat from '../../../helpers/numberFormat'
import ToolTip from 'components/Utils/ToolTip'

const listHeader = [
  {
    sorting: true,
    name: 'name',
    xs: 7,
    title: t('Наименование')
  },
  {
    sorting: true,
    name: 'division',
    xs: 4,
    title: t('Цена')
  },
  {
    sorting: true,
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
    subCategory: {
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      position: 'relative',
      '&:hover > div:last-child > div ': {
        opacity: '1'
      },
      '& > div:first-child': {
        paddingLeft: '50px'
      },
      '& > div:last-child': {
        paddingRight: '0'
      },
      '&:after': {
        content: '""',
        opacity: '0.5',
        background: 'url(' + Dot + ')',
        position: 'absolute',
        height: '2px',
        top: '0',
        left: '0',
        right: '0',
        marginTop: '1px'
      }
    },
    parentCategory: {
      width: '100%',
      '& > div:first-child': {
        paddingLeft: '0'
      },
      '&:hover > div:last-child > div ': {
        opacity: '1'
      }
    },
    marginLeft: {
      marginLeft: '20px !important'
    },
    right: {
      justifyContent: 'flex-end',
      textAlign: 'right',
      paddingRight: '0'
    },
    leftPanel: {
      backgroundColor: '#f2f5f8',
      flexBasis: '250px',
      maxWidth: '250px'

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

    iconBtn: {
      display: 'flex',
      opacity: '0',
      justifyContent: 'flex-end',
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

const CompanyTypeGridList = enhance((props) => {
  const {
    filter,
    createDialog,
    updateDialog,
    actionsDialog,
    confirmDialog,
    listData,
    detailData,
    classes
  } = props

  const actions = (
    <div>
      <IconButton onClick={actionsDialog.handleActionEdit}>
        <ModEditorIcon />
      </IconButton>

      <IconButton onClick={actionsDialog.handleActionDelete}>
        <DeleteIcon />
      </IconButton>
    </div>
  )

  const companyTypeList = _.map(listData.data, (item, index) => {
    const id = _.toNumber(_.get(item, 'id'))
    //    Const status = fp.flow(findItem, fp.get('name'))
    const fullName = _.get(item, 'name')
    const price = numberFormat(_.get(item, 'price'))
    return (
      <Row key={id} className={classes.listRow}>
        <Col xs={7}>{fullName}</Col>
        <Col xs={4}>{price}</Col>
        <Col xs={1}>
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
    list: companyTypeList,
    loading: _.get(listData, 'listLoading')
  }
  const addButton = (
    <div className={classes.addButtonWrapper}>
      <FlatButton
        backgroundColor="#fff"
        labelStyle={{textTransform: 'none', paddingLeft: '2px', color: '#12aaeb', fontSize: '13px'}}
        className={classes.addButton}
        label={t('добавить тип продукта')}
        onClick={createDialog.onOpen}
        icon={<ContentAdd color="#12aaeb"/>}>
      </FlatButton>
    </div>
  )
  return (
    <Container>
      <SubMenu url={ROUTES.COMPANY_TYPE_LIST_URL}/>

      <GridList
        filter={filter}
        list={list}
        detail={(<span>2</span>)}
        actionsDialog={actions}
        addButton={addButton}
      />

      <CompanyTypeCreateDialog
        open={createDialog.open}
        loading={createDialog.loading}
        onClose={createDialog.onClose}
        onSubmit={createDialog.onSubmit}
        initialValues={updateDialog.initialValues}
      />

      <CompanyTypeCreateDialog
        isUpdate={true}
        open={updateDialog.open}
        loading={updateDialog.loading}
        onClose={updateDialog.onClose}
        onSubmit={updateDialog.onSubmit}
        initialValues={updateDialog.initialValues}
      />

      <ConfirmDialog
        type="delete"
        message={_.get(detailData, ['data', 'name'])}
        loading={confirmDialog.loading}
        onClose={confirmDialog.onClose}
        onSubmit={confirmDialog.onSubmit}
        open={confirmDialog.open}
      />
    </Container>
  )
})

CompanyTypeGridList.propTypes = {
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
  }).isRequired,
  actionsDialog: PropTypes.shape({
    handleActionEdit: PropTypes.func.isRequired,
    handleActionDelete: PropTypes.func.isRequired
  }).isRequired
}

export default CompanyTypeGridList
