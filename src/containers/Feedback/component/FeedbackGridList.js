import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import injectSheet from 'react-jss'
import {compose} from 'recompose'
import {Row, Col} from 'react-flexbox-grid'
import * as ROUTES from 'constants/routes'
import GridList from 'components/GridList'
import Container from 'components/Container'
import SubMenu from 'components/SubMenu'
import Dot from 'components/Images/dot.png'
import t from 'helpers/translate'
import {hashHistory} from 'react-router'
import deepPure from '../../../helpers/deepPure'

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
    title: t('номер телефон')
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
  }),
  deepPure
)

const FeedbackGridList = enhance((props) => {
  const {
    filter,
    listData,
    classes
  } = props

  const onCreate = (clientName) => {
    hashHistory.push({pathname: ROUTES.ORDER_LIST_URL, query: {openCreateDialog: true, clientName}})
  }

  const companyTypeList = _.map(listData.data, (item, index) => {
    const id = _.toNumber(_.get(item, 'id'))
    //    Const status = fp.flow(findItem, fp.get('name'))
    const fullName = _.get(item, 'customer.fullName')
    const phone = _.get(item, 'customer.phoneNumber')
    const clientId = _.get(item, 'customer.id')
    return (
      <Row key={id} className={classes.listRow} onClick={() => onCreate(clientId)}>

        <Col xs={7}>{fullName}</Col>
        <Col xs={4}>{phone}</Col>
        <Col xs={1}>
        </Col>
      </Row>
    )
  })

  const list = {
    header: listHeader,
    list: companyTypeList,
    loading: false
  }

  return (
    <Container>
      <SubMenu url={ROUTES.FEEDBACK_LIST_URL}/>

      <GridList
        filter={filter}
        list={list}
        detail={(<span>2</span>)}
      />
    </Container>
  )
})

FeedbackGridList.propTypes = {
  filter: PropTypes.object.isRequired,
  listData: PropTypes.object,
  detailData: PropTypes.object
}

export default FeedbackGridList
