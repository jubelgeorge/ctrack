import React, { Component } from "react";
import { isAuthenticated } from "../auth";
import { read, update, updateUser } from "./apiUser";
import { Redirect } from "react-router-dom";

class EditProfile extends Component {
  constructor() {
    super();
    this.state = {
      id: "",
      name: "",
      email: "",
      password: "",
      redirectToProfile: false,
      error: "",
      loading: false
    };
  }

  init = userId => {
    const token = isAuthenticated().token;
    read(userId, token).then(data => {
      if (data.error) {
        this.setState({ redirectToProfile: true });
      } else {
        this.setState({
          id: data._id,
          name: data.name,
          email: data.email,
          error: ""
        });
      }
    });
  };

  componentDidMount() {    
    const userId = this.props.match.params.userId;
    this.init(userId);
  }

  isValid = () => {
    const { name, email, password } = this.state;
    
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

    if (password.length >= 1 && password.length <= 5) {
      this.setState({
        error: "Password must be at least 6 characters long",
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
        const { name, email, password } = this.state;

        const user = {
            name,
            email,
            password: password || undefined
        };

      const userId = this.props.match.params.userId;
      const token = isAuthenticated().token;

      update(userId, token, user).then(data => {
        console.log(data);
        if (data.error) {
          this.setState({ error: data.error });
        // } else if (isAuthenticated().user.role === "admin") {
        //   this.setState({
        //     redirectToProfile: true
        //   });
        } else {
          updateUser(data, () => {
            this.setState({
              redirectToProfile: true
            });
         });
        }
      });
    }
  };

  signupForm = (name, email, password) => (
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
      
      <div className="form-group">
        <label className="text-muted">Password</label>
        <input
          onChange={this.handleChange("password")}
          type="password"
          className="form-control"
          value={password}
        />
      </div>
      <button onClick={this.clickSubmit} className="btn btn-raised btn-primary">
        Update
      </button>
    </form>
  );

  render() {
    const {
      id,
      name,
      email,
      password,
      redirectToProfile,
      error,
      loading
    } = this.state;

    if (redirectToProfile) {
      return <Redirect to={`/user/${id}`} />;
    }
    
    return (
      <div className="container">
        <h2 className="mt-5 mb-5">Edit Profile</h2>
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
        
        {isAuthenticated().user._id === id &&
          this.signupForm(name, email, password)}
      </div>
    );
  }
}

export default EditProfile;