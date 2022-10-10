import React, { useEffect } from 'react';
import { Terminal } from 'xterm';
import 'xterm/css/xterm.css';
import { AttachAddon } from 'xterm-addon-attach';
import { FitAddon } from 'xterm-addon-fit';
import { useSnackbar } from 'notistack';

type tProps = {
  id: string;
  // wsUrl: string;
  ws: WebSocket;
  onCloseTodo?: () => any;
};

let timers: any = null;
let terminalSize = { rows: 40, cols: 150 };

function changeTerminalSize() {
  if (window.screen.height > 870) {
    terminalSize.rows = 40;
  }
  if (window.screen.height > 1000) {
    terminalSize.rows = 45;
  }
  if (window.screen.height > 1100) {
    terminalSize.rows = 50;
  }
  if (window.screen.height < 870) {
    terminalSize.rows = 30;
  }
}

const OmsTerminal = ({ id, ws, onCloseTodo }: tProps) => {
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    // const ws = new WebSocket(wsUrl);
    changeTerminalSize();
    const term = new Terminal({
      // rendererType: 'canvas', // 渲染类型
      // rows: Math.ceil((document.getElementById('terminal').clientHeight + 40)), // 行数
      rows: terminalSize.rows,
      cols: terminalSize.cols,
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
    // term.write('Hello from \x1B[1;3;31mxterm.js\x1B[0m $ ');
    // term.writeln('Welcome to xterm.js');
    // term.writeln('欢迎使用 oms !!!');
    // term.writeln('');
    term.focus();
    fitAddon.fit();

    switch (ws.readyState) {
      case WebSocket.CONNECTING:
        term.writeln('正在连接服务器...');
        break;
      case WebSocket.OPEN:
        term.writeln('服务器连接成功...');
        break;
      case WebSocket.CLOSING:
        break;
      case WebSocket.CLOSED:
        break;
      default:
        break;
    }

    term.onResize((event) => {
      if (timers) {
        //  防抖 只发送最后一次resize的值
        clearTimeout(timers);
        timers = null;
      }
      if (!timers) {
        timers = setTimeout(function () {
          // console.log(event);
          ws.send(JSON.stringify({ cols: event.cols, rows: event.rows }));
          terminalSize = { cols: event.cols, rows: event.rows };
          timers = null;
        }, 500);
      }
    });

    ws.onopen = (evt) => {
      term.writeln('WebSocket服务器连接成功...');
      ws.send(JSON.stringify({ cols: term.cols, rows: term.rows }));
      enqueueSnackbar(` WebSocket服务器连接成功: ${evt.type}`, {
        autoHideDuration: 3000,
        variant: 'success'
      });
    };

    ws.onerror = (evt) => {
      console.log(evt);
      enqueueSnackbar(` WebSocket服务器连接失败: ${evt.type}`, {
        autoHideDuration: 3000,
        variant: 'error'
      });
    };

    ws.onclose = function (evt) {
      console.log('Connection closed.', evt);
      // enqueueSnackbar(` WebSocket连接已关闭: ${evt.type}`, {
      //   autoHideDuration: 5000,
      //   variant: 'error'
      // });
      term.dispose();
      if (onCloseTodo) {
        onCloseTodo();
      }
    };
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

    const termResize = () => {
      // console.log(document.body.clientWidth);
      // console.log(document.body.clientHeight);
      // const cols = Math.ceil((document.body.clientWidth - 100) / 14);
      // const rows = Math.ceil((document.body.clientHeight / 20) - 10);
      // term.resize(cols, rows);
      const rows = Math.ceil(document.body.clientHeight / 18 - 10);
      term.resize(terminalSize.cols, rows);
      fitAddon.fit();
    };

    window.addEventListener('resize', termResize);
    return () => {
      // 组件卸载，关闭WebSocket连接 清除 Terminal 实例 web
      ws.close();
      term.dispose();
      window.removeEventListener('resize', termResize);
    };
  }, []);

  return <div id={id}></div>;
};

export default OmsTerminal;
