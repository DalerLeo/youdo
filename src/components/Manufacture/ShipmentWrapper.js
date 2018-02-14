import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import injectSheet from 'react-jss'
import {compose} from 'recompose'
import ManufactureTabs from './ManufactureTabs'
import ManufactureShipment from './Tab/ManufactureShipment'
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

const ManufactureShipmentWrapper = enhance((props) => {
    const {
        filterDialog,
        filterLogs,
        tabData,
        detailData,
        shipmentData,
        productMaterialDialog,
        addProductDialog,
        handleEditProductAmount
    } = props
    return (
        <div>
            <ManufactureTabs
                currentURL={ROUTES.MANUFACTURE_SHIPMENT_LIST_URL}
                detailId={_.toInteger(_.get(detailData, 'id'))}/>
            <ManufactureShipment
                manufactureId={_.toInteger(_.get(detailData, 'id'))}
                shipmentData={shipmentData}
                tabData={tabData}
                filterDialog={filterDialog}
                handleCloseDetail={_.get(detailData, 'handleCloseDetail')}
                productMaterialDialog={productMaterialDialog}
                filterLogs={filterLogs}
                handleEditProductAmount={handleEditProductAmount}
                addProductDialog={addProductDialog}/>
        </div>
    )
})

ManufactureShipmentWrapper.propTypes = {
    listData: PropTypes.object,
    detailData: PropTypes.object,
    shipmentData: PropTypes.object,
    handleEditProductAmount: PropTypes.func.isRequired
}

export default ManufactureShipmentWrapper
