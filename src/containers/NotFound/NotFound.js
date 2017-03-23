import React from 'react'
import SingInLayout from '../../components/SingInLayout'
import {Container, Segment} from 'semantic-ui-react'
import './NotFound.css'

const NotFound = () => {
    return (
        <SingInLayout>
            <Container className="blockCenter">
                <Segment>
                    <h1 className="notFoundText">
                        404 <br/>
                        Page not found
                    </h1>
                </Segment>
            </Container>
        </SingInLayout>
    )
}

export default NotFound
