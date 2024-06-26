// 复制内容到剪贴板
export const copyToClipboard = (content: string, cb?: { onSuccess: () => void; onError: () => void }): void => {
  navigator.clipboard
    .writeText(content)
    .then(
      () => {
        /* clipboard successfully set */
        if (cb?.onSuccess) {
          cb?.onSuccess();
        }
      },
      () => {
        /* clipboard write failed */
        if (cb?.onError) {
          cb?.onError();
        }
      }
    )
    .catch((e) => {
      console.error(`复制失败；${JSON.stringify(e)}`);
    });
};
