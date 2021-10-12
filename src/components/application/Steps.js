import React from 'react'
import { Container, Row, Col } from 'react-bootstrap'

import './Steps.css'

function Steps(props) {

    return (
        <Container fluid className="mb-5" id="StepsContent">
            <Row className="text-center text-white">
                <Col className="pt-3 px-4">
                <li>
                    <i className={"rounded-circle p-4 fa fa-edit fa-1x "+ (props.currentStep >= 1? "bg-success":"bg-secondary")}></i>
                    <span id="one">Application Requirement</span>
                </li>
                <li>
                    <i className={"rounded-circle p-4 fa fa-user fa-1x "+(props.currentStep >= 2? "bg-success":"bg-secondary")}></i>
                    <span id="two">Applicant Information</span>
                </li>
                <li>
                    <i className={"rounded-circle p-4 fa fa-wind fa-1x "+(props.currentStep >= 3? "bg-success":"bg-secondary")}></i>
                    <span id="three">New Equipment Information</span>
                </li>
                <li>
                    <i className={"rounded-circle p-4 fa fa-fan fa-1x "+(props.currentStep >= 4? "bg-success":"bg-secondary")}></i>
                    <span id="four">Existing Equipment Information</span>
                </li>
                <li>
                    <i className={"rounded-circle p-4 fa fa-list fa-1x "+(props.currentStep >= 5? "bg-success":"bg-secondary")}></i>
                    <span id="five">Equipment Review</span>
                </li>
                <li>
                    <i className={"rounded-circle p-4 fa fa-upload fa-1x "+(props.currentStep >= 6? "bg-success":"bg-secondary")}></i>
                    <span id="six">Submission of Documentation</span>
                </li>
                <li>
                    <i className={"rounded-circle p-4 fa fa-tasks fa-1x "+(props.currentStep >= 7? "bg-success":"bg-secondary")}></i>
                    <span id="seven">Final Review</span>
                </li>
                <li>
                    <i className={"rounded-circle p-4 fa fa-file-signature fa-1x "+(props.currentStep >= 8? "bg-success":"bg-secondary")}></i>
                    <span id="eight">Terms & Conditions</span>
                </li>
                </Col>
            </Row>
         
        </Container>
    )
}

export default Steps
