## TablacusExplorer オブジェクト仕様覚え書き

- - - - - - - -

### 構造

ほぼ **COMオブジェクト**、WebView2版では `await` 等でリテラル値を実体化させないと何も出来ない。

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
