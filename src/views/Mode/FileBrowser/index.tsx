import React, { memo, FC } from 'react';
import { FullFileBrowser, setChonkyDefaults, ChonkyIconProps, ChonkyActions, FileActionHandler } from 'chonky';
import { ChonkyIconFA } from 'chonky-icon-fontawesome';
import svg from '../../../assets/icons/Error.svg';


const myEmojiMap: { [iconName: string]: any } = {
  bentoEmoji: svg,
  angryEmoji: '😠',
  japanEmoji: '🗾'
};
export const MyEmojiIcon: FC<ChonkyIconProps> = memo((props) => {
  const emojiIcon = myEmojiMap[props.icon];
  if (emojiIcon) {
    return <>
    </>;
  }
  return <ChonkyIconFA {...props} />;
});

setChonkyDefaults({ iconComponent: MyEmojiIcon });

const FileBrowserPage = () => {
  const files = [
    { childrenCount: 3,
      id: '549c1f93247a',
      isDir: true,
      modDate: '2020-06-27T13:58:16.428Z',
      name: 'Files that load forever',
      parentId: 'qwerty123456'
    },
    { childrenCount: 3,
      id: '549c1f93247a1',
      isDir: true,
      modDate: '2020-06-27T13:58:16.428Z',
      name: 'Files that load forever',
      parentId: 'qwerty123456'
    },
    {
      id: 'mcd',
      name: 'chonky-sphere-v2.png',
      icon: 'bentoEmoji'
    }
  ];
  const folderChain = [{ id: 'xcv', name: 'Demo', isDir: true }];

  const handleAction = React.useCallback<FileActionHandler>((data) => {
    console.log('File action data:', data);
    if (data.id === 'mouse_click_file' && data.payload.clickType === 'double') {
      console.log('双击', data);
    }
  }, []);

  return (
    <div style={{ height: 300, width: '98%' }}>
      <FullFileBrowser
        files={files}
        folderChain={folderChain}
        onFileAction={handleAction}
      />
    </div>
  );
};

export default FileBrowserPage;
