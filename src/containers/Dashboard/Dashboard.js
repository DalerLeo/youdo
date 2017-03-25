import React from 'react'
import Layout from '../../components/Layout'
import GridList from '../../components/GridList/GridList'
import './Dashboard.css'

const Dashboard = (props) => {
    const {layout} = props

    return (
        <Layout {...layout}>
            <GridList />
        </Layout>
    )
}

export default Dashboard
