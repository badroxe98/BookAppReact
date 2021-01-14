import React, {useState,useEffect} from "react";
import Layout from "./Layout";
import {getProducts} from "./apiCore";
import Card from "./Card";
import "../style.css"
import Search from "./Search";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChartLine } from '@fortawesome/free-solid-svg-icons'
import { faBookOpen } from '@fortawesome/free-solid-svg-icons'

const Home = () => {
    const [productsBySell,setProductsBySell] = useState([]);
    const [productsByArrival,setProductsByArrival] = useState([]);
    const [error, setError] = useState(false);

    const loadProductsBySell = ()=>{
      getProducts('sold').then(data =>{
          if(data.error){
              setError(data.error)
          }else{
              setProductsBySell(data)
          }
      })
    };

    const loadProductsByArrival = ()=>{
        getProducts('createdAt').then(data =>{
            if(data.error){
                setError(data.error)
            }else{
                setProductsByArrival(data)
            }
        })
    };

    useEffect(()=>{
        loadProductsByArrival();
        loadProductsBySell()
    },[]);



    return(
        <Layout title="Accueil" description="Bienvenue dans votre bibliothèque de livres numériques !" 
        className="container-fluid">


            <Search/>
            <div className="alert alert-primary bg-primary text-center">
                <h4 className="mb-4"><FontAwesomeIcon icon={faBookOpen} /> Nouvelles Arrivées</h4>
            </div>
            <div className="row">
                {productsByArrival.map((product,i)=>(
                    <div key={i} className="col-4 mb-3">
                        <Card product={product}/>
                    </div>

                ))}
            </div>
            <hr/>
            <div className="alert alert-primary bg-primary text-center">
                <h4 className="mb-4"><FontAwesomeIcon icon={faChartLine} />  Meilleurs vendeurs</h4>
            </div>
            <div className="row">
                {productsBySell.map((product,i)=>(
                    <div key={i} className="col-4 mb-3">
                        <Card product={product}/>
                    </div>
                ))}
            </div>


    </Layout>)
};

export default Home;
