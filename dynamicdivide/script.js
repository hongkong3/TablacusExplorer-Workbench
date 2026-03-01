var Addon_Id="dynamicdivide", Addon_Name="DynamicDivide", lng=await GetLangId();

if(!window.log){window.log=window.chrome ? console.log : window.alert}

var item = GetAddonElement(Addon_Id), _GA=function(e, a){return e.getAttribute(a)};
if (!item.getAttribute("Set")) { // 初期値設定
  await item.setAttribute('nDivide', 0);
  await item.setAttribute('nMerge', 0);
  await item.setAttribute('Set', 1);
}
var c_opt=await Promise.all([_GA(item, 'nDivide'), _GA(item, 'bDivRev'), _GA(item, 'nMerge'), _GA(item, 'bMerRev'), _GA(item, 'bMerVert'), _GA(item, 'bClose')]);
c_opt=c_opt.map(function(a){return (a||0)-0});

if (window.Addon == 1) { // # Addon-Exec
  Addons[Addon_Name] = {
    Divide: async function(dir, tc, Ctrl, pt){
      if(Ctrl){var a=await Ctrl.Type; if(a==196608){tc=Ctrl}}
      var PA='Left,Top,Width,Height'.split(','), PB='Style,Align,TabWidth,TabHeight'.split(',');
      var ctc=tc||te.Ctrl(CTRL_TC), ar=te.Ctrls(CTRL_TC), ntc=[], prm=[]; dir=dir ? 1 : 0;

      for(var i=0; i<PA.length; i++){prm.push(await ctc[PA[i]])} prm=prm.map(function(p){return parseFloat(p)});
      prm=prm.concat(prm); for(var i=0; i<PB.length; i++){prm.push(await ctc[PB[i]])}

      prm[4+dir]+=(prm[2+dir]-=(prm[6+dir]=(prm[6+dir]/2).toFixed(2)-0));
      for(var i=8; i--;){prm[i]=prm[i].toFixed(2)+'%'}

      for(var i=await ar.Count; i--;){if(await ar[i].Data.Group){}else{ntc.unshift(ar[i])}}
      if(ntc.length){ntc=ntc[0]}else{ntc=await te.CreateCtrl(CTRL_TC, 0, 0, 0, 0, prm[8], prm[9], prm[10], prm[11])}
      for(var i=await ntc.Count; i--;){ntc.Item(i).Data.Lock=await false; await ntc.Item(i).Close()} ar=[];

      for(var i=4; i--;){ctc[PA[i]]=await prm[i+(c_opt==1 ? 4 : 0)]}
      for(var i=4; i--;){ntc[PA[i]]=await prm[i+(c_opt==1 ? 0 : 4)]}

      if(c_opt[0]==1){
        ar.push(ctc.Selected);
      }else if(c_opt[0]==2){
        for(var i=await ctc.Count; i--;){ar.push(ctc.Item(i))}
      }else if(c_opt[0]==3){
        await Promise.all([ctc.Count, ctc.SelectedIndex]).then(function(r){
          for(var i=r[0], j=r[0]>>1; j && i--;){if(i!=r[1]){ar.push(ctc.Item(i)); j--}}
        });
      }

      for(var i=ar.length; i--;){await Addons[Addon_Name][c_opt[0]==3 ? '_fvMove' : '_fvCopy'](ntc.Selected, ar[i])}
      if(c_opt[0]==2){ntc.SelectedIndex=await ctc.selectedIndex}
      ntc.Data.Group=await ctc.Data.Group; ntc.Visible=true;

      setTimeout(function(){ctc.Selected.Focus(); ChangeView()}, 500);
      return await ntc.Id;
    },

    Merge: async function(dir, tc, Ctrl, pt){
      var PA='Left,Top,Width,Height'.split(',');
      if(Ctrl){var a=await Ctrl.Type; if(a==196608){tc=Ctrl}}
      var ctc=tc||te.Ctrl(CTRL_TC), ntc=[null, null, null, null], ar=te.Ctrls(CTRL_TC), ar2=[], prm=[]; dir=dir ? 1: 0;
      for(var i=4, j; i--;){j=await ctc[PA[i]]; prm.unshift(parseFloat(j))}
      for(var i=await ar.Count; i--;){ //結合対象探索
        await Promise.all([ar[i][PA[0]], ar[i][PA[1]], ar[i][PA[2]], ar[i][PA[3]], ar[i].Data.Group, ctc.Data.Group]).then(async function(r){
          if(r[4]!=r[5]){return false} r=r.map(function(p){return parseFloat(p)});
          if(r[1]==prm[1] && r[3]==prm[3]){
            if(Math.abs(r[0]-prm[0]-prm[2])<0.02){ntc[0]=ar[i]}
            if(Math.abs(prm[0]-r[0]-r[2])<0.02){ntc[1]=ar[i]}
          }
          if(r[0]==prm[0] && r[2]==prm[2]){
            if(Math.abs(r[1]-prm[1]-prm[3])<0.02){ntc[2]=ar[i]}
            if(Math.abs(prm[1]-r[1]-r[3])<0.02){ntc[3]=ar[i]}
          }
        });
      }
      ar=[0, 1, 2, 3].map(function(a){return (a^(c_opt[3] ? 1 : 0))^(c_opt[4] ? 2 : 0)});
      // log(ntc.map(async function(n){return await n.Id||-1}).join(', ')); ////////////
      for(var i=0; i<4; i++){if(ntc[ar[i]]){ntc=ntc[ar[i]]; dir=ar[i]>>1; break}}
      if(ntc==null || (ntc instanceof Array)){return false} ar=[];

      await Promise.all([ctc.SelectedIndex, ctc.Count, ntc.Count]).then(async function(r){ //FV統合
        for(var i=r[1]; i--;){ar.push(await ctc.Item(i).FolderItem.Path)}
        for(var i=0, j, l, p; c_opt[2] && i<r[2]; i++){
          l=await ntc.Item(i).Data.Lock||false, p=await ntc.Item(i).FolderItem.Path;
          if((c_opt[2]==1 || l) && p!='about:blank'){
            j=ar.indexOf(p);
            if(j<0){await Addons[Addon_Name]._fvCopy(ctc.Selected, ntc.Item(i)); await ctc.Move(r[0]+1, -1)}else{ctc.Item(j).Data.Lock|=l}
          }
        }
      });

      for(var i=0, j; i<4; i++){j=await ntc[PA[i]]; prm.push(parseFloat(j))}
      prm.push(await ctc.Data.Group); prm.push(dir);
      prm[dir]=prm[dir+(prm[dir]<prm[dir+4] ? 0 : 4)]; prm[dir+2]+=prm[dir+6];
      prm=prm.map(function(p, i){return i&2 ? (p>99.97 ? 100 : p) : (p<0.03 ? 0 : p)});
      for(var i=0; i<4; i++){ctc[PA[i]]=prm[i]+'%'}
      // log((await ctc.Id||-1)+'+'+(await ntc.Id||-1)+': '+prm.join(', ')); ////////////

      if(c_opt[5]){ntc.Close()}else{ntc.Data.Group=await 0; ntc.Visible=await false}
      return await ctc.Id||-1;
    },

    _fvCopy: async function(destFV, srcFV, flg){ //flg[1:Move]
      var nf=destFV.Navigate(await srcFV.FolderItem.Path, SBSP_SAMEBROWSER|SBSP_NEWBROWSER|SBSP_ACTIVATE_NOFOCUS);
      nf.History=await srcFV.History; nf.Data.Lock=await srcFV.Data.Lock||false;
      if(flg&1){srcFV.Data.Lock=await false; await srcFV.Close()}
      return nf;
    },
    _fvMove: async function(destFV, srcFV){
      return Addons[Addon_Name]._fvCopy(destFV, srcFV, 1);
    },
    // splitアドオン 非依存用 - - - - - - - -
    Resize: null, ResizeTimer: 0,
    _mouseOver: async function(ev){
      var pp=document.getElementById('client'), nCursor=0, m_s=6, m_l=-8,
        aTC=await te.Ctrls(CTRL_TC, true, window.chrome), mo=[[], [], [], []];

      if(!/^Background$|^client$/i.test(ev.srcElement.id)){if(pp){pp.style.cursor=''} return}

      for(var i=0; i<aTC.length; i++){
        var TC=aTC[i], id=await TC.Id, e=document.getElementById('Panel_'+id); if(!e){continue}
        var eL=await TC.Left, eT=await TC.Top, p;

        if(eL && (p=ev.clientX-e.offsetLeft)<m_s && p>m_l){mo[0].push(id); nCursor|=1}
        if((p=ev.clientX-e.offsetLeft-e.offsetWidth)<m_s && p>m_l){mo[2].push(id); nCursor|=1}
        if(eT && (p=ev.clientY-e.offsetTop)<m_s && p>m_l){mo[1].push(id); nCursor|=2}
        if((p=ev.clientY-e.offsetTop-e.offsetHeight)<m_s && p>m_l){mo[3].push(id); nCursor|=2}
      }
      if(nCursor){
        pp.style.cursor=['', 'w-resize', 's-resize', 'move'][nCursor];
        Addons[Addon_Name].Cursor=await api.LoadCursor(null, nCursor+32643);
        api.SetCursor(Addons[Addon_Name].Cursor);
      }
      return mo;
    },
    _mouseDown: async function(ev){
      var mo=await Addons[Addon_Name]._mouseOver(ev); Addons[Addon_Name].ResizeTimer=0;
      if(mo && mo.length){api.SetCapture(ui_.hwnd); Addons[Addon_Name].Resize=mo}else{Addons[Addon_Name].Resize=null}
    },
    _mouseResize: function(Ctrl, hwnd, msg, wParam, ptm){ // sync.jsは作者専用裏口...
      if(msg==WM_LBUTTONUP){api.ReleaseCapture(); Addons[Addon_Name].Resize=null; return}
      if(!Addons[Addon_Name].Resize || msg!=WM_MOUSEMOVE){return}

      if(Addons[Addon_Name].ResizeTimer){clearTimeout(Addons[Addon_Name].ResizeTimer)}
      Addons[Addon_Name].ResizeTimer = setTimeout(async function(){
        if(!Addons[Addon_Name].Resize){return}
        var rcm=await api.Memory('RECT'), hwnd=await te.hwnd, rs=Addons[Addon_Name].Resize,
          rc={left:0, top:0, width:0, height:0, x:0, y:0}, ar=[], rsz=1;

        await Promise.all([te.offsetLeft, te.offsetTop, te.offsetRight, te.offsetBottom, api.GetClientRect(hwnd, rcm), api.ScreenToClient(hwnd, ptm)]).then(async function(r){
          rc.left=await rcm.left; rc.top=await rcm.top; rc.width=await rcm.right; rc.height=await rcm.bottom;
          rc.x=await ptm.x; rc.y=await ptm.y; rc.width-=r[0]+r[2]; rc.height-=r[1]+r[3]; rc.x-=r[0]; rc.y-=r[1];
        });

        for(var i=rs[0].length; rsz && i--;){
          var TC=te.Ctrl(CTRL_TC, rs[0][i]), t1=await TC.Left, t2=await TC.Width;
          t1=/%$/.test(t1) ? parseFloat(t1) : t1*100/rc.width;
          t2=/%$/.test(t2) ? parseFloat(t2) : t2*100/rc.width;
          t2=(Math.min(t2+t1, 100)-(t1=(100*rc.x/rc.width).toFixed(2))).toFixed(2);
          if((t2*rc.width/100)<4){rsz=0; break}
          ar.push([TC, 'Left', t1+'%']); ar.push([TC, 'Width', t2+'%']);
        }
        for(var i=rs[1].length; rsz && i--;){
          var TC=te.Ctrl(CTRL_TC, rs[1][i]), t1=await TC.Top, t2=await TC.Height;
          t1=/%$/.test(t1) ? parseFloat(t1) : t1*100/rc.height;
          t2=/%$/.test(t2) ? parseFloat(t2) : t2*100/rc.height;
          t2=(Math.min(t2+t1, 100)-(t1=(100*rc.y/rc.height).toFixed(2))).toFixed(2);
          if((t2*rc.height/100)<4){rsz=0; break}
          ar.push([TC, 'Top', t1+'%']); ar.push([TC, 'Height', t2+'%']);
        }
        for(var i=rs[2].length; rsz && i--;){
          var TC=te.Ctrl(CTRL_TC, rs[2][i]), t1=await TC.Left, t2;
          t1=/%$/.test(t1) ? parseFloat(t1)*rc.width/100 : t1;
          t2=Math.round(rc.x-t1); if(t2<4){rsz=0; break}
          ar.push([TC, 'Width', (100*t2/rc.width).toFixed(2)+'%']);
        }
        for(var i=rs[3].length; rsz && i--;){
          var TC=te.Ctrl(CTRL_TC, rs[3][i]), t1=await TC.Top, t2;
          t1=/%$/.test(t1) ? parseFloat(t1)*rc.height/100 : t1;
          t2=Math.round(rc.y-t1); if(t2<4){rsz=0; break}
          ar.push([TC, 'Height', (100*t2/rc.height).toFixed(2)+'%']);
        }

        for(var i=ar.length; rsz && i--;){ar[i][0][ar[i][1]]=ar[i][2]}

        rsz=await api.GetKeyState(VK_LBUTTON);
        if(rsz>=0 || msg==WM_LBUTTONUP){api.ReleaseCapture(); Addons[Addon_Name].Resize=null}
        Addons[Addon_Name].ResizeTimer=0;
      }, 30);
      return S_OK;
    }
  };

  // コマンド登録
  AddTypeEx("Add-ons", 'dd: Divide-UD', function(Ctrl, pt){Addons[Addon_Name].Divide(1, null, Ctrl, pt)});
  AddTypeEx("Add-ons", 'dd: Divide-LR', function(Ctrl, pt){Addons[Addon_Name].Divide(0, null, Ctrl, pt)});
  AddTypeEx("Add-ons", 'dd: Merge', function(Ctrl, pt){Addons[Addon_Name].Merge(null, null, Ctrl, pt)});

  // window.dd=Addons[Addon_Name]; ////TEST

  var pp=document.getElementById('client');
  if(!Addons.Split && pp){ // splitアドオン非依存用
    AddEventEx(pp, 'mouseover', Addons[Addon_Name]._mouseOver);
    AddEventEx(pp, 'mousedown', Addons[Addon_Name]._mouseDown);
    AddEvent('MouseMessage', Addons[Addon_Name]._mouseResize, true);
  }

}else{ // # Addon-Option
  var opt = function(){/** /
    <div class="article %lng%">
      <table style="max-width: 100%; min-width: 62%">
        <tr><td>
          <h4 class="legend"><u class="en">Divide</u><u class="ja">分割</u>:</h4><div>
            <label><input type="checkbox" id="bDivRev" /> <u class="en">Divide Top/Left</u><u class="ja">上/左へ分割</u></label>
          </div>
          <h4 class="legend"><u class="en">Tabs on Divide</u><u class="ja">分割時のタブ</u>:</h4><div class="fieldset">
            <input type="hidden" name="nDivide" />
            <label><input type="radio" name="_nDivide" id="nDivide=0" onclick="SetRadio(this)" /> blank</label>
            <label><input type="radio" name="_nDivide" id="nDivide=1" onclick="SetRadio(this)" /> <u class="en">Clone current tab</u><u class="ja">カレントタブを複製</u></label>
            <label><input type="radio" name="_nDivide" id="nDivide=2" onclick="SetRadio(this)" /> <u class="en">Close all tabs</u><u class="ja">すべてのタブを複製</u></label>
            <label><input type="radio" name="_nDivide" id="nDivide=3" onclick="SetRadio(this)" /> <u class="en">Move half tabs</u><u class="ja">タブを半分移す</u></label>
          </div>
        </td><td>
          <h4 class="legend"><u class="en">Merge</u><u class="ja">結合</u>:</h4><div>
            <label><input type="checkbox" id="bMerRev" /> <u class="en">Prioritize Top/Left</u><u class="ja">上/左を優先</u></label>
            <label><input type="checkbox" id="bMerVert" /> <u class="en">Prioritize Vertical</u><u class="ja">縦方向優先</u></label>
          </div>
          <h4 class="legend"><u class="en">Tabs on Merge</u><u class="ja">結合時のタブ</u>:</h4><div class="fieldset">
            <input type="hidden" name="nMerge" />
            <label><input type="radio" name="_nMerge" id="nMerge=0" onclick="SetRadio(this)" /> <u class="en">Release tabs</u><u class="ja">破棄</u></label>
            <label><input type="radio" name="_nMerge" id="nMerge=1" onclick="SetRadio(this)" /> <u class="en">Merge all tabs</u><u class="ja">すべてのタブを統合</u></label>
            <label><input type="radio" name="_nMerge" id="nMerge=2" onclick="SetRadio(this)" /> <u class="en">Merge locked tabs</u><u class="ja">ロックタブのみ統合</u></label>
          </div>
        </td><td>
          <h4 class="legend"><u class="en">Advanced</u><u class="ja">高度</u>:</h4><div>
            <label><input type="checkbox" id="bClose" /> <u class="en">Close invisible tabs</u><u class="ja">非表示タブを閉じる</u></label>
          </div>
        </td></tr>
      </table>
      <div class="info en">
        This add-on allows you to divide the current pane vertically or horizontally, and merge the divide panes.<br />
        <strong>Type: Add-ons</strong> will have the following commands added.  Register them in Menus, "Tool bar", etc., and use them.<br />
        <ul><li>dd: Divide-UD</li><li>dd: Divide-LR</li><li>dd: Merge</li></ul>
      </div><div class="info ja">
        現在のペインを上下または左右に分割し、分割されたペインを結合できるアドオンです。<br />
        <strong>タイプ: アドオン</strong> に以下のコマンドが追加されます。  メニューやツールバー等に登録して使用してください。<br />
        <ul><li>dd: 上下に分割</li><li>dd: 左右に分割</li><li>dd: 結合</li></ul>
      </div>
    </div>
    <style type="text/css">
      .article:not(.ja) .ja, .article.ja .en {display: none} .article u {text-decoration: none}
      .article {margin: 0; padding: 1em} .article .legend {font-size: 1.2em; margin: 0 0 .2em}
      .article .legend:not(:first-child) {margin-top: 1em} .legend + div {padding: .2em 1em; margin-right: 2em}
      .legend + .fieldset {margin-left: .4em; padding: .2em .4em; border-left: solid .2em rgba(120, 120, 124, .6)}
      .legend + div > label {display: block; margin-bottom: .2em; white-space: nowrap}.article ul {list-style: square}
      table {margin-bottom: 2em} .info {padding: 1em; opacity: 0.6} strong {font-weight: bold}
    </style>
  /**/}.toString().replace(/^[^\{]+\{[\s\S]*?\/\*+\s*\/?|\/?\*+\/[\s\S]*?\}$/g, '').replace(/%lng%/g, lng);

  SetTabContents(0, 'General', opt);
}
