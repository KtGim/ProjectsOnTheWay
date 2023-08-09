import { Option } from 'monapt';
import R from 'ramda';

export interface Key<T> { key: T }
export interface Value { desc: string }

/**
 * ```ts
 * const letters = {
 *   a: {
 *     desc: "A",
 *     xxx: 666
 *   },
 *   b: {
 *     desc: "B",
 *     xxx: 777
 *   },
 *   c: {
 *     desc: "C",
 *     xxx: 888
 *   }
 * };
 *
 * const Letter = createEnum(letters)
 *
 * type LetterType = typeof Letter.T
 * Letter.enum
 * Letter.keys
 * Letter.values
 * Letter.descs
 * Letter.descByKey('a')
 * Letter.valueByKey('a')
 * Letter.byDesc('B')
 *
 * ```
 */

export default function createEnum<K extends string, V extends Value, KeyV extends Key<K> & V>(
    obj: { [E in K]: V }
): {
    T: K;
    enum: { [E in K]: Key<K> & V };
    keys: K[];
    descs: string[];
    values: KeyV[];
    entries: [K, KeyV][];
    descByKey: (key?: K) => Option<string>;
    valueByKey: (key?: K) => Option<KeyV>;
    byDesc: (desc?: string) => Option<K>;
} {
    const enumObj = R.toPairs(obj).reduce(
        // @ts-ignore
        (acc, [k, v]) => Object.assign(acc, { [k]: R.assoc('key', k, v) }),
        {}
    ) as { [E in K]: KeyV };

    const keys = R.keys(enumObj);
    const values = R.values(enumObj);
    const descs = values.map((v: KeyV) => v.desc);
    const entries = R.toPairs(enumObj);

    const descByKey = (key?: K): Option<string> =>
        Option(key && obj[key]).map((v: V) => v.desc);
    const valueByKey = (key?: K): Option<V> => Option(key && { ...obj[key], key });
    const byDesc = (desc?: string): Option<K> => {
        // @ts-ignore
        const picked: { [E in K]: V } = R.pickBy((v: V, k: string) => v.desc === desc)(obj);
        return Option<K>(R.keys(picked)[0]);
    };

    return {
        enum: enumObj,
        keys,
        descs,
        values,
        entries,
        descByKey,
        valueByKey,
        byDesc,
    } as any;
}