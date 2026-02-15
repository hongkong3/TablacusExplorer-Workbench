/** 開発用: 確認関数 - 260215 *****************

- _promise(p0, p1,...), _p(p0, p1,...);
  DevToolsでの {Promise}/Proxy(Function) 値確認用

- _checkTCC();
  全TabControlの情報を出力

- _checkTC([ TC | TC.Id ]);
  カレント/指定TCの情報を出力

- _checkFV([ FV | FV.Id ]);
  カレント/指定FVの情報を出力

_check***系は実行後, `window.$p` に対象代入

**********************************************/

(function(){
  window.log=window.log ? log : window.chrome ? console.log : window.alert;

  window._promise = window._p = function(){ //[Blink]: {Promise}/Proxy(Function) 実体確認用
    Promise.all(arguments).then(window.log); return '';
  };

  window._checkTCC = function(){ //全TCちぇっく ()
    (async function(){
      var tcc=te.Ctrls(CTRL_TC), len=await tcc.Count, atc=[];
      for(var i=len; i--;){
        await Promise.all([tcc[i].Data.Group, tcc[i].Id, tcc[i].SelectedIndex, tcc[i].Selected.Id, tcc[i].Left, tcc[i].Top, tcc[i].Width, tcc[i].Height, tcc[i].Visible, tcc[i].Selected.Title, tcc[i].Count, te.Ctrl(CTRL_FV).Id]).then(function(r){
          atc.unshift((r[11]==r[3] ? '*' : !r[0] ? '/' : r[8] ? ' ' : '-')+'['+r[0]+'-'+r[1]+'.'+r[2]+'/'+r[10]+'] ('+r[4]+', '+r[5]+', '+r[6]+', '+r[7]+') '+r[3]+':"'+r[9]+'"');
        });
      }
      window.log(atc.join(',\r\n')); window.$p=tcc;
    })(); return '';
  };

  window._checkTC = function(tc){ //TCちぇっく ([TC|TC.Id])
    tc=typeof(tc)=='number' ? te.Ctrl(CTRL_TC, tc) : tc||te.Ctrl(CTRL_TC);
    Promise.all([tc.Data.Group, tc.Id, tc.SelectedIndex, tc.Count, tc.Left, tc.Top, tc.Width, tc.Height, tc.Visible, te.Ctrl(CTRL_TC).Id]).then(async function(r){
      var atc=(r[1]==r[9] ? '*' : !r[0] ? '/' : r[8] ? ' ' : '-')+'['+r[0]+'-TC_'+r[1]+'.'+r[2]+'/'+r[3]+'] ('+r[4]+', '+r[5]+', '+r[6]+', '+r[7]+')\r\nFV:[', afv=[];
      for(var i=r[3]; i--;){await Promise.all([tc.Item(i).Id, tc.Item(i).Title]).then(function(f){afv.unshift((i==r[2] ? '*' : '')+f[0]+':"'+f[1]+'"')})}
      window.log(atc+afv.join(', ')+']'); window.$p=tc;
    }); return '';
  };

  window._checkFV = function(fv){ //FVちぇっく ([FV|FV.Id])
    fv=typeof(fv)=='number' ? te.Ctrl(CTRL_FV, fv) : fv||te.Ctrl(CTRL_FV);
    Promise.all([fv.Parent.Data.Group, fv.Parent.Id, fv.Parent.SelectedIndex, fv.Parent.Count, fv.Parent.Visible, te.Ctrl(CTRL_TC).Id, fv.Id, fv.Title, fv.History.Index, fv.History.Count]).then(async function(r){
      var afv=(r[1]==r[5] ? '*' : !r[0] ? '/' : r[4] ? ' ' : '-')+'['+r[0]+'-'+r[1]+'.'+r[2]+'/'+r[3]+'] FV_'+r[6]+':"'+r[7]+'"\r\nHistory:[', ah=[];
      for(var i=r[9]; i--;){await Promise.all([fv.History[i].Path, fv.History[i].Name]).then(function(h){ah.unshift((i==r[8] ? '*' : '')+i+':"'+h[0]+'"')})}
      window.log(afv+ah.join(', ')+']'); window.$p=fv;
    }); return '';
  };
})();

