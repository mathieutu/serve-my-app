declare module 'nodemon' {
  type Config = {
    exec: string,
    script: string,
    watch: string[],
    ext: string,
    '--': string,
    verbose: boolean,
    help: boolean,
    version: boolean,
    dump: boolean,
    args: string,
  }
  type Event = 'start' | 'restart' | 'crash' | 'stdout' | 'stderr' | 'quit'

  namespace nodemon {
    const config: Config

    function on(event: Event, handler: (...params: any) => void): void

    function addListener(event: Event, handler: (...params: any) => void): void

    function once(event: Event, handler: (...params: any) => void): void

    function emit(event: Event): void

    function removeAllListeners(events: Event[]): void

    function reset(): void
  }

  function nodemon(config: Partial<Config> | string): void

  export = nodemon
}
