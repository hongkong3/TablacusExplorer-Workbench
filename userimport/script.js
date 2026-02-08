const Addon_Id='userimport', Addon_Name='UserImport';

// TITLE='TE'+(ui_.bit)+(window.chrome ? ' [wv2]' : '');
// window.alert = async function(m, t, w){let r=await wsh.Popup(m, w||0, t||TITLE, 65); return r==1}; ////CHECK
// window.confirm = async function(m, t, w){let r=await wsh.Popup(m, w||0, t||TITLE, 36); return r==6}; ////CHECK

if(window.Addon==1){ // Addon-Exec
  if(!te.Data[Addon_Name]){te.Data[Addon_Name]=await api.CreateObject("Object")}

  Addons[Addon_Name] = {
    Data: {},
    ParseCSS: function(n, v){ // Trident用 簡易CSSパーサ
      let cv={}; v=v.replace(/\/\*[\s\S]*?\*\//g, ''); // CommentOut
      v=v.replace(/#([\da-f]{4}|[\da-f]{8})\b/ig, function(_, q, i, j){ // #RRGGBBAA => rgba(R, G, B, a);
        if(q.length==4){j=q; q=''; for(i=0; i<4; i++){q+=j.charAt(i)+j.charAt(i)}}
        let c=[]; for(i=0; i<4; i++){c.push(parseInt('0x'+q.substr(i*2, 2)))}
        return 'rgba('+c[0]+','+c[1]+','+c[2]+','+(c[3]/255).toFixed(3)+')';
      });
      v=v.replace(/\-\-([\w\-]+)\s*:\s*(.+?)\s*\;/ig, function(_, k, v){cv[k]=v; return _}); // --VAR: ****;
      v=v.replace(/\bvar\s*\(\s*\-\-([\w\-]+)\s*\)/g, function(_, k){return cv[k]||_}); // var(--VAR)
      return MainWindow.Addons[Addon_Name].Data[n]=v;
    }
  };

  AddEvent('BrowserCreatedEx', async function(){
    const D=document, _GA=function(e, a){return e.getAttribute(a)}, _SA=function(e, a, v){return e.setAttribute(a, v)},
      _CE=async function(e, c, t){
        let d=await D.createElement(e||'pre');
        if(t){_SA(d, 'type', t)}
        return d;
      },
      _path = function(p){
        if(/:/.test(p) && fso.FileExists(p)){return p}
        let fp=ui_.Installed+'\x5c'+p; if(fso.FileExists(fp)){return fp}
        fp=wsh.ExpandEnvironmentStrings(p); if(fso.FileExists(fp)){return fp}
        fp=ui_.Installed+'\x5c'+fp; if(fso.FileExists(fp)){return fp}
        return '';
      };

    let xml=await OpenXmlUI('%aid%.xml', false, true), dat=await xml.getElementsByTagName('Item');
    for(let i=0; i<dat.length; i++){
      let p=await _path(_GA(dat[i], 'File')); if(!p || _GA(dat[i], 'Enabled')==0){continue}

      if(/\.js$/i.test(p)){importScript(p); continue}

      let fid=p.replace(/^.*?([^\\\/]+)$/, '$1').replace(/[ \.]/g, '_'), tc, e;
      if(/\.css$/i.test(p)){
        if(window.chrome){
          tc=await ReadTextFile(p);
        }else if(MainWindow.Addons['%anm%'].Data[fid]!=undefined){
          tc=MainWindow.Addons['%anm%'].Data[fid];
        }else{
          tc=await MainWindow.Addons['%anm%'].ParseCSS(fid, await ReadTextFile(p));
        }
        e=D.createElement('style'); e.type='text/css'; e.media='screen';
        e.appendChild(await D.createTextNode(tc));
      }else{e=D.createElement('pre'); e.style.display='none'; e.innerHTML=await ReadTextFile(p)}
      e.id=fid; D.body.appendChild(e);
    }
  }.toString().replace(/^[^{]+{\s*|\s*}$/g, '').replace(/%aid%/g, Addon_Id).replace(/%anm%/g, Addon_Name));
} else { // Addon-Option
  importScript('addons/'+Addon_Id+'/options.js');
}


