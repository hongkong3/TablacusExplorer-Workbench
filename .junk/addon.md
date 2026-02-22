## TablacusExplorer アドオン仕様覚え書き
- [config.xml](#configxml)  
- [script.js](#scriptjs)  
- [lang/ja.xml](#langjaxml)  
- [オプション設定画面](#オプション設定画面)  

- - - -

### ファイル構成
~~~~scala
(TablacusExplorer)/           // TEインストールフォルダ
 ├─ config/
 │   ├─ addons.xml            // 全アドオン設定保存
 │   └─ ***.???               // 何かファイル読み書きするならココが慣例ぽい
 └─ addons/
     └─ (myaddonname)/        // 各アドオンのフォルダ, 慣例的に全小文字？
         ├─ config.xml        // *必須* アドオン定義ファイル
         ├─ script.js         // *必須* アドオン動作ファイル
         ├─ sync.js           // 非-非同期処理用 (作者専用？)
         ├─ lang/
         │   └─ ja.xml        // 日本語ローカライズ用
         └─ ***.js, ***.html  // 任意ファイル, importScript()/ReadTextFile()等で使用
~~~~


### config.xml
~~~~xml:config.xml
<?xml version="1.0" encoding="UTF-8"?>
<TablacusExplorer>
  <General>
    <Version>1.00</Version>                           <!-- アドオン バージョン -->
    <pubDate>Fri, 20 Feb 2026 00:00:00 GMT</pubDate>  <!-- 更新日時 -->
    <MinVersion>2023.9.13</MinVersion>                <!-- 要求TEバージョン -->
    <Options>Common:0,1,5,8:0</Options>               <!-- オプション設定のページ指定 -->
    <Level>2</Level>                                  <!-- 謎, 2固定？ -->
    <Creator>Me</Creator>                             <!-- *任意* アドオン作者 -->
    <URL>https://MyPageURL</URL>                      <!-- *任意* サイトURL？ -->
    <License>License</License>                        <!-- *任意* ライセンス表記 -->
  </General>
  <en>                                                <!-- *たぶん必須* 英文[デフォルト] アドオン名 & 説明 -->
    <Name>Add-on Name</Name>                            <!-- 「アドオン」画面での表示用, 自由に記述可 -->
    <Description>My Add-on</Description>                <!-- システムとしての登録は script.js 内で -->
  </en>
  <ja>                                                <!-- *任意* 各言語(ロケール)対応用 アドオン名 & 説明 -->
    <Name>アドオンの名前</Name>                          <!-- ja, fr, zh など -->
    <Description>アドオンの説明</Description>
  </ja>
</TablacusExplorer>
~~~~
<table><tr><td><details>
 <summary>オプション設定のページ指定</summary>

  `Common:` *(ページ番号0～9を , 区切り指定)* `:` *(初期表示ページ番号)*  
  > 例: `<Options>Common:0,1,5,8:0</Options>`  
  
  |ページ番号|内容|
  |:-:|---|
  | 0 .. 4 | 自由指定の空ページ<br />&nbsp;&nbsp;`SetTabContents(N, "PageName", "Contents");`<br />`"General"`: 全般, `"View"`: 表示 など |
  | 5 | `Icon`: アイコン |
  | 6 | `Position`: 位置 |
  | 7 | `Menus`: メニュー |
  | 8 | `Key`: キー |
  | 9 | `Mouse`: マウス |
</details></td></tr></table>

- - - -

### script.js
~~~~js:script.js
// 直接リテラル指定でも良いけど, 変数に入れとくと変更や流用しやすい
const Addon_Id = "myaddonname";         // アドオンフォルダ名
const Addon_Name = "MyAddonName";       // 登録用のアドオン名

const item = GetAddonElement(Addon_Id); // オプション値操作用
if (!item.getAttribute("Set")) {      // 初期値設定
  await item.setAttribute("nParam", 0);
  // ... //
}

if (window.Addon == 1) {
  /* # アドオンとしての実行部: アドオン登録・イベント登録・コマンド登録, UI設置など */

  Addons[Addon_Name] = {
    /* ## アドオン登録: Addons.MyAddonName.Exec(); 等でメンバ関数を呼び出せるようになる */
    Param: null,
    Exec: async function(){ ... },
    SetUI: async function(){ ... }
  };

  AddEvent("EventName", Function, [Priority]);
  /* ## イベント登録: 自動的に何かさせる
    "EventName": トリガーとするイベント名
      Load, Finalize, Layout, Arrange, ChangeView, BrowserCreatedEx, etc...
    Function: 実行する関数, 引数はイベント次第, 稀に文字列指定
    Priority: true なら実行順が先になる

    (純粋なイベントドリヴンではなく, 都度 RunEvent***() による呼び出し)
  */

  AddEventEx(elm, "event", Function);
  /* ## イベント登録: まんま elm.addEventListener("event", Function, false); */

  AddTypeEx("Add-ons", "CommandName", Function);
  /* ## コマンド登録: メニュー・キー等で「タイプ:アドオン」から選択できるコマンド
    "Add-ons": 「タイプ:アドオン」として登録, Tabs, Edit など他タイプへの登録も可能
    "CommandName": 表示名, 英名登録してローカライズが慣例ぽい
    Function: 実行する関数, 引数として (Ctrl, pt) を受け取る
  */

  AddEvent("Layout", async function(){ ... });
  /* ## UI設置: ボタン・入力欄などTE上のUIパーツを設置
    "Layout": モノによっては多少トリガーイベントの差異アリ

    UI設置そのものはJSによる動的DOM生成 => TE自体のDOM構造把握は必須
    (オプションページ「位置」も "場所の名前" を設定するだけ)
    イベント割り当てもDOMとして .AddEventListener() や onlick="..." で設定
  */

} else {
  /* # オプション設定部: 主に0～4ページ用, 5～9はお任せでOK */
  SetTabContents(N, "PageName", "Contents");
  /*
    N: 対象ページ番号
    "PageName": 設定ページ表示名, 英名指定してロケール化が慣例ぽい
      General, View, CSS, Hidden(?) など, 1ページだけなら表示されない
    "Contentes": 設定画面に挿入するHTML内容を "文字列" で指定
      - contents = await ReadTextFile("addons\\" + Addon_Id + "\\options.html");
        ファイルから読み込むパターン
      - contents = function(){ ... }.toString().replace(/^.*?\/\*|\*\/\}$/g, '');
        関数内コメントとしてHTML記述, 文字列化でまとめて取り出すパターン
  */
}
~~~~
> [!WARNING]
> WebView2(Blink)版でTEが返すのは大体 **COMオブジェクト**  
> `await`, `Promise.all()` 等で値を実体化させる必要がある上, 謎の有効期限付き  
> そして 非同期汚染が止まらない・・・  

- - - -

### lang/ja.xml
~~~~xml:lang/ja.xml
<?xml version="1.0" encoding="UTF-8"?>
<resources>
  <lang author="MyName" en="Japanese">日本語</lang>
  <text s="English Caption">日本語表記</text>
  <!-- ... -->
</resources>
~~~~
英語表記 -> 日本語表記の対応を列挙してくだけ
- 適用範囲はUI全域？  判定は恐らく完全一致
  - メニュー等で `&` 含む場合, `&amp;Menu Item` のような指定
- 適用対象はそのアドオンの語に**限定されない**
- 既に有効なアドオンに追加しても, そのままでは内部フラグが更新されない  
  一旦アドオン無効化 -> 有効化 でローカライズ適用

- - - -

### オプション設定画面
~~~~html:options.html
<html>
  <!-- ... -->
  <div class="panel">
    <iframe id="panel_(アドオンフォルダ名)">
      <html>
        <body>
          <div id="P">
            <!-- ... -->
            <from name="F">
              <div class="panel">
                <!-- ココに SetTabContents() でコンテンツ挿入 -->
~~~~
- 基本的にid(またはname)を持つフォーム系部品の値は、その **id名の属性値** として保存される  
  `<input type="checkbox" id="bCheck" />` がONなら、`<myaddonname bCheck="1">` として保存
  - `script.js` 等での設定値参照
    ~~~~js
    const item = await GetAddonElement(Addon_Id);
    let chk = await item.getAttribute("bCheck");
    ~~~~
  - **ラジオグループ**  
    `name`, `id`, `onclick` で連動させて **数値** として選択を保存  
    ~~~~html:ahona_irowake_taisaku.html
    <input type="hidden" name="nRadio" title="この非表示要素（nRadio）の値として選択を保存" />
    <label><input type="radio" name="_nRadio" id="nRadio=0" onclick="SetRadio(this)" /> UI用のRadio_0</label>
    <label><input type="radio" name="_nRadio" id="nRadio=1" onclick="SetRadio(this)" /> UI用のRadio_1</label>
    <label><input type="radio" name="_nRadio" id="nRadio=2" onclick="SetRadio(this)" /> UI用のRadio_2</label>
    ~~~~
  - **色指定**  
    `id`, `onchange`, `onclick` で連動、`(ID)` 部分を属性名として保存
    ~~~~html:bagu_poi.html
    <input type="text" id="(ID)" onchange="ChangeColor1(this)" title="テキスト入力">
    <input type="button" id="Color_(ID)" value=" " onclick="ChooseColor2(this)" title="カラーダイアログ">
    ~~~~
  - **textarea**  
    そのままでは WebView2 版で**改行除去**される  
    改行も含めてデータとして扱う場合、↓の措置などが必要
- `SaveLocation()` 関数が存在すれば、設定保存時にコールバック関数として呼ばれる  
  別個にファイルを書き出すのではなく、属性値を更新して返せばその値で保存されるタイプ
  ~~~~js
  SaveLocation = async function () {
    const item = await $.GetAddonElement(Addon_Id);
    let sText = document.getElementById("sText").value;
    await item.setAttribute("sText", sText.replace(/\s*[\r\n]+\s*/g, '\\n'));
  }
  // 読み込みは SetTabContents() 後テキトーに属性値読み込んで該当DOMに反映
  let o = await $.GetAddonElement(Addon_Id), s = await o.getAttribute("sText");
  document.getElementById("sText").value = s.replace(/\\n/g, '\r\n');
  ~~~~
