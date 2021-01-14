import React,{useState,useEffect} from 'react'
import Layout from "../core/Layout";
import {isAuthenticated} from "../auth";
import {createProduct,getCategories} from "./apiAdmin";


const AddProduct = () =>{
    const [values, setValues] = useState({
        name:'',
        description:'',
        price:'',
        categories:[],
        category:'',
        shipping:'',
        quantity:'',
        photo:'',
        loading:false,
        error:'',
        createdProduct:'',
        redirectToProfile:false,
        formData:''
    });

    const {user,token} = isAuthenticated();
    const {
        name,
        description,
        price,
        categories,
        category,
        shipping,
        quantity,
        loading,
        error,
        createdProduct,
        redirectToProfile,
        formData
    } = values;

    // load categories and set form data
    const init = ()=>{
        getCategories().then(data =>{
            if(data.error){
                setValues({...values,error:data.error})
            }else{
                setValues({...values,categories: data, formData:new FormData()})
            }
        })
    }


    useEffect(()=>{
        init();
    }, []);

    const handleChange = name => event => {
      const value = name === "photo" ? event.target.files[0] : event.target.value;
        formData.set(name, value);
        setValues({...values,[name]: value})

    };

const clickSubmit = event => {
        event.preventDefault(event);
        setValues({...values, error:'', loading: true});
    createProduct(user._id,token,formData)
            .then(data =>{
                if(data.error){
                    setValues({...values, error: data.error})
                }else{
                    setValues({
                        ...values, name:'', description: '', photo: '', price: '',quantity: '', loading: false,createdProduct: data.name
                    })
                }
            })
};



    const newPostForm = ()=>(
        <form className="mb-3" className="card card-body bg-light mb-5" onSubmit={clickSubmit}>
            <div className="form-group">
                <label className="text-muted">Nom</label>
                <input onChange={handleChange('name')} type="text" className="form-control" value={name}/>
            </div>

            <div className="form-group">
                <label className="text-muted">Description</label>
                <textarea onChange={handleChange('description')} className="form-control" value={description}/>
            </div>

            <div className="form-group">
                <label className="text-muted">Prix</label>
                <input onChange={handleChange('price')} type="number" className="form-control" value={price}/>
            </div>

            <div className="form-group">
                <label className="text-muted">Categorie</label>
                <select onChange={handleChange('category')} className="form-control">
                    <option>Veuillez sélectionner</option>
                    {categories && categories.map((c,i)=>(<option key={i} value={c._id}>{c.name}</option> ))}

                </select>
            </div>

            <div className="form-group">
                <label className="text-muted">Quantitie</label>
                <input onChange={handleChange('quantity')} type="number" className="form-control" value={quantity}/>
            </div>

            <div className="form-group">
                <label className="text-muted">Livraison</label>
                <select onChange={handleChange('shipping')} className="form-control">
                    <option>Please select</option>
                    <option value="0">Non</option>
                    <option value="1">Oui</option>

                </select>
            </div>
            <label className="text-muted">Photo</label>
            <div className="form-group">
                <label className="btn btn-secondary btn-block">
                    <input onChange={handleChange('photo')} type="file"  name="photo" accept="image/*"/>
                </label>
            </div>
            <hr/>
            <button className="btn btn-primary">Ajouter</button>
        </form>
    );

    const showEror = ()=>(
        <div className="alert alert-danger text-center" style={{display:error ? '' : 'none'}}>
            <h5>{error}</h5>
        </div>
    );

    const showSuccess = ()=>(
        <div className="alert alert-success text-center" style={{display: createdProduct ? '' : 'none'}}>
            <h5>{`${createdProduct}`} est crée !</h5>
        </div>
    );

    const showLoading = ()=>(
       loading && (<div className="alert alert-success">
           <h2>Loading ...</h2>
       </div>)
    );



    return(
        <Layout title="Ajouter un nouveau produit" description={`Bienvenue ${user.name} , prêt à ajouter un nouveau livre`}>
            <div className="row">
                <div className="col-md-8 offset-md-2">
                    {showLoading()}
                    {showSuccess()}
                    {showEror()}
                    {newPostForm()}

                </div>
            </div>
        </Layout>
    )
};


export default AddProduct;
