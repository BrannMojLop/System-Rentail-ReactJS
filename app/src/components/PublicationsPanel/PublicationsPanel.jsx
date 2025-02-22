import * as React from 'react';
import Button from '@mui/material/Button';
import BasicTable from './utils/BasicTable';
import Snackbar from '@mui/material/Snackbar';
import Stack from '@mui/material/Stack';
import MuiAlert from '@mui/material/Alert';
import SimpleBackdrop from '../utils/SimpleBackdrop/SimpleBackdrop'
import ModalCreate from "./utils/ModalCreate/ModalCreate"
import "./publications-panel.sass"
import SelectFilterD from './utils/SelectFilter/SelectFilterD'
import SelectFilterM from './utils/SelectFilter/SelectFilterM'

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function PublicationsPanel(){

    const [ publicationsData, setpublicationsData ] = React.useState(null)
    const [ loading, setLoading ] = React.useState(null);
    const [ msg, setMsg ] = React.useState({status: "success", message: "Publicacion Creada con Exito!"})
    const [ selectFilter, setSelectFilter ] = React.useState(null);
    const [ refresh, setRefresh ] = React.useState(false);

    React.useEffect(() => {

        setLoading(true);

        const getpublications = async (url) => {
          try {
            const config = {
                "Authorization": "Bearer " + JSON.parse(localStorage.getItem('user')).token
            }

            const request = await fetch(url, {
              headers: config
            }) 
            const jsonRequest = await request.json() 
            setpublicationsData(jsonRequest)
            setLoading(false)

            } catch (e){ 
              setpublicationsData([])
              setLoading(false) 
            } 
          } 
          getpublications('https://system-rentail-api.herokuapp.com/publications?id_lessor=' + JSON.parse(localStorage.getItem('user')).id)
        },[]) 

        React.useEffect(() => {

          setLoading(true);

          const getpublications = async (url) => {
            try {
              const config = {
                  "Authorization": "Bearer " + JSON.parse(localStorage.getItem('user')).token
              }
  
              const request = await fetch(url, {
                headers: config
              }) 
                const jsonRequest = await request.json() 
                let filterPublications = null
                switch (selectFilter){
                  case "Activas":
                    filterPublications = jsonRequest.filter(publication => {
                      if (publication.status){
                        return publication
                      }
                    })
                    setpublicationsData(filterPublications);
                    setLoading(false);
                    break
  
                  case "Deshablitadas":
                    filterPublications = jsonRequest.filter(publication => {
                      if (!publication.status){
                        return publication
                      }
                    })                  
                    setpublicationsData(filterPublications);
                    setLoading(false);
                    break

                  default:
                    setpublicationsData(jsonRequest);
                    setLoading(false);
                    break
                }
              } catch (e){ 
                console.log(e); 
              } } 
      
              getpublications('https://system-rentail-api.herokuapp.com/publications?id_lessor=' + JSON.parse(localStorage.getItem('user')).id)

        },[selectFilter]) 

        React.useEffect(() => {

          setLoading(true);
  
          const getpublications = async (url) => {
            try {
              const config = {
                  "Authorization": "Bearer " + JSON.parse(localStorage.getItem('user')).token
              }
  
              const request = await fetch(url, {
                headers: config
              }) 
              const jsonRequest = await request.json() 
              setpublicationsData(jsonRequest)
              setLoading(false)
  
              } catch (e){ 
                setpublicationsData([])
                setLoading(false) 
              } 
            } 
            getpublications('https://system-rentail-api.herokuapp.com/publications?id_lessor=' + JSON.parse(localStorage.getItem('user')).id)
          },[refresh]) 

        const [openModal, setOpenModal] = React.useState(false);

        const handleClickOpen = () => {
            setOpenModal(true);
        };

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
            <div className="header-publications">
                <h3>Mis Publicaciones</h3>
                <SelectFilterD setSelectFilter={setSelectFilter} />
                <SelectFilterM setSelectFilter={setSelectFilter} />
                <div className="actions-publications-panel">
                    <Button onClick={handleClickOpen} className="btn-publication-panel"variant="outlined"> <strong>+</strong> Nueva Publicación</Button>
                </div>
            </div>
            <div className="table-publications-panel">
              {publicationsData !== null ? <BasicTable refresh={refresh} setRefresh={setRefresh} publicationsData={publicationsData} setLoading={setLoading} /> : null}
            </div> 
            {openModal ? <ModalCreate publicationsData={publicationsData} setOpenAlert={setOpenAlert} setMsg={setMsg} setLoading={setLoading} openModal={openModal} setOpenModal={setOpenModal} /> : null}
            <Stack spacing={2}>
            <Snackbar open={openAlert} autoHideDuration={6000} onClose={handleCloseAlert}>
              <Alert onClose={handleCloseAlert} severity={msg.status} sx={{ width: '100%' }}>
                {msg.message}
              </Alert>
            </Snackbar>
            </Stack>
        </>
    )
}