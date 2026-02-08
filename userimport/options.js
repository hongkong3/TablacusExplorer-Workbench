const Addon_Id='userimport', Addon_Name='UserImport', lng=await GetLangId(), tep=await ui_.Installed+'\x5c';

init = async function(){
  await SetTabContents(0, 'General', await ReadTextFile('addons/'+Addon_Id+'/options.html'));
  var e=document.getElementById('toolbar');
  e.innerHTML='<input type="button" value="Add" onclick="rowAdd()">&nbsp;&nbsp;';
  e.innerHTML+='<input type="button" value="Up" onclick="rowCmd(-1)">';
  e.innerHTML+='<input type="button" value="Down" onclick="rowCmd(2)">&nbsp;&nbsp;';
  e.innerHTML+='<input type="button" value="Remove" onclick="rowCmd(null)">';
  document.getElementById('UI_Form').className='lng_'+lng;
}

_path = async function(p){
  if(/:/.test(p) && await fso.FileExists(p)){return p}
  let fp=tep+p; if(await fso.FileExists(fp)){return fp}
  fp=await wsh.ExpandEnvironmentStrings(p); if(await fso.FileExists(fp)){return fp}
  fp=tep+fp; if(await fso.FileExists(fp)){return fp}
  return '';
}

_row = function(e){
  while(e && e.localName!='tr'){e=e.parentNode} return e||null;
}
_currentRow = function(){
  return _row(T.querySelector('.rdoSel:checked'));
}

_rowFocus = function(ev){
  let fr=_row(ev.srcElement||ev.target), fc=fr.getElementsByClassName('rdoSel')[0];
  if(fc){fc.checked=true}
}

rowAdd = async function(p1, p2, p3){ //(File, Notes, [Enabled=0/1])
  let r=_CE('tr'), l;
  r.appendChild(_CE('td')).appendChild(_CE('input', 'rdoSel', '', {type: 'radio', name: 'rdoSel', checked: 1}));
  r.appendChild(_CE('td')).appendChild(_CE('input', 'iptFile', p1||'', {type: 'text', placeholder: cFile, title: cFile}));
  r.appendChild(_CE('td')).appendChild(_CE('input', 'btnBrowse fonticonbutton', '\ued25', {type: 'button', title: cBrowse, style: cButton, onclick: 'rowBrowse(this)'}));
  r.appendChild(_CE('td')).appendChild(_CE('input', 'btnEdit fonticonbutton', '\ue70f', {type: 'button', title: cEdit, style: cButton, onclick: 'rowEdit(this)'}));
  // r.appendChild(_CE('td')).appendChild(_CE('input', 'btnBrowse fonticonbutton', '\ue712', {type: 'button', title: cBrowse, style: cButton, onclick: 'rowBrowse(this)'}));
  l=r.appendChild(_CE('td')).appendChild(_CE('label'));
  l.appendChild(_CE('input', 'chkEnable', '', {type: 'checkbox', checked: p3!=0})); l.appendChild(_CE('span', '', cEnabled));
  r.appendChild(_CE('td')).appendChild(_CE('input', 'iptNote', p2||'', {type: 'text', placeholder: cNote, title: cNote}));
  return T.tBodies[0].appendChild(r);
}

rowCmd = async function(v){
  let cr=_currentRow(), ci=cr.rowIndex, cl=T.rows.length; if(!cr){return false}
  if(v===null){ // Remove
    let c=6, f=cr.getElementsByClassName('iptFile')[0].value;
    if(f){f='"'+f+'"\r\n'; f+=lng=='ja' ? 'この項目を削除しますか？' : await GetText('Remove this Item?');
    c=await wsh.Popup(f, 0, Addon_Name, 0x20|4)}
    if(c==6){T.tBodies[0].removeChild(cr)}
    if(!T.rows.length){rowAdd()}else{ci=Math.min(ci, T.rows.length-1); T.rows[ci].getElementsByClassName('rdoSel')[0].checked=true}
    return;
  }
  let cm=ci+v; if((cm<0) || (cm>cl)){return false}
  T.tBodies[0].insertBefore(cr, cm<cl ? T.rows[cm] : null);
}

rowBrowse = async function(v){
  let r=_row(v); if(!r){return false}
  let t=r.getElementsByClassName('iptFile')[0], f=await _path(t.value), nf=await OpenDialogEx(f||tep, '', true);
  if(await fso.FileExists(nf)){
    f=nf.indexOf(tep); if(f===0){nf=nf.substr(tep.length)}
    t.value=nf;
  }
}

rowEdit = async function(v){
  let r=_row(v); if(!r){return null}
  let f=await _path(r.getElementsByClassName('iptFile')[0].value);
  await api.ShellExecute(0, 'edit', '\x22'+f.replace(/[\\\/]+/g, '\x5c')+'\x22', '', '', 1);
}

SaveLocation = async function(v){
  let xml=await CreateXml(), root=await xml.createElement('TablacusExplorer');
  for(let i=0; i<T.rows.length; i++){
    let r=T.rows[i], item=await xml.createElement('Item');
    await _SA(item, 'Enabled', r.getElementsByClassName('chkEnable')[0].checked ? 1 : 0);
    await _SA(item, 'File', r.getElementsByClassName('iptFile')[0].value);
    await _SA(item, 'Notes', r.getElementsByClassName('iptNote')[0].value);
    await root.appendChild(item);
  }
  await xml.appendChild(root);
  await SaveXmlEx(Addon_Id+'.xml', xml);
  // te.Data['xml'+Addon_Name]=xml;
}

await init();
let D=document, T=D.getElementById('UI_Table'), _$=T.querySelector.bind(T), _$$=T.querySelectorAll.bind(T),
  cFile=await GetText('File'), cBrowse=await GetText('Browse'), cEdit=await GetText('Edit'), cNote=lng=='ja' ? 'メモ' : await GetText('Notes'),
  cEnabled=await GetText('Enabled'), cButton='', xml=await OpenXmlUI(Addon_Id+'.xml', false, true), dat=await xml.getElementsByTagName('Item'),
  _GA=function(e, a){return e.getAttribute(a)}, _SA=function(e, a, v){return e.setAttribute(a, v)}, 
  _CE=function(e, c, t, o){
    let d=D.createElement(e||'span'); if(c){d.className=c}
    if(t){if(e=='input'){d.value=t}else{d.innerHTML=t}}
    for(let k in (o||{})){if(k=='checked'){d.checked=o[k]}else if(k){_SA(d, k, o[k])}}
    return d;
  };

await Promise.all([MainWindow.g_.IconFont, MainWindow.DefaultFont.lfHeight, MainWindow.DefaultFont.lfWeight]).then(function(p){
  cButton='font-family:"'+p[0]+'";font-size:'+Math.abs(p[1])+'px;font-weight:'+p[2];
});
cFile+=' (*.css, *.js, etc...)';
T.addEventListener('focusin', _rowFocus);

for(let i=0; i<dat.length; i++){await rowAdd(_GA(dat[i], 'File'), _GA(dat[i], 'Notes'), _GA(dat[i], 'Enabled'))}
if(!T.rows.length){rowAdd()}

dat=xml=null;

