import React from 'react';
declare const withLogin: (WrappedComponent: React.ComponentType) => {
    (): React.JSX.Element;
    displayName: string;
    WrappedComponent: React.ComponentType<{}>;
};
export default withLogin;
