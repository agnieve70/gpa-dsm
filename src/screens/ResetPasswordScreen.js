import React, { useState } from "react";
import { Row, Col, Form, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Navbar, Image, Nav, Container, NavDropdown } from "react-bootstrap";
import { emailChangePasswordAction, logout } from "../actions/userActions";
import { LinkContainer } from "react-router-bootstrap";
import { useParams, Link, useLocation } from "react-router-dom";
import Swal from "sweetalert2";

function ResetPasswordScreen({ location, history }) {
  const useQuery = () => new URLSearchParams(useLocation().search);
  const [new_password, setNewPassword] = useState("");
  const [confirm_new_password, setConfirmNewPassword] = useState("");
  const [is_confirm, setIsConfirm] = useState();

  const dispatch = useDispatch();

  let query = useQuery();
  let creds = query.get("creds");

  const emailChangePassword = useSelector((state) => state.emailChangePassword);
  const { email_change_pass } = emailChangePassword;
  const submitHandler = (e) => {
    e.preventDefault();

    if (confirm_new_password === new_password) {
      setIsConfirm(true);
      dispatch(emailChangePasswordAction(creds, new_password));

      if (email_change_pass) {
        if (email_change_pass.status) {
          alert(email_change_pass.message);
        } else {
          Swal.fire(
            "Reset Success",
            "Successfully change your password!",
            "success"
          ).then(() => {
            dispatch(logout());
            history.push("/admin");
          });
        }
      }
    } else {
      setIsConfirm(false);
    }
  };

  return (
    <>
      <header>
        <Navbar
          bg="info"
          variant="dark"
          expand="zl"
          collapseOnSelect
          className="p-3 d-flex justify-content-center align-items-center"
        >
          <Container>
            <Link
              style={{ marginLeft: "auto", marginRight: "auto" }}
              to={`/dashboard`}
            >
              <img
                src="/icon.png"
                width="250"
                height="65"
                className="d-inline-block align-top"
                alt="Energy Sense Rebate Program"
              />
            </Link>
            {/* <Navbar.Toggle aria-controls="basic-navbar-nav" /> */}
          </Container>
        </Navbar>
      </header>
      <div>
        <Row md={3} xs={12} sm={12}>
          <Col md={2} sm={12} xs={12}></Col>
          <Col className="mt-4" md={8} sm={12} xs={12}>
            <Row className="mb-5">
              <Col md={4}></Col>
              <Col md={4}></Col>
              <Col md={4}></Col>
            </Row>
            <Row className="mb-2">
              <Col md={1}></Col>
              <Col md={10}>
                <h1 className="mb-4 text-center text-info">Change Password</h1>
              </Col>
              <Col md={1}></Col>
            </Row>
            <Form onSubmit={submitHandler}>
              <Row>
                <Col md={3}></Col>
                <Col md={6}>
                  <Form.Group controlId="new_password">
                    <Form.Label>New Password</Form.Label>
                    <Form.Control
                      type="password"
                      // placeholder='Enter Password'
                      value={new_password}
                      onChange={(e) => setNewPassword(e.target.value)}
                    ></Form.Control>
                  </Form.Group>

                  <Form.Group controlId="confirm_new_password">
                    <Form.Label>Confirm New Password</Form.Label>
                    <Form.Control
                      type="password"
                      // placeholder='Enter Password'
                      value={confirm_new_password}
                      onChange={(e) => setConfirmNewPassword(e.target.value)}
                    ></Form.Control>
                    {is_confirm === false ? (
                      <span className="text-danger">New Password Mismatch</span>
                    ) : (
                      <></>
                    )}
                  </Form.Group>

                  <Row>
                    <Col md={6} className="mx-auto">
                      <div className="d-grid gap-2 mt-3 mb-4">
                        <Button
                          type="submit"
                          variant="success"
                          className="me-1"
                        >
                          SUBMIT
                        </Button>
                      </div>
                    </Col>
                    <Col md={6}>
                      <div className="d-grid gap-2 mt-3 mb-4">
                        <LinkContainer to="/dashboard">
                          <Button type="button" variant="danger">
                            CANCEL
                          </Button>
                        </LinkContainer>
                      </div>
                    </Col>
                  </Row>
                </Col>
                <Col md={3}></Col>
              </Row>
            </Form>

            <Row className="mt-2">
              <Col className="text-center">
                <small className="text-secondary">
                  Energy Sense Rebate Program for Central, Ducted Systems <br />
                  Copyright &copy; 2020 GPA Powered By Xtendly
                </small>
              </Col>
            </Row>
          </Col>
          <Col md={2} sm={12} xs={12}></Col>
        </Row>
      </div>
    </>
  );
}

export default ResetPasswordScreen;
