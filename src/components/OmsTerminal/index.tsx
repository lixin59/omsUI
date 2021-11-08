import React, { useEffect } from 'react';
import { Terminal } from 'xterm';
import 'xterm/css/xterm.css';
import { AttachAddon } from 'xterm-addon-attach';
import { FitAddon } from 'xterm-addon-fit';

type tProps = {
  id: string
}

const OmsTerminal = ({ id }: tProps) => {

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:4001');
    const term = new Terminal({
      // rendererType: 'canvas', // 渲染类型
      // rows: Math.ceil((document.getElementById('terminal').clientHeight + 40)), // 行数
      rows: 46,
      // cols: 200,
      convertEol: true, // 启用时，光标将设置为下一行的开头
      // scrollback: 1000, // 终端中的回滚量
      // disableStdin: false, // 是否应禁用输入。
      cursorStyle: 'underline', // 光标样式
      cursorBlink: true, // 光标闪烁
      // theme: {
      //   foreground: 'yellow', // 字体
      //   background: '#060101', // 背景色
      //   cursor: 'help'// 设置光标
      // },
      // fontFamily: 'Menlo, Monaco, "Courier New", monospace',
      // fontWeight: 400,
      fontSize: 14,
      tabStopWidth: 4
    });
    const attachAddon = new AttachAddon(ws);
    const fitAddon = new FitAddon();
    term.loadAddon(attachAddon);
    term.loadAddon(fitAddon);

    term.open(document.getElementById(id) as HTMLElement);
    term.write('Hello from \x1B[1;3;31mxterm.js\x1B[0m $ ');
    term.writeln('Welcome to xterm.js');
    term.writeln('This is a local terminal emulation, without a real terminal in the back-end.');
    term.writeln('Type some keys and commands to play around.');
    term.writeln('');
    term.focus();
    fitAddon.fit();

    term.onResize((event) => {
      console.log(event);
      // term.resize(event.cols, event.rows);
    });
    // term.onData((val) => {
    //   term.write(val);
    // });

    // term.onKey((e) => {
    //   const ev = e.domEvent;
    //   const printable = !ev.altKey && !ev.altGraphKey && !ev.ctrlKey && !ev.metaKey;
    //   if (ev.keyCode === 13) {
    //     term.prompt();
    //   } else if (ev.keyCode === 8) {
    //     // Do not delete the prompt
    //     if (term._core.buffer.x > 0) {
    //       term.write('\b \b');
    //     }
    //   } else if (printable) {
    //     term.write(e.key);
    //     // webSocket.send(e.key);
    //   }
    // });
    // async function asyncInitSysEnv() {
    //   const pid = await initSysEnv(term),
    //     ws = new WebSocket(socketURL + pid),
    //     attachAddon = new AttachAddon(ws);
    //   term.loadAddon(attachAddon);
    // }
    // asyncInitSysEnv();

    const termResize = () => {
      console.log(document.body.clientWidth);
      // console.log(document.body.clientHeight);
      // const cols = Math.ceil((document.body.clientWidth - 100) / 14);
      // const rows = Math.ceil((document.body.clientHeight / 20) - 10);
      // term.resize(cols, rows);
      fitAddon.fit();
    };

    window.addEventListener('resize', termResize);
    return () => {
      // 组件卸载，清除 Terminal 实例
      term.dispose();
      window.removeEventListener('resize', termResize);
    };
  }, []);

  return (<div id={id}></div>);
};

export default OmsTerminal;
