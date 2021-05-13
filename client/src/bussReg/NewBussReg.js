import React, { Component } from "react";
import { isAuthenticated } from "../auth";
import { create } from "./apiBussReg";
import { Redirect } from "react-router-dom";

class NewBussReg extends Component {
  constructor() {
    super();
    this.state = {     
      name: "",
      email: "",      
      error: "",
      user: {},
      loading: false,
      redirectToProfile: false
    };
  }

//   init = userId => {
//     const token = isAuthenticated().token;
//     read(userId, token).then(data => {
//       if (data.error) {
//         this.setState({ redirectToProfile: true });
//       } else {
//         this.setState({
//           id: data._id,
//           name: data.name,
//           email: data.email,
//           error: ""
//         });
//       }
//     });
//   };

  componentDidMount() {    
    this.setState({user: isAuthenticated().user});
  }

  isValid = () => {
    const { name, email } = this.state;
    
    if (name.length === 0) {
      this.setState({ error: "Name is required", loading: false });
      return false;
    }

    // email@domain.com
    if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
      this.setState({
        error: "A valid Email is required",
        loading: false
      });
      return false;
    }

    return true;
  };

  handleChange = name => event => {
    // this.setState({ error: "" });
        
    this.setState({ [name]: event.target.value });
  };

  clickSubmit = event => {
    event.preventDefault();
    this.setState({ loading: true });    

    if (this.isValid()) {
        const { name, email } = this.state;

        const user = {
            name,
            email
        };

      const userId = isAuthenticated().user._id;
      const token = isAuthenticated().token;

      create(userId, token, user).then(data => {
        console.log(data);
        if (data.errors) {
            this.setState({ error: data.errors[0].msg, loading: false });
        // } else if (isAuthenticated().user.role === "admin") {
        //   this.setState({
        //     redirectToProfile: true
        //   });
        } else {
        //   updateUser(data, () => {
        //     this.setState({
        //       redirectToProfile: true
        //     });
        //  });
        this.setState({ loading: false, name: '', email: '', error: '', redirectToProfile: true });
        }
      });
    }
  };

  newBusinessRegistartionForm = (name, email) => (
    <form>      
      <div className="form-group">
        <label className="text-muted">Name</label>
        <input
          onChange={this.handleChange("name")}
          type="text"
          className="form-control"
          value={name}
        />
      </div>
      <div className="form-group">
        <label className="text-muted">Email</label>
        <input
          onChange={this.handleChange("email")}
          type="email"
          className="form-control"
          value={email}
        />
      </div>
            
      <button onClick={this.clickSubmit} className="btn btn-raised btn-primary">
        Register
      </button>
    </form>
  );

  render() {
    const {     
        name,
        email,
        error,
        user,
        loading,
        redirectToProfile   
    } = this.state;

    if (redirectToProfile) {
      return <Redirect to={`/user/${user._id}`} />;
    }
    
    return (
      <div className="container">
        <h2 className="mt-5 mb-5">Business Registration</h2>
        <div
          className="alert alert-danger"
          style={{ display: error ? "" : "none" }}
        >
          {error}
        </div>

        {loading ? (
          <div className="jumbotron text-center">
            <h2>Loading...</h2>
          </div>
        ) : (
          ""
        )}  
        {this.newBusinessRegistartionForm(name, email)}
        {/* {isAuthenticated().user._id === id &&
          this.newBusinessRegistartionForm(name, email)} */}
      </div>
    );
  }
}

export default NewBussReg;