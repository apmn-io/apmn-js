var execSync = require('execa').sync;

var failures = 0;

function runTest(variant, env) {

  var NODE_ENV = process.env.NODE_ENV;

  process.env.VARIANT = variant;
  process.env.NODE_ENV = env;

  console.log('[TEST] ' + variant + '@' + env);

  try {
    execSync('karma', [ 'start', 'test/config/karma.distro.js' ]);
  } catch (e) {
    console.error('[TEST] FAILURE ' + variant + '@' + env);
    console.error(e);

    failures++;
  } finally {
    process.env.NODE_ENV = NODE_ENV;
  }
}

function test() {

  runTest('apmn-modeler', 'development');
  runTest('apmn-modeler', 'production');

  runTest('apmn-navigated-viewer', 'development');
  runTest('apmn-navigated-viewer', 'production');

  runTest('apmn-viewer', 'development');
  runTest('apmn-viewer', 'production');

  if (failures) {
    process.exit(1);
  }
}


test();