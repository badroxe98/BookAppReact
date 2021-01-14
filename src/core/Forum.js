import React,{useState,useEffect} from 'react'
import Layout from "./Layout";
import {isAuthenticated} from "../auth";
import {getCategories} from "../admin/apiAdmin";


const Forum = () =>{
    const [categories, setCategories] = useState([]);
    const {user: {_id,name,email, role}} = isAuthenticated();

    const [category, setCategory] = useState('');
    
    useEffect(() => {
        loadCategories();
    }, []);

    const loadCategories = () => {
        getCategories()
        .then(data => {
            if (data.error) {
                console.log(data.error)
            } else {
                setCategories(data);
            }
        });
    };
    const handleChange = (e)=>{
        e.preventDefault(e);
        setCategory(e.target.value);
      };

    return(
        <Layout
            title='Forum de discussion'
            description='Vous pouvez communiquer avec les autres sur la catégorie'
            className='container-fluid'>
            <div className='row mb-5'>
            <div className="card card-body col-md-6 offset-md-3">
                <div className="form">
                    <div className="form-group">
                        <label className="text-muted">Choisir une categorie</label>
                        <select  className="form-control" onChange={handleChange}>
                            <option>Veuillez sélectionner</option>
                            {categories && categories.map((c,i)=>(<option key={i} value={c.name}>{c.name}</option> ))}
                        </select>
                    </div>
                    <a className="btn btn-primary" href={`https://lets-chat-app98.herokuapp.com/chat.html?username=${name}&usercolor=Blue&room=${category}`}>Accéder au forum</a>
                </div>
            </div>
            
            </div>           
        </Layout>
    );
}


export default Forum;
