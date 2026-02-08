var Addon_Id="usercheatsheet", Addon_Name="UserCheatSheet", lng=await GetLangId();

var item = GetAddonElement(Addon_Id);
if (!item.getAttribute("Set")) {
  item.setAttribute("bConflict", '1');
  item.setAttribute("cConflict", '#c01030');
  item.setAttribute("cAddon", '#0078D7');
}

if (window.Addon == 1) { // # Addon-Exec
  Addons[Addon_Name] = {
    Data: {},

    Exec: async function(Type, Ctrl, pt){ // チートシート表示( "Key" / "Mouse", ...)
      if(!Addons[Addon_Name].Data[Type]){await Addons[Addon_Name].Normalize()}

      var opt=await api.CreateObject('Object'); opt.MainWinow=$;
      await Promise.all([GetText(Type), GetText('CheatSheet'), Addons[Addon_Name].Data['html'+Type], ReadTextFile('config/'+Addon_Id+'.dat')||'|',]).then(function(r){
        opt.title=r[0]+' '+r[1]+' - '+TITLE; opt.content=r[2]; opt.aid=Addon_Id; opt.pos='';
        if(item.getAttribute('bRestore')=='1'){
          var wp=(opt.pos=r[3].split('|')[Type=='Mouse' ? 1 : 0]||'').split(',');
          if(wp.length>4){opt.x=wp[0]; opt.y=wp[1]; opt.width=wp[2]; opt.height=wp[3]}
        }
      });

      var hwnd=await api.FindWindow('TablacusExplorer2', await opt.title);
      if(hwnd){ //既存ウィンドウ
        if(await api.IsIconic(hwnd)){await api.ShowWindow(hwnd, SW_RESTORE)}
        await api.SetForegroundWindow(hwnd); return hwnd;
      }
      return ShowDialog('../addons/'+Addon_Id+'/dialog.html', opt);
    },

    Normalize: async function(){ // データ収集
      var cck=[], ccm=[], xml, D=document, _CE=D.createElement.bind(D),
        _GA=function(e, a){return e.getAttribute(a)}, _SA=function(e, a, v){return e.setAttribute(a, v)},
        _KEY=async function(k){
          var kk=/^\$7d$/i.test(k) ? '(_)' : await GetKeyName(k);
          if(/^\$\w02a$|^\$\w01d$|^\$\w038$/i.test(kk)){kk=await GetKeyName(kk.slice(0, 3) + "1e"); kk=kk.replace(/\+A$/, "")}
          return kk;
        };

      'All,List,Tree,Edit,Menus'.split(',').map(function(c){cck.push({name: c, item: [], cnf: []})});
      'All,List,List_Background,Tree,Tabs,Tabs_Background'.split(',').map(function(c){ccm.push({name: c, item: [], cnf: []})});

      xml=await OpenXmlUI('key.xml', false, true); // Key
      for(var ci=0; ci<cck.length; ci++){
        var ck=cck[ci], ar=xml.getElementsByTagName(ck.name);
        for(var i=0; i<ar.length; i++){
          var k=_GA(ar[i], 'Key').split(/\s*,\s*/); if(!k.length){continue}
          for(var ki=0; ki<k.length; ki++){k[ki]=await _KEY(k[ki])}
          ck.item.push([_GA(ar[i], 'Type'), ar[i].text||ar[i].textContent, '', k, 0]);
        }
      }

      xml=await OpenXmlUI('mouse.xml', false, true); // Mouse
      for(var ci=0; ci<ccm.length; ci++){
        var cm=ccm[ci], ar=xml.getElementsByTagName(cm.name);
        for(var i=0; i<ar.length; i++){
          var m=_GA(ar[i], 'Mouse').split(/\s*,\s*/); if(!m.length){continue}
          cm.item.push([_GA(ar[i], 'Type'), ar[i].text||ar[i].textContent, _GA(ar[i], 'Name')||'', m, 0]);
        }
      }

      var d=_CE('div'); d.innerHTML=await ReadTextFile('config/addons.xml');
      xml=d.querySelectorAll('[enabled="1"][keyexec="1"], [enabled="3"][keyexec="1"]'); // Add-ons Key
      for(var i=0; i<xml.length; i++){
        var ak=_GA(xml[i], 'key').split(/\s*,\s*/); if(!ak.length){continue}
        var ac=_GA(xml[i], 'keyon'), aa=xml[i].localName, an='', e=_CE('div');
        e.innerHTML=await ReadTextFile('addons/'+aa+'/config.xml');
        an=(e.querySelector(lng+' > Name')||e.querySelector('en > Name')).textContent;
        for(var ki=0; ki<ak.length; ki++){ak[ki]=await _KEY(ak[ki])}
        cck[['All','List','Tree','Edit','Menus'].indexOf(ac)].item.push(['Add-ons', aa, an, ak, 8]);
      }
      xml=d.querySelectorAll('[enabled="1"][mouseexec="1"], [enabled="3"][mouseexec="1"]'); // Add-ons Mouse
      for(var i=0; i<xml.length; i++){
        var am=_GA(xml[i], 'mouse').split(/\s*,\s*/); if(!am.length){continue}
        var ac=_GA(xml[i], 'mouseon'), aa=xml[i].localName, an='', e=_CE('div');
        e.innerHTML=await ReadTextFile('addons/'+aa+'/config.xml');
        an=(e.querySelector(lng+' > Name')||e.querySelector('en > Name')).textContent;
        ccm[['All','List','List_Background','Tree','Tabs','Tabs_Background'].indexOf(ac)].item.push(['Add-ons', aa, an, am, 8]);

        for(var j=0; j<am.length; j++){// アドオン登録ジェスチャの"名前"補完
          var em=await MainWindow.eventTE.Mouse[ac][am[j]][0]; if(em){em[2]=an+' *'}
        }
      }

      xml = new DOMParser().parseFromString(await te.Data.xmlMenus.xml, 'application/xml'); d=xml.getElementsByTagName('Item'); // Menus
      for(var i=0; i<d.length; i++){
        var pi=d[i], mn=_GA(pi, 'Name'), mk, mt=_GA(pi, 'Type'), mo=pi.text||pi.textContent;
        if(mn.match(/^\s*(\S.*?)\s*(?:\t|\\t)\s*(\S.*?)\s*$/i)){
          mn=RegExp.$1; mk=RegExp.$2; mk=mk.split(/\s*,\s*/);
          for(var ki=0; ki<mk.length; ki++){mk[ki]=await _KEY(mk[ki])}
          mn=await GetText(mn); pi=await GetText(pi.parentNode.tagName); mn=pi+' > '+mn;
          cck[4].item.push([mt, mo, mn, mk, 4]);
        }else{
          //Blinkでメニュー書き換え手間なので, メニュー表示補正ナシ？
        }
      }

      for(var ci=0, dc=[]; ci<cck.length; ci++){ // Key conflict
        var c=cck[ci]; dc[ci]=ci? dc[0].slice(0) : [];
        for(var i=0; i<c.item.length; i++){
          for(var j=0; j<c.item[i][3].length; j++){
            var k=c.item[i][3][j];
            if(dc[ci].indexOf(k)<0){
              dc[ci].push(k);
            }else if(c.cnf.indexOf(k)<0){
              c.cnf.push(k);
              if(ci && cck[0].cnf.indexOf(k)<0){cck[0].cnf.push(k)}
            }
          }
        }
      }
      for(var ci=0, dc=[]; ci<ccm.length; ci++){ // Mouse conflict
        var c=ccm[ci]; dc[ci]=ci? dc[0].slice(0) : [];
        for(var i=0; i<c.item.length; i++){
          for(var j=0; j<c.item[i][3].length; j++){
            var m=c.item[i][3][j];
            if(dc[ci].indexOf(m)<0){
              dc[ci].push(m);
            }else if(c.cnf.indexOf(m)<0){
              c.cnf.push(m);
              if(ci && ccm[0].cnf.indexOf(m)<0){ccm[0].cnf.push(m)}
            }
          }
        }
      }

      // console.log('# KEY', cck); console.log('# MOUSE', ccm); //CHECK
      Addons[Addon_Name].Data.Key=cck; Addons[Addon_Name].Data.Mouse=ccm;

      Addons[Addon_Name].Data.htmlKey=await Addons[Addon_Name].Parse(cck, false);
      Addons[Addon_Name].Data.htmlMouse=await Addons[Addon_Name].Parse(ccm, true);
      return;
    },

    Parse: function(cc, md) { // HTML化
      var OD=item.getAttribute('cOrder')=='1', D=document,
        _GA=function(e, a){return e.getAttribute(a)}, _SA=function(e, a, v){return e.setAttribute(a, v)},
        _CE=function(t, c, v, o){
          var e=D.createElement(t||'div'); o=o||{}; if(v){e.innerHTML='<label>'+v+'</label>'} if(c){e.className=c}
          for(var a in o){_SA(e, a, o[a])} return e;
        };

      var b=_CE('div', 'body'), root=b.appendChild(_CE('div', 'article'));
      for(var i=0; i<cc.length; i++){
        var c=cc[i], tbl=_CE('table', md ? 'mouse' : 'key');
        tbl.appendChild(_CE('caption', 'title', c.name.replace(/^\s*(.+?)_(.+?)\s*$/, '<label>$1</label> (<label>$2</label>)')), {'data-count': c.item.length});
        for(var j=0; j<c.item.length; j++){
          var p=c.item[j], tr=tbl.appendChild(_CE('tr')), e, t;
          if(!p[2] && /Script$/i.test(p[0]) && p[1].match(/^\s*\/\/+\s*(\S.*?)\s*$/m)){p[2]=RegExp.$1}
          t=p[2] ? p[2] : p[0]+'</label>: <label>'+p[1];
          e=tr.appendChild(_CE('td', (p[4]&8 ? 'addon' : p[4]&4 ? 'menu' : ''), t));
          e=tr.insertBefore(_CE('td'), OD ? e : null);

          for(var h=0, cb; h<p[3].length; h++){
            t=p[3][h]; cb=c.cnf.indexOf(p[3][h])<0; if(h){e.appendChild(_CE('br'))}
            if(md){
              var ct=['', '1: Left-Button', '2: Right-Button', '3: Wheel-Button', '4: X1-Button', '5: X2-Button', '', '', '8: Wheel-RollUp', '9: Wheel-RollDown'];
              t=t.replace(/./g, function(q){
                return /\d/.test(q) ? '<s class="m m'+q+'" title="'+ct[q]+'"></s>' :
                  q=='L' ? '<s class="arw">\uf0b0</s>' : q=='U' ? '<s class="arw">\uf0ad</s>' :
                  q=='R' ? '<s class="arw">\uf0af</s>' : q=='D' ? '<s class="arw">\uf0ae</s>' :
                  q=='A' ? '<kbd class="key">Alt</kbd>' : q=='C' ? '<kbd class="key">Ctrl</kbd>' :
                  q=='S' ? '<kbd class="key">Shift</kbd>' : q;
              });
              e.appendChild(_CE('kbd', 'mouse'+(cb ? '' : ' conflict'), t));
            }else{
              e.appendChild(_CE('kbd', 'key'+(cb ? '' : ' conflict'), t, t=='(_)' ? {title: 'bottom "\\"'} : {}));
            }
          }
        }
        if(c.item.length){root.appendChild(tbl)}
      }
      var c=_CE('style', 'css_colored', '', {type: 'text/css'}), s=''; //着色用
      s='td.addon, td.menu {color: '+(_GA(item, 'bAddon')=='1' ? _GA(item, 'cAddon') : 'currentColor')+'}';
      s+='kbd.conflict {color: '+(_GA(item, 'bConflict')=='1' ? _GA(item, 'cConflict') : 'currentColor')+'}';
      c.textContent=s; root.insertBefore(c, root.firstChild);

      return b.innerHTML;
    }
  };

  AddTypeEx("Add-ons", Addon_Name+'_Key', function(Ctrl, pt){Addons[Addon_Name].Exec('Key', Ctrl, pt)});
  AddTypeEx("Add-ons", Addon_Name+'_Mouse', function(Ctrl, pt){Addons[Addon_Name].Exec('Mouse', Ctrl, pt)});

} else { // # Addon-Option
  var htm=function(){/**
    <table class="ucc %lng%">
      <tr>
        <td><span class="en">Item display format</span><span class="ja">項目の表示形式</span>:</td>
        <td><label><input type="checkbox" id="cOrder" style="visibility: hidden" /><span class="tglOrder">&nbsp;</span></label></td>
      </tr><tr>
        <td><label><input type="checkbox" id="bConflict" /> <span class="en">Color Conflict Input</span><span class="ja">重複操作を着色</span>:</label></td>
        <td><input type="text" id="cConflict" onchange="ChangeColor1(this)"> <input id="Color_cConflict" type="button" value=" " class="color" onclick="ChooseColor2(this)"></td>
      </tr><tr>
        <td><label><input type="checkbox" id="bAddon" /> <span class="en">Color Add-ons and Menu item</span><span class="ja">アドオン・メニューの項目を着色</span></label>:</td>
        <td><input type="text" id="cAddon" onchange="ChangeColor1(this)"> <input id="Color_cAddon" type="button" value=" " class="color" onclick="ChooseColor2(this)"></td>
      </tr><tr>
        <td colspan="2"><label><input type="checkbox" id="bRestore" /> <span class="en">Restore display position</span><span class="ja">表示位置を復元</span></label></td>
      </tr><tr><td class="info en" colspan="2">
        Menus / Key / Mouse / "Tool bar" add-ons, etc.<br />&nbsp;* Type: "Add-ons"<br />&nbsp;* Options: "UserCheatSheet_Key" / "UserCheatSheet_Mouse"<br /> This allows each list to be displayed.<br /><br />
        Type: JScript, JavaScript and VBScript treats,<br />&nbsp;&nbsp;// Comment-Line within options as "Names".
      </tr><tr><td class="info ja" colspan="2">
        メニュー / キー / マウス / 「ツールバー」アドオン等で<br />&nbsp;* タイプ: 「アドオン」<br />&nbsp;* オプション: 「キー 一覧」 / 「マウス 一覧」<br />と指定する事で、一覧を表示出来るようになります。<br /><br />
        タイプ: JScript / JavaScript / VBScript では、オプション 内の<br />&nbsp;&nbsp;// コメント行を「名前」として扱います。
      </td></tr>
    </table>
    <style type="text/css" media="screen">
      table.ucc {margin: 1em; max-width: 100%} table.ja .en, table:not(.ja) .ja {display: none} td {padding: 0.2em 0.4em}
      .info {padding: 1em; opacity: 0.6} #cOrder {margin-left: -1.2em} input[type="text"] {font-family: monospace}
      .tglOrder {display: inline-block; position: relative; width: 14em; line-height: 1.8em; border-radius: 0.2em; overflow: hidden; cursor: pointer}
      .tglOrder::before, .tglOrder::after {content: 'Name'; position: absolute; background-color: rgba(120, 120, 124, 0.2); width: 50%; height: 100%; left: 0%; top: 0; text-align: center; transition: 0.3s}
      .tglOrder::after {content: 'Input'; background-color: rgba(120, 120, 124, 0.4); left: 50%}
      input:checked + .tglOrder::before {left: 50%} input:checked + .tglOrder::after {left: 0%} table.ja .tglOrder::before {content: '名前'} table.ja .tglOrder::after {content: '操作'}
    </style>
  /**/}.toString().replace(/^[^\{]+\{[\s\S]*?\/\*+|\/?\*+\/[\s\S]*?\}$/g, '').replace(/%lng%/g, lng);
  SetTabContents(1, 'View', htm);
}
