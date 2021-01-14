import React, {useState} from "react";
import Layout from "../core/Layout";
import {signin,authenticate,isAuthenticated} from "../auth";
import {Redirect} from "react-router-dom";

const Signin = () =>{

    const [values, setValues] = useState({
        email:'mohamed2@gmail.com',
        password:'1234567',
        error:'',
        loading: false,
        redirectedToReferrer: false
    });

    const {email, password,loading,error,redirectedToReferrer} = values;
    const {user} = isAuthenticated();

    const handleChange = name => event =>{
        setValues({...values, error:false, [name]: event.target.value});
    };



    const clickSubmit = (event)=>{
        event.preventDefault();
        setValues({...values,error: false,loading: true});
        signin({email:email,password:password})
            .then(data=>{
                if(data.error){
                    setValues({...values, error:data.error,loading: false})
                }else{
                    authenticate(data, ()=>{
                        setValues({
                            ...values,
                            redirectedToReferrer: true
                        });
                    })
                }
            });
    };

    const signUpForm= ()=>(
        <form className="card card-body bg-light mb-5">

            <div className="form-group">
                <label className="text-muted">Email</label>
                <input onChange={handleChange('email')} type="email" className="form-control" value={email}/>
            </div>

            <div className="form-group">
                <label className="text-muted">Mot de passe</label>
                <input onChange={handleChange('password')} type="password" className="form-control" value={password}/>
            </div>
            <button onClick={clickSubmit} className="btn btn-primary btn-block">Se connecter</button>
        </form>
    );

    const showError = ()=>(
        <div className="alert alert-danger" style={{display: error ? '':'none'}}>
            {error}
        </div>
    );

    const showLoading = ()=>
        loading && (
            <div className="alert alert-info">
                <h2>Loading ...</h2>
            </div>
        );

    const redirectUser = ()=>{
        if(redirectedToReferrer){
            if(user && user.role === 1){
                return <Redirect to="/admin/dashboard"/>
            }else{
                return <Redirect to="/user/dashboard"/>
            }
        }
        if(isAuthenticated()){
            return <Redirect to="/"/>
        }
    };






    return(
        <Layout title="Connexion" description="Se connecter à notre plateforme" className="container col-md-8 offset-md-2">
            {showLoading()}
            {showError()}
            {signUpForm()}
            {redirectUser()}
        </Layout>
    )
};
export default Signin;


