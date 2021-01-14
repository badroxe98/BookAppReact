import React, {useState,useEffect} from "react";
import Layout from "./Layout";
import {read, listRelated} from "./apiCore";
import Card from "./Card";
import Search from "./Search";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faList } from '@fortawesome/free-solid-svg-icons'

const Product =(props)=>{
    const [product, setProduct] = useState({});
    const [relatedProduct, setRelatedProduct] = useState([]);
    const [error, setError] = useState(false);

    const loadSingleProduct = productId =>{
        read(productId).then(data=>{
            if(data.error){
                setError(data.error)
            }else{
                setProduct(data);
                //fetch related product
                listRelated(data._id).then(data=>{
                    if(data.error){
                        setError(data.error)
                    }else{
                        setRelatedProduct(data)
                    }
                })
            }
        })
    };

    useEffect(()=>{
        const productId = props.match.params.productId;
        loadSingleProduct(productId)
    },[props]);

    return(
        <Layout title={product && product.name}
                description={product && product.description && product.description.substring(0,200)}
                className="container-fluid">
        <div className="row mb-5">
                <div className="col-7">
                    {product && product.description && product.description.substring(0,100) &&
                    <Card product={product} showViewProductButton={false}/>}
                </div>
            <div className="col-5">
                <div className="alert alert-primary text-center"><h5><FontAwesomeIcon icon={faList} /> Dans la meme catégorie</h5></div>
                {relatedProduct.map((p,i)=>(
                    <div key={i} className="mb-3">
                        <Card  product={p}/>
                    </div>
                ))}
            </div>
        </div>
        </Layout>)
};
export default Product;
