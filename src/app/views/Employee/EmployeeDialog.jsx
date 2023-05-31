import React, { useState, useEffect, forwardRef, useRef } from "react"
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, Container, Box, Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Autocomplete from '@material-ui/lab/Autocomplete';
import CloseIcon from '@material-ui/icons/Close';
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';
import {
  addEmployee,
  getSearchProvince,
  getSearchCommune,
  getSearchEmployee,
  getSearchProvinceByID,
  updateEmployee
} from "./EmployeeService";
import { toast } from "react-toastify";

toast.configure({
  autoClose: 2000,
  draggable: false,
  limit: 3,
});

const useStyles = makeStyles(() => ({
  title: {
    display: "flex",
    justifyContent: "space-between"
  },
  titleText: {
    fontSize: "25px", color: "green"
  },
  boxIcon: {
    height: "40px",
    width: "40px",
    textAlign: "center",
    borderRadius: "50%",
    cursor: "pointer",
    borderRadius: "50%",
    '&:hover': {
      backgroundColor: "#ccc",
      opacity: "0.7",
    }
  },
  iconCustom: {
    marginTop: "8px"
  },
  colorRequired: {
    color: "red"
  },
}));

function EmployeeDialog({ close, UsersGet, dataUpdate, actionCreate }, ref) {

  const classes = useStyles();

  const [employee, setEmployee] = useState({
    name: actionCreate ? '' : dataUpdate.name,
    code: actionCreate ? '' : dataUpdate.code,
    age: actionCreate ? '' : dataUpdate.age,
    phone: actionCreate ? '' : dataUpdate.phone,
    email: actionCreate ? '' : dataUpdate.email,
    province: null,
    district: null,
    commune: null
  })

  const [listAddress, setListAddress] = useState({
    province: [],
    district: [],
    commune: []
  })

  const listID = useRef({
    idProvince: undefined,
    idDistrict: undefined,
  })

  const [open, setOpen] = useState(true);

  const reff = useRef("form")

  const handleRequest = (result) => {
    if (result.data.code === 200) {
      UsersGet()
      handleClose()
      toast.success(result.data.message)

    } else {
      toast.warning(result.data.message)
    }
  }

  const handleClickSave = () => {
    if (actionCreate) {
      addEmployee(employee)
        .then(
          (result) => {
            // console.log(result.data)
            handleRequest(result)
          }
        )
        .catch(err => toast.error("Hệ thống đang lỗi, thử lại sau!"))

    } else {
      updateEmployee(employee, dataUpdate.id)
        .then(
          (result) => {
            // console.log(result.data)
            handleRequest(result)
          }
        )
        .catch(err => toast.error("Hệ thống đang lỗi, thử lại sau!"))
    }
  }

  useEffect(() => {
    getSearchProvince({}).then(res => {
      setListAddress({ ...listAddress, "province": res.data.data.filter(result => result.name !== null) })
    })

  }, [])

  useEffect(() => {
    setEmployee({ ...employee, "district": null, "commune": null })
    if (listID.current.idProvince !== undefined) {
      getSearchProvinceByID(listID.current.idProvince).then(res => {
        setListAddress({ ...listAddress, "district": res.data.data })
      })
    }
  }, [listID.current.idProvince])

  useEffect(() => {
    setEmployee({ ...employee, "commune": null })
    if (listID.current.idDistrict !== undefined) {
      getSearchCommune({ "id": listID.current.idDistrict }).then(res => {
        setListAddress({ ...listAddress, "commune": res.data.data.filter(result => result.district.id === listID.current.idDistrict) })
      })
    }
  }, [listID.current.idDistrict])


  const handleClose = () => {
    setOpen(false);
    close()
    // UsersGet()
  };


  return (
    <Container maxWidth="xs">
      <Dialog open={open} maxWidth="md">
        <DialogTitle id="draggable-dialog-title">
          <div className={classes.title}>
            <div className={classes.titleText}>
              {
                actionCreate ? "Thêm mới Nhân viên" : "Chỉnh sửa Nhân viên"
              }
            </div>
            <Box className={classes.boxIcon} onClick={handleClose} >
              <CloseIcon className={classes.iconCustom} />
            </Box>
          </div>
        </DialogTitle>
        <DialogContent>
          <ValidatorForm
            ref={reff}
            onSubmit={handleClickSave}
            onError={(errors) => console.log(errors)}
            noValidate={true}
          >
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextValidator
                  autoFocus
                  autoComplete="Name"
                  fullWidth
                  variant="outlined"
                  size="small"
                  label={
                    <span>
                      <span className={classes.colorRequired}> * </span>
                      {"Họ và tên"}
                    </span>
                  }
                  onChange={(e) => setEmployee({ ...employee, "name": e.target.value })}
                  name="name"
                  placeholder="VD: Nguyen Van An"
                  value={employee.name}
                  validators={["required", "toString"]}
                  errorMessages={["Trường này là bắt buộc!", "Tên không hợp lệ!"]}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextValidator
                  variant="outlined"
                  size="small"
                  fullWidth
                  id="codee"
                  label={
                    <span>
                      <span className={classes.colorRequired}> * </span>
                      {"Mã nhân viên"}
                    </span>
                  }
                  placeholder="VD: abcd123 (6->10 kí tự)"
                  value={employee.code}
                  onChange={(e) => setEmployee({ ...employee, "code": e.target.value })}
                  validators={["required"]}
                  errorMessages={["Trường này là bắt buộc!"]}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextValidator
                  variant="outlined"
                  size="small"
                  fullWidth
                  id="age"
                  label={
                    <span>
                      <span className={classes.colorRequired}> * </span>
                      {"Tuổi"}
                    </span>
                  }
                  placeholder="VD: 20"
                  value={employee.age}
                  onChange={(e) => setEmployee({ ...employee, "age": e.target.value })}
                  validators={["required", "minNumber:1", "isNumber"]}
                  errorMessages={["Trường này là bắt buộc!", "Tuổi không hợp lệ!"]}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Autocomplete
                  id="combo-box-demo"
                  options={listAddress.province}
                  getOptionLabel={(option) => { listID.current.idProvince = option.id; return option.name ? option.name : "" }}
                  onChange={(event, newValue) => {
                    event.preventDefault();
                    setEmployee({ ...employee, "province": newValue })

                  }}
                  // onInputChange={(event, newInputValue) => {
                  //   setProvince(newInputValue);
                  // }}
                  value={employee.province}
                  renderInput={(params) =>
                    <TextValidator {...params}
                      variant="outlined"
                      size="small"
                      fullWidth
                      id="address-province"
                      label={
                        <span>
                          <span className={classes.colorRequired}> * </span>
                          {"Tỉnh -Thành Phố"}
                        </span>
                      }
                      value={employee.province}
                      validators={["required"]}
                      errorMessages={["Trường này là bắt buộc!"]}

                    />
                  }
                />

              </Grid>
              <Grid item xs={12} sm={6}>
                <TextValidator
                  variant="outlined"
                  size="small"
                  fullWidth
                  id="phone"
                  label={
                    <span>
                      <span className={classes.colorRequired}> * </span>
                      {"Số điện thoại"}
                    </span>
                  }
                  placeholder="VD: 0345678999"
                  value={employee.phone}
                  onChange={(e) => setEmployee({ ...employee, "phone": e.target.value })}
                  validators={["required", "isNumber"]}
                  errorMessages={["Trường này là bắt buộc!", "Số điện thoại không hợp lệ!"]}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Autocomplete
                  id="combo-box-demo"
                  options={listAddress.district}
                  getOptionLabel={(option) => { listID.current.idDistrict = option.id; return option.name ? option.name : "" }}
                  onChange={(event, newValue) => {
                    event.preventDefault();
                    setEmployee({ ...employee, "district": newValue })
                  }}
                  value={employee.district}
                  renderInput={(params) =>
                    <TextValidator {...params}
                      variant="outlined"
                      size="small"
                      fullWidth
                      id="address-district"
                      label={
                        <span>
                          <span className={classes.colorRequired}> * </span>
                          {"Quận - Huyện"}
                        </span>
                      }
                      value={employee.district}
                      validators={["required"]}
                      errorMessages={["Trường này là bắt buộc!"]}
                    />
                  }
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextValidator
                  variant="outlined"
                  size="small"
                  label={
                    <span>
                      <span className={classes.colorRequired}> * </span>
                      {"Email"}
                    </span>
                  }
                  onChange={(e) => setEmployee({ ...employee, "email": e.target.value })}
                  name="email"
                  fullWidth
                  placeholder="VD: admin@gmail.com"
                  value={employee.email}
                  validators={["required", "isEmail"]}
                  errorMessages={["Trường này là bắt buộc!", "Email không hợp lệ!"]}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Autocomplete
                  id="combo-box-demo"
                  options={listAddress.commune}
                  getOptionLabel={(option) => option.name ? option.name : ""}
                  onChange={(event, newValue) => {
                    event.preventDefault();
                    setEmployee({ ...employee, "commune": newValue })
                  }}
                  value={employee.commune}
                  renderInput={(params) =>
                    <TextValidator {...params}
                      variant="outlined"
                      size="small"
                      fullWidth
                      id="address-commune"
                      label={
                        <span>
                          <span className={classes.colorRequired}> * </span>
                          {"Phường - Xã"}
                        </span>
                      }
                      value={employee.commune}
                      validators={["required"]}
                      errorMessages={["Trường này là bắt buộc!"]}
                    />
                  }
                />
              </Grid>
            </Grid>
            <DialogActions>
              <Button color="secondary" variant="contained" onClick={handleClose}>Hủy</Button>
              <Button type="submit" color="primary" variant="contained">Lưu</Button>
            </DialogActions>
          </ValidatorForm>
        </DialogContent>
      </Dialog>
    </Container>
  )
}

export default forwardRef(EmployeeDialog)