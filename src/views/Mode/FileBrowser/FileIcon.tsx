import React, { FC, memo, PropsWithChildren } from 'react';
import { ChonkyIconProps } from 'chonky';
import { ChonkyIconFA } from 'chonky-icon-fontawesome';
import svgMap from '../../../assets/MTUIicons';

const svgIconMap: { [iconName: string]: any } = {
  android: svgMap.android,
  angular: svgMap.angular,
  audio: svgMap.audio,
  babel: svgMap.babel,
  bucklescript: svgMap.bucklescript,
  c: svgMap.c,
  coffee: svgMap.coffee,
  coldfusion: svgMap.coldfusion,
  command: svgMap.command,
  cpp: svgMap.cpp,
  css: svgMap.css,
  cuda: svgMap.cuda,
  database: svgMap.database,
  dinophp: svgMap.dinophp,
  django: svgMap.django,
  docker: svgMap.docker,
  document: svgMap.document,
  editorconfig: svgMap.editorconfig,
  eslint: svgMap.eslint,
  exe: svgMap.exe,
  file: svgMap.file,
  flash: svgMap.flash,
  flow: svgMap.flow,
  fsharp: svgMap.fsharp,
  git: svgMap.git,
  gitlab: svgMap.gitlab,
  go: svgMap.go,
  gradle: svgMap.gradle,
  h: svgMap.h,
  hpp: svgMap.hpp,
  html: svgMap.html,
  image: svgMap.image,
  jar: svgMap.jar,
  java: svgMap.java,
  javascript: svgMap.javascript,
  jenkins: svgMap.jenkins,
  jest: svgMap.jest,
  jsconfig: svgMap.jsconfig,
  json: svgMap.json,
  kotlin: svgMap.kotlin,
  less: svgMap.less,
  lib: svgMap.lib,
  markdown: svgMap.markdown,
  matlab: svgMap.matlab,
  mp3: svgMap.mp3,
  mp4: svgMap.mp4,
  nest: svgMap.nest,
  nginx: svgMap.nginx,
  nodejs: svgMap.nodejs,
  pdf: svgMap.pdf,
  php: svgMap.php,
  ppt: svgMap.ppt,
  powershell: svgMap.powershell,
  prettier: svgMap.prettier,
  python: svgMap.python,
  qsharp: svgMap.qsharp,
  r: svgMap.r,
  raml: svgMap.raml,
  react: svgMap.react,
  reduxAction: svgMap.reduxAction,
  rescript: svgMap.rescript,
  rollup: svgMap.rollup,
  rust: svgMap.rust,
  sass: svgMap.sass,
  svg: svgMap.svg,
  swift: svgMap.swift,
  testJs: svgMap.testJs,
  testJsx: svgMap.testJsx,
  testTs: svgMap.testTs,
  tsconfig: svgMap.tsconfig,
  typescript: svgMap.typescript,
  video: svgMap.video,
  vue: svgMap.vue,
  vueconfig: svgMap.vueconfig,
  webpack: svgMap.webpack,
  word: svgMap.word,
  xml: svgMap.xml,
  xls: svgMap.xls,
  xlsx: svgMap.xlsx,
  yaml: svgMap.yaml,
  yarn: svgMap.yarn,
  zip: svgMap.zip
};

// eslint-disable-next-line react/display-name
const FileIcon: FC<ChonkyIconProps> = memo((props:PropsWithChildren<any>) => {
  const icon = svgIconMap[props?.icon];
  const size = props?.fixedWidth ? '20px' : '100%';
  const top = props?.fixedWidth ? '2px' : '0';
  if (icon) {
    return <>
      <img style={{ height: size, width: size, position: 'relative', top }} src={icon}/>
    </>;
  }
  return <ChonkyIconFA {...props} />;
});

export default FileIcon;
