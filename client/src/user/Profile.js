import React, {Component} from 'react';
import {Redirect, Link} from 'react-router-dom';
import { isAuthenticated } from "../auth";
import {read} from './apiUser';

class Profile extends Component {
    constructor() {
        super();
        this.state = {
            user: "",
            redirectToSignin: false
        };
    }
    
    init = userId => {
        const token = isAuthenticated().token;
        read(userId, token)
        .then( data => {
            if(data.error) {
                this.setState({ redirectToSignin: true });
            } else {                
                this.setState({ user: data })
            }
        });
    };

    componentDidMount() {
        // console.log(this.props);
        const userId = this.props.match.params.userId;       

        this.init(userId);
    }

    componentWillReceiveProps(props) {
        const userId = props.match.params.userId;
        this.init(userId);
      }

    render() {
        const { redirectToSignin, user } = this.state;
        if (redirectToSignin) return <Redirect to="/signin" />;

        return (
            <div className='container'>
                <h2 className='mt-5 mb-5'>Profile</h2>  
                <div className='row'>

                    <div className="col-md-6">  
                        <div className='lead mt-2 ml-2'>
                            <p>Hello, {user.name}</p>
                            <p>Email: {user.email}</p>
                            <p>{`Joined: ${new Date(user.created).toDateString()}`}</p>
                        </div>
                        
                    </div>

                    <div className='col-md-6'>
                        {isAuthenticated().user && isAuthenticated().user._id === user._id && (
                        <div className="d-inline-block mt-5">
                            {/* <Link
                            className="btn btn-raised btn-info mr-5"
                            to={`/post/create`}
                            >
                            Create Post
                            </Link> */}

                            <Link
                                className="btn btn-raised btn-success mr-5"
                                to={`/user/edit/${user._id}`}
                            >
                                Edit Profile
                            </Link>                            
                        </div>                 
                        )}
                    </div>

                </div>
            </div>
        );
    }
}

export default Profile;