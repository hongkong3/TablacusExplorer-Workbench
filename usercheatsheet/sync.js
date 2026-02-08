var Addon_Id="usercheatsheet", Addon_Name="UserCheatSheet";

Sync[Addon_Name] = {
  // `ShowDialog()`は, sync.jsの非同期 Sync.*** から呼ばないとBlink動作不可
  // Sync関数内での 'document' はハリボテ未満でDOM操作全滅... console.log(), debugger, alert()も不可
  ShowWindow: function(opt){
    return ShowDialog('../addons/'+Addon_Id+'/dialog.html', opt);
  }
};

