import React, {useState,useEffect} from "react";
import {createOrder,getBraintreeClientToken,processPayment} from "./apiCore";
import {isAuthenticated} from "../auth";
import DropIn from "braintree-web-drop-in-react";
import {Link} from "react-router-dom";
import {emptyCart} from "./cardHelpers";

const Checkout =({ products })=>{

    const [data, setData] = useState({
        loading:false,
        success:false,
        clientToken:null,
        error:'',
        instance:{},
        address:""
    });

    const userId = isAuthenticated() && isAuthenticated().user._id;
    const token = isAuthenticated() && isAuthenticated().token;

    const getToken = (userId, token) => {
        getBraintreeClientToken(userId,token).then(data=>{
            if(data.error){
                setData({...data,error:data.error});
            }else{
                setData({clientToken:data.clientToken});
            }
        })
    };
    useEffect(()=>{
        getToken(userId, token);
    },[]);


    const getTotal= ()=>{
        return products.reduce((currentValue, nextValue)=>{
            return currentValue + nextValue.count * nextValue.price;
        }, 0)
    };

    const showCheckout =()=>{
        return isAuthenticated() ? (
            <div>{showDropIn()}</div>
        ) : (
            <Link to="/signin">
                <button className="btn btn-primary">Connectez-vous pour payer</button>
            </Link>
        )
    };

    let deliveryAddress = data.address;

    const buy = ()=>{
        setData({loading:true});

        // send the nonce to your server
        // nonce  = data.instace
        let nonce;
        let getNonce = data.instance
            .requestPaymentMethod()
            .then(data => {
                nonce = data.nonce;

                const paymentData = {
                    paymentMethodNonce: nonce,
                    amount: getTotal(products)
                };

                processPayment(userId, token, paymentData)
                    .then(response => {
                        const createOrderData = {
                            products: products,
                            transaction_id: response.transaction.id,
                            amount: response.transaction.amount,
                            address: deliveryAddress
                        };
                        createOrder(userId, token, createOrderData)
                            .then(response => {
                                console.log(products)
                            });
                        emptyCart(()=>{
                            console.log('payment success and empty cart');
                            setData( {loading:false,success:true})
                        });

                    })
                    .catch(error => {
                        console.log(error);
                        setData({loading: false})

                    });
            })
            .catch(error =>{
                setData({...data,error:error.message})
            })
    };

    const handleAddress = event =>{
        setData({...data,address:event.target.value})
    };

    const showDropIn = ()=>(
        <div onBlur={()=>setData({...data,error:""})}>
            {data.clientToken!==null && products.length > 0 ? (
                <div>
                    <div className="gorm-group mb-3">
                       <label className="text-muted">Adresse de livraison :</label>
                    <textarea onChange={handleAddress}
                    className="form-control"
                    value={data.address}
                     placeholder="Saisissez votre adresse de livraison ici ..."
                    />

                    </div>
                    <DropIn options={{
                        authorization: data.clientToken,
                        paypal:{
                            flow:'vault'
                        }
                    }} onInstance={instance => (data.instance = instance)}/>
                    <button onClick={buy} className="btn btn-success btn-block">Payer</button>
                </div>

            ) : null}
        </div>
    );

    const showLoading =(loading)=> loading && <h5>Loading ...</h5>;


    const showError = error =>(
        <div className="alert alert-danger" style={{display: error ? '' : 'none'}}>
            {error}
        </div>
    );

    const showSuccess = success =>(
        <div className="alert alert-success" style={{display: success ? '' : 'none'}}>
            <h5>Merci! Votre paiement a réussi!</h5>
        </div>
    );



    return <div>
        <h4>Totale : <strong>${getTotal()}</strong></h4>
        {showLoading(data.loading)}
        {showSuccess(data.success)}
        {showError(data.error)}
        {showCheckout()}
    </div>
};

export default Checkout;
