import React from 'react'
import Layout from "../core/Layout";
import {isAuthenticated} from "../auth";
import {Link} from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faInfo } from '@fortawesome/free-solid-svg-icons'
import { faUserCog } from '@fortawesome/free-solid-svg-icons'
import { faCogs } from '@fortawesome/free-solid-svg-icons'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import { faBookMedical } from '@fortawesome/free-solid-svg-icons'
import { faHistory } from '@fortawesome/free-solid-svg-icons'

const AdminDashboard = () =>{

    const {user: {_id,name,email, role}} = isAuthenticated();
    
    const adminLinks = ()=>{
        return(
            <div className="card">
                <h5 className="card-header bg-primary"><FontAwesomeIcon icon={faUserCog} />  Liens d'administrateur</h5>
                <ul className="list-group">
                    <li className="list-group-item">
                        <Link className="nav-link" to="/create/category"><FontAwesomeIcon icon={faPlus} />  Créer une catégorie</Link>
                    </li>
                    <li className="list-group-item">
                        <Link className="nav-link" to="/create/product"><FontAwesomeIcon icon={faBookMedical} />  Ajouter un livre</Link>
                    </li>

                    <li className="list-group-item">
                        <Link className="nav-link" to="/admin/orders"><FontAwesomeIcon icon={faHistory} />  Afficher les commandes</Link>
                    </li>
                    <li className='list-group-item'>
                        <Link
                            to='/admin/products'
                            className='nav-link'>
                                <FontAwesomeIcon icon={faCogs} />   Gérer les livres
                        </Link>
                    </li>     
                </ul>
            </div>
        )
    };

    const adminInfo = ()=>{
        return(
            <div className="card mb-5">
                <h5 className="card-header bg-primary"><FontAwesomeIcon icon={faInfo} />  Information de l'utilisateur</h5>
                <ul className="list-group">
                    <li className="list-group-item p-4"><strong>Nom : </strong>{name}</li>
                    <li className="list-group-item p-4"><strong>Email : </strong>{email}</li>
                    <li className="list-group-item p-4"><strong>Role : </strong>{role === 1 ? 'Admin' : 'Registered User'}</li>
                </ul>
            </div>
        )
    };



    return(
        <Layout title="Tableau de bord" description={`Bienvenue ${name} !`} className="container-fluid">
            <div className="row pb-5">
                <div className="col-5">
                    {adminLinks()}
                </div>
                <div className="col-7">
                    {adminInfo()}
                </div>
            </div>
        </Layout>
    )
};

export default AdminDashboard;
