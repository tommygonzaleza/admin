import React, { useState,useEffect } from "react";
import {
  Avatar,
  Button,
  Card,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableRow,
  TextField,
  List,
  ListItem,
  ListItemText,
  DialogTitle,
  Dialog,
} from "@material-ui/core";
import { Formik } from "formik";
import axios from "../../../../axios";
import { Alert } from '@material-ui/lab';
import Snackbar from '@material-ui/core/Snackbar';

const StaffDetails = ({ user, staff_id }) => {
  const initialValues = {
    "first_name": user?.user.first_name,
    "last_name": user?.user.last_name,
    "address": user?.address,
    "phone": user?.phone
  }
  const customerInfo = [
    {
      title: "First Name",
      name: "first_name",
      value: initialValues.first_name,
    },
    {
      title: "Last Name",
      name: "last_name",
      value: initialValues.last_name,
    },
    {
      title: "Phone number",
      name: "phone",
      value: initialValues.phone,
    },
    {
      title: "Address",
      name: "address",
      value: initialValues.address,
    },
  ];
  const [msg, setMsg] = useState({ alert: false, type: "", text: "" });
  const [roleDialog, setRoleDialog] = useState(false);
  const [roles, setRoles] = useState(null);
  const updateMemberProfile = (values) => {
    axios.put(`${process.env.REACT_APP_API_HOST}/v1/auth/academy/student/${staff_id}`, { ...values })
      .then(data => {
        setMsg({ alert: true, type: "success", text: "User profile updated successfully" })
      })
      .catch(error => {
        console.log(error)
        setMsg({ alert: true, type: "error", text: error.detail || `${error.first_name[0]}: First Name` || error.email[0] || error.phone[0] })
      })
  }
  const updateRole = (role) => {
    axios.put(`${process.env.REACT_APP_API_HOST}/v1/auth/academy/member/${user.user.id}`,{role: role})
    .then(({data}) => {
      console.log(data)
      setMsg({ alert: true, type: "success", text: "Role updated successfully" }) })
    .catch(error => setMsg({ alert: true, type: "error", text: error.detail}))
  }
  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_HOST}/v1/auth/role`)
    .then(({data}) => setRoles(data))
    .catch(error => setMsg({ alert: true, type: "error", text: error.detail}))
  } , [])
  return (
    <Card className="pt-6" elevation={3}>
      <div className="flex-column items-center mb-6">
        <Avatar className="w-84 h-84" src="/assets/images/faces/10.jpg" />
        <h5 className="mt-4 mb-2">{user?.user.first_name + " " + user?.user.last_name}</h5>
        <div className="px-3 text-11 py-3px border-radius-4 text-white bg-green mr-3" onClick={()=> setRoleDialog(true)} style={{ cursor: "pointer" }}>
          {user?.role.name.toUpperCase()}
        </div>
      </div>
      <Divider />
      <Formik
        initialValues={initialValues}
        onSubmit={(values) => updateMemberProfile(values)}
        enableReinitialize={true}
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          handleSubmit,
          isSubmitting,
          setSubmitting,
          setFieldValue,
        }) => (
          <form className="p-4" onSubmit={handleSubmit}>
            <Table className="mb-4">

              <TableBody>
                <TableRow>
                  <TableCell className="pl-4">Email</TableCell>
                  <TableCell>
                    <div>{user?.user.email}</div>
                    <small className="px-1 py-2px bg-light-green text-green border-radius-4">
                      EMAIL VERIFIED
                    </small>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="pl-4">Github</TableCell>
                  <TableCell>
                    <div>{user?.user.github}</div>
                    {user?.user.github == undefined ?
                      <small className="px-1 py-2px bg-light-error text-red border-radius-4">
                        GITHUB UNVERIFIED
                    </small> :
                      <small className="px-1 py-2px bg-light-green text-green border-radius-4">
                        GITHUB VERIFIED
                    </small>
                    }

                  </TableCell>
                </TableRow>
                {customerInfo.map((item, ind) => (
                  <TableRow key={ind}>
                    <TableCell className="pl-4">{item.title}</TableCell>
                    <TableCell>
                      <TextField
                        placeholder={item.title}
                        name={item.name}
                        size="small"
                        variant="outlined"
                        defaultValue=""
                        required
                        value={values[item.name]}
                        onChange={handleChange}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="flex-column items-start px-4 mb-4">
              <Button color="primary" variant="contained" type="submit">
                Update Member Details
              </Button>
            </div>
          </form>
        )}
      </Formik>
      {msg.alert ? (<Snackbar open={msg.alert} autoHideDuration={15000} onClose={() => setMsg({ alert: false, text: "", type: "" })}>
        <Alert onClose={() => setMsg({ alert: false, text: "", type: "" })} severity={msg.type}>
          {msg.text}
        </Alert>
      </Snackbar>) : ""}
      <Dialog
        onClose={() => setRoleDialog(false)}
        open={roleDialog}
        aria-labelledby="simple-dialog-title"
      >
        <DialogTitle id="simple-dialog-title">Change Member Role</DialogTitle>
        <List>
          {roles?.map((role, i) => (
            <ListItem
              button
              onClick={() => {
                updateRole(role.slug);
                setRoleDialog(false);
              }}
              key={i}
            >
              <ListItemText primary={role.name.toUpperCase()} />
            </ListItem>
          ))}
        </List>
      </Dialog>
    </Card>
  );
};




export default StaffDetails;