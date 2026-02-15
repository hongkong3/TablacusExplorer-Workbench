/** CSSによるUI装飾用のclass仕込みスクリプト - 260212

## ペイン (分割画面, TabControl)
  `div#Panel > table.layout.fixed[id^="Panel_"]`
  - .activepane
    アクティブなペインにクラス付与
    UI上のTCやinner***はその配下なので、アクティブ状態でスタイル切り替えが可能
    TreeView, FolderViewはWindowsコントロールなのでCSSじゃ無理
  - data-group = 1～
    所属タブグループのIDを設置, 0:未所属

## フィルターバー
  `input[type="text"][name^="filter"]`
  - .filtered
    フィルターが有効ならクラス付与, 色変えて目立たせたり

## チェックボックス/ラジオ
  `input[type="checkbox"].chkBase` + `span.chkCheck`, `input[type="radio"].chkBase` + `span.chkRadio`
  CSSで描画しやすくするための仕込み
  `.chkBase {opacity: 0}` して .chkCheck/.chkRadio で描く方式
  `.chkBase:checked + .chkChek {...}` 等でチェック状態反映


若干切り替えラグあるのは, 本体側のjs書き換えない限りどーにもなんない...
**********************************************/

(function(){
  if(Addons._preparationCSS){return}
  Addons._preparationCSS = true;

  var _GA=function(e, a){return e.getAttribute(a)}, _SA=function(e, a, v){return e.setAttribute(a, v)},
    _CE=function(t, c, v, o){var e=document.createElement(t||'div'); o=o||{}; if(c){e.className=c} if(v){e.innerHTML=v} for(var a in o){_SA(e, a, o[a])} return e}

  async function _classPane(Ctrl){ // アクティブペイン(分割画面): .activepane  ('div#Panel > table.layout.fixed[id^="Panel_"]')
    var tid=await Ctrl.Parent.Id, tcc=await te.Ctrls(CTRL_TC), tcg=[0], l=await tcc.Count;
    var att=document.querySelectorAll('#Panel > table[id^="Panel_"]'), tt=document.getElementById('Panel_'+tid);
    while(l--){var nid=await tcc[l].Id; tcg[nid]=await tcc[l].Data.Group}
    for(var i=att.length; i--;){
      att[i].classList[att[i]==tt ? 'add' : 'remove']('activepane');
      _SA(att[i], 'data-group', tcg[att[i].id.replace(/^.*?(\d+)$/, '$1')||0]);
    }
  }

  function _classFilter(){ // 有効フィルタバー(input): .filterd  ('input[type="text"][name^="filter"]')
    var af=document.querySelectorAll('input[type="text"][name^="filter"]');
    for(var i=af.length; i--;){af[i].classList[/[^\*]/.test(af[i].value) ? 'add' : 'remove']('filtered')}
  }

  function _classCheckRadio(){ // 装飾用にチェック/ラジオのDOM構造改変: .chkBase .chkCheck/.chkRadio (.btnChkSet)
    var ac=document.querySelectorAll('input[type="checkbox"]:not(.chkBase), input[type="radio"]:not(.chkBase)');
    for(var i=ac.length; i--;){
      var c=ac[i], cs=getComputedStyle(c), l;
      c.parentNode.insertBefore((l=_CE('label')), c).appendChild(c).classList.add('chkBase');
      if(cs.display=='none' || cs.visibility=='hidden'){continue}
      l.appendChild(_CE('span', c.type=='radio' ? 'chkRadio' : 'chkCheck'));

      // アドオン一覧等では, なぜか切り替え毎に作り直しなので...
      if(/^_\w+|^enable_/.test(c.id)){c.addEventListener('change', function(){setTimeout(_classCheckRadio, 50)})}
    }
    if(ac.length){setTimeout(_classCheckRadio, 150)}

    ac=document.querySelectorAll('input[type="button"]:not(.btnChkSet), button:not(.btnChkSet)'); //動的追加対策
    for(var i=ac.length; i--;){ac[i].addEventListener('click', function(){setTimeout(_classCheckRadio, 30)}); ac[i].classList.add('btnChkSet')}
  }


  AddEvent("ChangeView1", function(Ctrl){ // ev:FVフォーカス変更
    _classPane(Ctrl);
    _classFilter(); for(var i=16; i>>=1;){setTimeout(_classFilter, i*60)}
  });

  AddEvent("FilterChanged", function(Ctrl){ // ev:フィルター変更
    _classFilter();
    for(var i=16; i>>=1;){setTimeout(_classFilter, i*60)}
  });

  AddEvent("Load", function(){ // ev:起動後
    _classFilter();
  });

  AddEvent("BrowserCreatedEx", async function(){ // ev:TEウィンドウ生成後
    if($.chrome){setTimeout(function(){document.body.classList.add('wb_blink')}, 100)}
    _classCheckRadio(); setTimeout(_classCheckRadio, 100);
  }.toString().replace(/^([\s\S]+)$/, '($1)();'));

  // TE本体だけは "BrowserCreatedEx" 経過(というかコレ)なので直接実行
  if($.chrome){setTimeout(function(){document.body.classList.add('wb_blink')}, 100)}
  setTimeout(_classCheckRadio, 100);

})();

