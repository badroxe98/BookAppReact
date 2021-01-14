import React,{Fragment} from 'react'
import {Link, withRouter} from 'react-router-dom'
import {signout,isAuthenticated} from "../auth"
import {itemTotal} from "./cardHelpers";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHome } from '@fortawesome/free-solid-svg-icons'
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons'
import { faTachometerAlt } from '@fortawesome/free-solid-svg-icons'
import { faSignInAlt } from '@fortawesome/free-solid-svg-icons'
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons'
import { faUserPlus } from '@fortawesome/free-solid-svg-icons'
import { faStore } from '@fortawesome/free-solid-svg-icons'
import { faComments } from '@fortawesome/free-solid-svg-icons'

const isActive = (history, path) => {
    if (history.location.pathname === path) {
        return {color: "#964938"};
    }
    else {
        return {color: "#ffffff"};
    }
};
const {user: {_id,name,email, role}} = isAuthenticated();

const Menu = ({history}) => (
    <div>
        <ul className="nav nav-tabs p-2 bg-primary">
            <li className="nav-item">
            
                <Link className="nav-link" style={isActive(history,'/')} to="/"><FontAwesomeIcon icon={faHome} />    Accueil</Link>
            </li>

            <li className="nav-item">
                <Link className="nav-link" style={isActive(history,'/shop')} to="/shop"><FontAwesomeIcon icon={faStore} />    Magasin</Link>
            </li>

            {isAuthenticated() &&(
                <li className="nav-item">
                    <Link className="nav-link" style={isActive(history,'/cart')} to="/cart"><FontAwesomeIcon icon={faShoppingCart} />   Panier{" "} <sup><small className="badge badge-pill badge-danger p-1">{itemTotal()}</small></sup></Link>
                </li>
            )}
          
            {isAuthenticated() && isAuthenticated().user.role === 0 && (
                <li className="nav-item">
                    <Link className="nav-link" style={isActive(history,'/user/dashboard')} to="/user/dashboard"><FontAwesomeIcon icon={faTachometerAlt} />   Tableau de bord</Link>
                </li>
            )}

            {isAuthenticated() && isAuthenticated().user.role === 1 && (
                <li className="nav-item">
                    <Link className="nav-link" style={isActive(history,'/admin/dashboard')} to="/admin/dashboard"><FontAwesomeIcon icon={faTachometerAlt} />  Tableau de bord</Link>
                </li>
            )}

            {isAuthenticated() && (
                <li className="nav-item">
                    {/* <a className="nav-link text-white" href={`https://lets-chat-app98.herokuapp.com/chat.html?username=${name}&usercolor=Blue&room=D%C3%A9veloppment+web`}><FontAwesomeIcon icon={faComments} />  Forum de discussion</a> */}
                    <Link className="nav-link" style={isActive(history,'/forum')} to="/forum"><FontAwesomeIcon icon={faComments} />  Forum de discussion</Link>

                </li>
            )}

            {!isAuthenticated() && (
                <Fragment>
                    <li className="nav-item ml-auto">
                        <Link className="nav-link" style={isActive(history,"/signin")} to="/signin"><FontAwesomeIcon icon={faSignInAlt} />   S'identifier</Link>
                    </li>

                    <li className="nav-item">
                        <Link className="nav-link" style={isActive(history,"/signup")} to="/signup"><FontAwesomeIcon icon={faUserPlus} />  S'inscrire</Link>
                    </li>
                </Fragment>
            )}

            {isAuthenticated() && (
                <li className="nav-item ml-auto">
                <span className="nav-link" style={{cursor:'pointer',color:'#ffffff'}} onClick={()=> signout(()=>{
                    history.push('/');
                })} >
                    <FontAwesomeIcon icon={faSignOutAlt} />  Se déconnecter
                </span>
                </li>
            )}


        </ul>
    </div>
);

export default withRouter(Menu);
