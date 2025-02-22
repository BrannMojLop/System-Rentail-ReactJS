import * as React from 'react';
import PropTypes from 'prop-types';
import SimpleBackdrop from '../../../utils/SimpleBackdrop/SimpleBackdrop'
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import "./modal-edit.sass"

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));

const BootstrapDialogTitle = (props) => {
  const { children, onClose, ...other } = props;

  return (
    <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
      {children}
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
};

BootstrapDialogTitle.propTypes = {
  children: PropTypes.node,
  onClose: PropTypes.func.isRequired,
};

export default function ModalEdit(props) {

  const [ editData, setEditData ] = React.useState(props.productData[0])
  const [ loading, setLoading ] = React.useState(null);
  const [selectCategories, setSelectCategories] = React.useState([]);

  React.useEffect(() => {
    const getOptions = async (url) => {
        const request = await fetch(url)
        const jsonRequest = await request.json()
        setSelectCategories(jsonRequest)
    }

    getOptions("https://system-rentail-api.herokuapp.com/categories")

},[])


  const handleClose = async (event) => {
   
    if (event.target.id === 'edit-product'){
      if (editData.name === '' || editData.image === '' || editData.id_category === ''){
        props.setMsg({status: "error", message: "Completa los datos requeridos (*)"})
        props.setOpenAlert(true)
      } else {
        setLoading(true)
        try {
          const url = 'https://system-rentail-api.herokuapp.com/products/' + props.productData[0]._id
          const config = {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + JSON.parse(localStorage.getItem('user')).token 
              },
              body: JSON.stringify(editData)
              
          } 
          await fetch(url, config)
          props.setMsg({status: "success", message: "Producto Actualizado con Exito!"})
          props.setOpenAlert(true)
          setTimeout(() => {
            window.location.href = "/user/panel-products"
          }, 1000)
  
        } catch (e){
          console.log(e);
        } 
      } 
    } else {
      props.setOpenModal(false);
      setEditData(props.productData[0])
    }
  };

  const handleChange = (event) => {
    if (event.target.id === "name"){
      setEditData({...editData, name:event.target.value});
    } else if (event.target.id === "description"){
      setEditData({...editData, description:event.target.value})
    } else if (event.target.id === "image") {
      setEditData({...editData, image:event.target.value})
    } else {
      setEditData({...editData, id_category:event.target.value})
    }
  }

  const [openAlert, setOpenAlert] = React.useState(false);
      
  const handleCloseAlert = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpenAlert(false);
  };

  return (
    <>
    {loading ? <SimpleBackdrop loading={true} />: null} 
    <div >
      <BootstrapDialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={props.openModal}
      >
        <BootstrapDialogTitle id="customized-dialog-title" onClose={handleClose}>
          Editar: {props.productData[0].name}
        </BootstrapDialogTitle>
        <DialogContent dividers className="dialog-content">
            <TextField 
              onChange={handleChange} 
              className="input-product" 
              id="name" label="Nombre" 
              defaultValue= {editData.name}
              required="true"
            />
            <TextField
              id="category"
              select
              label="Categoría"
              className="input-product"
              value={editData.id_category}
              onChange={handleChange}
              required="true"
            >
              {selectCategories.map((o) => <MenuItem key={o._id} value={o._id}>{o.name}</MenuItem> )}
            </TextField>
            <TextField onChange={handleChange} 
              className="input-product url-img" 
              id="image" 
              label="Imagen (URL)" 
              value={editData.image}
              required="true"
            />
            <TextField
            onChange={handleChange}
            className="input-product-multiline"
            label="Descripción"
            id="description"
            multiline
            rows={4}
            defaultValue="Default Value"
            variant="standard"
            value={editData.description}
          />
        </DialogContent>
        <DialogActions>
          <Button id="edit-product" autoFocus onClick={handleClose}>
            Aplicar Cambios
          </Button>
        </DialogActions>
      </BootstrapDialog>
    </div>
    </>
  );
}