## TablacusExplorer オブジェクト仕様覚え書き

- - - - - - - -

### 構造

ほぼ **COMオブジェクト**、WebView2版では `await` 等で実体化させないと**大体使えない**。

- **TE** (TEのメインウィンドウ?)  
  UIの大部分はHTMLによる構成  
  `MainWindow` : HTMLとしてのメインウィンドウ？  
  - **TC** (TabControl)  
    分割画面(ペイン)の単位、UI上では HTMLElement のタブバー部分  
    `TC.Data.Group` に所属「タブグループ」を保持  
    - **FV** (FileView)  
      各タブ(フォルダ)の内容。UIは *Windowsコントロール*  
      - FI? (FileItem?)  
        FV内に表示されるファイル/フォルダ類  
      - **TV** (TreeView)  
        サイドツリー以外はFVごとに保持？  UIは *Windowsコントロール*  
  - **TV** (Side-TreeView)  
    `.Id` 値を持たないのでどれがどれやら・・・  
  - 各アドオンのUI  
    メインウィンドウ上の HTMLElement として生成される  

  - **WebBorwser**  
    ダイアログ等の別ウィンドウ  
    生成時のオプション値を `dialogArguments.***` として参照可能  
    場合によっては `MainWindow` からオブジェクトも引っ張ってくる  

<table><tr><td><details><summary><strong>Ctrl</strong></summary>

コマンド等での呼び出しでは引数として`Ctrl`が渡される。  
`Ctrl.Type`の定数値で呼び出し元を判別。  
- FV: `CTRL_SB:1`, `CTRL_FV:0`  
- TC: `CTRL_TC:196608`, たまに`CTRL_WB:131072`など  
- TV: `CTRL_TV:262144`  
- TE: `CTRL_TE:65536`  
  メニュー・ボタン等は本体経由扱い
- その他: `CTRL_WB:131072`  
  どのアドオン(のUI)かは`pt`を`document.elementFromPoint()`に使うなどして探索
</details></td></tr></tr></table>

- - - - - - - -

### TC
~~~~js:hoge.js
TC = await te.Ctrl(CTRL_TC, [Id]);
nTC = await te.Ctrls(CTRL_TC, [Group]);
nTC = await te.Ctrls(CTRL_TC, true, window.chrome);

TC.Type
TC.Id
TC.Data.Group
TC.Visible

TC.Item(N)
TC.Count
TC.SelectedIndex
TC.Selected

TC.Move(srcIndex, destIndex, [destTC]);
TC.SetOrder([idx0, idx1,...]);
~~~~
