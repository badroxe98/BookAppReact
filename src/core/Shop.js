import React, {useState,useEffect} from "react";
import Layout from "./Layout";
import Card from "./Card";
import {getCategories,getFilteredProducts} from "./apiCore";
import Chechbox from "./Checkbox";
import {prices} from "./fixedPrices";
import RadioBox from "./RadioBox";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBook } from '@fortawesome/free-solid-svg-icons'
import { faMoneyCheck } from '@fortawesome/free-solid-svg-icons'
import { faLayerGroup } from '@fortawesome/free-solid-svg-icons'

const Shop = () =>{
    const [myFilters, setMyFilters] = useState({
       filters:{category:[],price:[]}
    });
    const [categories, setCategories]= useState([]);
    const [error, setError]= useState(false);
    const [limit, setLimit]= useState(3);
    const [skip, setSkip]= useState(0);
    const [size, setSize]= useState(0);

    const [filteredResults, setFilteredResults]= useState([]);



    const init = ()=>{
        getCategories().then(data =>{
            if(data.error){
                setError(data.error)
            }else{
                setCategories(data)
            }
        })
    };

    const loadFilterResults = (newFilters) =>{

        //console.log(newFilters)
        getFilteredProducts(skip, limit, newFilters).then(data=>{
            if(data.error){
                setError(data.error)
            }else{
                setFilteredResults(data.data);
                setSize(data.size);
                setSkip(0);
            }
        });

    };
    const loadMore = () => {
        let toSkip = skip + limit;
        getFilteredProducts(toSkip, limit, myFilters.filters).then(data=>{
            if(data.error){
                setError(data.error)
            }else{
                setFilteredResults([...filteredResults, ...data.data]);
                setSize(data.size);
                setSkip(toSkip);
            }
        })

    };


        const loadMoreButton = () =>{
            return(
                size > 0 &&
                size >= limit && (
                    <button onClick={loadMore} className="btn btn-warning mb-5">Charger plus</button>
                )
            );
        };





    useEffect(()=>{
        init();
        loadFilterResults(skip,limit, myFilters.filters)
    },[]);

    const handleFilters = (filters, filterBy) =>{
        //console.log('SHOP',filters,filterBy)
            const newFilters ={...myFilters};
            newFilters.filters[filterBy] = filters;
            if(filterBy === "price"){
                let priceValues = handlePrice(filters);
                newFilters.filters[filterBy] = priceValues;
            }

        loadFilterResults(myFilters.filters);
        setMyFilters(newFilters);


    };

    const handlePrice = value =>{
        const data = prices;
        let array = [];

        for(let key in data){
            if(data[key]._id === parseInt(value)){
                array = data[key].array
            }
        }
        return array;
    };




    return(
        <Layout title="Page d'achat" description="Recherchez et trouvez les livres de votre choix" className="container-fluid">

           <div className="row">
               <div className="col-4">
                   <div className="alert alert-primary text-center"><h5><FontAwesomeIcon icon={faLayerGroup} /> Filtrer par catégories</h5></div>
                   <ul>
                       <Chechbox categories={categories}
                        handleFilters={filters =>handleFilters(filters, "category")}/>
                   </ul>

                   <div className="alert alert-primary text-center"><h5><FontAwesomeIcon icon={faMoneyCheck} /> Filtrer par prix</h5></div>
                   <div>
                       <RadioBox prices={prices}
                                 handleFilters={filters =>handleFilters(filters, "price")}/>
                   </div>
               </div>


                <div className="col-8">
                <div className="alert alert-primary text-center"><h5><FontAwesomeIcon icon={faBook} /> Livres</h5></div>

                    <div className="row">

                        {filteredResults.map((product, i)=>(
                            <div key={i} className="col-4 mb-3">
                                <Card product={product}/>
                            </div>
                        ))}

                    </div>
                    <hr/>
                    {loadMoreButton()}
                </div>
           </div>


        </Layout>)
};

export default Shop;
