import React, { useState, useEffect, useRef } from "react"
import { withStyles, makeStyles } from '@material-ui/core/styles';
import {
  Button,
  Container,
  Paper,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  IconButton,
  Tooltip,
  Dialog,
  DialogActions,
  DialogTitle,
  Icon
} from '@material-ui/core';
import MaterialTable, {
  MTableToolbar,
} from 'material-table'
import SearchBar from "material-ui-search-bar";
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import { Breadcrumb } from "egret";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getSearchEmployee, deleteEmployee } from "./EmployeeService";
import EmployeeDialog from "./EmployeeDialog";

toast.configure({
  autoClose: 2000,
  draggable: false,
  limit: 3,
});

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    margin: "32px 32px 0"
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    margin: "10px 32px 20px"
  },
  header_buttonAdd: {
    marginTop: "10px"
  },
  container: {
    padding: "0",
  },
  paper: {
    boxShadow: "none",
    margin: "10px 32px 32px",
    color: "#FAFAFA",
  },
  tableHead: {
    backgroundColor: "#28A365"
  },
  button: {
    margin: theme.spacing(1),
  },
  colorText: {
    color: "#fff",
  },
  searchbar: {
    width: "300px",
    boxShadow: "rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px",
    '&:hover': {
      backgroundColor: "#F5F5F5",
    }
  },
  iconCustom: {
    '&:hover': {
      backgroundColor: "#E6E6E6",
    }
  },
  iconEdit: {
    color: "#7467EF"
  },
  iconDelete: {
    color: "#F44336"
  },
}));

const LightTooltip = withStyles((theme) => ({
  tooltip: {
    backgroundColor: theme.palette.common.white,
    color: 'rgba(0, 0, 0, 0.87)',
    boxShadow: theme.shadows[1],
    fontSize: 11,
    position: "absolute",
    top: '-15px',
    left: '-30px',
    width: '80px'
  }
}))(Tooltip);

function MaterialButton(props) {
  return (
    <div className="none_wrap">
      <LightTooltip title="Sửa bản ghi" placement="right-end" enterDelay={300} leaveDelay={200}>
        <IconButton size="small" onClick={() => props.onSelect(0)}>
          <Icon fontSize="small" color="primary">edit</Icon>
        </IconButton>
      </LightTooltip>
      <LightTooltip title="Xóa bản ghi" placement="right-end" enterDelay={300} leaveDelay={200}>
        <IconButton size="small" onClick={() => props.onSelect(1)}>
          <Icon fontSize="small" color="error">delete</Icon>
        </IconButton>
      </LightTooltip>
    </div>
  )
}

function Employee() {

  const classes = useStyles();

  const [users, setUsers] = useState([]);

  const usersRef = useRef()

  const idDeleteRef = useRef()
  const nameDeleteRef = useRef()

  const [dataUpdate, setDataUpdate] = useState({})

  const [searched, setSearched] = useState("");

  const [openDialogCreate, setOpenDialogCreate] = useState(false)
  const [openDialogUpdate, setOpenDialogUpdate] = useState(false)
  const [openDialogDelete, setOpenDialogDelete] = useState(false)

  let columns = [
    {
      title: "Thao tác",
      field: 'custom',
      align: 'left',
      width: '120px',
      headerStyle: {
        minWidth: "100px",
        paddingLeft: "30px",
        paddingRight: "0px",
      },
      cellStyle: {
        minWidth: "100px",
        paddingLeft: "30px",
        paddingRight: "0px",
        textAlign: "left",
      },
      render: (user) => (
        <MaterialButton
          onSelect={(method) => {
            if (method === 0) {
              handleUpdateUser(user)
            } else {
              setOpenDialogDelete(true);
              idDeleteRef.current = user.id
              nameDeleteRef.current = user.name
            }
          }}
        />
      ),
    },
    {
      title: "Mã nhân viên", field: 'code', align: 'left', width: '150',
      headerStyle: {
        minWidth: "150px",
        paddingLeft: "10px",
        paddingRight: "0px",
      },
      cellStyle: {
        minWidth: "150px",
        paddingLeft: "10px",
        paddingRight: "0px",
        textAlign: "left",
      },
    },
    {
      title: "Họ và tên", field: 'name', align: 'left', width: '150',
      headerStyle: {
        minWidth: "150px",
        paddingLeft: "10px",
        paddingRight: "0px",
      },
      cellStyle: {
        minWidth: "150px",
        paddingLeft: "10px",
        paddingRight: "0px",
        textAlign: "left",
      },
    },
    {
      title: "Tuổi", field: 'age', align: 'left', width: '100',
      headerStyle: {
        minWidth: "100px",
        paddingLeft: "10px",
        paddingRight: "0px",
      },
      cellStyle: {
        minWidth: "100px",
        paddingLeft: "18px",
        paddingRight: "0px",
        textAlign: "left",
      },
    },
    {
      title: "Số điện thoại", field: 'phone', width: '150',
      headerStyle: {
        minWidth: "150px",
        paddingLeft: "10px",
        paddingRight: "0px",
      },
      cellStyle: {
        minWidth: "150px",
        paddingLeft: "10px",
        paddingRight: "0px",
        textAlign: "left",
      },
    },
    {
      title: "Email", field: 'email', align: 'left', width: '150',
      headerStyle: {
        minWidth: "150px",
        paddingLeft: "10px",
        paddingRight: "0px",
      },
      cellStyle: {
        minWidth: "150px",
        paddingLeft: "10px",
        paddingRight: "0px",
        textAlign: "left",
      },
    },
  ]
  const UsersGet = () => {
    getSearchEmployee({}).then(res => {
      usersRef.current = res.data.data
      setUsers(res.data.data)
    })
  }

  useEffect(() => {
    UsersGet()
  }, [])

  
  const handleUpdateUser = (user) => {
    setOpenDialogUpdate(true)
    setDataUpdate(user)
  }
  const handleDeleteUser = () => {
    deleteEmployee(idDeleteRef.current)
      .then(
        (result) => {
          setUsers(users.filter(user => user.id !== idDeleteRef.current))
          if(result.data.code === 200) {
            toast.success(result.data.message)
          }
        }
      )
      .catch(err => toast.error("Hệ thống đang lỗi, xin thử lại!"))
    setOpenDialogDelete(false)
  }


  const requestSearch = (searchedVal) => {
    const filteredRows = usersRef.current.filter((row) => {
      return row.name.toLowerCase().includes(searchedVal.toLowerCase());
    });
    setUsers(filteredRows);
  };

  const cancelSearch = () => {
    setSearched("");
    requestSearch(searched);
  };

  const CloseDialog = () => {
    setOpenDialogCreate(false)
    setOpenDialogUpdate(false)
    setOpenDialogDelete(false)
  }

  const DialogDelete = ({ name }) => {
    return (
      <Dialog open={openDialogDelete} onClose={CloseDialog} maxWidth="xs">
        <DialogTitle>Bạn có muốn xóa nhân viên {name} ?</DialogTitle>
        <DialogActions >
          <Button color="secondary" variant="contained" onClick={CloseDialog}>Không</Button>
          <Button color="primary" variant="contained" onClick={handleDeleteUser}>Có</Button>
        </DialogActions>
      </Dialog>
    )
  }


  return (
    <div className={classes.root}>
      <div className={classes.title}>
        <Breadcrumb routeSegments={[{ name: "Quản lý", path: "" }, { name: "Quản Lý Nhân Viên" }]} />
      </div>
      <Box className={classes.header}>
        <Box>
          <Button className={classes.header_buttonAdd} size="medium" variant="contained" color="primary" onClick={(e) => { setOpenDialogCreate(true) }} >
            + Thêm mới
          </Button>
        </Box>
        <SearchBar
          placeholder="Tìm kiếm"
          className={classes.searchbar}
          value={searched}
          onChange={(searchVal) => requestSearch(searchVal)}
          onCancelSearch={() => cancelSearch()}
        />
      </Box>
      <Container className={classes.container} maxWidth="xl">
        <Paper className={classes.paper}>
          <TableContainer component={Paper}>
            <MaterialTable
              title="Bảng nhân viên"
              data={users}
              columns={columns}
              options={{
                selection: false,
                actionsColumnIndex: -1,
                paging: true,
                // search: false,
                rowStyle: (rowData, index) => ({
                  backgroundColor: (index % 2 === 1) ? '#EEE' : '#FFF',
                }),
                maxBodyHeight: '450px',
                minBodyHeight: '370px',
                headerStyle: {
                  backgroundColor: '#358600',
                  color: '#fff',
                },
                padding: 'dense',
                toolbar: false,
                pageSizeOptions: [5, 10, 50, 100]
              }}
              localization={{
                pagination: {
                  labelDisplayedRows: '{from}-{to} trong {count}',
                  labelRowsSelect: '',
                  firstTooltip: 'Trang đầu',
                  previousTooltip: 'Trang trước',
                  nextTooltip: 'Trang sau',
                  lastTooltip: 'Trang cuối'
                }
              }}
            />
          </TableContainer>
        </Paper>
      </Container>

      {
        (openDialogCreate || openDialogUpdate) && <EmployeeDialog
          close={CloseDialog}
          UsersGet={UsersGet}
          dataUpdate={dataUpdate}
          actionCreate={openDialogCreate}
        />
      }
      {
        openDialogDelete && <DialogDelete name={nameDeleteRef.current} />
      }
    </div>

  );
}

export default Employee;

