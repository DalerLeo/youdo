import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import injectSheet from 'react-jss'
import {compose} from 'recompose'
import * as ROUTES from 'constants/routes'
import Container from 'components/Container'
import PieChart from './PieChart'
import SubMenu from 'components/SubMenu'
import defaultPropTypes from 'constants/propTypes'

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
    rightPanel: {
      background: '#fff',
      flexBasis: '100%',
      width: '100%',
      overflowY: 'auto',
      overflowX: 'hidden'
    },
    iconBtn: {
      display: 'flex',
      justifyContent: 'flex-end',
      transition: 'all 200ms ease-out'
    },
    listRow: {
      margin: '0 -30px !important',
      width: 'auto !important',
      padding: '0 30px',
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
    },
    link: {
      cursor: 'pointer',
      position: 'absolute',
      top: '0',
      left: '0',
      right: '0',
      bottom: '0',
      zIndex: '1'
    },
    addButtonWrapper: {
      position: 'absolute',
      top: '10px',
      right: '0',
      marginBottom: '0px'
    },
    chartWrap: {
      padding: '20px',
      display: 'flex',
      justifyContent: 'space-between',
      background: '#fff',
      '& > div': {
        width: '50%'
      }
    }

  })
)

const StatDistrictGridList = enhance((props) => {
  const {
    listData,
    brandListData,
    classes
  } = props

  return (
    <Container>
      <div className={classes.wrapper}>
        <SubMenu url={ROUTES.STAT_DISTRICT_LIST_URL}/>
        <div className={classes.chartWrap}>
          <PieChart
            subtitle={'Нажмите график для детали'}
            title={'Фактические продажи по районам'}
            loading={_.get(listData, 'loading')}
            data={_.get(listData, 'data')}/>
          <PieChart
            subtitle={' '}
            laoding={_.get(brandListData, 'loading')}
            title={'Фактические продажи по брендам'}
            data={_.get(brandListData, 'data')}/>
        </div>
      </div>

    </Container>
  )
})

StatDistrictGridList.propTypes = {
  listData: PropTypes.object,
  brandListData: PropTypes.object
}

export default StatDistrictGridList
