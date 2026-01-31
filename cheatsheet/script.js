const Addon_Id="cheatsheet", Addon_Name="CheatSheet", lng=await GetLangId();

const item = GetAddonElement(Addon_Id);
if (!item.getAttribute("Set")) {
  item.setAttribute("bConflict", '1');
  item.setAttribute("cConflict", '#c01030');
  item.setAttribute("cAddon", '#0078D7');
}

if (window.Addon == 1) { // # Addon-Execute
  Addons[Addon_Name] = {
    Data: null, // データ格納用

    Exec: async function (typ, Ctrl, pt) { // チートシート表示
      if(!Addons[Addon_Name].Data){Addons[Addon_Name].DataPick()}
      const opt=await api.CreateObject("Object"), rc=item.getAttribute('Window'+(typ.charAt(0)))||'';
      opt.MainWindow=$; opt.resize=true; opt.maximize=true; opt.minimize=true;
      opt.Type=typ=='Mouse'; opt.Title=GetText(typ)+' '+GetText('CheatSheet');
      opt.Data=Addons[Addon_Name].Data[typ]; opt.Prm=item;
      if(item.getAttribute('bRestore') && rc){let r=rc.split(','); opt.left=r[0]; opt.top=r[1]; opt.width=r[2]; opt.height=r[3]; opt.WinState=r[4]}

      let hwnd=api.FindWindow('TablacusExplorer2', opt.Title); // 既存のアクティブ化
      if(hwnd){if(api.IsIconic(hwnd)){api.ShowWindow(hwnd, SW_RESTORE)} api.SetForegroundWindow(hwnd); return S_OK}

      ShowDialog("../addons/"+Addon_Id+"/dialog.html", opt);
      return S_OK;
    },

    DataPick: function(){ // データ収集
      const D=document, CE=D.createElement.bind(D), _o=function(v){return {name:v, item: [], cnf: []}};
      let kd=[], md=[], kka=[], mka=[], tp=CE('div'); tp.innerHTML=(await ReadTextFile('config/key.xml'));

      // Keys
      let tc=tp.childNodes.length ? tp.childNodes[0].childNodes : [];
      for(let i=0; i<tc.length; i++){
        let t=tc[i].getAttribute('type'), k=(tc[i].getAttribute('key')||'').split(/\s*,\s*/), o=tc[i].innerHTML,
          c=tc[i].localName.replace(/^(\w)/, function(_, r){return String.fromCharCode(r.charCodeAt(0)-0x20)});
        if(!k.length || !k[0]){continue}
        for(let j=0; j<k.length; j++){k[j]=k[j].replace(/\$7d\b/g, '(_)'); k[j]=/^\$/.test(k[j]) ? await GetKeyName(k[j]) : k[j]; k[j]=/^\$\w02a$|^\$\w01d$|^\$\w038$/i.test(k[j]) ? await GetKeyName(s.slice(0, 3) + "1e").replace(/\+A$/, "") : k[j]}
        if(o.match(/^\s*\/\/+\s*(\S.*?)\s*$/m)){o=RegExp.$1, t=''}else if(o.match(/^\s*(\S.*?)\s*[\r\n]+\s*\S/m)){o=RegExp.$1+'...'}else{o=o.replace(/^\s+|\s+$/g, '')}
        if(kka.indexOf(c)<0){kd.push(_o(c)); kka.push(c)} kd[kka.indexOf(c)].item.push([t, o, k, 0]);
      }

      // Gestures
      tp=CE('div'), tp.innerHTML=(await ReadTextFile('config/mouse.xml')), tc=tp.childNodes.length ? tp.childNodes[0].childNodes : [];
      for(let i=0; i<tc.length; i++){
        let t=tc[i].getAttribute('type'), m=(tc[i].getAttribute('mouse')||'').split(/\s*,\s*/), o=tc[i].innerHTML,
          n=tc[i].getAttribute('name'), c=tc[i].localName.replace(/^(\w)/, function(_, r){return String.fromCharCode(r.charCodeAt(0)-0x20)});
        if(!m.length || !m[0]){continue}
        if(n){o=n, t=''}else if(o.match(/^\s*\/\/+\s*(\S.*?)\s*$/m)){o=RegExp.$1, t=''}else if(o.match(/^\s*(\S.*?)\s*[\r\n]+\s*\S/m)){o=RegExp.$1+'...'}else{o=o.replace(/^\s+|\s+$/g, '')}
        if(mka.indexOf(c)<0){md.push(_o(c)); mka.push(c)} md[mka.indexOf(c)].item.push([t, o, m, 0]);
      }

      // Addons
      tp=CE('div'), tp.innerHTML=(await ReadTextFile('config/addons.xml'));
      tc=tp.querySelectorAll('[enabled="1"][keyexec="1"],[enabled="1"][mouseexec="1"],[enabled="3"][keyexec="1"],[enabled="3"][mouseexec="1"]');
      for(let i=0; i<tc.length; i++){
        let an=tc[i].localName, a=CE('div'), b;
        a.innerHTML=(await ReadTextFile('addons/'+an+'/config.xml'));
        an=(b=a.querySelector(lng+' > Name')||a.querySelector('en > Name')) ? b.innerHTML : an;

        if(tc[i].getAttribute('keyexec')==1){ // Addon-Keys
          let k=(tc[i].getAttribute('key')||'').split(/\s*,\s*/), c=tc[i].getAttribute('keyon'); if(!k.length || !k[0]){continue}
          for(let j=0; j<k.length; j++){k[j]=k[j].replace(/\$7d\b/g, '(_)'); k[j]=/^\$/.test(k[j]) ? await GetKeyName(k[j]) : k[j]; k[j]=/^\$\w02a$|^\$\w01d$|^\$\w038$/i.test(k[j]) ? await GetKeyName(s.slice(0, 3) + "1e").replace(/\+A$/, "") : k[j]}
          if(kka.indexOf(c)<0){kd.push(_o(c)); kka.push(c)} kd[kka.indexOf(c)].item.push(['', an, k, 8]);
        }
        if(tc[i].getAttribute('mouseexec')==1){ // Addon-Gestures
          let m=(tc[i].getAttribute('mouse')||'').split(/\s*,\s*/), c=tc[i].getAttribute('mouseon'); if(!m.length || !m[0]){continue}
          if(mka.indexOf(c)<0){md.push(_o(c)); mka.push(c)} md[mka.indexOf(c)].item.push(['', an, m, 8]);

          for(let j=0; j<m.length; j++){ //アドオンジェスチャの名前補完
            if(eventTE.Mouse[c][m[j]]){eventTE.Mouse[c][m[j]][0][2]=an+' *'}
          }
        }
      }

      for(let i=0; i<kd.length; i++){ // Conflict-Key
        for(let j=0, c=kd[i], b=[]; j<c.item.length; j++){
          for(let h=0, k=c.item[j][2]; h<k.length; h++){
            if(b.indexOf(k[h])<0){b.push(k[h])}else if(c.cnf.indexOf(k[h])<0){c.cnf.push(k[h])}
          }
        }
      }
      for(let i=0; i<md.length; i++){ // Conflict-Mouse
        for(let j=0, c=md[i], b=[]; j<c.item.length; j++){
          for(let h=0, m=c.item[j][2]; h<m.length; h++){
            if(b.indexOf(m[h])<0){b.push(m[h])}else if(c.cnf.indexOf(m[h])<0){c.cnf.push(m[h])}
          }
        }
      }
      return Addons[Addon_Name].Data={Key: kd, Mouse: md};
    }
  };

  AddEvent("Load", function(){ // アドオンジェスチャ名補完用の起動時実行
    if(item.getAttribute('bInit')){Addons[Addon_Name].DataPick()}
  });

  AddTypeEx("Add-ons", Addon_Name+'_Key', function(Ctrl, pt){Addons[Addon_Name].Exec('Key', Ctrl, pt)});
  AddTypeEx("Add-ons", Addon_Name+'_Mouse', function(Ctrl, pt){Addons[Addon_Name].Exec('Mouse', Ctrl, pt)});
} else { // # Addon-Option
  let htm=function(){/**
    <table class="@@@">
      <tr>
        <td><span class="en">Item Order</span><span class="ja">項目の表示順</span>:</td>
        <td><label><input type="checkbox" id="cOrder" style="visibility: hidden" /><span class="tglOrder">&nbsp;</span></label></td>
      </tr><tr>
        <td><label><input type="checkbox" id="bConflict" /> <span class="en">Color Conflict Input</span><span class="ja">重複操作を着色</span>:</label></td>
        <td><input type="text" id="cConflict" onchange="ChangeColor1(this)"> <input id="Color_cConflict" type="button" value=" " class="color" onclick="ChooseColor2(this)"></td>
      </tr><tr>
        <td><label><input type="checkbox" id="bAddon" /> <span class="en">Color Add-ons item</span><span class="ja">アドオン項目を着色</span></label>:</td>
        <td><input type="text" id="cAddon" onchange="ChangeColor1(this)"> <input id="Color_cAddon" type="button" value=" " class="color" onclick="ChooseColor2(this)"></td>
      </tr><tr>
        <td><label><input type="checkbox" id="bRestore" /> <span class="en">Restore window position</span><span class="ja">ウィンドウ位置を復元</span></label></td>
        <td><label><input type="checkbox" id="bInit" /> <span class="en">Autocomplete the "Name" of mouse gestures from Add-ons</span><span class="ja">アドオン固有マウスジェスチャの「名前」を補完</span></label></td>
      </tr><tr><td class="info en" colspan="2">
        Menus / Key / Mouse / "Tool bar" add-ons, etc.<br />&nbsp;* Type: "Add-ons"<br />&nbsp;* Options: "CheatSheet_Key" / "CheatSheet_Mouse"<br /> This allows each list to be displayed.<br /><br />
        Type: JScript, JavaScript and VBScript treats,<br />&nbsp;&nbsp;// Comment-Line within options as "Names".
      </tr><tr><td class="info ja" colspan="2">
        メニュー / キー / マウス / 「ツールバー」アドオン等で<br />&nbsp;* タイプ: 「アドオン」<br />&nbsp;* オプション: 「キー 一覧」 / 「マウス 一覧」<br />と指定する事で、一覧を表示出来るようになります。<br /><br />
        タイプ: JScript / JavaScript / VBScript では、オプション 内の<br />&nbsp;&nbsp;// コメント行を「名前」として扱います。
      </td></tr>
    </table>
    <style type="text/css" media="screen">
      table.ja .en, table:not(.ja) .ja {display: none} td {padding: 0.2em 0.4em}
      .info {padding: 1em; opacity: 0.6} #cOrder {margin-left: -1.2em} input[type="text"] {font-family: monospace}
      .tglOrder {display: inline-block; position: relative; width: 14em; line-height: 1.8em; border-radius: 0.2em; overflow: hidden; cursor: pointer}
      .tglOrder::before, .tglOrder::after {content: 'Name'; position: absolute; background-color: rgba(120, 120, 124, 0.2); width: 50%; height: 100%; left: 0%; top: 0; text-align: center; transition: 0.3s}
      .tglOrder::after {content: 'Input'; background-color: rgba(120, 120, 124, 0.4); left: 50%}
      input:checked + .tglOrder::before {left: 50%} input:checked + .tglOrder::after {left: 0%} table.ja .tglOrder::before {content: '名前'} table.ja .tglOrder::after {content: '操作'}
    </style>
  /**/}.toString().replace(/^[^\{]+\{[\s\S]*?\/\*+|\/?\*+\/[\s\S]*?\}$/g, '').replace(/@@@/g, lng);
  SetTabContents(1, "View", htm);
}
