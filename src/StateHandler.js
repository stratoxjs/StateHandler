
export class StateHandler {
    //#prefix;
    #currentRoute;
    #handlerEvent = 'dispatched';

    constructor() {
        //this.#prefix = prefix;
        this.unbind = this.#eventHandler('popstate', this.#dispatcher.bind(this));
        this.#currentRoute = this.#updateEventState();
    }

    emitter(eventName, ...args) {
        const detail = { args }
        const event = new CustomEvent(eventName, { detail })
        window.dispatchEvent(event)
    }

    pushState(route, state = {}) {
        history.pushState(state, '', route)
        this.#dispatcher();
    }

    state(fn) {
        let event = this.#eventHandler(this.#handlerEvent, (currentRoute) => {
            fn({ ...currentRoute })
        });
        this.emitter(this.#handlerEvent, { ...this.#currentRoute });
        return event;
    }

    unbind() {
        this.unbind();
    }

    parseStr(search) {
        return [...new URLSearchParams(search).entries()].reduce(
            (acc, [K, V]) => Object.assign(acc, { [K]: V }),
            {}
        )
    }

    #dispatcher(event) {
        this.#currentRoute = this.#updateEventState(event)
        this.emitter(this.#handlerEvent, { ...this.#currentRoute })
    }

    #updateEventState(event) {
        return {
            state: event?.state ?? history.state,
            href: location.href,
            path: location.pathname,
            query: this.parseStr(location.search),
            hash: location.hash.substring(1),
        }
    }

    #eventHandler(eventName, cb) {
        const handler = (event) => cb(...(event?.detail?.args ?? []))
        window.addEventListener(eventName, handler)
        return () => window.removeEventListener(eventName, handler)
    }
}
