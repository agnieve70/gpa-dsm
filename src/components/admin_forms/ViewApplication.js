import React, { useState, useEffect } from "react";
import {
  Row,
  Col,
  Table,
  Form,
  ListGroup,
  Modal,
  Tab,
  Badge,
  InputGroup,
  FormControl,
  Container,
  Button,
  Nav,
} from "react-bootstrap";
import {
  detailApplication,
  commentsApplication,
  addCommentAction,
  logsApplication,
  updateApplication,
} from "../../actions/applicationActions";
import { retrieveFileAction } from "../../actions/fileActions";
import { useDispatch, useSelector } from "react-redux";
import MaterialTable from "material-table";
import ModalImage from "../ModalImage";
import "./ApplicationForm.css";
import { uploadFileAction } from "../../actions/fileActions";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { useWindowDimensions } from "../../hooks";
import { formatAMPM } from "../../helpers";
import _ from "lodash";

const MySwal = withReactContent(Swal);

function ViewApplication({
  current,
  setShow,
  currentControlNum,
  setApplicationId,
  applicationId,
}) {
  const { height, width } = useWindowDimensions();
  let obj = JSON.parse(localStorage.getItem("userInfo"));
  let roleId = obj.message.original.roleId;

  const [tabThree, setTabThree] = useState(true);
  const [tabFour, setTabFour] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const [status, setStatus] = useState("");
  const [stage, setStage] = useState("");
  const [reason, setReason] = useState("");
  const [batch, setBatch] = useState("");
  const [comment, setComment] = useState("");
  const [swalInfo, setSwalInfo] = useState("");
  const [updateState, setUpdateState] = useState(0);
  const [submited, setSubmited] = useState(false);
  const [detailsToggle, setDetailsToggle] = useState(false);

  const handleModalClose = () => setShowModal(false);

  const dispatch = useDispatch();

  const applicationUpdate = useSelector((state) => state.applicationUpdate);
  const {
    error: updateError,
    loading: updateLoading,
    success: successUpdate,
  } = applicationUpdate;

  const addComment = useSelector((state) => state.addComment);
  const {
    error: commentError,
    loading: commentLoading,
    success: commentSucess,
  } = addComment;

  const retrieveFile = useSelector((state) => state.retrieveFile);
  const {
    error: retrieveError,
    loading: retrieveLoading,
    success: retrieveSuccess,
  } = retrieveFile;

  const batchAdd = useSelector((state) => state.batchAdd);
  const { success: addBatchSuccess } = batchAdd;

  const [modalShow, setModalShow] = useState(false);
  const [modalData, setModalData] = useState({
    description: "",
    image_sample: "",
  });

  const [invoice, setInvoice] = useState(null);
  const [irs_form, setIrsForm] = useState(null);
  const [disposal_slip, setDisposalSlip] = useState(null);
  const [letter_authorization, setLetterAuthorization] = useState(null);
  const [installer_certification, setInstallerCertification] = useState(null);
  const [other_doc1, setOtherDoc1] = useState(null);
  const [other_doc2, setOtherDoc2] = useState(null);

  const uploadFile = useSelector((state) => state.uploadFile);
  const { loading: uploadLoading, error: uploadError, fileCode } = uploadFile;

  const [intervalId2, setIntervalId2] = useState();

  const applicationDetail = useSelector((state) => state.applicationDetail);
  const applicationComments = useSelector((state) => state.applicationComments);
  const applicationLogs = useSelector((state) => state.applicationLogs);

  const [application, setApplication] = useState();
  const [logs, setLogs] = useState({});
  const [comments, setComments] = useState([]);

  useEffect(() => {
    if (applicationDetail.application) {
      if (!application) {
        setApplication(applicationDetail.application);
      } else if (
        applicationDetail.application.Last_Modified_On !==
        application.Last_Modified_On
      ) {
        setApplication(applicationDetail.application);
      }
    }
  }, [applicationDetail]);

  useEffect(() => {
    if (comments?.length === 0) {
      if (applicationComments.comments) {
        setComments(applicationComments.comments);
      }
    }

    if (applicationComments.comments) {
      if (applicationComments.comments.length !== comments.length) {
        setComments(applicationComments.comments);
      }
    }
  }, [applicationComments]);

  useEffect(() => {
    if (logs?.length === 0) {
      if (applicationLogs.logs) {
        setLogs(applicationLogs.logs);
      }
    }

    if (applicationLogs.logs) {
      if (applicationLogs.logs.length !== comments.length) {
        setLogs(applicationLogs.logs);
      }
    }
  }, [applicationLogs]);

  useEffect(() => {
    if (current !== "application" || current !== "batch") {
      clearInterval(intervalId2);
    }
  }, [current]);

  useEffect(() => {
    if (current == "application" || current == "batch") {
      if (applicationId) {
        if (intervalId2) {
          clearInterval(intervalId2);
        }
        const rerun = setInterval(() => {
          dispatch(detailApplication(applicationId));
          dispatch(logsApplication(applicationId));
          dispatch(commentsApplication(applicationId));
        }, 5000);

        setIntervalId2(rerun);
      }
    }
  }, [applicationId]);

  useEffect(() => {
    dispatch(commentsApplication(applicationId));
  }, [addComment]);

  let inv,
    irs,
    loa,
    disp,
    oth1,
    oth2 = "";

  let total_rebate = 0;
  const handleOnChange = (e, doc_type, control_no) => {
    console.log("control_no", control_no);
    dispatch(uploadFileAction(e.target.files[0], doc_type, control_no));
    if (doc_type === "irs_form") {
      setIrsForm(e.target.files[0]);
    } else if (doc_type === "other_doc1") {
      setOtherDoc1(e.target.files[0]);
    } else if (doc_type === "other_doc2") {
      setOtherDoc2(e.target.files[0]);
    } else if (doc_type === "letter_authorization") {
      setLetterAuthorization(e.target.files[0]);
    } else if (doc_type === "invoice") {
      setInvoice(e.target.files[0]);
    } else if (doc_type === "installer_certification") {
      setInstallerCertification(e.target.files[0]);
    } else if (doc_type === "disposal_receipt") {
      setDisposalSlip(e.target.files[0]);
    }
    return;
  };

  const changeStatusHandler = (status) => {
    setSubmited(false);
    setStatus(status);
    setShowModal(true);
  };

  const updateStatus = (status, stage) => {
    setStage(stage);
    setSubmited(true);
    if (status !== 3) {
      setStatus(status);
      setStage(stage);
      setUpdateState(updateState + 1);
    }
  };

  useEffect(() => {
    if (status === 3 && submited === true) {
      if (submited) {
        Swal.fire({
          title: "Are you sure you want to reject application?",
          // showDenyButton: true,
          showCancelButton: true,
          confirmButtonText: "Save",
          // denyButtonText: `Cancel`,
        }).then((result) => {
          if (result.isConfirmed) {
            dispatch(updateApplication(applicationId, status, stage, reason));
            setShow(false);
            setSubmited(false);
            Swal.fire("Success", "Application has been rejected!", "success");
            setShowModal(false);
          }
        });
      }
    } else if (
      swalInfo !== "" &&
      status !== "" &&
      stage !== "" &&
      submited === true
    ) {
      Swal.fire({
        title: `Are you sure you want to ${swalInfo}?`,
        // showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: "Save",
        // denyButtonText: `Cancel`,
      }).then((result) => {
        if (result.isConfirmed) {
          dispatch(
            updateApplication(applicationId, status, stage, reason, batch)
          );
          setShow(false);
          setSubmited(false);
          Swal.fire("Success", "Application has been processed!", "success");
          setShowModal(false);
          setApplicationId(null);
        }
      });
    }
  }, [updateState, status, stage, swalInfo, submited]);

  const resetHandler = () => {
    clearInterval(intervalId2);
    setApplicationId(null);
    setApplication(null);
    setComments([]);
    setLogs({});
    setShow(false);
  };

  const addCommentHandler = () => {
    dispatch(addCommentAction(applicationId, comment));

    const Toast = MySwal.mixin({
      toast: true,
      position: "bottom-right",
      iconColor: "white",
      customClass: {
        popup: "colored-toast",
      },
      showConfirmButton: false,
      timer: 3500,
      timerProgressBars: true,
    });

    Toast.fire({
      icon: "success",
      title: "Comment Sent",
      text: "",
    });

    setComment("");
  };

  const changeCommentHandler = (text) => {
    setComment(text);
  };

  const handleRetrieveFile = (code) => {
    console.log(code);
    dispatch(retrieveFileAction(code));
  };

  const handleDetailsToggle = () => {
    if (detailsToggle === false) {
      setDetailsToggle(true);
    } else {
      setDetailsToggle(false);
    }
  };

  return (
    <Container>
      <Tab.Container
        id="left-tabs-example"
        defaultActiveKey="application_information"
      >
        <div
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Button className="mb-3 btn btn-light" onClick={() => resetHandler()}>
            <i className="fa fa-arrow-left"></i> Back to Application
          </Button>
          <h4 style={{ marginLeft: "auto" }}>{currentControlNum}</h4>
        </div>
        <Row style={{ paddingLeft: 12 }}>
          <Col
            className="p-0"
            style={{ backgroundColor: "rgb(227, 227, 229)" }}
          >
            <div id="applicationFormNa">
              <Nav variant="pills">
                <Nav.Item>
                  <Nav.Link eventKey="application_information">
                    Applicant Information
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link
                    eventKey="new_quipment_info"
                    onClick={() => {
                      setTabThree(false);
                    }}
                  >
                    New Equipment Information
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link
                    eventKey="old_quipment_info"
                    disabled={tabThree}
                    onClick={() => {
                      setTabFour(false);
                    }}
                  >
                    Old/Existing Equipment Information
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link
                    eventKey="submission_of_documentation"
                    disabled={tabFour}
                  >
                    Submitted Documents
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item
                  style={{ marginLeft: "auto", width: 50, paddingTop: 10 }}
                  className="d-flex aligns-items-center justify-content-center editbtn"
                  onClick={() => handleDetailsToggle()}
                >
                  <i className="fa fa-edit"></i>
                </Nav.Item>
                {/* <Nav.Item className="me-1">
                  <Nav.Link eventKey="verify_information">Update Status</Nav.Link>
                  </Nav.Item> */}
              </Nav>
            </div>
          </Col>
        </Row>
        <Row>
          <Col md={detailsToggle ? 9 : 12}>
            <Tab.Content>
              {/* Applicaiton Information */}
              <Tab.Pane eventKey="application_information">
                <h3 className="mt-3 mb-5 text-info">Applicant Info</h3>
                {application ? (
                  <ListGroup style={{ display: "flex", flexDirection: "row" }}>
                    {width > 770 ? (
                      <>
                        <div style={{ marginRight: 50 }}>
                          <p>
                            <b style={{ color: "#B6B6B6" }}>Control Number</b>
                          </p>
                          <p>
                            <b style={{ color: "#B6B6B6" }}>
                              GPA Electric Account Number
                            </b>
                          </p>
                          <p>
                            <b style={{ color: "#B6B6B6" }}>Bill ID</b>
                          </p>
                          <p>
                            <b style={{ color: "#B6B6B6" }}>
                              Name on GPA Account
                            </b>
                          </p>
                          <p>
                            <b style={{ color: "#B6B6B6" }}>Customer Name</b>
                          </p>
                          <p>
                            <b style={{ color: "#B6B6B6" }}>
                              Installation Address
                            </b>
                          </p>
                          <p>
                            <b style={{ color: "#B6B6B6" }}>City</b>
                          </p>
                          <p>
                            <b style={{ color: "#B6B6B6" }}>Zip</b>
                          </p>
                          <p>
                            <b style={{ color: "#B6B6B6" }}>Email</b>
                          </p>
                          <p>
                            <b style={{ color: "#B6B6B6" }}>Telephone Number</b>
                          </p>
                          <p className="mt-5 mb-5">
                            <b style={{ color: "#B6B6B6" }}>
                              Is Applicant the owner of the <br /> residential
                              property?
                            </b>
                          </p>
                          <p>
                            <b style={{ color: "#B6B6B6" }}>MAILING ADDRESS</b>
                          </p>
                          <p>
                            <b style={{ color: "#B6B6B6" }}>CITY</b>
                          </p>
                          <p>
                            <b style={{ color: "#B6B6B6" }}>ZIP</b>
                          </p>
                          <p>
                            <b style={{ color: "#B6B6B6" }}>
                              {application
                                ? application.Type === "RESID"
                                  ? "HOME"
                                  : "BUILDING"
                                : ""}{" "}
                              AGE
                            </b>
                          </p>
                          <p>
                            <b style={{ color: "#B6B6B6" }}>NEW CONSTRUCTION</b>
                          </p>
                          <p>
                            <b style={{ color: "#B6B6B6" }}>
                              {application
                                ? application.Type === "RESID"
                                  ? "HOME"
                                  : "BUILDING"
                                : ""}{" "}
                              TYPE
                            </b>
                          </p>
                        </div>
                        <div>
                          <p>
                            <b>{application.Control_Number || "N/A"} </b>
                             
                          </p>
                          <p>
                            <b>{application.Info_Account_no || "N/A"}</b>
                          </p>
                          <p>
                            <b>{application.Info_Bill_id || "N/A"}</b>
                          </p>
                          <p>
                            <b>{application.Account_Name || "N/A"}</b>
                            
                          </p>
                          <p>
                            
                            <InputGroup className="mb-3">
                            <b>{application.Info_Customer_name || "N/A"}</b>
                                {/* <FormControl
                                  placeholder="Applicant's Name"
                                  aria-label="Applicant's Name"
                                  aria-describedby="basic-addon2"
                                /> */}
                                <Button variant="outline-success" size="sm">
                                  <i className="fa fa-edit"></i>
                                </Button>
                              </InputGroup>
                          </p>
                          <p>
                            <b>{application.Info_Mailing_address || "N/A"}</b>
                          </p>
                          <p>
                            <b>{application.Info_Mailing_city || "N/A"}</b>
                          </p>
                          <p>
                            <b>{application.Info_Mailing_zip || "N/A"}</b>
                          </p>
                          <p>
                            <b>{application.Info_Email || "N/A"}</b>
                          </p>
                          <p>
                            <b>{application.Info_Tel_no || "N/A"}</b>
                          </p>
                          <p className="mt-5 mb-5">
                            <b>
                              {application.Info_Is_owner == 1 ? "true" : "false" || "N/A"}
                              <br />
                              <p
                                style={{
                                  color: "#F9F9FA",
                                  userSelect: "none",
                                }}
                              >
                                h
                              </p>
                            </b>
                          </p>
                          <p>
                            <b>{application.Info_Mailing_address || "N/A"}</b>
                          </p>
                          <p>
                            <b>{application.Info_Mailing_city || "N/A"}</b>
                          </p>
                          <p>
                            <b>{application.Info_Mailing_zip || "N/A"}</b>
                          </p>
                          <p>
                            <b>{application.Info_Home_age || "N/A"}</b>
                          </p>
                          <p>
                            <b>{application.Info_New_construction || "N/A"}</b>
                          </p>
                          <p>
                            <b>{application.Info_Home_type || "N/A"}</b>
                          </p>
                        </div>
                      </>
                    ) : (
                      <div style={{ marginRight: 50 }}>
                        <p>
                          <b style={{ color: "#B6B6B6" }}>
                            GPA Electric Account Number
                          </b>
                          <br />
                          <b>{application.Info_Account_no || "N/A"}</b>
                        </p>
                        <p>
                          <b style={{ color: "#B6B6B6" }}>Bill ID</b>
                          <br />
                          <b>{application.Info_Bill_id || "N/A"}</b>
                        </p>
                        <p>
                          <b style={{ color: "#B6B6B6" }}>
                            Name on GPA Account
                          </b>
                          <br />
                          <b>{application.Info_Customer_name || "N/A"}</b>
                        </p>
                        <p>
                          <b style={{ color: "#B6B6B6" }}>
                            Installation Address
                          </b>
                          <br />
                          <b>{application.Info_Mailing_address || "N/A"}</b>
                        </p>
                        <p>
                          <b style={{ color: "#B6B6B6" }}>City</b>
                          <br />
                          <b>{application.Info_Mailing_city || "N/A"}</b>
                        </p>
                        <p>
                          <b style={{ color: "#B6B6B6" }}>Zip</b>
                          <br />
                          <b>{application.Info_Mailing_zip || "N/A"}</b>
                        </p>
                        <p>
                          <b style={{ color: "#B6B6B6" }}>Email</b>
                          <br />
                          <b>{application.Info_Email || "N/A"}</b>
                        </p>
                        <p>
                          <b style={{ color: "#B6B6B6" }}>Telephone Number</b>
                          <br />
                          <b>{application.Info_Tel_no || "N/A"}</b>
                        </p>
                        <p className="mt-5 mb-5">
                          <b style={{ color: "#B6B6B6" }}>
                            Is Applicant the owner of the <br /> residential
                            property?
                          </b>
                          <br />
                          <b>{application.Info_Is_owner || "N/A"}</b>
                        </p>
                        <p>
                          <b style={{ color: "#B6B6B6" }}>MAILING ADDRESS</b>
                          <br />
                          <b>{application.Info_Mailing_address || "N/A"}</b>
                        </p>
                        <p>
                          <b style={{ color: "#B6B6B6" }}>CITY</b>
                          <br />
                          <b>{application.Info_Mailing_city || "N/A"}</b>
                        </p>
                        <p>
                          <b style={{ color: "#B6B6B6" }}>ZIP</b>
                          <br />
                          <b>{application.Info_Mailing_zip || "N/A"}</b>
                        </p>
                        <p>
                          <b style={{ color: "#B6B6B6" }}>HOME AGE</b>
                          <br />
                          <b>{application.Info_Home_age || "N/A"}</b>
                        </p>
                        <p>
                          <b style={{ color: "#B6B6B6" }}>NEW CONSTRUCTION</b>
                          <br />
                          <b>{application.Info_New_construction || "N/A"}</b>
                        </p>
                        <p>
                          <b style={{ color: "#B6B6B6" }}>HOME TYPE</b>
                          <br />
                          <b>{application.Info_Home_type || "N/A"}</b>
                        </p>
                      </div>
                    )}
                  </ListGroup>
                ) : (
                  <></>
                )}
              </Tab.Pane>
              {/* New equipment */}
              <Tab.Pane eventKey="new_quipment_info">
                <h3 className="mt-3 mb-3 text-info">New Equipment Info</h3>
                <Row>
                  <Col md={6}></Col>
                </Row>
                <Row className="px-0">
                  <Col className="mb-2 px-0" md={12}>
                    <Table striped hover responsive>
                      <thead className="bg-info text-white">
                        <tr>
                          <th>#</th>
                          <th>System Type</th>
                            {
                            application ? 
                            application.New_equipment[0].newEquip_System_type !== "Dryer" ?
                            application.New_equipment[0].newEquip_System_type !== "Washer" ?
                            <th>
                                BTU
                             </th>
                            :null : null : null
                            }
                       
                          <th>Vendor</th>
                          <th>Manu facturer</th>
                          <th>Model Number</th>
                          <th>Invoice</th>
                          {/* <th>{
                            application ? 
                            application.New_equipment[0].newEquip_System_type !== "Dryer" ?
                          application.New_equipment[0].newEquip_System_type !== "Washer" ?
                          "Tons"
                          :"Cubic sq.":"Cubic sq."
                            : null
                        }</th> */}
                          <th>Install Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {
                          application
                          ? application?.New_equipment?.length === 0
                            ? []
                            : application.New_equipment.map((equip, indx) => 
                            <tr>
                              <td>{indx+1}</td>
                              <td>{equip.newEquip_System_type}</td>
                                {
                                  equip.newEquip_System_type !== "Washer" ?
                                  equip.newEquip_System_type !== "Dryer"?
                                    <td>{equip.newEquip_Btu}</td>
                                  :null :null
                                }
                              <td>{equip.newEquip_Vendor}</td>
                              <td>{equip.newEquip_Manufacturer}</td>
                              <td>{equip.newEquip_Model_no}</td>
                              <td>{equip.newEquip_Invoice_no}</td>
                              {/* <td>{equip.newEquip_Tons}</td> */}
                              <td>{equip.newEquip_Purchase_date}</td>
                            </tr>)
                          : []
                        }

                      </tbody>

                    </Table>
                    {/* <MaterialTable
                      columns={[
                        {
                          title: "System Type",
                          field: "newEquip_System_type",
                        },
                        {
                          title: "Batch",
                          field: "Batch_code",
                        },
                        { title: "Vendor", field: "newEquip_Vendor" },
                        { title: "Quantity", field: "newEquip_Quantity" },
                        { title: "BTU", field: "newEquip_Btu" },
                        {
                          title: "Manufacturer",
                          field: "newEquip_Manufacturer",
                        },
                        {
                          title: "Model Number",
                          field: "newEquip_Model_no",
                        },
                        { title: "Invoice#", field: "newEquip_Invoice_no" },
                        {
                          title: "Purchase Date",
                          field: "newEquip_Purchase_date",
                        },
                        { title: "Type", field: "newEquip_Type" },
                        { title: "Tons", field: "newEquip_Tons" },
                        {
                          title: "Install Date",
                          field: "newEquip_Purchase_date",
                        },
                      ]}
                      data={
                        application
                          ? application?.New_equipment?.length === 0
                            ? []
                            : application.New_equipment
                          : []
                      }
                      title="New Equipments"
                      options={{
                        headerStyle: {
                          backgroundColor: "#233f88",
                          color: "#FFF",
                        },
                      }}
                    /> */}
                  </Col>
                  <Col md={6}>
                    {application ? (
                      application?.New_equipment?.length >= 1 ? (
                        <>
                          <h3 className="mt-3 mb-3 text-info">
                            Installer Information
                          </h3>
                          <ListGroup
                            className="mb-3"
                            style={{
                              display: "flex",
                              flexDirection: "row",
                            }}
                          >
                            <div style={{ marginRight: 50 }}>
                              <p>
                                <b style={{ color: "#B6B6B6" }}>
                                  Technician Name
                                </b>
                              </p>
                              <p>
                                <b style={{ color: "#B6B6B6" }}>
                                  Work Telephone
                                </b>
                              </p>
                              <p>
                                <b style={{ color: "#B6B6B6" }}>Company</b>
                              </p>
                              {
                                application.New_equipment[0].newEquip_System_type !== "Washer" ?
                                application.New_equipment[0].newEquip_System_type !== "Dryer" ?
                                  <p>
                                    <b style={{ color: "#B6B6B6" }}>
                                      Certification No.
                                    </b>
                                  </p>
                                :null
                                :null
                              }
                              
                              <p>
                                <b style={{ color: "#B6B6B6" }}>Email</b>
                              </p>
                              <p>
                                <b style={{ color: "#B6B6B6" }}>
                                  Date of Final
                                </b>
                              </p>
                              {
                                console.log(Math.abs(
                                new Date(application.New_equipment[0].newEquip_Purchase_date) -
                                  new Date(application.Installer_New_finaldate)
                              ) /
                                (1000 * 3600 * 24))
                              }
                              {
                                Math.abs(
                                new Date(application.New_equipment[0].newEquip_Purchase_date) -
                                  new Date(application.Installer_New_finaldate)
                              ) /
                                (1000 * 3600 * 24) >
                              120 ? <p>
                                  <b style={{ color: "#B6B6B6" }}>
                                  Reason for Exceeding 120 days
                                </b>
                              </p>:null
                              }
                            </div>
                            <div>
                              <p>
                                <b>{application.Installer_New_name || "N/A"}</b>
                              </p>
                              <p>
                                <b>
                                  {application.Installer_New_worktel || "N/A"}
                                </b>
                              </p>
                              <p>
                                <b>
                                  {application.Installer_New_companyname ||
                                    "N/A"}
                                </b>
                              </p>
                              <p>
                                <b>
                                  {
                                    application.New_equipment[0].newEquip_System_type !== "Washer" ?
                                    application.New_equipment[0].newEquip_System_type !== "Dryer" ?
                                      application.Installer_New_certno || "N/A"
                                    :null
                                    :null
                                  }
                                </b>
                              </p>
                              <p>
                                <b>
                                  {application.Installer_New_email || "N/A"}
                                </b>
                              </p>
                              <p>
                                <b>
                                  {application.Installer_New_finaldate || "N/A"}
                                </b>
                              </p>
                              {
                                Math.abs(
                                new Date(application.New_equipment[0].newEquip_Purchase_date) -
                                  new Date(application.Installer_New_finaldate)
                              ) /
                                (1000 * 3600 * 24) >
                              120 ? <p>
                                  <b>
                                    {application.Delay_Reason}
                                  </b>
                              </p>:null
                              }
                            </div>
                          </ListGroup>
                        </>
                      ) : (
                        <>No Equipment</>
                      )
                    ) : (
                      <></>
                    )}
                  </Col>
                  <Col
                    md={6}
                    className="mt-3 px-0 d-flex justify-content-center"
                  >
                    <div
                      style={{
                        height: width <= 767 ? "100%" : "200px",
                        width: "100%",
                      }}
                    >
                      <Table size="lg" striped bordered hover>
                        <thead className="bg-info text-white">
                          <tr className="py-5">
                            <th className="p-3">Equipment No.</th>
                            <th className="p-3">QTY</th>
                            <th className="p-3">Rebate</th>
                          </tr>
                        </thead>
                        <tbody>
                          {application ? (
                            <>
                              {application?.New_equipment?.map((eq, id) => (
                                <tr key={id + 1}>
                                  <td className="p-3">{id + 1}</td>
                                  <td className="p-3">
                                    {eq.newEquip_Quantity}
                                  </td>
                                  <td className="p-3">
                                    <span hidden>
                                      {
                                        (total_rebate += parseInt(
                                          eq.newEquip_rebate
                                        ))
                                      }
                                    </span>
                                    {eq.newEquip_rebate}
                                  </td>
                                </tr>
                              ))}
                            </>
                          ) : (
                            <></>
                          )}
                          <tr>
                            <td className="p-3 text-center" colSpan="2">
                              TOTAL
                            </td>
                            <td className="p-3">{total_rebate}</td>
                          </tr>
                        </tbody>
                      </Table>
                    </div>
                  </Col>
                </Row>
              </Tab.Pane>
              <Tab.Pane eventKey="old_quipment_info">
                <h3 className="mt-3 mb-3 text-info">
                  Existing/Old Equipment Info{" "}
                </h3>

                <Table striped hover responsive>
                  <thead className="bg-info text-white">
                    <tr>
                      <th>#</th>
                      <th>System Type</th>
                      <th>Years</th>
                      <th>Quantity</th>
                      {
                        application ?
                        application.New_equipment[0].newEquip_System_type !== "Washer" ?
                        application.New_equipment[0].newEquip_System_type !== "Dryer" ?
                          <th>TONS</th>
                        :<th>CUBIC SQ.</th>
                        :<th>CUBIC SQ.</th>:null
                      }
                      <th>Eqpmt. Condition</th>
                      {
                        application ?
                        application.New_equipment[0].newEquip_System_type !== "Washer" ?
                        application.New_equipment[0].newEquip_System_type !== "Dryer" ?
                          <th>SEER</th>
                        :null
                        :null:null
                      }
                      <th>Disposal Party</th>
                      <th>Disposal Date</th>
                    </tr>
                    </thead>
                    <tbody>
                      {
                        application
                        ? application?.Old_equipment?.length === 0
                          ? []
                          : application.Old_equipment.map((old_eqiup, indx) =>
                          <tr>
                            <td>{indx + 1}</td>
                            <td>{old_eqiup.oldEquip_System_type}</td>
                            <td>{old_eqiup.oldEquip_Years}</td>
                            <td>{old_eqiup.oldEquip_Quantity}</td>
                            <td>{old_eqiup.oldEquip_Tons}</td>
                            <td>{old_eqiup.oldEquip_Conditon}</td>
                            {
                              application ?
                              application.New_equipment[0].newEquip_System_type !== "Washer" ?
                              application.New_equipment[0].newEquip_System_type !== "Dryer" ?
                                <td>{old_eqiup.oldEquip_Seer}</td>
                              :null
                              :null:null
                            }
                            
                            <td>{old_eqiup.oldEquip_Disposal_party}</td>
                            <td>{old_eqiup.oldEquip_Disposal_date}</td>
                          </tr>)
                        : []
                      }
                    </tbody>

                  </Table>
                {/* <MaterialTable
                  columns={[
                    { title: "System Type", field: "oldEquip_System_type" },
                    { title: "Years", field: "oldEquip_Btu" },
                    { title: "Quantity", field: "oldEquip_Years" },
                    { title: "BTU", field: "oldEquip_Quantity" },
                    { title: "Eqpmt. Condition", field: "oldEquip_Tons" },
                    { title: "Seer", field: "oldEquip_Seer" },
                    {
                      title: "Disposal Party",
                      field: "oldEquip_Disposal_party",
                    },
                    {
                      title: "Date",
                      field: "oldEquip_Disposal_party",
                    },
                  ]}
                  data={
                    application
                      ? application?.Old_equipment?.length === 0
                        ? []
                        : application.Old_equipment
                      : []
                  }
                  title="Old Equipments"
                  options={{
                    headerStyle: {
                      backgroundColor: "#233f88",
                      color: "#FFF",
                    },
                  }}
                /> */}
              </Tab.Pane>
              <Tab.Pane eventKey="submission_of_documentation">
                <ModalImage
                  data={modalData}
                  show={modalShow}
                  onHide={() => setModalShow(false)}
                />
                <Container className="ml-2 mr-2">
                  <h3 className="mt-3 mb-3 text-info">Submitted Documents</h3>

                  <ListGroup className="mb-3">
                    {application ? (
                      <>
                        <Row>
                          <Col md={4}>
                            <div
                              style={{
                                width: "100%",
                                display: "flex",
                                flexDirection: "row",
                                alignItems: "center",
                              }}
                            >
                              <span stlye={{ width: "100%" }}>
                                Invoice <br />
                              </span>
                              {application.Submitted_docs ? (
                                application.Submitted_docs[0].invoice !==
                                null ? (
                                  <Button
                                    className="mb-2"
                                    variant={"success"}
                                    onClick={() =>
                                      handleRetrieveFile(
                                        inv
                                          ? inv
                                          : application.Submitted_docs[0]
                                              .invoice
                                      )
                                    }
                                    size={"sm"}
                                    style={{ marginLeft: "auto" }}
                                  >
                                    Download
                                  </Button>
                                ) : (
                                  <></>
                                )
                              ) : (
                                ""
                              )}
                            </div>
                            <Form.Group controlId="invoice" className="mb-3">
                              {roleId !== 4 ? (
                                <InputGroup>
                                  <Form.Control
                                    name="invoice"
                                    type="file"
                                    onChange={(e) =>
                                      handleOnChange(
                                        e,
                                        "invoice",
                                        application.Control_Number
                                      )
                                    }
                                  />
                                </InputGroup>
                              ) : (
                                <></>
                              )}

                              {invoice ? (
                                <>
                                  {fileCode ? (
                                    <>
                                      <p hidden>{(inv = fileCode)}</p>
                                      <Badge bg={"success"}>
                                        File Uploaded
                                      </Badge>{" "}
                                      <br />
                                    </>
                                  ) : (
                                    <>no upload</>
                                  )}
                                  Filename: {invoice.name} <br />
                                  File Type: {invoice.type} <br />
                                  <br />
                                </>
                              ) : (
                                <></>
                              )}
                            </Form.Group>
                          </Col>
                          <Col md={4}>
                            <div
                              style={{
                                width: "100%",
                                display: "flex",
                                flexDirection: "row",
                                alignItems: "center",
                              }}
                            >
                              <span>IRS-W9 </span>
                              {application.Submitted_docs ? 
                                application.Submitted_docs[0].irs_form !==
                                null ? (
                              <Button
                                className="mb-2"
                                variant={"success"}
                                onClick={() =>
                                  handleRetrieveFile(
                                    irs
                                      ? irs
                                      : application.Submitted_docs[0].irs_form
                                  )
                                }
                                size={"sm"}
                                style={{ marginLeft: "auto" }}
                              >
                                Download
                              </Button>): <small className="text-danger">(*No file uploaded)</small> :null
                            }
                            </div>

                            <Form.Group controlId="irs_form" className="mb-3">
                              {roleId !== 4 ? (
                                <InputGroup>
                                  <Form.Control
                                    name="irs_form"
                                    type="file"
                                    onChange={(e) =>
                                      handleOnChange(
                                        e,
                                        "irs_form",
                                        application.Control_Number
                                      )
                                    }
                                  />
                                </InputGroup>
                              ) : (
                                <></>
                              )}

                              {irs_form ? (
                                <>
                                  {fileCode ? (
                                    <>
                                      <p hidden>{(irs = fileCode)}</p>
                                      <Badge bg={"success"}>
                                        File Uploaded
                                      </Badge>{" "}
                                      <br />
                                    </>
                                  ) : (
                                    <>no upload</>
                                  )}
                                  Filename: {irs_form.name} <br />
                                  File Type: {irs_form.type} <br />
                                  <br />
                                </>
                              ) : (
                                <></>
                              )}
                            </Form.Group>
                          </Col>
                          <Col md={4}>
                            <div
                              style={{
                                width: "100%",
                                display: "flex",
                                flexDirection: "row",
                                alignItems: "center",
                              }}
                            >
                              <span>Letter of Authorization </span>
                              {application.Submitted_docs ? 
                                application.Submitted_docs[0].letter_authorization !==
                                null ? (
                              <Button
                                className="mb-2"
                                variant={"success"}
                                onClick={() =>
                                  handleRetrieveFile(
                                    loa
                                      ? loa
                                      : application.Submitted_docs[0]
                                          .letter_authorization
                                  )
                                }
                                size={"sm"}
                                style={{ marginLeft: "auto" }}
                              >
                                Download {" "}
                              </Button>) : <small className="text-danger"> (*No file uploaded)</small> :null
                              }
                            </div>
                            <Form.Group
                              controlId="letter_authorization"
                              className="mb-3"
                            >
                              {roleId !== 4 ? (
                                <InputGroup>
                                  <Form.Control
                                    name="letter_authorization"
                                    type="file"
                                    onChange={(e) =>
                                      handleOnChange(
                                        e,
                                        "letter_authorization",
                                        application.Control_Number
                                      )
                                    }
                                  />
                                </InputGroup>
                              ) : (
                                <></>
                              )}

                              {letter_authorization ? (
                                <>
                                  {fileCode ? (
                                    <>
                                      <p hidden>{(loa = fileCode)}</p>
                                      <Badge bg={"success"}>
                                        File Uploaded
                                      </Badge>{" "}
                                      <br />
                                    </>
                                  ) : (
                                    <>no upload</>
                                  )}
                                  Filename: {letter_authorization.name} <br />
                                  File Type: {letter_authorization.type} <br />
                                  <br />
                                </>
                              ) : (
                                <></>
                              )}
                            </Form.Group>
                          </Col>
                          <Col md={4}>
                            <div
                              style={{
                                width: "100%",
                                display: "flex",
                                flexDirection: "row",
                                alignItems: "center",
                              }}
                            >
                              <span>Disposal Slip </span>
                              {application.Submitted_docs ? 
                                application.Submitted_docs[0].disposal_slip !==
                                null ? (
                              <Button
                                className="mb-2"
                                variant={"success"}
                                onClick={() =>
                                  handleRetrieveFile(
                                    disp
                                      ? disp
                                      : application.Submitted_docs[0]
                                          .disposal_slip
                                  )
                                }
                                size={"sm"}
                                style={{ marginLeft: "auto" }}
                              >
                                Download
                              </Button>) : <small className="text-danger">(*No file uploaded )</small> : null 
                              }
                            </div>
                            <Form.Group
                              controlId="disposal_slilp"
                              className="mb-3"
                            >
                              {roleId !== 4 ? (
                                <InputGroup>
                                  <Form.Control
                                    name="disposal_slilp"
                                    type="file"
                                    onChange={(e) =>
                                      handleOnChange(
                                        e,
                                        "disposal_receipt",
                                        application.Control_Number
                                      )
                                    }
                                  />
                                </InputGroup>
                              ) : (
                                <></>
                              )}

                              {disposal_slip ? (
                                <>
                                  {fileCode ? (
                                    <>
                                      <p hidden>{(disp = fileCode)}</p>
                                      <Badge bg={"success"}>
                                        File Uploaded
                                      </Badge>{" "}
                                      <br />
                                    </>
                                  ) : (
                                    <>no upload</>
                                  )}
                                  Filename: {disposal_slip.name} <br />
                                  File Type: {disposal_slip.type} <br />
                                  <br />
                                </>
                              ) : (
                                <></>
                              )}
                            </Form.Group>
                          </Col>

                          <Col md={4}>
                            <div
                              style={{
                                width: "100%",
                                display: "flex",
                                flexDirection: "row",
                                alignItems: "center",
                              }}
                            >
                              <span>Other Document 1 </span>
                              {application.Submitted_docs ? 
                                application.Submitted_docs[0].other_doc2 !==
                                null ? (
                              <Button
                                className="mb-2"
                                variant={"success"}
                                onClick={() =>
                                  handleRetrieveFile(
                                    oth1
                                      ? oth1
                                      : application.Submitted_docs[0].other_doc2
                                  )
                                }
                                size={"sm"}
                                style={{ marginLeft: "auto" }}
                              >
                                Download
                              </Button>) : <small className="text-danger">(*No file uploaded)</small> :null 
                              }
                            </div>

                            <Form.Group controlId="other_doc1" className="mb-3">
                              {roleId !== 4 ? (
                                <InputGroup>
                                  <Form.Control
                                    name="other_doc1"
                                    type="file"
                                    onChange={(e) =>
                                      handleOnChange(
                                        e,
                                        "other_doc1",
                                        application.Control_Number
                                      )
                                    }
                                  />
                                </InputGroup>
                              ) : (
                                <></>
                              )}

                              {other_doc1 ? (
                                <>
                                  {fileCode ? (
                                    <>
                                      <p hidden>{(oth1 = fileCode)}</p>
                                      <Badge bg={"success"}>
                                        File Uploaded
                                      </Badge>{" "}
                                      <br />
                                    </>
                                  ) : (
                                    <>no upload</>
                                  )}
                                  Filename: {other_doc1.name} <br />
                                  File Type: {other_doc1.type} <br />
                                  <br />
                                </>
                              ) : (
                                <></>
                              )}
                            </Form.Group>
                          </Col>

                          <Col md={4}>
                            <div
                              style={{
                                width: "100%",
                                display: "flex",
                                flexDirection: "row",
                                alignItems: "center",
                              }}
                            >
                              <span>Other Document 2 </span>
                              {application.Submitted_docs ? 
                                application.Submitted_docs[0].other_doc3 !==
                                null ? (
                              <Button
                                className="mb-2"
                                variant={"success"}
                                onClick={() =>
                                  handleRetrieveFile(
                                    oth2
                                      ? oth2
                                      : application.Submitted_docs[0].other_doc3
                                  )
                                }
                                size={"sm"}
                                style={{ marginLeft: "auto" }}
                              >
                                Download
                              </Button>) : <small className="text-danger">(*No file uploaded)</small> : null 
                              }
                            </div>

                            <Form.Group
                              controlId="letter_authorization"
                              className="mb-3"
                            >
                              {roleId !== 4 ? (
                                <InputGroup>
                                  <Form.Control
                                    name="letter_authorization"
                                    type="file"
                                    onChange={(e) =>
                                      handleOnChange(
                                        e,
                                        "other_doc2",
                                        application.Control_Number
                                      )
                                    }
                                  />
                                </InputGroup>
                              ) : (
                                <></>
                              )}

                              {other_doc2 ? (
                                <>
                                  {fileCode ? (
                                    <>
                                      <p hidden>{(oth2 = fileCode)}</p>
                                      <Badge bg={"success"}>
                                        File Uploaded
                                      </Badge>{" "}
                                      <br />
                                    </>
                                  ) : (
                                    <>no upload</>
                                  )}
                                  Filename: {other_doc2.name} <br />
                                  File Type: {other_doc2.type} <br />
                                  <br />
                                </>
                              ) : (
                                <></>
                              )}
                            </Form.Group>
                          </Col>
                        </Row>
                      </>
                    ) : (
                      ""
                    )}
                  </ListGroup>
                </Container>
                <Container className="ml-2 mr-2">
                  {roleId !== 4 && roleId !== 7 ? (
                    <h3 className="mt-3 mb-3">Update Status</h3>
                  ) : (
                    <></>
                  )}
                  {roleId !== 7 ? (
                    <Row>
                      <Col md={12}>
                        <Modal show={showModal} onHide={handleModalClose}>
                          <Modal.Header closeButton>
                            <Modal.Title>
                              {status === 3 ? (
                                <>Reject Application</>
                              ) : (
                                <>Process Application</>
                              )}
                            </Modal.Title>
                          </Modal.Header>
                          <Modal.Body className="text-center">
                            {status === 3 ? (
                              <Container className="col-8 text-center btn-group-vertical">
                                <Form.Group
                                  controlId="role_id"
                                  className="mb-1"
                                >
                                  <Form.Select
                                    onChange={(e) => setReason(e.target.value)}
                                    value={reason}
                                    required
                                  >
                                    <option>Open this select menu</option>
                                    <option value="0">None</option>
                                    <option value="1">
                                      Applicant is not a GPA Account holder or
                                      property owner.
                                    </option>
                                    <option value="2">
                                      Application information provided was
                                      incorrect.
                                    </option>
                                    <option value="3">
                                      Equipment was not installed within 120
                                      days from invoice date.
                                    </option>
                                    <option value="4">
                                      Application was not submitted within 120
                                      days from install date.
                                    </option>
                                    <option value="5">
                                      Missing or incorrect Invoice.
                                    </option>
                                    <option value="6">
                                      Missing or incorrect W-9.
                                    </option>
                                    <option value="7">
                                      Missing or Incorrect Installer
                                      Information.
                                    </option>
                                    <option value="8">
                                      Other: Please contact GPA for more
                                      information.
                                    </option>
                                  </Form.Select>
                                </Form.Group>
                                <Button
                                  variant={"danger"}
                                  onClick={() => updateStatus(3, 0)}
                                >
                                  Reject Application
                                </Button>
                              </Container>
                            ) : roleId === 2 ? (
                              <Container>
                                <Button
                                  onClick={() => {
                                    setSwalInfo("Send to SPORD");
                                    updateStatus(1, 1);
                                  }}
                                >
                                  Send to SPORD
                                </Button>
                              </Container>
                            ) : roleId === 3 ? (
                              <Container className="col-8 text-center btn-group-vertical">
                                <Button
                                  onClick={() => {
                                    setSwalInfo("Send to Supervisor");
                                    updateStatus(1, 3);
                                  }}
                                  className="mb-1"
                                >
                                  Send to Supervisor
                                </Button>{" "}
                                <br />
                                <Button
                                  onClick={() => {
                                    setSwalInfo(
                                      "Send Back to Customer Service"
                                    );
                                    updateStatus(1, 4);
                                  }}
                                >
                                  Send Back to Customer Service
                                </Button>
                              </Container>
                            ) : roleId === 6 ? (
                              <Container className="col-8 text-center btn-group-vertical">
                                <Button
                                  onClick={() => {
                                    setSwalInfo("Send to Budget");
                                    updateStatus(1, 5);
                                  }}
                                >
                                  Send to Budget
                                </Button>
                                <Button
                                  onClick={() => {
                                    setSwalInfo("Send Back to SPORD");
                                    updateStatus(1, 1);
                                  }}
                                >
                                  Send Back to SPORD
                                </Button>
                              </Container>
                            ) : roleId === 4 ? (
                              <Container className="col-8 text-center btn-group-vertical">
                                <Button
                                  onClick={() => {
                                    setSwalInfo("Send to Accounting");
                                    updateStatus(1, 2);
                                  }}
                                >
                                  Send to Accounting
                                </Button>
                                <Button
                                  onClick={() => {
                                    setSwalInfo("Send Back to Supervisor");
                                    updateStatus(1, 3);
                                  }}
                                >
                                  Send Back to Supervisor
                                </Button>
                              </Container>
                            ) : roleId === 5 ? (
                              <Container className="col-8 text-center btn-group-vertical">
                                <Button
                                  variant={"success"}
                                  className="mb-1"
                                  onClick={() => {
                                    setSwalInfo("Approve Application");
                                    updateStatus(2, 0);
                                  }}
                                >
                                  Approve Application
                                </Button>
                                <br />
                                <Button
                                  variant={"danger"}
                                  className="mb-1"
                                  onClick={() => {
                                    setSwalInfo("(Decline) Send to Spord");
                                    updateStatus(1, 1);
                                  }}
                                >
                                  (Decline) Send to Spord
                                </Button>
                                <br />
                                <Button
                                  variant={"danger"}
                                  className="mb-1"
                                  onClick={() => {
                                    setSwalInfo("(Decline) Send to CS");
                                    updateStatus(1, 4);
                                  }}
                                >
                                  (Decline) Send to CS
                                </Button>
                              </Container>
                            ) : roleId === 1 ? (
                              <Container className="col-8 text-center btn-group-vertical">
                                <Button
                                  variant={"success"}
                                  onClick={() => {
                                    setSwalInfo("Approve Application");
                                    updateStatus(2, 0);
                                  }}
                                >
                                  Approve Application
                                </Button>
                                <br />
                                <Button
                                  onClick={() => {
                                    setSwalInfo("Send to CS");
                                    updateStatus(1, 4);
                                  }}
                                >
                                  Send to CS
                                </Button>{" "}
                                <br />
                                <Button
                                  onClick={() => {
                                    setSwalInfo("Send to SPORD");
                                    updateStatus(1, 1);
                                  }}
                                >
                                  Send to SPORD
                                </Button>{" "}
                                <br />
                                <Button
                                  onClick={() => {
                                    setSwalInfo("Send to Supervisor");
                                    updateStatus(1, 3);
                                  }}
                                >
                                  Send to Supervisor
                                </Button>{" "}
                                <br />
                                <Button
                                  onClick={() => {
                                    setSwalInfo("Send to Budget");
                                    updateStatus(1, 5);
                                  }}
                                >
                                  Send to Budget
                                </Button>{" "}
                                <br />
                                <Button
                                  onClick={() => {
                                    setSwalInfo("Send to Accounting");
                                    updateStatus(1, 2);
                                  }}
                                >
                                  Send to Accounting
                                </Button>{" "}
                                <br />
                              </Container>
                            ) : (
                              <></>
                            )}
                          </Modal.Body>
                        </Modal>
                        {roleId !== 4 ? (
                          <>
                            <Button
                              className="me-2"
                              variant={"info processbtn"}
                              onClick={() => changeStatusHandler(1)}
                            >
                              Process Sending
                            </Button>
                            <Button
                              className="me-2 rejectbtn"
                              variant={"danger"}
                              onClick={() => changeStatusHandler(3)}
                            >
                              Reject
                            </Button>
                          </>
                        ) : (
                          <></>
                        )}
                      </Col>
                    </Row>
                  ) : (
                    <></>
                  )}
                </Container>
              </Tab.Pane>
            </Tab.Content>
          </Col>
          {detailsToggle ? (
            <>
              {application ? (
                <>
                  <Col
                    className="customRow"
                    md={3}
                    style={{
                      backgroundColor: "rgb(243, 244, 249)",
                      borderLeft: "2px solid #d0d5db",
                    }}
                  >
                    <h4 className="mt-3 mb-3">Details</h4>
                    <h6 className="text-muted">Date Applied</h6>
                    <h6>{application.Application_Date}</h6>
                    <br />
                    <h6 className="text-muted">Current Stage</h6>
                    <h6>{application.Status}</h6>
                    <br />
                    <h6 className="text-muted">Current Department</h6>
                    <h6 className="mb-5">{application.Stage}</h6>

                    <h4>Event Logs</h4>
                    {console.log(logs)}
                    {logs ? (
                      <div style={{ height: "440px", overflowY: "auto" }}>
                        {logs.map((log, index) => (
                          <div key={index}>
                            <h6>{log.Action}</h6>
                            <small className="text-muted">
                              Made By: {log.Made_By}
                            </small>
                            <br />
                            <small className="text-muted">
                              Made On: {log.Made_On}
                            </small>
                            <hr />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p>Loading...</p>
                    )}
                  </Col>
                </>
              ) : (
                "loading . . "
              )}
            </>
          ) : (
            <></>
          )}
        </Row>
        <hr />
        {/* Comments section */}
        <br />
        <Row className="mt-2">
          <Col md={9}>
            <Form>
              <Form.Group className="mb-3" controlId="comment">
                <Form.Label>
                  <b>Comments</b>
                </Form.Label>
                <Form.Control
                  as="textarea"
                  rows={5}
                  onChange={(e) => changeCommentHandler(e.target.value)}
                  value={comment}
                />
              </Form.Group>
              <Button onClick={() => addCommentHandler()} variant="success">
                Submit
              </Button>
              <br />
              <br />
            </Form>
            <hr />

            {comments ? (
              comments.map((comment) => {
                const madeOn = new Date(comment.Made_On.replace(/-/g, "/"));
                const stringDate = madeOn.toString().substring(0, 15);
                return (
                  <div className="p-3 mb-1">
                    <h6>
                      {comment.Made_By} | {stringDate}
                      <br />
                      <small className="text-muted">{comment.role}</small>
                    </h6>
                    <h6 className="text-muted">{comment.Comment}</h6>
                  </div>
                );
              })
            ) : (
              <></>
            )}
          </Col>
          <Col md={3}></Col>
        </Row>
      </Tab.Container>
    </Container>
  );
}

export default ViewApplication;
