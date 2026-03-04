> [!NOTE]
> 🧰アドオン未満のジャンク置き場。  
  [_checks.js](_checks.js) ： デバッグ用関数  
  [_style.js](_style.js) ： スタイル調整用関数  
  [te_addon.md](te_addon.md) ： TEアドオン覚え書き  
  [te_object.md](te_object.md) : TEオブジェクト覚え書き  

- - - - - - - -

#### タイトルバーの「Tabulacus Explorer」の文字を変更
自動実行されるスクリプト等で `window.TITLE` を上書き。
~~~~js:oOo.js
  // Type: JavaScript
  TITLE = 'TE' + (ui_.bit) + (window.chrome ? '-WV2' : '');
~~~~
&nbsp;

#### 動作モード変更
WebView2(Blink) / IE(Trident) を切り替えてTE再起動。  `tewv32.dll`, `tewv64.dll` が存在する事が前提。  
~~~~js:oOo.js
  // Type: JavaScript
  const cs=['Trident', 'WebView2(Blink)', (ui_.bit)+'bit '], cc=window.chrome ? 1 : 0
  const lb='tewv'+(ui_.bit)+'.dll', lc=[ui_.Installed+'/lib/--'+lb, ui_.Installed+'/lib/'+lb];
  let tx='現在 '+cs[2]+cs[cc]+' 版です', fc=fso.FileExists(lc[cc]);

  if(fc){tx+='\r\n'+cs[2]+cs[cc^1]+' 版に切り替えますか？'}
  if(await MessageBox(tx, TITLE, 0x24|0x100)==6){
    await Promise.all([fso.MoveFile(lc[cc], lc[cc^1]), FinalizeUI(), te.Reload(true)]);
  }
~~~~
&nbsp;
