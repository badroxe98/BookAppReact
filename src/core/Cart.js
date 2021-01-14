import React, {useState,useEffect} from "react";
import {getCart} from "./cardHelpers";
import Layout from "./Layout";

import Card from "./Card";
import {Link} from "react-router-dom";
import Checkout from "./Checkout";


const Cart = ()=>{
  const [items, setItems] = useState([]);
    const [refresh, setRefresh] = useState(false);


    useEffect(() => {
        setItems(getCart());
        setRefresh(false);
    }, [refresh]);

    const showItems = (items) => {
      return(
          <div>
              <div className="alert alert-primary text-center"><h5>Votre panier a {`${items.length}`} articles</h5></div>
              <hr/>
              {items.map((product,i)=>(<Card key={i} product={product}
               showAddToCartButton={false}
                showRemoveProductButton={true}
                cartUpdate={true}
                refresh={(value = false)=>{
                    setRefresh(value);
                }}


              />))}
          </div>
      )
    };

        const noItemsMessage = ()=>(
            <div>
                <div className="alert alert-primary text-center"><h5>Votre panier est vide </h5></div> <br/>
                <Link to="/shop" className="btn btn-primary btn-block">Continuer vos achats</Link>
            </div>

        );




    return(
        <Layout title="Panier"
        description="Gérez les articles de votre panier.Ajouter supprimer le paiement ou continuer vos achats"
       className="container-fluid">

            <div className="row">
                <div className="col-6">
                    {items.length > 0 ? showItems(items) : noItemsMessage()}
                </div>

                <div className="col-6">
                <div className="alert alert-primary text-center"><h5> Récapitulatif de votre panier</h5></div>
                    <hr/>
                    <Checkout products={items} refresh={(value = false)=>{
                        setRefresh(value)}}/>
                </div>
            </div>
        </Layout>)
};

export default Cart;
