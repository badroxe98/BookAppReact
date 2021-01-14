import React, {useState, useEffect} from 'react';
import Layout from '../core/Layout';
import {isAuthenticated} from '../auth';
import {Link} from 'react-router-dom';
import {getProducts, deleteProduct} from '../admin/apiAdmin';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons'
import { faEdit } from '@fortawesome/free-solid-svg-icons'

const ManageProducts = () => {
    const [products, setProducts] = useState([]);
    const {user, token} = isAuthenticated();

    useEffect(() => {
        loadProducts();
    }, []);

    const loadProducts = () => {
        getProducts()
        .then(data => {
            if (data.error) {
                console.log(data.error)
            } else {
                setProducts(data);
                console.log(data);
            }
        });
    };

    const destroy = (productId) => {
        deleteProduct(productId, user._id, token)
        .then(data => {
            if (data.error) {
                console.log(data.error)
            } else {
                loadProducts();
            }
        });
    }

    return(
        <Layout
            title='Gérer les produits            '
            description='Mettre à jour ou supprimer des produits'
            className='container-fluid'>
            <div className='row mb-5'>
                <div className='col-12'>
                    <h2 className='text-center'>
                        Total {products.lenght} produits
                    </h2>
                    <hr/>
                    <ul className='list-group'>
                        {products.map((prod, i) => {
                            return(
                                <li
                                    key={i}
                                    className='list-group-item d-flex justify-content-between align-items-center'>
                                    <strong>
                                        {prod.name}
                                    </strong>
                                    <div className="ml-auto">
                                        <Link
                                            to={`/admin/product/update/${prod._id}`}>
                                            <span className='badge badge-warning badge-pill mr-2'>
                                            <FontAwesomeIcon icon={faEdit} />   Modifier
                                            </span>
                                        </Link>
                                        
                                        <button
                                            onClick={() => {
                                                destroy(prod._id);
                                            }}
                                            className='badge badge-danger badge-pill'>
                                            <FontAwesomeIcon icon={faTrashAlt} />    Supprimer
                                        </button>    
                                    </div>
                                                                        
                                    
                                </li>
                            );
                        })}
                    </ul>
                </div>
            </div>           
        </Layout>
    );
}

export default ManageProducts;