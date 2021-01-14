import React, {useState, useEffect} from 'react';
import Layout from '../core/Layout';
import {isAuthenticated} from '../auth';
import {Link, Router, Redirect} from 'react-router-dom';
import {getProduct, updateProduct, getCategories, getProducts} from './apiAdmin';

const UpdateProduct = ({match}) => {
    const {user, token} = isAuthenticated();
    const [values, setValues] = useState({
        name: '',
        description: '',
        price: '', 
        categories: [],
        category: '',
        shipping: '',
        quantity: '',
        photo: '',
        loading: false,
        error: '',
        createdProduct: '',
        redirectToProfile: false,
        formData: ''
    });

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

    const [showResultMsg, setShowResultMsg] = useState(false);

    const init = (productId) => {
        getProduct(productId)
        .then(data => {
            if (data.error) {
                setValues({...values, error: data.error});
            } else {
                console.log("data : " ,data);
                setValues({...values,
                    name: data.name,
                    description: data.description,
                    price: data.price,
                    category: data.category._id,
                    shipping: data.shipping,
                    quantity: data.quantity,
                    formData: new FormData() 
                });

                initCategories();
            }
        });
    }

    const initCategories = () => {
        setShowResultMsg(false);
        getCategories()
        .then(data => {
            if (data.error) {
                setValues({...values, error: data.error});
            } else {
                setValues({categories: data, formData: new FormData()});
            }
        })
    }

    useEffect(() => {
        init(match.params.productId);
    }, []);

    const handleChange = (name) => (event) => {
        const value = name === 'photo' ? event.target.files[0] : event.target.value;
        formData.set(name, value);
        setValues({...values, [name]: value});
    }

    const clickSubmit = (e) => {
        e.preventDefault();
        setValues({...values, error: '', loading: true});
        setShowResultMsg(false);

        updateProduct(match.params.productId, user._id, token, formData)
        .then(data => {
            setShowResultMsg(true);
            
            if(data.error) {
                setValues({...values, error: data.error})
            } else {
                setValues({...values,
                    name: '',
                    description: '',
                    price: '',
                    shipping: '',
                    quantity: '',
                    photo: '',
                    loading: false,
                    redirectToProfile: true,
                    createdProduct: data.name,
                    formData: new FormData()
                })
            }
        })
        .catch();
    }
    
    const showResult = () => {
        var msgClass = 'alert ' + (error ? 'alert-danger' : 'alert-info');
        var result = (error ? error : `Product ${createdProduct} successfully updated!`);       
        
        setTimeout(() => {
            setShowResultMsg(false);
        }, 3000);

        return(
            <div
                className={msgClass}>
                <h5>
                    {result}
                </h5>
            </div>
        );
    }

    const showLoading = () => {
        if (loading) {
            return(
                <div className='alert alert-success'>
                    <h5>
                        Loading...
                    </h5>
                </div>
            );
        }
    }

    const redirectUser = () => {
        if (redirectToProfile) {
            if (!error) {
                return(
                    <Redirect to='/admin/products'/>
                );
            }
        }
    }

    const newPostForm = () => {
        return(
            <form
                className='mb-3 card card-body bg-light'
                onSubmit={clickSubmit}>
                
                <div className='form-group'>
                    <label className='text-muted'>
                        Nom
                    </label>
                    <input
                        type='text'
                        className='form-control'
                        onChange={handleChange('name')}
                        value={name}>                        
                    </input>
                </div>
                <div className='form-group'>                    
                    <label className='text-muted'>
                        Description
                    </label>
                    <textarea
                        className='form-control'
                        onChange={handleChange('description')}
                        value={description}>                        
                    </textarea>
                </div>
                <div className= 'form-group'>                                
                    <label className='text-muted'>
                        Prix
                    </label>
                    <input
                        type='number'
                        className='form-control'
                        onChange={handleChange('price')}
                        value={price}>                        
                    </input>
                </div>
                <div className= 'form-group'>                                
                    <label className='text-muted'>
                        Categorie
                    </label>
                    <select
                        className='form-control'
                        onChange={handleChange('category')}>
                        <option
                            value=''>
                                -- Veuillez sélectionner --
                        </option>
                        {categories && categories.map((c, i) => {
                            return(
                                <option
                                    key={i}
                                    value={c._id}>
                                    {c.name}
                                </option>
                            );
                        })}                                     
                    </select>
                </div>
                <div className='form-group'>
                    <label className='text-muted'>
                        Quantitie
                    </label>
                    <input
                        type='number'
                        className='form-control'
                        onChange={handleChange('quantity')}
                        value={quantity}>                        
                    </input>
                </div>
                <div className= 'form-group'>                                
                    <label className='text-muted'>
                        Livraison
                    </label>
                    <select
                        className='form-control'
                        onChange={handleChange('shipping')}>
                        <option
                            value=''>
                                -- Veuillez sélectionner --
                        </option>                        
                        <option
                            value='0'>
                                Non
                        </option>
                        <option
                            value='1'>
                                Oui
                        </option>                                             
                    </select>
                </div>
                <label className='text-muted'>
                    Photo
                </label>
                <div className= 'form-group'>
                    <label className='btn btn-secondary btn-block'>
                        <input
                            type='file'
                            name='photo'
                            accept='image/*'
                            onChange={handleChange('photo')}>
                        </input>
                    </label>
                </div>
                <hr/>
                <button className='btn btn-primary btn-block'>
                    Update
                </button>                                    
            </form>            
        );
    }

    return(
        <Layout
            title='Modifier le produit'
            description={`Bonjour, ${user.name}! Prêt à ajouter un modifier le produit?`}>
            <div className='row'>
                <div className='col-md-8 offset-md-2'>
                    {showLoading()}
                    {showResultMsg ? showResult() : ''}
                    {newPostForm()}
                    {redirectUser()}
                </div>
            </div>
        </Layout>
    );
};

export default UpdateProduct;