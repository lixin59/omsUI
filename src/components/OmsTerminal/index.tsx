import React, { useEffect, useState } from 'react';
import { Terminal } from 'xterm';
import Zmodem from 'zmodem.js';
import 'xterm/css/xterm.css';
import { AttachAddon } from './AttachAddon';
import { FitAddon } from 'xterm-addon-fit';
import { useSnackbar } from 'notistack';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import UploadButtons from '../Button/UploadButton';

type tProps = {
  id: string;
  // wsUrl: string;
  ws: WebSocket;
  onCloseTodo?: () => any;
};

let timers: any = null;
let zsession = null;
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

  const [uploadDialogVisible, setUploadDialogVisible] = useState(false);
  const [downloadDialogVisible, setDownloadDialogVisible] = useState(false);
  const [percentage, setPercentage] = useState(0);
  const [uploadLoading, setUpLoading] = useState(false);

  const send_files = (session, files, options) => {
    if (!options) options = {};
    // Populate the batch in reverse order to simplify sending
    // the remaining files/bytes components.
    const batch = [];
    let total_size = 0;
    for (let f = files.length - 1; f >= 0; f--) {
      const fobj = files[f];
      total_size += fobj.size;
      batch[f] = {
        obj: fobj,
        name: fobj.name,
        size: fobj.size,
        mtime: new Date(fobj.lastModified),
        files_remaining: files.length - f,
        bytes_remaining: total_size
      };
    }
    let file_idx = 0;

    function promise_callback() {
      const cur_b = batch[file_idx];
      if (!cur_b) {
        return Promise.resolve(); // batch done!
      }
      file_idx++;
      return session.send_offer(cur_b).then(function after_send_offer(xfer) {
        if (options.on_offer_response) {
          options.on_offer_response(cur_b.obj, xfer);
        }
        if (xfer === undefined) {
          return promise_callback(); // skipped
        }
        return new Promise(function (res) {
          const reader = new FileReader();
          // This really shouldn’t happen … so let’s
          // blow up if it does.
          reader.onerror = function reader_onerror(e) {
            console.error('file read error', e);
            throw 'File read error: ' + e;
          };
          let piece;
          reader.onprogress = function reader_onprogress(e) {
            // Some browsers (e.g., Chrome) give partial returns,
            // while others (e.g., Firefox) don’t.
            if (e.target.result) {
              piece = new Uint8Array(e.target.result, xfer.get_offset());
              // _check_aborted(session);
              if (session.aborted()) {
                throw new Zmodem.Error('aborted');
              }
              xfer.send(piece);
              if (options.on_progress) {
                options.on_progress(cur_b.obj, xfer, piece);
              }
            }
          };
          reader.onload = function reader_onload(e) {
            piece = new Uint8Array(e.target.result, xfer, piece);
            // _check_aborted(session);
            if (session.aborted()) {
              throw new Zmodem.Error('aborted');
            }
            xfer.end(piece).then(function () {
              if (options.on_progress && piece.length) {
                options.on_progress(cur_b.obj, xfer, piece);
              }
              if (options.on_file_complete) {
                options.on_file_complete(cur_b.obj, xfer);
              }
              // Resolve the current file-send promise with
              // another promise. That promise resolves immediately
              // if we’re done, or with another file-send promise
              // if there’s more to send.
              res(promise_callback());
            });
          };
          reader.readAsArrayBuffer(cur_b.obj);
        });
      });
    }
    return promise_callback();
  };

  const upload = (files) => {
    // const fileElem = document.getElementsByName('file')[0];
    if (files.length > 0) {
      setUpLoading(true);
      // 这里就需要用到_send_files函数，函数在下面，里面的逻辑不用动
      // 这个内置函数需要传三个参数，具体参数介绍在git里面有，不做赘述
      // 第三个参数是一个object，包含三个回调函数，可以自己拎出来
      send_files(zsession, files, {
        // 上传响应
        on_offer_response(obj, xfer) {
          // 如果回调参数xfer为undefined，说明上传有问题
          if (xfer) {
            console.log(xfer);
          } else {
            console.log(`${obj.name} was upload skipped`);
          }
        },
        // 上传进度回调
        on_progress(obj, xfer) {
          const detail = xfer.get_details();
          // const name = detail.name;
          const total = detail.size;
          let percent;
          if (total === 0) {
            percent = 100;
          } else {
            percent = Math.round((xfer.file_offset / total) * 100);
          }
          console.log(`${percent}%`);
        },
        // 上传成功回调
        on_file_complete(obj) {
          console.log(`${obj.name} 上传成功`);
        }
      }).then(() => {
        zsession?.close();
        setUploadDialogVisible(false);
        setUpLoading(false);
        ws.send('\n');
        // term.focus();
      });
    } else {
      console.log('-------请选择文件');
      setUpLoading(false);
    }
  };
  // 上传文件弹框关闭
  const handleCloseUpload = () => {
    if (uploadLoading) {
      console.log('====上传中无法关闭');
    } else {
      zsession?.close().then(() => {
        // const upload = this.$refs.upload;
        // upload.clearFiles();
      });
    }
  };

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

    ws.onmessage = (e) => {
      try {
        zsentry.consume(e.data);
      } catch (error) {
        // zsession?._on_session_end();
        ws.send('\n');
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
    const _save_to_disk = (packets, name) => {
      const blob = new Blob(packets);
      const url = URL.createObjectURL(blob);
      const el = document.createElement('a');
      el.style.display = 'none';
      el.href = url;
      el.download = name;
      document.body.appendChild(el);
      el.click();
      document.body.removeChild(el);
    };
    const _to_terminal = (octets) => {
      // i.e. send to the Terminal
    };
    const _on_retract = () => {
      // for when Sentry retracts a Detection
      console.log('retract');
    };
    const _sender = (octets) => {
      // i.e. send to the ZMODEM peer
      if (ws) {
        ws.send(new Uint8Array(octets).buffer);
      }
    };

    const _on_detect = (detection) => {
      // Do this if we determine that what looked like a ZMODEM session
      // is actually not meant to be ZMODEM.
      zsession = detection.confirm();
      // 这里是监听上传事件
      if (zsession?.type === 'send') {
        // Send a group of files, e.g., from an <input>’s “.files”.
        // There are events you can listen for here as well,
        // e.g., to update a progress meter.
        // Zmodem.Browser.send_files( zsession, files_obj );

        // 打开上传dialog弹框
        setUploadDialogVisible(true);
      } else {
        // 这里监听下载事件
        zsession.on('offer', (xfer) => {
          // Do this if you don’t want the offered file.

          // 这里是做了一个进度的计算，可有可无
          const total = xfer.get_details().bytes_remaining;
          let length = 0;
          setDownloadDialogVisible(true);
          xfer.on('input', (octets) => {
            length += octets.length;
            setPercentage(Math.ceil((length * 100) / total));
          });

          // 这里往下是功能区
          xfer.accept().then(() => {
            // Now you need some mechanism to save the file.
            // An example of how you can do this in a browser:'

            // 这个下载函数也是内置源码有的，在下面有，可以直接用
            _save_to_disk(xfer._spool, xfer.get_details().name);
          });
        });
        // 监听到下载完毕，关闭下载弹框
        zsession.on('session_end', () => {
          setPercentage(0);
          setDownloadDialogVisible(false);
        });
        zsession.start();
      }
    };

    const zsentry = new Zmodem.Sentry({
      // 这几个参数都为必要参数，是zmodem.js库源码示例中所必须的，每个参数都对应一个function
      // 为了代码可读，把相关方法单独拎了出来
      // 这几个内置函数在源码里都有，里面的逻辑有些小改动，可以对比查看
      to_terminal: _to_terminal,
      sender: _sender,
      on_detect: _on_detect,
      on_retract: _on_retract
    });

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

  return (
    <>
      <div id={id}></div>
      <Dialog
        open={uploadDialogVisible}
        onClose={() => setUploadDialogVisible(false)}
        aria-labelledby="file-browser"
        fullWidth
        maxWidth="md">
        <DialogContent
          style={{ minHeight: '300px', display: 'flex', flexDirection: 'column', justifyContent: 'center ' }}
          dividers>
          <DialogContentText>
            <UploadButtons
              type="host"
              typeId={1}
              onBeforeUpload={() => {
                setUploadDialogVisible(false);
              }}
              customUploadFn={upload}
              // onUploadProgress={onUploadProgress}
              showUploadProgress={false}
            />
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setUploadDialogVisible(false)} color="primary">
            关闭
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default OmsTerminal;
