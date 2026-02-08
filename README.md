# TablacusExplorer Workbench

Windows用のタブ型ファイラー [Tablacus Explorer](https://tablacus.github.io/explorer.html "Tablacus Explorer \- アドオンで拡張できるタブ型ファイラー") の**非公式アドオン**を置いてます。  

- アドオンのご利用は **自己責任** でお願いします
- 主に 非WebView2（Trident）64ビット版（`TE64.exe, te64.dll`）で動作確認しています

各アドオンのZipファイルは [.releases](.releases/) からダウンロード可能です。  
<br/>

<!-- TOC/ -->
- [インストール方法](#インストール方法)
- [アドオン](#アドオン)
  - [ユーザー チートシート](#ユーザー-チートシート)
  - [ユーザーインポート](#ユーザーインポート)
  - [アイコン選択ダイアログ-改](#アイコン選択ダイアログ-改)
<!-- /TOC -->
- - - - - - - -

## インストール方法
1. 各アドオン用のファイルをフォルダごとダウンロードします。  
   アドオンごとにZipファイルを用意してあるので、それをダウンロードして解凍するのが楽です。  
1. アドオンのフォルダを、TablacusExplorer インストールフォルダ内の `addons` フォルダの中へ移動します。  
1. TablacusExplorer を再起動 or 再読込 します。
1. `オプション > アドオン` 画面の一番下に、アドオンが *無効状態* で追加されてます。  
   チェックボックスで *有効化* して、「OK」ボタンで `オプション` 画面を閉じれば **インストール完了** です。  
   - `オプション > アドオン` 画面の⚙️(歯車)アイコンから、各アドオンの「オプション画面」を開けます。  
   - 各アドオンのオプション画面内に、簡単に使い方を書いてます。  

## アンインストール方法
1. `オプション > アドオン` 画面内、🗑️(ゴミ箱)アイコンから削除できます。

- - - - - - - -

## アドオン
<!-- バージョン更新時の表記更新・DL先変更を忘れずに!! -->

### [ユーザー チートシート](/usercheatsheet)
[![TE 25.12.31](https://img.shields.io/static/v1?label=TE&message=25.12.31&color=fc5)](https://github.com/tablacus/TablacusExplorer "tablacus/TablacusExplorer: A tabbed file manager with Add\-on support")&nbsp;
[![CC0 1.0Universal](https://img.shields.io/static/v1?label=license&message=CC0&color=27e)](https://creativecommons.org/publicdomain/zero/1.0/ "CC0 1.0Universal")&nbsp;
![Add-ons 1.50](https://img.shields.io/static/v1?label=Add-ons&message=1.50&color=c23 "Add-ons: 1.50")  
🗳️<svg aria-hidden="true" focusable="false" class="octicon octicon-download" viewBox="0 0 16 16" width="16" height="16" fill="currentColor" display="inline-block" overflow="visible" style="vertical-align: text-bottom;"><path d="M2.75 14A1.75 1.75 0 0 1 1 12.25v-2.5a.75.75 0 0 1 1.5 0v2.5c0 .138.112.25.25.25h10.5a.25.25 0 0 0 .25-.25v-2.5a.75.75 0 0 1 1.5 0v2.5A1.75 1.75 0 0 1 13.25 14Z"></path><path d="M7.25 7.689V2a.75.75 0 0 1 1.5 0v5.689l1.97-1.969a.749.749 0 1 1 1.06 1.06l-3.25 3.25a.749.749 0 0 1-1.06 0L4.22 6.78a.749.749 0 1 1 1.06-1.06l1.97 1.969Z"></path></svg>
: [TE_usercheatsheet_v150.zip](/../../raw/master/.releases/TE_usercheatsheet_v150.zip)  
<br/>
現在のキーボード・マウスジェスチャの操作設定を一覧表示します。  
<br/>
<br/>

### [ユーザーインポート](/userimport)
[![TE 25.12.31](https://img.shields.io/static/v1?label=TE&message=25.12.31&color=fc5)](https://github.com/tablacus/TablacusExplorer "tablacus/TablacusExplorer: A tabbed file manager with Add\-on support")&nbsp;
[![CC0 1.0Universal](https://img.shields.io/static/v1?label=license&message=CC0&color=27e)](https://creativecommons.org/publicdomain/zero/1.0/ "CC0 1.0Universal")&nbsp;
![Add-ons 1.27](https://img.shields.io/static/v1?label=Add-ons&message=1.27&color=c23 "Add-ons: 1.27")
: [TE_userimport_v127.zip](/../../raw/master/.releases/TE_userimport_v127.zip)  
<br/>
TEウィンドウ生成時に指定ファイルを埋め込みます。  
  
「ユーザースタイルシート」「セットアップ時に実行」などの類似品。  
`*.css`, `*.js` などのファイルを複数登録可能、個別に無効化できます。  
<br/>
<br/>

### [アイコン選択ダイアログ-改](/chooseiconfix)
[![TE 25.12.31](https://img.shields.io/static/v1?label=TE&message=25.12.31&color=fc5)](https://github.com/tablacus/TablacusExplorer "tablacus/TablacusExplorer: A tabbed file manager with Add\-on support")&nbsp;
[![CC0 1.0Universal](https://img.shields.io/static/v1?label=license&message=CC0&color=27e)](https://creativecommons.org/publicdomain/zero/1.0/ "CC0 1.0Universal")&nbsp;
![Add-ons 1.06](https://img.shields.io/static/v1?label=Add-ons&message=1.06&color=c23 "Add-ons: 1.06")
: [TE_chooseiconfix_v106.zip](/../../raw/master/.releases/TE_chooseiconfix_v106.zip)  
<br/>
「アイコン選択ダイアログ」のUI改修。  
  
しっかりグループ分け、グループごとに開閉可能化。
<br/>
<br/>

