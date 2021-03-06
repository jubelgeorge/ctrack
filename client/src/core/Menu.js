import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import { signout, isAuthenticated } from '../auth';

const isActive = (history, path) => {
    if (history.location.pathname === path) return { color: '#ff9900' };
    else return { color: '#ffffff' };
};


const Menu = ({ history }) => (              // With 'withRouter', we get props.history
    <div>
        <ul className="nav nav-tabs bg-primary">
            <li className="nav-item">
                <Link className="nav-link" style={isActive(history, '/')} to="/">
                    Home
                </Link>
            </li> 

            <li className="nav-item">
                <Link className="nav-link" style={isActive(history, '/users')} to="/users">
                    Users
                </Link>
            </li>            

            {!isAuthenticated() && (
                <React.Fragment>
                    <li className="nav-item">
                        <Link className="nav-link" style={isActive(history, '/signin')} to="/signin">
                            Sign In
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link" style={isActive(history, '/signup')} to="/signup">
                            Sign Up
                        </Link>
                    </li>                    
                </React.Fragment>
            )} 

            {isAuthenticated() && ( 
                <React.Fragment>                                  
                    <li className="nav-item">
                        <span
                            className="nav-link"
                            style={
                                (isActive(history, '/signup'),
                                { cursor: 'pointer', color: '#fff' })
                            }
                            onClick={() => signout(() => history.push('/'))}
                        >
                            Sign Out
                        </span>
                    </li> 
                    <li className="nav-item">                        
                        <Link
                            to={`/bussreg/create`}
                            style={isActive(history, `/bussreg/create`)} 
                            className="nav-link"                          
                        >
                            Register Business
                        </Link>                                                
                    </li>                     
                    <li className="nav-item">                        
                        <Link
                            to={`/user/${isAuthenticated().user._id}`}
                            style={isActive(history, `/user/${isAuthenticated().user._id}`)} 
                            className="nav-link"                          
                        >
                            {`${isAuthenticated().user.name}'s profile`}
                        </Link>                        
                    </li> 
                </React.Fragment>               
            )} 
          
        </ul>
    </div>
);

export default withRouter(Menu);
