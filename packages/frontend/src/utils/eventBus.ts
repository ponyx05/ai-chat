import mitt from 'mitt'

export type Events = {
  apiError: string
}

const emitter = mitt<Events>()

export default emitter