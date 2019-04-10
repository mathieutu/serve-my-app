import { Express } from 'express'
import { Server } from 'http'

export type ApiFunction = (app: Express, server: Server) => void
