/// <reference types="express" />

declare module 'express-list-endpoints' {
  import { Express } from 'express'

  namespace expressListEndpoints {

    export type ExpressEndpoint = {
      path: string,
      methods: ['GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'OPTIONS' | 'HEAD']
    }

    export type ExpressEndpoints = [ExpressEndpoint] | []
  }

  function expressListEndpoints(app: Express): expressListEndpoints.ExpressEndpoints

  export = expressListEndpoints
}
