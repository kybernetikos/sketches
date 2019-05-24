import {createElement} from "./preact-10.0.0-beta.1/preact.module.js";

const create = (component) =>
    (props, ...children) =>
        (props && props.constructor === Object && props._ === undefined) ?
            createElement(component, props, ...children) :
            createElement(component, null, props, ...children)
const elements = new Proxy({}, {get: (target, prop) => create(prop)})

export {create, elements}