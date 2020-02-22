import * as React from 'react';
import {
    Route,
    Redirect,
    RouteProps,
} from 'react-router-dom';

interface PrivateRouteProps {
    // tslint:disable-next-line:no-any
    component: any;
    isSignedIn: boolean;
    path:string;
};

const PrivateRoute = (props: PrivateRouteProps) => {
    const { component: Component, isSignedIn, path, ...rest } = props;

    return (
        <Route
        path={path}
            {...rest}
            render={(routeProps: PrivateRouteProps) =>
                isSignedIn ? (
                    <Component {...routeProps} />
                ) : (
                        <Redirect to='/lecshare-main/login'/>
                    )
            }
        />
    );
};

export default PrivateRoute;