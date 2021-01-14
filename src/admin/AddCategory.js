import React,{useState} from 'react'
import Layout from "../core/Layout";
import {isAuthenticated} from "../auth";
import {Link} from "react-router-dom";
import {createCategory,createProduct} from "./apiAdmin";

const AddCategory = () =>{

    const [name, setName] = useState('');
    const [error, setError] = useState(false);
    const [success, setSuccess] = useState(false);


//destructure user and token from localSorage
    const {user, token} = isAuthenticated();

    const handleChange= (e)=>{
        setError('');
        setName(e.target.value);
    };

    const clickSubmit =(e)=>{
        e.preventDefault(e);
        setError('');
        setSuccess(false);
        createCategory(user._id, token, {name})
            .then(data =>{
                if(data.error){
                    setError(true)
                }else{
                    setError('');
                    setSuccess(true);
                }
            })
    };




    const newCategoryForm =() =>(
        <form onSubmit={clickSubmit}>
            <div className="form-group">
                <label className="text-muted">Name</label>
                <input type="text" className="form-control"
                 onChange={handleChange} value={name}
                autoFocus required/>
            </div>
            <button className="btn btn-primary btn-block">Créer</button>
        </form>
    );

    const showSuccess = ()=>{
        if(success){
            return <div className="alert alert-success text-center"><h5 className="text-success">{name} est crée</h5></div>
        }
    };

    const showError = ()=>{
        if(error){
            return <div className="alert alert-danger text-center"><h5 className="text-danger">La catégorie doit être unique</h5></div>
        }
    };

    const goBack = ()=>(
        <div className="mt-2">
            <Link to="/admin/dashboard" className="btn btn-info btn-block">
                Retourner au tableau de bord
            </Link>
        </div>
    );



    return(
        <Layout title="Ajouter une nouvelle catégorie" description={`Bienvenue ${user.name} ,prêt à ajouter une nouvelle catégorie`}>
            <div className="row">
                <div className="card card-body bg-light col-md-6 offset-md-3">
                    {showSuccess()}
                    {showError()}
                    {newCategoryForm()}
                    {goBack()}

                </div>
            </div>
        </Layout>
    )


};

export default AddCategory;
