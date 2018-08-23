import { div, VNode } from "@cycle/dom";
import { Stream } from "xstream";

/**
 * cycle-classic-dom
 * -------------------
 *
 * A tiny helper library for working with classic JS libraries.
 *
 * That is to say, any JS library that works by taking a reference
 * to an element and manipulating the DOM directly.
 *
 * `npm install cycle-classic-dom`
 *
 * API:
 */

export type Constructor = (el: HTMLElement) => void;

export function makeVNode(ctor: Constructor): VNode {
  return div({
    key: Math.random().toString(),
    hook: { insert: vnode => ctor(vnode.elm) }
  });
}

/**
 * Example, sets up a simple xterm.js powered terminal:
 *
 *     import { makeVNode } from 'cycle-classic-dom';
 *     import { makeDOMDriver } from '@cycle/dom';
 *     import { Terminal } from 'xterm'
 *     import xs from 'xstream';
 *
 *     function main() {
 *       const terminal = new Terminal();
 *
 *       terminal.write("Hello from \x1B[1;3;31mxterm.js\x1B[0m $ ");
 *
 *       const terminalVNode = makeVNode(element => {
 *         terminal.open(element);
 *         terminal.refresh(0, terminal.rows - 1);
 *       });
 *
 *       return {
 *         DOM: xs.of(terminalVNode)
 *       }
 *     }
 *
 *     run(main, {DOM: makeDOMDriver(document.body)});
 *
 * For a larger example including capturing output, see the example directory
 */
