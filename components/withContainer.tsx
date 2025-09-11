import React from "react";
import { container } from "../core/container"; // Import your existing Inversify container

const withContainer = (WrappedComponent: any) => {
  return (props: any) => <WrappedComponent {...props} container={container} />;
};

export default withContainer;
