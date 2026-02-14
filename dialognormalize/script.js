var Addon_Id="dialognormalize", Addon_Name="DialogNormalize", lng=await GetLangId();

var item = await GetAddonElement(Addon_Id);
if (item.getAttribute('Set')!=1) { // 初期値設定
  item.setAttribute('winD', 'ツールバー%-_-%/Tool bar/i');
  item.setAttribute('winR', 'オプション%-_-%一覧表%-_-%Options%-_-%/CheatSheet/');
}

if (window.Addon == 1) { // # Addon-Exec
  AddEvent('BrowserCreatedEx', async function(){
    var item=await $.GetAddonElement('%aid%'), wd=await item.getAttribute('winD'), wr=await item.getAttribute('winR');
    wd=wd.split(/%-_-%/).map(function(q){return (q=q.replace(/^\s+|\s+$/g, '')).match(/^\/(.+?)\/(\w*)$/) ? new RegExp(RegExp.$1, RegExp.$2) : q});
    wr=wr.split(/%-_-%/).map(function(q){return (q=q.replace(/^\s+|\s+$/g, '')).match(/^\/(.+?)\/(\w*)$/) ? new RegExp(RegExp.$1, RegExp.$2) : q});
    async function _DoDialog(hwnd){
      while(hwnd=await api.FindWindowEx(0, hwnd||null, 'TablacusExplorer2', null)){
        Promise.all([api.GetWindowText(hwnd), api.GetWindowLongPtr(hwnd, -16), api.GetSystemMenu(hwnd, null)]).then(async function(n){
          var cd=cr=0, rm=[SC_MINIMIZE, SC_MAXIMIZE, SC_RESTORE];
          wd.map(function(q){cd|=q && n[0].match(q) ? 1 : 0}); wr.map(function(q){cr|=q && n[0].match(q) ? 1 : 0});
          if((!cd && !cr) || n[1]!=0x16cf0000){return null} if(!cr){rm.push(SC_SIZE)}
          await api.SetWindowLongPtr(hwnd, -16, n[1]&(~(cr ? 0x30000 : 0x70000)));
          rm.map(async function(m){await api.RemoveMenu(n[2], m, MF_BYCOMMAND)});
          await api.SetWindowPos(hwnd, null, 0, 0, 0, 0, SWP_NOSIZE|SWP_NOMOVE|SWP_NOZORDER|SWP_NOACTIVATE|SWP_FRAMECHANGED|SWP_NOOWNERZORDER);
        });
      }
    }
    setTimeout(_DoDialog, 100);
  ;}.toString().replace(/^[^{]+{\s*|\s*}$/g, '').replace(/%aid%/g, Addon_Id));
} else { // # Addon-Option
  var htm = function(){/**** /
    <div class="content %lng%"><table class="full options"><tr>
      <td><strong class="ja">ダイアログウィンドウ:</strong><strong class="en">Dialog Window:</strong><textarea class="winD" wrap="soft"></textarea></td>
      <td><strong class="ja">サイズ可変ウィンドウ:</strong><strong class="en">Resizable Window:</strong><textarea class="winR" wrap="soft"></textarea></td>
    </tr></table>
    <p class="info en">
      Remove the minimize/maximize buttons from the specified TE-Window to give it a more “dialog” appearance.<br /><br />
      * Dialog Window: Remove minimize/maximize buttons, fixed window size<br />
      * Resizable Window: Remove minimize/maximize buttons, window size can be changed<br />
      List one per line, executes on windows matching the Window-Title or matching <code>/regular expression/</code>.
    </p><p class="info ja">
      TEウィンドウの最小化/最大化ボタンを削除し、「ダイアログ」らしい外観にします。<br /><br />
      * ダイアログウィンドウ: 最小化/最大化ボタン削除、ウィンドウサイズ固定<br />
      * サイズ可変ウィンドウ: 最小化/最大化ボタン削除、ウィンドウサイズは変更可能<br />
      一行に1つずつ記述、タイトルと部分一致か<code>/正規表現/</code>一致したウィンドウに実行します。
    </p></div>
    <style type="text/css" media="screen">
      table.options td {width: 50%; padding: 0 .5em}
      table.options textarea {display: block; width: 100%; height: 38vh; resize: none; font-size: .9rem}
      p.info {padding: 1em; opacity: 0.6}
      .content:not(.ja) .ja, .content.ja .en {display: none} textarea {white-space: pre-wrap}
      b, strong, .bold {font-weight: 700} kbd, code, pre, .code {font-family: 'BIZ UDGothic', monospace}
    </style>
  /****/}.toString().replace(/^[^\{]+\{[\s\S]*?\/\*+\s*\/?|\/?\*+\/[\s\S]*?\}$/g, '').replace(/%lng%/g, lng);
  await SetTabContents(0, 'General', htm);

  if(1){ // load Settings
    document.getElementsByClassName('winD')[0].value=item.getAttribute('winD').replace(/%-_-%/g, '\r\n');
    document.getElementsByClassName('winR')[0].value=item.getAttribute('winR').replace(/%-_-%/g, '\r\n');
  }

  SaveLocation=async function(){ // save Settings
    var item = await $.GetAddonElement(Addon_Id); //保存は $.GetAddonElement()でないとダメ？
    var wn=await document.getElementsByClassName('winD')[0].value, wr=await document.getElementsByClassName('winR')[0].value;
    await item.setAttribute('winD', await wn.replace(/[\r\n]+/g, '%-_-%'));
    await item.setAttribute('winR', await wr.replace(/[\r\n]+/g, '%-_-%'));
    await item.setAttribute('Set', 1);
  };
}

