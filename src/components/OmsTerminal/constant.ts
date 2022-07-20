// \x1b[(文字装饰);(颜色代码):
// 0	   1	  3     4
// 正常	 加粗	斜体   下划线

// 参考ANSI转义序列https://blog.csdn.net/ScilogyHunter/article/details/106874395

export const ANSI_COLOR_RED = '\x1b[1;3;31m';
export const ANSI_COLOR_GREEN = '\x1b[1;3;32m';
export const ANSI_COLOR_YELLOW = '\x1b[1;33m';
export const ANSI_COLOR_BLUE = '\x1b[1;3;34m';
export const ANSI_COLOR_MAGENTA = '\x1b[1;3;35m';
export const ANSI_COLOR_CYAN = '\x1b[1;3;36m';
export const ANSI_COLOR_RESET = '\x1b[1;3;0m';
