import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'

import injectSheet from 'react-jss'
import {compose} from 'recompose'
import ManufactureTabs from './ManufactureTabs'
import ManufacturePerson from './Tab/ManufacturePerson'
import * as ROUTES from '../../constants/routes'

const enhance = compose(
    injectSheet({
        addButton: {
            '& button': {
                backgroundColor: '#275482 !important'
            }
        },
        addButtonWrapper: {
            position: 'absolute',
            top: '10px',
            right: '0',
            marginBottom: '0px'
        },
        productionMainRow: {
            paddingTop: '20px',
            margin: '0 -28px',
            height: '100vh'
        },
        productionRightSide: {
            width: 'calc(100% - 280px)',
            marginTop: '-20px',
            padding: '20px 30px',
            overflowY: 'auto'
        },
        productList: {
            width: '100%',
            '& li': {
                width: '100%',
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                padding: '10px 0'
            },
            '& .dottedList:last-child:after': {
                content: '""',
                backgroundImage: 'none'
            },
            '& .dottedList:after': {
                left: '0.7em',
                right: '0.7em'
            }
        }
    })
)

const ManufacturePersonWrapper = enhance((props) => {
    const {
        detailData,
        personData
    } = props
    return (
        <div>
            <ManufactureTabs currentURL={ROUTES.MANUFACTURE_PERSON_LIST_URL} detailId={_.toInteger(_.get(detailData, 'id'))}/>
            <ManufacturePerson personData={personData} manufactureId={_.toInteger(_.get(detailData, 'id'))}/>
        </div>
    )
})

ManufacturePersonWrapper.propTypes = {
    listData: PropTypes.object,
    detailData: PropTypes.object,
    personData: PropTypes.object.isRequired
}

export default ManufacturePersonWrapper