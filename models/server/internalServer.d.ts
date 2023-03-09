/// <reference types="node" />
import 'isomorphic-fetch';
import express from 'express';
import http from 'http';
import React from 'react';
import { ServerConfig } from "../config";
declare const _default: {
    app: import("express-serve-static-core").Express;
    apiProxy: any;
    server: http.Server;
    start: (ReactApp: React.ComponentType<any>, config: ServerConfig, ServerFeatures: (app: express.Express) => void) => void;
};
export default _default;
