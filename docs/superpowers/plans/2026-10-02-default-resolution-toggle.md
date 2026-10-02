# BT 搜索默认清晰度切换 实现计划

> **面向 AI 代理的工作者：** 必需子技能：使用 superpowers:subagent-driven-development（推荐）或 superpowers:executing-plans 逐任务实现此计划。步骤使用复选框（`- [ ]`）语法来跟踪进度。

**目标：** BT 英文搜索的质量后缀（写死的 ` 1080p`）改为可在豆瓣页面 BT 面板内一键切换的 `1080p`（默认）/ `2160p`，localStorage 持久化。

**架构：** 沿用现有分层——纯函数构造 URL（`build_bt_sites` 增加 `res` 参数）、新增偏好读写纯函数（`get_res_pref` / `toggle_res_pref`，try/catch 降级）、DOM 渲染抽成 `render_bt_links`，`main()` 绑定标题行切换标签。规格见 `docs/superpowers/specs/2026-10-02-default-resolution-toggle-design.md`。

**技术栈：** Tampermonkey/Violentmonkey 用户脚本（无构建、无依赖）、node 内置测试脚本（函数正则提取 + eval）、本地 HTTP mock 页 + 浏览器验证。

**仓库流程说明：** 本仓库沿用直接在 master 上小步提交的既有流程，不建 worktree；提交一律不推送。

---

## 文件结构

- 修改：`movie.plus.user.js` —— 新增偏好常量与读写函数；`build_bt_sites` 第 4 参数；`update_bt_site` 重构为 `render_bt_links`；`main()` 绑定切换标签；注入 CSS 追加 `.res-toggle` 样式；版本号 → `261002.4`。
- 修改：`tests/test_search_urls.mjs` —— 新增 `grabConst` 提取、localStorage stub、8 个清晰度用例。
- 临时（不入库，验证后删除）：`C:\tmp\restoggle\`（mock 页、jquery、node 服务脚本）。

---

### 任务 1：清晰度偏好纯函数 + `build_bt_sites` 参数化（TDD）

**文件：**
- 修改：`tests/test_search_urls.mjs`
- 修改：`movie.plus.user.js`

- [ ] **步骤 1：编写失败的测试**

在 `tests/test_search_urls.mjs` 中做三处修改：

(a) `grab` 函数之后新增常量提取与 stub：

```js
function grabConst(name) {
  const m = src.match(new RegExp(`const ${name} = [^\\n]+`));
  if (!m) throw new Error(`常量 ${name} 不存在于 movie.plus.user.js`);
  return m[0];
}

// 为偏好函数注入 localStorage stub（node 环境没有；defineProperty 兼容有无内建 localStorage 的版本）
function stubLocalStorage(store) {
  Object.defineProperty(globalThis, 'localStorage', {
    configurable: true,
    value: {
      getItem: k => (k in store ? store[k] : null),
      setItem: (k, v) => { store[k] = String(v); },
    },
  });
}
```

(b) 替换 try 块内的提取与导出（原第 15-16 行）：

```js
  const code = [
    grabConst('RES_KEY'), grabConst('RES_OPTIONS'),
    grab('btdig_url'), grab('is_series'), grab('build_bt_sites'), grab('build_sub_sites'),
    grab('get_res_pref'), grab('toggle_res_pref'),
  ].join('\n');
  fns = new Function(`${code}; return {btdig_url, build_bt_sites, build_sub_sites, get_res_pref, toggle_res_pref};`)();
```

(c) `cases` 数组末尾（`build_sub_sites` 段之后）追加：

```js
  // ---- 清晰度偏好 ----
  // 指定 2160p：电影与剧集分支的后缀都跟随
  [() => fns.build_bt_sites('The Shawshank Redemption', '1994', '肖申克的救赎', '2160p')['BTDigg EN'],
    'https://www.btdig.com/search?q=The+Shawshank+Redemption+1994+2160p'],
  [() => fns.build_bt_sites('Fargo S02', '2015', '冰血暴', '2160p')['BTDigg EN'],
    'https://www.btdig.com/search?q=Fargo+S02+2160p'],
  // 空片名时无论什么清晰度都置灰，不生成废查询
  [() => fns.build_bt_sites('', '1994', '肖申克的救赎', '2160p')['BTDigg EN'], null],
  // 缺省/非法/合法存储值的读取行为
  [() => { stubLocalStorage({}); return fns.get_res_pref(); }, '1080p'],
  [() => { stubLocalStorage({ 'movieplus:res': '2160p' }); return fns.get_res_pref(); }, '2160p'],
  [() => { stubLocalStorage({ 'movieplus:res': '4k' }); return fns.get_res_pref(); }, '1080p'],
  // 切换：翻转返回值 + 写入存储；再切一次回到 1080p
  [() => { const store = {}; stubLocalStorage(store); const now = fns.toggle_res_pref(); return `${now}/${store['movieplus:res']}`; }, '2160p/2160p'],
  [() => { const store = { 'movieplus:res': '2160p' }; stubLocalStorage(store); return fns.toggle_res_pref(); }, '1080p'],
```

（注意：既有 15 个用例三参数调用 `build_bt_sites`，依赖缺省 `1080p` 保持绿色，这本身就是缺省行为的回归用例。）

- [ ] **步骤 2：运行测试验证失败**

运行：`node tests/test_search_urls.mjs`
预期：exit 1，输出 `FAIL: 常量 RES_KEY 不存在于 movie.plus.user.js`（grab 尚未提取到新常量）

- [ ] **步骤 3：编写最少实现**

(a) `movie.plus.user.js` 中 `btdig_url` 函数之后、`// 站点 URL 统一在这里构造` 注释之前插入：

```js
// 默认清晰度偏好：存豆瓣域 localStorage；缺失/非法/不可用时一律按 1080p
const RES_KEY = 'movieplus:res'
const RES_OPTIONS = ['1080p', '2160p']

function get_res_pref() {
    let saved = ''
    try { saved = localStorage.getItem(RES_KEY) } catch (e) { }
    return RES_OPTIONS.includes(saved) ? saved : '1080p'
}

function toggle_res_pref() {
    let next = get_res_pref() === '1080p' ? '2160p' : '1080p'
    try { localStorage.setItem(RES_KEY, next) } catch (e) { }
    return next
}
```

(b) `build_bt_sites` 改为（签名加 `res`，三处 `' 1080p'` 改用 `res`）：

```js
// 站点 URL 统一在这里构造：片名整体编码，空格转 +（btdig 查询串不认 %20）；名称缺失时返回 null 置灰
function build_bt_sites(title, year, title_cn, res) {
    res = res || '1080p'
    title = title.trim()
    title_cn = title_cn.trim()
    let sites = {
        'BTDigg EN': title ? btdig_url(title + (year ? ' ' + year : '') + ' ' + res) : null,
        'BTDigg 中': title_cn ? btdig_url(title_cn) : null
    }

    if (title && is_series(title))
        sites['BTDigg EN'] = btdig_url(title + ' ' + res)

    return sites
}
```

注意：新函数体保持"闭括号顶格"风格（现有 grab 正则 `\n\}` 依赖它），try/catch 写单行。

- [ ] **步骤 4：运行测试验证通过**

运行：`node tests/test_search_urls.mjs && node --check movie.plus.user.js`
预期：23/23 PASS，语法无错

- [ ] **步骤 5：Commit**

```bash
git add tests/test_search_urls.mjs movie.plus.user.js
git commit -m "清晰度偏好纯函数：1080p/2160p 切换与回退，build_bt_sites 支持传入清晰度"
```

---

### 任务 2：面板切换标签 + 链接即时重建（含浏览器验证）

**文件：**
- 修改：`movie.plus.user.js`（注入 CSS、`update_bt_site` → `render_bt_links`、`main()`、版本号）
- 临时：`C:\tmp\restoggle\`（mock 页、jquery、node 服务，验证后删除）

- [ ] **步骤 1：注入 CSS 追加切换标签样式**

`movie.plus.user.js` 中 `myScriptStyle.innerHTML` 字符串末尾，把

```
.c-aside-body a.disabled {text-decoration: line-through}"
```

替换为

```
.c-aside-body a.disabled {text-decoration: line-through}  .c-aside h2 a.res-toggle {color: #999;cursor: pointer;font-size: 12px;margin-left: 8px}  .c-aside h2 a.res-toggle:hover {color: #37A}"
```

- [ ] **步骤 2：`update_bt_site` 重构为 `render_bt_links`**

把整个 `update_bt_site` 函数替换为（BT 站点早已不用 douban_ID/IMDb_ID，参数随之删除）：

```js
function render_bt_links(title, year, title_cn) {
    let sites = build_bt_sites(title, year, title_cn, get_res_pref())
    let ul = $('#content div.site-bt-body ul').empty()
    for (let name in sites)
        ul.append(parse_sites(name, sites))
}
```

- [ ] **步骤 3：`main()` 绑定切换标签**

把 `main()` 末尾的

```js
        update_bt_site(bt_title, year, douban_ID, IMDb_ID, title_cn);
        update_sub_site(title_cn, douban_ID, IMDb_ID);
```

替换为

```js
        render_bt_links(bt_title, year, title_cn);
        update_sub_site(title_cn, douban_ID, IMDb_ID);

        // 标题行清晰度切换：翻转偏好后标签更新、BT 链接立即重建
        let res_tag = $('<a class="res-toggle"></a>').text(get_res_pref()).attr('title', '切换默认清晰度');
        site_bt.find('h2').append(res_tag);
        res_tag.on('click', function () {
            $(this).text(toggle_res_pref());
            render_bt_links(bt_title, year, title_cn);
        });
```

版本号 `// @version        261002.3` → `261002.4`。

- [ ] **步骤 4：语法与回归验证**

运行：`node --check movie.plus.user.js && node tests/test_search_urls.mjs`
预期：语法无错，23/23 PASS

- [ ] **步骤 5：搭建 mock 页**

`C:\tmp\restoggle\mock.html`：

```html
<!doctype html>
<meta charset="utf-8">
<title>豆瓣 aside mock</title>
<div id="content">
  <h1><span>肖申克的救赎 The Shawshank Redemption</span><span> (1994)</span></h1>
  <div id="info">导演: 弗兰克·德拉邦特<br>IMDb: tt0111161<br>又名: The Shawshank Redemption</div>
  <div class="aside"></div>
</div>
<script src="/jquery.js"></script>
<script src="/user.js"></script>
```

下载 jQuery（直连失败就加 `-x http://127.0.0.1:7897`，TLS 抖动加 `--retry 2 --retry-all-errors`）：

```bash
curl -sL https://code.jquery.com/jquery-3.7.1.min.js -o /c/tmp/restoggle/jquery.js
```

`C:\tmp\restoggle\server.js`（`/user.js` 从仓库实时读，改脚本不用重启）：

```js
const h = require('http'), f = require('fs');
h.createServer((q, s) => {
  if (q.url === '/user.js') {
    s.setHeader('content-type', 'text/javascript; charset=utf-8');
    s.end(f.readFileSync('C:/Tools/movie.plus/movie.plus.user.js'));
  } else {
    const file = q.url === '/jquery.js' ? 'jquery.js' : 'mock.html';
    s.setHeader('content-type', q.url === '/jquery.js' ? 'text/javascript' : 'text/html; charset=utf-8');
    s.end(f.readFileSync('C:/tmp/restoggle/' + file));
  }
}).listen(8124, () => console.log('serving on 8124'));
```

后台启动：`node C:/tmp/restoggle/server.js`

- [ ] **步骤 6：浏览器逐项验证**

用 browser-use 技能打开 `http://127.0.0.1:8124/`，逐项断言（evaluate 读取，不要凭截图目测）：

1. 初始：BT 面板 h2 末尾标签文本为 `1080p`；`BTDigg EN` 链接 `href` 以 `q=The+Shawshank+Redemption+1994+1080p` 结尾
2. 点击标签 → 标签文本变 `2160p`；`BTDigg EN` href 变 `...+1994+2160p`；`BTDigg 中` 链接不变；字幕面板 3 个链接不变
3. `reload()` 页面 → 标签仍是 `2160p`、href 仍 `+2160p`（localStorage 持久化）
4. 再点击 → 回到 `1080p`
5. `localStorage.setItem('movieplus:res','4k')` 后 reload → 标签回退 `1080p`（非法值归一化）

- [ ] **步骤 7：清理临时环境并 Commit**

关闭浏览器标签、停掉 8124 服务、删除 `C:\tmp\restoggle\`：

```bash
git add movie.plus.user.js
git commit -m "BT 面板内一键切换默认清晰度，localStorage 持久化"
```

---

## 自检记录

- **规格覆盖度：** 行为（两值、影响范围、即时重建）→ 任务 1/2；UI（h2 标签、当前值显示、点击交互）→ 任务 2 步骤 1/3/6；持久化（key、回退、降级）→ 任务 1 步骤 1/3 + 任务 2 步骤 6.3/6.5；代码结构（`get_res_pref`/`toggle_res_pref`/第 4 参数/渲染小函数/main 绑定/版本号）→ 任务 1/2 全覆盖；错误处理（结构异常沿用早退、try/catch、归一化）→ 任务 1 + 既有早退逻辑不动；测试计划 4 条 → 任务 1 步骤 1 的 8 个用例包含。无遗漏。
- **占位符扫描：** 无"待定/TODO/类似任务 N"；所有代码步骤含完整代码。
- **类型一致性：** `RES_KEY`/`RES_OPTIONS`/`get_res_pref`/`toggle_res_pref`/`render_bt_links`/CSS 类 `res-toggle` 前后一致；测试导出名与用例引用一致。
