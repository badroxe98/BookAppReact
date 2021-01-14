import React,{useState,useEffect} from 'react'
import Layout from "../core/Layout";
import {isAuthenticated} from "../auth";
import {createProduct,getCategories} from "./apiAdmin";
import {Link} from "react-router-dom";
import {listOrders,getStatusValues,updateOrderStatus} from "./apiAdmin";
import moment from "moment";



const Orders = ()=> {
    const [orders, setOrders] = useState([]);
    const [statusValues, setStatusValues] = useState([]);

    const {user, token} = isAuthenticated();

    const loadOrders = () => {
        listOrders(user._id, token).then(data => {
            if (data.error) {
                console.log(data.error)
            } else {
                setOrders(data)
            }
        });
    };

    const loadStatusValues = () => {
        getStatusValues(user._id, token).then(data => {
            if (data.error) {
                console.log(data.error)
            } else {
                setStatusValues(data)
                console.log(data);
            }
        });
    };

        useEffect(() => {
            loadOrders();
            loadStatusValues()
        }, []);

    const showOrdersLength = () =>{
        if(orders.length > 0){
            return (
                <div className="alert alert-danger"><h5 className="text-danger">Total des commandes : {orders.length}</h5></div>
            )
        }else{
            return <div className="alert alert-danger"><h5 className="text-danger">Aucune commande</h5></div>
        }
    };


    const showInput = (key, value)=>(
        <div className="input-group mb-2 mr-sm-2">
            <div className="input-group-prepend">
                <div className="input-group-text">{key}</div>
            </div>
            <input type="text" value={value} className="form-control" readOnly/>
        </div>
    );

    const handleStatusChange = (e, orderId) =>{
        updateOrderStatus(user._id,token,orderId, e.target.value)
            .then(data=>{
                if(data.error){
                    console.log('Status update failed')
                }else{
                    loadOrders()
                }
            })
    };

    const showStatus = (o)=>(
        <div className="form-group">
            <h3 className="mark mb-4">Status: {o.status}</h3>
            <select className="form-control" defaultValue={'DEFAULT'} onChange={e=> handleStatusChange(e,o._id)}>
                <option value="DEFAULT" disabled>Modifier le status</option>
                {statusValues.map((status, index)=>(
                    <option key={index} value={status}>{status}</option>
                ))}
            </select>
        </div>
    );


    return(
        <Layout title="Les commandes" description={`Bonjour ${user.name} ,Vous pouvez gérer toutes les commandes ici`}>
            <div className="row">
                <div className="col-md-8 offset-md-2">
                    {showOrdersLength()}
                    {orders.map((o, oIndex)=>{
                        return (
                            <div className="mt-5" key={oIndex} style={{borderBottom:"5px solid indigo"}}>
                                <h2 className="mb-5">
                                    <span className="bg-primary">ID de la commande  : {o._id}</span>
                                </h2>

                                <ul className="list-group mb-2">
                                    <li className="list-group-item">
                                        {showStatus(o)}
                                    </li>

                                    <li className="list-group-item">
                                         ID de la transaction: {o.transaction_id}
                                    </li>

                                    <li className="list-group-item">
                                        Montant : ${o.amount}
                                    </li>

                                    <li className="list-group-item">
                                        Commandé par : {o.user.name}
                                    </li>

                                    <li className="list-group-item">
                                    Adresse de livraison: {o.address}
                                    </li>

                                </ul>

                                <h3 className="mt-4 mb-4 font-italic">
                                    Total produit dans la commande : {o.products.length}
                                </h3>

                                {o.products.map((p, pIndex)=>(
                                    <div className="mb4" key={pIndex} style={{padding:'20px', border:'1px solid indigo' }}>
                                        {showInput('Nom du produit', p.name)}
                                        {showInput('Prix du produit', p.price)}
                                        {showInput('Totale du produit', p.count)}
                                        {showInput('ID du product ', p._id)}

                                    </div>
                                ))}

                            </div>
                        )
                    })}
                </div>
            </div>
        </Layout>
    )

    };


export default Orders;
