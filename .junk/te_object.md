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
    - **FV** (FolderView)  
      各タブ(フォルダ)の内容。UIは *Windowsコントロール*  
      - **FI** (FolderItem?)  
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

### TC (TabControl)
~~~~js:tc.js
TC = te.Ctrl(CTRL_TC, [Id]);                   // アクティブor指定IDのTCを取得
nTC = te.Ctrls(CTRL_TC);                       // 全てのTCをCOMコレクションで取得
nTC = te.Ctrls(CTRL_TC, true, window.chrome);  // 現在のタブグループのTCをCOMコレクションで取得

TC.Type == CTRL_TC                             // オブジェクト定数
TC.Id                                          // 識別用ID
TC.Data.Group                                  // 所属タブグループ[1..], 0:未所属
TC.Visible                                     // 表示状態

TC.Count                                       // FV(タブ)数
TC.Item(N) = FV                                // インデックス(並び順)指定でFV取得
TC.Selected = FV                               // TC内でアクティブなFVを取得
TC.SelectedIndex = N                           // アクティブFVのインデックス番号, 代入でアクティブFV変更

TC.Left                                        // ペイン(分割画面)としての表示領域
TC.Top                                         // 非分割時: 0, 0, "100%", "100%"
TC.Width                                       // "0.00%" ～ "100.00%": 割合指定
TC.Height                                      // 数値指定: px単位指定？

TC.Move(src_idx, dest_idx, [dest_TC]);         // インデックス指定でタブ(FV)を移動
TC.SetOrder([idx0, idx1,...]);                 // インデックス指定の配列でタブの並び替え
TC.Close();                                    // TCを閉じる
~~~~

- - - - - - - -

### FV (FolderView)
~~~~js:fv.js
FV = te.Ctrl(CTRL_FV, [Id]);                 // アクティブor指定IDのFV取得
nFV = te.Ctrls(CTRL_FV);                     // 全てのFVをCOMコレクションで取得
nFV = te.Ctrls(CTRL_FV, true);               // 現在のタブグループのFVをCOMコレクションで取得

FV.Type == CTRL_SB                           // オブジェクト定数
FV.Id                                        // 識別用ID
FV.Parent                                    // 所属TC
FV.Index                                     // 所属TC内での並び順[0..]
FV.Title                                     // タブ表示名
FV.FolderItem.Path                           // FV自身のフルパス
FV.Data.Lock                                 // ロック状態, 取得: GetLock(FV), トグル: Lock(TC, idx, true)

FV.Items = nFI                               // FV内のファイル/フォルダのアイテム(FI)をCOMコレクションで取得
FV.FocusedItem = FI                          // フォーカス中のアイテム(FI)
FV.SelectedItems = nFI                       // 選択アイテムのCOMコレクション
FV.SelectItem(FI, SVSI_FOCUSED|他);          // フォーカスアイテム設定
FV.SelectItem([FI0,...], SVSI_SELECT|他);    // 選択アイテム設定

FV.History.Count                             // 履歴アイテムの総数
FV.History.Index                             // 履歴内での現在のインデックス番号
FV.History.Item(N).Name                      // 履歴アイテムの表示(フォルダ)名
FV.History.Item(N).Path                      // 履歴アイテムのフルパス

FV.Navigate("path", SBSP_SAMEBROWSER);       // 指定パスを開く, SBSP_ACTIVATE_NOFOCUS 併用でアクティブ化しない
FV.Navigate("path", SBSP_NEWBROWSER) = FV;   // 指定パスを新規タブ(FV)で開く
FV.Focus();                                  // 所属TCをアクティブ化
FV.Close();                                  // FVを閉じる
~~~~

- - - - - - - -

### FI (FolderItem)
~~~~js:fi.js
FI = FV.Items.Item(N);                         // FV内のインデックス指定でFIを取得

FI.Name                                        // 表示名
FI.Path                                        // フルパス
FI.Type                                        // ファイルタイプを文字列で取得
FI.IsFolder                                    // フォルダーか (*.zipもフォルダ判定)
FI.IsFileSystem                                // 実在するファイルか？
FI.Size                                        // ファイルサイズ [byte]

FI.ExtendedProperty("System.FileAttributes")   // ファイル属性 [D A R H S]

FI.ExtendedProperty("System.DateCreated")      // 作成日時の DateTimeString
FI.ExtendedProperty("System.DateModified")     // 変更日時の DateTimeString
FI.ExtendedProperty("System.DateAccessed")     // アクセス日時の DateTimeString
~~~~
ファイル/フォルダ操作そのものは、fso.***関数で行う？

- - - - - - - -
