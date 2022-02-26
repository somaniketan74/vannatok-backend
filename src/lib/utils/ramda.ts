import {
    always,
    compose,
    cond as rcond,
    fromPairs,
    isNil,
    isEmpty,
    merge,
    map,
    reject,
    toPairs,
    values,
    T
} from 'ramda'
import { Nullable, ObjectWithNullableProps, ObjectWithNonNullableProps } from '../types'

// tslint:disable no-any

const cond = <T = {}>(fns: Array<[(p: T) => boolean, (p: T) => any]>) => (props: T) => rcond(fns)(props)

const isUndefined = (element: any) => typeof element === 'undefined'

const isNilOrEmpty = (toCheck: any) => isNil(toCheck) || isEmpty(toCheck)

const hasElements = (arr: any) => Array.isArray(arr) && arr.length > 0

const replaceNil = <T = any>(defaultValue: T, valueToCheck?: Nullable<T>) => isNil(valueToCheck)
    ? defaultValue
    : valueToCheck

const mergeDefaultProps = <T = {}>(props: object = {}, defaultProps: object = {}) => merge(defaultProps, reject(isUndefined, props)) as T
// tslint:enable no-any

const disAllowedValues = [null, undefined, ''];

const filterFields = (original: any, disAllowedKeys: Array<string>) => {
    const result = Object.entries(original).reduce((ourNewObject: any, pair) => {
        const key:any = pair[0];
        const value:any = pair[1];
        if (
            disAllowedKeys.includes(key) === false &&
            disAllowedValues.includes(value) === false
        ) {
            ourNewObject[key] = value;
        }
        return ourNewObject;
    }, {});
    return result;
}

export {
    always,
    compose,
    cond,
    fromPairs,
    isEmpty,
    isNil,
    isNilOrEmpty,
    isUndefined,
    hasElements,
    map,
    merge,
    mergeDefaultProps,
    reject,
    replaceNil,
    toPairs,
    values,
    T,
    filterFields
}