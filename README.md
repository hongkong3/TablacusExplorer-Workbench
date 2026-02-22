# TablacusExplorer Workbench

Windows用のタブ型ファイラー [Tablacus Explorer](https://tablacus.github.io/explorer.html "Tablacus Explorer \- アドオンで拡張できるタブ型ファイラー") の**非公式アドオン**を置いてます。  

- 主に 非WebView2（Trident）64ビット版（`TE64.exe, te64.dll`）で動作確認しています
- アドオンのご利用は **自己責任** でお願いします

各アドオンのZipファイルは [.releases](.releases/) からダウンロード可能です。  
<br/>

<!-- TOC/ -->
> - [ユーザー チートシート](#ユーザー-チートシート)
> - [ユーザーインポート](#ユーザーインポート)
> - [アイコン選択ダイアログ-改](#アイコン選択ダイアログ-改)
<!-- /TOC -->

<table><tr><td>
<details>
  <summary><strong>インストール・アンインストール 方法</strong></summary>

  ### 🌱 インストール
  1. 各アドオン用のファイルをフォルダごとダウンロードします。  
     アドオンごとにZipファイルを用意してあるので、それをダウンロードして解凍するのが楽です。  
  1. アドオンのフォルダを、TablacusExplorer インストールフォルダ内の `addons` フォルダの中へ移動します。  
  1. TablacusExplorer を再起動 or 再読込 します。
  1. `オプション > アドオン` 画面の一番下に、アドオンが *無効状態* で追加されてます。  
     チェックボックスで *有効化* して、「OK」ボタンで `オプション` 画面を閉じれば **インストール完了** です。  
     - `オプション > アドオン` 画面の⚙️(歯車)アイコンから、各アドオンの「オプション画面」を開けます。  
     - 各アドオンのオプション画面内に、簡単に使い方を書いてます。  

  ### 🍂 アンインストール
  `オプション > アドオン` 画面内、🗑️(ゴミ箱)アイコンから削除できます。
</details>
</td></tr></table>

- - - - - - - -


## アドオン
<!-- バージョン更新時の表記更新・DL先変更を忘れずに!! -->
[i-te]: https://img.shields.io/static/v1?color=fc5&label=TE&message=25.12.31
[a-te]: https://github.com/tablacus/TablacusExplorer "tablacus/TablacusExplorer: A tabbed file manager with Add\-on support"
[i-cc]: https://img.shields.io/static/v1?color=2ab&label=license&message=CC0
[a-cc]: https://creativecommons.org/publicdomain/zero/1.0/ "CC0 1.0Universal"

### [ユーザー チートシート](/usercheatsheet)
[![x][i-te]][a-te]&nbsp;[![x][i-cc]][a-cc]&nbsp;
[<img height="27fox" src="https://img.shields.io/static/v1?labelColor=27e&color=c23&label=Download%20:&message=TE_usercheatsheet_v153.zip"/>
](/../../raw/master/.releases/TE_usercheatsheet_v153.zip "TE_usercheatsheet_v153.zip をダウンロード")  
<br/>
現在のキーボード・マウスジェスチャの操作設定を一覧表示します。  
<br/>
<br/>

### [ユーザーインポート](/userimport)
[![x][i-te]][a-te]&nbsp;[![x][i-cc]][a-cc]&nbsp;
[<img height="27fox" src="https://img.shields.io/static/v1?labelColor=27e&color=c23&label=Download%20:&message=TE_userimport_v127.zip"/>
](/../../raw/master/.releases/TE_userimport_v127.zip "TE_userimport_v127.zip をダウンロード")  
<br/>
TEウィンドウ生成時に指定ファイルを埋め込みます。  
  
「ユーザースタイルシート」「セットアップ時に実行」などの類似品。  
`*.css`, `*.js` などのファイルを複数登録可能、個別に無効化できます。  
<br/>
<br/>

### [アイコン選択ダイアログ-改](/chooseiconfix)
[![x][i-te]][a-te]&nbsp;[![x][i-cc]][a-cc]&nbsp;
[<img height="27fox" src="https://img.shields.io/static/v1?labelColor=27e&color=c23&label=Download%20:&message=TE_chooseiconfix_v106.zip"/>
](/../../raw/master/.releases/TE_chooseiconfix_v106.zip "TE_chooseiconfix_v106.zip をダウンロード")  
<br/>
「アイコン選択ダイアログ」のUI改修。  
しっかりグループ分け、グループごとに開閉可能。
<br/>
<br/>

### [ダイアログ正規化](/dialognormalize)
[![x][i-te]][a-te]&nbsp;[![x][i-cc]][a-cc]&nbsp;
[<img height="27fox" src="https://img.shields.io/static/v1?labelColor=27e&color=c23&label=Download%20:&message=TE_dialognormalize_v093.zip"/>
](/../../raw/master/.releases/TE_dialognormalize_v093.zip "TE_dialognormalize_v093.zip をダウンロード")  
<br/>
指定のTEウィンドウの外観をダイアログっぽくします。  
具体的には、最小化/最大化ボタンの削除・ウィンドウサイズ固定化です。  
**実用性はありません。**  
<br/>
<br/>

### [デバッグコンソール](/debugconsole)
[![x][i-te]][a-te]&nbsp;[![x][i-cc]][a-cc]&nbsp;
[<img height="27fox" src="https://img.shields.io/static/v1?labelColor=27e&color=c23&label=Download%20:&message=TE_debugconsole_v094.zip.zip"/>
](/../../raw/master/.releases/TE_debugconsole_v094.zip "TE_debugconsole_v094.zip をダウンロード")  
<br/>
デバッグ用のコンソールもどきを設置、非WebView2(Trident)用。
<br/>
