// 搜索站点 URL 构造回归测试
// 用法: node tests/test_search_urls.mjs
import { readFileSync } from 'node:fs';

const src = readFileSync(new URL('../movie.plus.user.js', import.meta.url), 'utf8');

function grab(name) {
  const m = src.match(new RegExp(`function ${name}[\\s\\S]*?\\n\\}`));
  if (!m) throw new Error(`函数 ${name} 不存在于 movie.plus.user.js`);
  return m[0];
}

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

let fns;
try {
  const code = [
    grabConst('RES_KEY'), grabConst('RES_OPTIONS'),
    grab('btdig_url'), grab('is_series'), grab('build_bt_sites'), grab('build_sub_sites'),
    grab('get_res_pref'), grab('toggle_res_pref'),
  ].join('\n');
  fns = new Function(`${code}; return {btdig_url, build_bt_sites, build_sub_sites, get_res_pref, toggle_res_pref};`)();
} catch (e) {
  console.error(`FAIL: ${e.message}`);
  process.exit(1);
}

const cases = [
  // ---- build_bt_sites ----
  // 电影：片名 + 年份 + 1080p，空格转 +
  [() => fns.build_bt_sites('The Shawshank Redemption', '1994', '肖申克的救赎')['BTDigg EN'],
    'https://www.btdig.com/search?q=The+Shawshank+Redemption+1994+1080p'],
  // 中文片名走 UTF-8 百分号编码
  [() => fns.build_bt_sites('The Shawshank Redemption', '1994', '肖申克的救赎')['BTDigg 中'],
    'https://www.btdig.com/search?q=%E8%82%96%E7%94%B3%E5%85%8B%E7%9A%84%E6%95%91%E8%B5%8E'],
  // 年份缺失时不产生连续 ++（DOM 防御分支的下游行为）
  [() => fns.build_bt_sites(' Fargo ', '', '  肖申克的救赎  ')['BTDigg EN'],
    'https://www.btdig.com/search?q=Fargo+1080p'],
  // title_cn 首尾空格要 trim，不能编码成 +
  [() => fns.build_bt_sites('Fargo', '', '  肖申克的救赎  ')['BTDigg 中'],
    'https://www.btdig.com/search?q=%E8%82%96%E7%94%B3%E5%85%8B%E7%9A%84%E6%95%91%E8%B5%8E'],
  // 剧集：Sxx 结尾时去掉年份
  [() => fns.build_bt_sites('Fargo S02', '2015', '冰血暴')['BTDigg EN'],
    'https://www.btdig.com/search?q=Fargo+S02+1080p'],
  // 片名解析失败时不得生成废查询（如 +1994+1080p），应置灰
  [() => fns.build_bt_sites('', '1994', '肖申克的救赎')['BTDigg EN'], null],
  // 中文片名缺失/纯空白时置灰，不得生成空查询
  [() => fns.build_bt_sites('Fargo', '1994', '')['BTDigg 中'], null],
  [() => fns.build_bt_sites('Fargo', '1994', '   ')['BTDigg 中'], null],

  // ---- build_sub_sites ----
  // 片名含 & 必须整体编码（encodeURIComponent），不能裸拼进 searchword
  [() => fns.build_sub_sites('Tom & Jerry', '1292052', 'tt0111161')['伪射手'],
    'https://assrt.net/sub/?searchword=Tom%20%26%20Jerry'],
  // 豆瓣 ID / IMDb ID 齐全时正常拼 URL
  [() => fns.build_sub_sites('肖申克的救赎', '1292052', 'tt0111161')['SubHD'],
    'https://subhd.tv/d/1292052'],
  [() => fns.build_sub_sites('肖申克的救赎', '1292052', 'tt0111161')['字幕库'],
    'https://zimuku.org/search?q=tt0111161'],
  // ID 缺失时不得用片名伪造 ID 链接，应为 null（置灰展示）
  [() => fns.build_sub_sites('肖申克的救赎', '', '')['SubHD'], null],
  [() => fns.build_sub_sites('肖申克的救赎', '', '')['字幕库'], null],
  // ID 格式不对（如 fallback 进来的中文片名）同样置灰
  [() => fns.build_sub_sites('肖申克的救赎', '肖申克的救赎', '肖申克的救赎')['SubHD'], null],
  [() => fns.build_sub_sites('肖申克的救赎', '肖申克的救赎', '肖申克的救赎')['字幕库'], null],

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
];

let failed = 0;
for (const [fn, expected] of cases) {
  let got, label = fn.toString().replace(/^\(\) => /, '').replace(/\n\s*/g, ' ');
  try { got = fn(); } catch (e) { got = `THROW: ${e.message}`; }
  if (got === expected) {
    console.log(`PASS  ${label}`);
  } else {
    console.error(`FAIL  ${label}\n  got:      ${JSON.stringify(got)}\n  expected: ${JSON.stringify(expected)}`);
    failed++;
  }
}
process.exit(failed ? 1 : 0);
