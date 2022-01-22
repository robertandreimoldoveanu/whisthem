/* eslint-disable no-debugger */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { tap } from 'rxjs';

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
    checkpoint: function (
      name: string | number,
      variables: { [x: string]: any },
      logs = false
    ) {
      if (flows.get(name) && debugOn) {
        Object.keys(variables).forEach((variable) => {
          log(variable, variables[variable]);
        });
        return tap({
          next(value) {
            logs && log(`[${name} STREAM NEXT]`, value);
            debugger;
          },
          error(error) {
            logs && log(`[${name} STREAM ERROR]`, error);
            debugger;
          },
          complete() {
            logs && log(`[${name} STREAM COMPLETE]`);
            debugger;
          },
        });
      }
      return null;
    },
  };
})();

const style = `background: #eaec30; color: #000`;
const log = (tag: string, ...a: unknown[]) =>
  console.log(`%c[DPN] ${tag}:`, style, ...a);
