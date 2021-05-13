import React, { Component } from "react";
 import { list } from "./apiBussReg";
import { Link } from "react-router-dom";

class BussReg extends Component {
    constructor() {
        super();
        this.state = {
            bussReg: []
        };
    }

    componentDidMount() {
        list().then(data => {
            console.log(data);
            if (data.error) {
                console.log(data.error);
            } else {
                this.setState({ bussReg: data });
            }
        });
    }

    renderBussReg = bussReg => (
        <div className="row">
            {bussReg.map((buss, i) => (
                <div className="card col-md-4" key={i}>
                    
                    <div className="card-body">
                        <h5 className="card-title">{buss.name}</h5>
                        <p className="card-text">{buss.email}</p>
                        {/* <Link
                            to={`/user/${user._id}`}
                            className="btn btn-raised btn-primary btn-sm"
                        >
                            View Profile
                        </Link> */}
                    </div>
                </div>
            ))}
        </div>
    );

    render() {
        const { bussReg } = this.state;
        return (
            <div className="container">
                <h2 className="mt-5 mb-5">Business Registration Details</h2>

                {this.renderBussReg(bussReg)}
            </div>
        );
    }
}

export default BussReg;