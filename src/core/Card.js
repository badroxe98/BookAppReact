import React,{useState} from 'react'
import {Link,Redirect} from "react-router-dom";
import ShowImage from "./ShowImage";
import moment from 'moment'
import {addItem,updateItem,removeItem} from "./cardHelpers";
import {isAuthenticated} from "../auth"

const Card = ({product,
                  showViewProductButton = true,
                  showAddToCartButton= true,
                  cartUpdate=false,
                  showRemoveProductButton= false,
                    refresh
}) =>{
    const [redirect, setRedirected] = useState(false);
    const [count, setCount] = useState(product.count);

    const showViewButton =(showViewProductButton)=>{
        return(
            showViewProductButton && (
                <Link to={`/product/${product._id}`} className="mr-2">
                <button className="btn btn-outline-primary mt-2 mb-2 mr-2">
                    Détails
                </button>
                </Link>
            )
        )
    };

    const addToCart =()=>{
        addItem(product, ()=>{
            setRedirected(true)
        })
    };

    const shouldRedirect = redirect =>{
      if(redirect){
          return <Redirect to="/cart"/>
      }
    };

    const showAddToCart =showAddToCartButton=> {
        return(
            isAuthenticated() && showAddToCartButton && (
                <button onClick={addToCart} className="btn btn-outline-warning mt-2 mb-2">
                    Ajouter au panier
                </button>
            )

        )
    };


    const showRemoveButton = showRemoveProductButton=> {
        return(
            showRemoveProductButton && (
                <button onClick={()=> {
                    removeItem(product._id);
                    refresh(true);
                }}
                        className="btn btn-outline-danger mt-2 mb-2">
                    Supprimer de la panier
                </button>
            )

        );
    };


    const showStock =(quantity)=>{
        return quantity > 0 ? <span className="badge badge-primary badge-pill">En Stock</span> :

            <span>En rupture de stock</span>
    };


    const handleChange = productId => event => {
      setCount(event.target.value < 1 ? 1 : event.target.value);
      if(event.target.value >= 1){
          updateItem(productId, event.target.value);
          refresh(true)
      }
    };

    const showCartUpdateOptions = cartUpdate => {
      return cartUpdate && <div>
          <div className="input-group mb-3">
              <div className="input-group-prepend">
                  <span className="input-group-text">Ajuster la quantité</span>
              </div>
              <input type="number"
                     className="form-control"
                     value={count}

                      onChange={handleChange(product._id)}/>


          </div>


      </div>
    };


    return(
            <div className="card">
                <div className="card-header name">{product.name}</div>
                <div className="card-body">
                    {shouldRedirect(redirect)}
                    <ShowImage item={product} url="product"/>
                    <p className="lead mt-2">{product.description.substring(0, 200)}</p>
                    <p className="black-10"><strong>Prix : </strong><span className="badge badge-danger">${product.price}</span></p>
                    <p className="black-9"><strong>Catégorie : </strong>{product.category && product.category.name}</p>
                    <p className="black-8">
                       <strong>Ajouté le : </strong> {moment(product.createdAt).fromNow()}
                    </p>

                    {showStock(product.quantity)}
                    <br/>
                    {showViewButton(showViewProductButton)}
                    {showAddToCart(showAddToCartButton)}
                    {showRemoveButton(showRemoveProductButton)}
                    {showCartUpdateOptions(cartUpdate)}


                </div>
            </div>

    )
};

export default Card;

