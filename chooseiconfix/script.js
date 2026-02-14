const Addon_Id = 'chooseiconfix';

if(window.Addon==1){ // # Addon-Exec
  AddEvent('BrowserCreatedEx', async function(){
    let Q=window.dialogArguments ? await dialogArguments.Query : '';
    if(/^icon/i.test(Q)){
      const D=document, _$$=D.querySelectorAll.bind(D), cst=15000; // 更新待機時間[ms]
      let stl=0; aPrm=await $.GetAddonElement('%aid%'), lng=await GetLangId(),
        pp=await aPrm.getAttribute('groupP'), pd=await aPrm.getAttribute('groupD');
      pp=pp.split(/%;_;%/); pd=pd.split(/%;_;%/);

      async function _iconGroup(){
        let grp=_$$('div[onclick="OpenIcon(this)"]:not(.icon_grp)');
        for(let i=0; i<grp.length; i++){
          let g=grp[i], s=g.id; g.classList.add('icon_grp');
          g.addEventListener('click', function(ev){ev.srcElement==this? this.classList.toggle('opened') : 0});
          g.dataset.title = /^b,214,/i.test(s) ? (lng=='en' ? 'General' : '全般') :
            /^b,204,/i.test(s) ? (lng=='en' ? 'Browser' :'ブラウザ') :
            /^b,697,/i.test(s) ? 'ieframe,697':
            s.match(/^i,(.+?)$/i) ? RegExp.$1 :
            s.match(/^f,(.+?),(\d*),/i) ? RegExp.$1+' #'+(RegExp.$2-0).toString(16) : s;
        }
        if(grp.length || !stl){stl=Date.now()+cst}
        if(Date.now()<stl){setTimeout(_iconGroup, 100)}else{stl=0}

        if(grp.length){ //並び替え
          let pa=[], da=[], fg=null; grp=_$$('div.icon_grp');
          for(let i=0; i<grp.length; i++){
            let g=grp[i], gt=g.dataset.title, f=0;
            if(g.classList.contains('set')){continue}
            for(let j=0; !f && j<pd.length; j++){if(await PathMatchEx(gt, pd[j])){f++; da.push(g); break}}
            for(let j=0; !f && j<pp.length; j++){if(await PathMatchEx(gt, pp[j])){f++; pa.push(g); break}}
            if(!f && !fg){fg=g}
          }
          for(let i=0; i<pa.length; i++){pa[i].classList.add('set'); grp[0].parentNode.insertBefore(pa[i], fg); pa[i].click()}
          for(let i=0; i<da.length; i++){da[i].classList.add('set'); grp[0].parentNode.insertBefore(da[i], null)}
        }
      }

      let b=_$$('button#ButtonSearch[onclick^="SearchIcon("]');
      if(b.length){b[0].addEventListener('click', function(){setTimeout(_iconGroup, 100)})}
      let p=D.createElement('style'), css=function(){/**
        div#Content {max-width:100%;overflow-x:hidden}
        div.icon_grp {padding: 0}
        div.icon_grp.opened {padding-bottom: 1em}
        div.icon_grp::before {
          content: '+ ' attr(data-title); display: block; padding: .2em; font-size: 1.2em; margin: 0;
          background-color: rgba(120, 120, 124, .1); border-bottom: solid 1px rgba(120, 120, 124, 0.4);
        }
        div.icon_grp.opened::before {content: '- ' attr(data-title); margin-bottom: .3em}
        div.icon_grp > span.tab, div#Content > div.icon_grp:not(.opened) > * {display: none}
      /**/}.toString().replace(/^[^\{]+\{[\s\S]*?\/\*+|\/?\*+\/[\s\S]*?\}$/g, '');
      p.type='text/css'; p.media='screen'; p.appendChild(D.createTextNode(css));
      D.body.appendChild(p); setTimeout(_iconGroup, 100); // Blinkだとwindow.onloadで起動はできない
    }
  }.toString().replace(/^[^{]+{\s*|\s*}$/g, '').replace(/%aid%/g, Addon_Id));

} else { // # Addon-Option
  let s=function(){/**
    <div class="content %lang%"><table class="full options"><tr>
      <td><strong class="ja">レギュラーグループ:</strong><strong class="en">Regular Group:</strong><textarea class="groupP" wrap="soft"></textarea></td>
      <td><strong class="ja">二軍グループ:</strong><strong class="en">Secondary Group:</strong><textarea class="groupD" wrap="soft"></textarea></td>
    </tr></table>
    <p class="info en">
      This add-on aims to improve the UX of the "Icon Select Dialog" for menus, buttons, etc.<br />
      Specifically, it enables constant display of icon group names & makes icon groups collapsible.<br /><br />
      Additionally, entering a "Group Name" in the settings field will reorder the icon groups.<br />
      * Regular Group: Positioned above standard groups, initially expanded<br />
      * Secondary Group: Positioned below standard groups<br />
      Enter one group name per line, <code>/regular expression/</code> specification is also possible.
    </p>
    <p class="info ja">
      メニュー・ボタン等の「アイコン選択ダイアログ」のUX改修を目指したアドオンです。<br />
      具体的には、アイコングループ名を常時表示 & アイコングループの開閉可能化 します。<br /><br />
      また上記設定欄に「グループ名」を記述する事で、アイコングループを並べ替えます。<br />
      * レギュラーグループ: 通常より上へ配置、初期で展開状態<br />
      * 二軍グループ: 通常より下へ配置<br />
      一行に1つずつ記述、<code>/正規表現/</code> 指定も可能。
    </p>
    <footer>
      <span class="ja">テスト用:</span><span class="en">for Test:</span> <input type="button" value="Select" onclick="IconTest()"/>
    </footer></div>
    <style type="text/css" media="screen">
      table.options td {width: 50%; padding: 0 .5em}
      table.options textarea {display: block; width: 100%; height: 38vh; resize: none; font-size: .9rem}
      p.info {padding: 1em; opacity: 0.6}
      .content:not(.ja) .ja, .content.ja .en {display: none} textarea {white-space: pre-wrap}
      b, strong, .bold {font-weight: 700} kbd, code, pre, .code {font-family: 'BIZ UDGothic', monospace}
      footer {display: block; position: absolute; left: 0; bottom: 0; text-align: right; width: 100%; padding: .5em 1em}
    </style>
  /**/}.toString().replace(/%lang%/g, await GetLangId()).replace(/^[^\{]+\{[\s\S]*?\/\*+|\/?\*+\/[\s\S]*?\}$/g, '');

  await SetTabContents(0, 'General', s);

  if(1){ // load Settings (becose not restore linefeeds in textarea...)
    const aPrm=await $.GetAddonElement(Addon_Id);
    let pp=await aPrm.getAttribute('groupP')||'', pd=await aPrm.getAttribute('groupD')||'';
    document.getElementsByClassName('groupP')[0].value=pp.replace(/(%;_;%)+/ig, '\r\n');
    document.getElementsByClassName('groupD')[0].value=pd.replace(/(%;_;%)+/ig, '\r\n');
  }

  SaveLocation=async function(){ // save Settings
    const aPrm=await $.GetAddonElement(Addon_Id);
    let pp=document.getElementsByClassName('groupP')[0].value, pd=document.getElementsByClassName('groupD')[0].value;
    await aPrm.setAttribute('groupP', await pp.replace(/[\r\n]+/g, '%;_;%'));
    await aPrm.setAttribute('groupD', await pd.replace(/[\r\n]+/g, '%;_;%'));
  };

  IconTest=async function(){ //テスト用「アイコン選択ダイアログ」
    await SaveLocation(); ShowIcon('', 'List');
  }

}

