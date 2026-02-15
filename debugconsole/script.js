var Addon_Id = 'debugconsole', Addon_Name = 'DebugConsole', lng = await GetLangId(), Default='BottomBar2Left';
var _GA=function(e, a){return e.getAttribute(a||'Prm')}, _SA=function(e, a, v){return e.setAttribute(a||'Prm', v||'')},
  _CE=function(t, c, v, o){var e=document.createElement(t||'div'); o=o||{}; if(c){e.className=c} if(v){e.innerHTML=v} for(var a in o){_SA(e, a, o[a])} return e};

var item = await GetAddonElement(Addon_Id);
if(!item.getAttribute("Set")){ // 初期値設定
  _SA(item, 'nHeight', '100');
  _SA(item, 'nRecent', '16');
  _SA(item, 'cNortfy', '#07d');
  _SA(item, 'cWarn', '#cb1');
  _SA(item, 'cError', '#c13');
  _SA(item, 'bTrident', 1);
  // _SA(item, 'bBlink', 1);
  _SA(item, 'Set', 1);
}
var RNUM = (_GA(item, 'nRecent')||16)-0;

if (window.Addon == 1) { // # Addon-Exec
  Addons[Addon_Name] = {
    Recent: [], Temp: [], Update: 0,
    add: function(s, c, q){
      var r=document.getElementById('debug'); if(!r){return wsh.Popup(s)}
      var o=r.firstElementChild, p=_CE('pre', (c||'')+' selectable', s||'');
      p.dataset.time=new Date().toLocaleTimeString(); if(q){p.dataset.query=String(q)}
      o.appendChild(p); r.scrollTop=r.scrollHeight;
      return o.children.length;
    },
    log: function(s, c, q){return Addons.DebugConsole.add((s && s.join ? '['+s.join(', ')+']' : String(s)).replace(/\</g, '&lt;'), c||'', q)},
    warn: function(s){return Addons.DebugConsole.log(s, 'warn')},
    error: function(s){return Addons.DebugConsole.log(s, 'error')},
    system: function(s){return Addons.DebugConsole.add(s, 'nortify')},
    _cmd: function(ev){ // 1行入力キー操作
      var e=ev.srcElement||ev.target, k=ev.keyCode, v=e.value, adc=Addons.DebugConsole, r=document.getElementById('debug');
      if(v && k==0x0d){ //Enter:入力
        var rec=[v]; adc.Recent.map(function(k){if(rec.indexOf(k)<0){rec.push(k)}});
        adc.Recent=rec.slice(0, RNUM); adc.Update++; adc.Temp=[]; e.value='';
        var ec=eval('try{'+v+'}catch(e){"\x0f"+String(e)}'), eb=(ec=''+ec).charAt(0)=='\x0f';
        return adc.log(ec.substr(eb ? 1 : 0), eb ? 'error' : '', v);
      }else if(k==0x26 || k==0x28){ //Up/Down:履歴
        if(!adc.Temp.length){adc.Temp=[v].concat(adc.Recent)}
        var i=adc.Temp.indexOf(v), j=i+0x27-k; j=j<0 || j>=adc.Temp.length ? 0 : j;
        if(adc.Temp[j]!=v){r.scrollTop=r.scrollHeight; return e.value=adc.Temp[j]}
      }else if(v && k==0x1b){e.value=''; return -1} //Esc:消去
    },
    set: function(s, c){
      var o=document.getElementById('debug').firstElementChild;
      while(o.firstChild){o.removeChild(o.firstChild)}
      return s ? this.log(s, c) : 0;
    },
    CNDB: {
      1: "RENAMEITEM", 2: "CREATE", 4: "DELETE", 8: "MKDIR", 16: "RMDIR", 32: "MEDIAINSERTED", 64: "MEDIAREMOVED",
      128: "DRIVEREMOVED", 256: "DRIVEADD", 512: "NETSHARE", 1024: "NETUNSHARE", 2048: "ATTRIBUTES", 4096: "UPDATEDIR",
      8192: "UPDATEITEM", 16384: "SERVERDISCONNECT", 32768: "UPDATEIMAGE", 65536: "DRIVEADDGUI", 131072: "RENAMEFOLDER",
      262144: "FREESPACE", 67108864: "EXTENDED", 134217728: "ASSOCCHANGED"
    }
  }

  var cr=await Promise.all([_GA(item, 'bTrident')==1, _GA(item, 'bBlink')==1]);
  if((window.chrome && !cr[1]) || (!window.chrome && !cr[0])){
    delete cr; delete item; return false;
  }

  cr=await Promise.all([_GA(item, 'nHeight'), _GA(item, 'cWarn'), _GA(item, 'cError'), _GA(item, 'cNortfy')]);

  if(_GA(item, 'bNotify')){
    AddEvent('ChangeNotify', async function(Ctrl, pidls, wParam, lParam){
      var l=await pidls.lEvent, ar=[Addons[Addon_Name].CNDB[l] || ("0000000"+l.toString(16)).substr(-8)],
        path=await api.GetDisplayNameOf(await pidls[0], SHGDN_FORPARSING);

      if(/^[A-Z]:\\|^\\\\\w|^::{/i.test(path)){ar.push(path)}
      if(l==SHCNE_RENAMEITEM || l==SHCNE_RENAMEFOLDER){
        path=await api.GetDisplayNameOf(await pidls[1], SHGDN_FORPARSING);
        if(/^[A-Z]:\\|^\\\\\w|^::{/i.test(path)){ar.push(path)}
      }
      Addons[Addon_Name].log(ar.join(" : "), 'nortify');
    });
  }

  AddEvent("Layout", function(){
    var ac = function(){/** /
      <div id="debug_outer">
        <div id="debug">
          <div></div>
          <label id="debug_input"><input type="search" onkeydown="return Addons.DebugConsole._cmd(event||ev)" /></label>
        </div>
        <input type="button" id="debug_cls" value="&#xE75C;" title="clear" onclick="return Addons.DebugConsole.set()" />
      </div>
      <style type="text/css">
        #debug_outer {position: relative; padding: 0; margin: 0}
        #debug {position: relative; width: 100%; height: 100px; height: %cs0%px; padding: .2em; border: solid 1px rgba(120, 120, 124, .4); overflow-y: auto}
        #debug pre {position: relative; margin: 0; padding: .2em .2em .2em 5em; border: solid rgba(120, 120, 124, .1); border-width: 0 0 1px; white-space: pre-wrap; overflow-wrap: anywhere; word-break: break-all; width: 100%; max-width: calc(100% - 4px)}
        #debug pre:nth-child(2n+2) {background-color: rgba(120, 120, 124, .05)}
        #debug pre::after {content: attr(data-time); position: absolute; left: .2em; top: .2em; color: #778}
        #debug pre[data-query]::before {content: '> ' attr(data-query); display: block; color: #778; margin-bottom: .2em}

        #debug .warn {color: currentColor; color: %cs1%}
        #debug .error {color: currentColor; color: %cs2%}
        #debug .nortify {color: currentColor; color: %cs3%}

        #debug_input {display: block; padding: 0 0 0 2em; width: 100%; line-height: 1.2em; min-height: 22px; white-spae: pre}
        #debug_input::before {content: ' > '; margin-left: -2em; opacity: .4}
        #debug_input input {display: inline-block; margin:0; padding: 0; border: none 0; border-radius: 0; outline: none 0; background-color: transparent; width:100%; line-height: 1.2em}

        #debug_cls {font-family: 'Segoe MDL2 Assets'; font-size: 1.2em; position: absolute; right: 1.4em; top: .2em; z-index: 9; opacity: .2}
        #debug_cls:hover {opacity: .7}
      </style>
    /**/}.toString().replace(/^[^\{]+\{[\s\S]*?\/\*+\s*\/?|\/?\*+?\/\}$/g, '');
    cr.map(function(c, i){ac=ac.replace('%cs'+i+'%', c)});

    return SetAddon(Addon_Id, Default, ac);
  });
 
  AddEvent("Load", function(){
    Promise.all([ReadTextFile('config/'+Addon_Id+'.dat')]).then(function(r){Addons[Addon_Name].Recent=(r[0]||'').split('\x0f')});
    Addons[Addon_Name].set('READY : Tablacus Explorer '+ui_.bit+(window.chrome ? 'bit WebView2(Chromium/Blink)' : 'bit (IE11/Trident)'), 'nortify');
  });
  AddEvent("Finalize", async function(){
    var r=''; if(Addons[Addon_Name].Update){Addons[Addon_Name].Recent.map(function(w){if(w){r+=(r ? '\x0f' : '')+w}})}
    if(r){await WriteTextFile('config/'+Addon_Id+'.dat', r)}
  });

  window.alert=window.log=window.debug = await Addons[Addon_Name].log;
  window.warn = await Addons[Addon_Name].warn;
  window.error = await Addons[Addon_Name].error;
  window.clear = await Addons[Addon_Name].set;

  delete item; delete cr;
} else { // # Addon-Options
  var opt = function(){/** /
    <div class="article %lng%"><table class="debugconsole"><tr>
      <td><label>Warning</label>:</td>
      <td><input type="text" id="cWarn" onchange="ChangeColor1(this)" placeholder="#000000"> <input id="Color_cWarn" type="button" value=" " class="color" onclick="ChooseColor2(this)"></td>
    </tr><tr>
      <td><label>Error</label>:</td>
      <td><input type="text" id="cError" onchange="ChangeColor1(this)" placeholder="#000000"> <input id="Color_cError" type="button" value=" " class="color" onclick="ChooseColor2(this)"></td>
    </tr><tr>
      <td><label><input type="checkbox" id="bNotify"> System Nortfy</label>:</td>
      <td><input type="text" id="cNortfy" onchange="ChangeColor1(this)" placeholder="#000000"> <input id="Color_cNortfy" type="button" value=" " class="color" onclick="ChooseColor2(this)"></td>
    </tr><tr>
      <td><label>Number of recent Inputs</label>:</td>
      <td class="recent"><input type="text" id="nRecent" placeholder="16"/></td>
    </tr><tr>
      <td><label>Height</label>:</td>
      <td class="h-size"><input type="text" id="nHeight" placeholder="100"/></td>
    </tr><tr>
      <td colspan="2" class="field">
        <label><input type="checkbox" id="bTrident"> IE11 [Trident]</label>
        <label class="p-right"><input type="checkbox" id="bBlink"> WebView2 [Blink]</label>
      </td>
    </tr></table>
    <div class="info">
      <table class="list" style="min-width: 38%">
        <tr><td class="code">alert()<br />debug()<br />log()</td><td>put Default message.</td></tr>
        <tr><td class="code">warn()</td><td>put Warning message.</td></tr>
        <tr><td class="code">error()</td><td>put Error message.</td></tr>
        <tr><td class="code">clear()</td><td>clear all messages.</td></tr>
      </table>
    </div></div>
    <style type="text/css">
      .article.ja .en, .article:not(.ja) .ja {display: none}
      table.debugconsole {margin: 1em; max-width: 100%} td {padding: .2em .4em}
      td.recent > input {width: 100%; text-align: right}
      td.h-size {position: relative} td.h-size > input {width: 100%; text-align: right; padding-right: 2em}
      td.h-size > input::-ms-clear, td.recent > input::-ms-clear {display: none}
      td.h-size::after {content: 'px '; display: inline-block; position: absolute; white-space: pre; right: .7em; top: 50%; transform: translateY(-50%); opacity: 0.6; z-index: 2}
      td.field {position: relative; padding: 1.3em .6em .3em}
      td.field::before {content: ''; display: inline-block; position: absolute; left: 0; top: 1em; width: 100%; height: calc(100% - 1em); border: solid 1px rgba(120, 120, 124, .6); border-radius: .2em; z-index: -1}
      input::-ms-input-placeholder {color: #ff0000; opacity: 0.6}
      input::placeholder {color: #f00; opacity: 0.6}
      div.info {padding: 1em; opacity: 0.6}
      table.list td {padding: .3em 1em; vertical-align: middle; border: solid 1px rgba(120, 120, 124, .4)}
      table.list tr:nth-child(2n+2) {background-color: rgba(120, 120, 124, .1)}
      .p-right {float: right}
      pre, code, kbd, .code {font-family: 'BIZ UDGothic', monospace; white-space: pre}
    </style>
  /**/}.toString().replace(/^[^\{]+\{[\s\S]*?\/\*+\s*\/?|\/?\*+\/[\s\S]*?\}$/g, '').replace(/%lng%/g, lng);
  SetTabContents(0, 'General', opt);
  // EnableInner();
}

