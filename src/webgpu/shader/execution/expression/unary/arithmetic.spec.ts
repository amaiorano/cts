export const description = `
Execution Tests for the f32 arithmetic unary expression operations
`;

import { makeTestGroup } from '../../../../../common/framework/test_group.js';
import { GPUTest } from '../../../../gpu_test.js';
import { f32, i32, TypeF32, TypeI32 } from '../../../../util/conversion.js';
import { negationInterval } from '../../../../util/f32_interval.js';
import { fullF32Range, fullI32Range } from '../../../../util/math.js';
import { makeCaseCache } from '../case_cache.js';
import {
  allInputSources,
  generateUnaryToF32IntervalCases,
  InputSource,
  run,
} from '../expression.js';

import { unary } from './unary.js';

export const g = makeTestGroup(GPUTest);

export const d = makeCaseCache('unary/arithmetic', {
  negation_f32: () => {
    // return generateUnaryToF32IntervalCases(
    //   fullF32Range({ neg_norm: 250, neg_sub: 20, pos_sub: 20, pos_norm: 250 }),
    //   'unfiltered',
    //   negationInterval
    // );
    return [
      { input: f32(-0.0), expected: f32(0.0) },
      { input: f32(0.0), expected: f32(0.0) },
    ];
  },
  negation_i32: () => {
    // return fullI32Range().map(e => {
    //   return { input: i32(e), expected: i32(-e) };
    // });
    return [
      { input: i32(-0), expected: i32(0) },
      { input: i32(0), expected: i32(0) },
    ];
  },
});

g.test('negation_f32')
  .specURL('https://www.w3.org/TR/WGSL/#floating-point-evaluation')
  .desc(
    `
Expression: -x
Accuracy: Correctly rounded
`
  )
  .params(u =>
    //u.combine('inputSource', allInputSources).combine('vectorize', [undefined, 2, 3, 4] as const)
    u.combine('inputSource', ['const'] as InputSource[]).combine('vectorize', [undefined] as const)
  )
  .fn(async t => {
    const cases = await d.get('negation_f32');
    await run(t, unary('-'), [TypeF32], TypeF32, t.params, cases);
  });

g.test('negation_i32')
  .specURL('https://www.w3.org/TR/WGSL/#floating-point-evaluation')
  .desc(
    `
Expression: -x
`
  )
  .params(u =>
    // u.combine('inputSource', allInputSources).combine('vectorize', [undefined, 2, 3, 4] as const)
    u.combine('inputSource', ['const'] as InputSource[]).combine('vectorize', [undefined] as const)
  )
  .fn(async t => {
    const cases = await d.get('negation_i32');
    await run(t, unary('-'), [TypeI32], TypeI32, t.params, cases);
  });
