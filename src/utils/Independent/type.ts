// 推断数组的类型
export type InferArray<T extends any[]> = T extends (infer U)[] ? U : never;

// export type InferFirst<T extends unknown[]> = T extends [infer U, ...infer _] ? U : never;

// 推断数组或元祖的最后一个类型
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export type InferLast<T extends unknown[]> = T extends [...infer _, infer U] ? U : never;
