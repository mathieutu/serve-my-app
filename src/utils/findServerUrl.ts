import { Config } from '../cli'
import { findPort } from './findPort'
import { prepareUrls } from './prepareUrl'

export const findServerUrl = async (args: Config) => {
  const protocol = args.https ? 'https' : 'http'
  const host = args.host
  const port = await findPort(host, args.port)
  const {
    lanUrlForTerminal: networkUrl,
    localUrl,
    localUrlForTerminal,
    localUrlForBrowser,
  } = prepareUrls(protocol, host, port)

  return {
    protocol,
    host,
    port,
    networkUrl,
    localUrl,
    localUrlForTerminal,
    localUrlForBrowser,
  }
}
