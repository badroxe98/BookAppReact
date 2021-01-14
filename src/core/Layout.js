import React from "react";
import Menu from "./Menu";
import "../style.css";

const Layout = ({title='Title', description='Description',className, children}) =>(
    <div>
        <Menu />
        <div className="jumbotron pb-2">
            <h2>{title}</h2>
            <p className="lead mt-2">{description}</p>
        </div>
        <div className={className}>{children}</div>
    </div>
);
export default Layout;
