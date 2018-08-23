import { makeDOMDriver, div, button, VNode } from "@cycle/dom";
import { run } from "@cycle/run";
import { Terminal } from "xterm";
import xs, { Stream } from "xstream";
import { makeVNode } from "../readme";

function fromEvent(terminal: Terminal, event: string): Stream<any> {
  let terminalListener;

  return xs.create({
    start(listener) {
      terminalListener = listener.next.bind(listener);

      terminal.on(event, terminalListener);
    },

    stop() {
      if (terminalListener) {
        terminal.off(event, terminalListener);
      }
    }
  });
}

function terminal(input$) {
  const term = new Terminal();
  const data$ = fromEvent(term, "data");

  input$.subscribe({ next: term.write.bind(term) });

  return {
    data$,

    vnode: makeVNode(el => {
      term.open(el);
      term.refresh(0, term.rows - 1);
    })
  };
}

function main(sources) {
  const xterm = terminal(xs.of("Hello from \x1B[1;3;31mxterm.js\x1B[0m $ "));

  const visible$ = sources.DOM.select("button")
    .events("click")
    .fold(acc => !acc, true);

  const data$ = xterm.data$.fold((acc, val) => acc.concat(val), []);

  return {
    DOM: xs
      .combine(visible$, data$)
      .map(([visible, data]) =>
        div([
          button("toggle"),
          visible ? xterm.vnode : div(""),
          div(data.join(""))
        ])
      )
  };
}

const drivers = {
  DOM: makeDOMDriver(document.body)
};

run(main, drivers);
