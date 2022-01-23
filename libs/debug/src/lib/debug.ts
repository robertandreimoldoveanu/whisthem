/* eslint-disable no-debugger */
/* eslint-disable @typescript-eslint/no-explicit-any */

export const DPN = (function dpn() {
  const flows = new Map();
  let debugOn = true;

  return {
    setDebugMode: function (mode: boolean) {
      debugOn = mode;
    },
    start: function (name: string | number) {
      if (debugOn) {
        flows.set(name, true);
      }
    },
    stop: function (name: string | number) {
      if (debugOn) {
        flows.set(name, false);
      }
    },
    clear: function () {
      if (debugOn) {
        flows.clear();
      }
    },
    getActiveFlows: function () {
      log('Active flows', flows);
    },
    debug: function (name: string | number, variables?: { [x: string]: any }) {
      if (flows.get(name) && debugOn) {
        if (variables) {
          Object.keys(variables).forEach((variable) => {
            log(variable, variables[variable]);
          });
        }
        debugger;
      }
    },
  };
})();

const style = `background: #eaec30; color: #000`;
const log = (tag: string, ...a: unknown[]) =>
  console.log(`%c[DPN] ${tag}:`, style, ...a);
