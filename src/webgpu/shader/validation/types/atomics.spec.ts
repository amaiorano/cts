export const description = `
Validation tests for atomic types
`;

import { param } from 'jquery';
import { makeTestGroup } from '../../../../common/framework/test_group.js';
import { keysOf } from '../../../../common/util/data_tables.js';
import { ShaderValidationTest } from '../shader_validation_test.js';

export const g = makeTestGroup(ShaderValidationTest);

const kBasicTypes = ['i32', 'u32', 'f32', 'f16', 'bool'];
const kValidAtomicTypes = ['i32', 'u32'];

const kAddressSpaces = ['function', 'private', 'workgroup', 'uniform', 'storage', 'handle'];
const kValidAtomicAddressSpaces = ['workgroup', 'storage'];

g.test('atomics')
  .desc('Tests validation of atomic types')
  .params(
    u =>
      u
        .combine('type', kBasicTypes) //
        .combine(
          'address_space',
          kAddressSpaces.filter(v => v != 'handle')
        ) //
  )
  .beforeAllSubcases(t => {
    if (t.params.type == 'f16') {
      t.selectDeviceOrSkipTestCase('shader-f16');
    }
  })
  .fn(t => {
    let wgsl = '';
    switch (t.params.address_space) {
      case 'function':
        wgsl += `
            fn f() {
                var a: atomic<${t.params.type}>;
            }
            `;
        break;
      case 'private':
        wgsl += `var<private> a: atomic<${t.params.type}>;`;
        break;
      case 'workgroup':
        wgsl += `var<workgroup> a: atomic<${t.params.type}>;`;
        break;
      case 'uniform':
        wgsl += `@group(0) @binding(0) var<uniform, read_write> a: atomic<${t.params.type}>;`;
        break;
      case 'storage':
        wgsl += `@group(0) @binding(0) var<storage, read_write> a: atomic<${t.params.type}>;`;
        break;
      case 'handle':
        wgsl += `invalid`;
        break;
    }

    const ok =
      kValidAtomicTypes.includes(t.params.type) && //
      kValidAtomicAddressSpaces.includes(t.params.address_space);

    t.expectCompileResult(ok, wgsl);
  });
