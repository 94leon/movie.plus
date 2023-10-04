// ==UserScript==
// @name           绿豆瓣·豆瓣电影 BT/种子/资源/磁链/字幕 一键搜索下载 在线观看
// @namespace      https://github.com/94leon/movie.plus
// @description    搜片神器，高清党福音；自动解析电影名/豆瓣ID/IMDb ID；BTDigg/低端影视/茶杯狐/WebHD/SubHD/字幕库/伪射手 一键直达
// @author         94Léon
// @grant          GM_setClipboard
// @match          http*://movie.douban.com/subject/*/
// @match          http*://movie.douban.com/subject/*/?from=*
// @exclude-match  http*://movie.douban.com/subject/*/*/
// @version        230917
// ==/UserScript==

const myScriptStyle = document.createElement("style");
myScriptStyle.innerHTML = "@charset utf-8;.c-aside {margin-bottom: 30px}  .c-aside-body {*letter-spacing: normal}  .c-aside-body a {border-radius: 6px;color: #37A;display: inline-block;letter-spacing: normal;margin: 0 8px 8px 0;padding: 0 8px;text-align: center;width: 65px}  .c-aside-body a:link, .c-aside-body a:visited {background-color: #f5f5f5;color: #37A}  .c-aside-body a:hover, .c-aside-body a:active {background-color: #e8e8e8;color: #37A}  .c-aside-body a.disabled {text-decoration: line-through}  .c-aside-body a.available {background-color: #5ccccc;color: #006363}  .c-aside-body a.available:hover, .c-aside-body a.available:active {background-color: #3cc}  .c-aside-body a.honse {background-color: #fff0f5;color: #006363}  .c-aside-body a.honse:hover, .c-aside-body a.honse:active {background-color: #3cc}  .c-aside-body a.sites_r0 {text-decoration: line-through}";
document.getElementsByTagName("head")[0].appendChild(myScriptStyle);
const aside_html = '<div class=c-aside > <h2><i class="">四字标题</i>· · · · · · </h2> <div class=c-aside-body  style="padding: 0 12px;"> <ul class=bs > </ul> </div> </div>';


const en_total_reg = /^[a-zA-Z\d\s-:·,/`~!@#$%^&*()_+<>?"{}.…;'[\]]+$/;
const en_end_reg = /\s[a-zA-Z\d\s-:·,/`~!@#$%^&*()_+<>?"{}.…;'[\]]+$/;
const cn_start_reg = /^[\u4e00-\u9fa5a-zA-Z\d\s-：:·,，/`~!@#$%^&*()_+<>?"{}.…;'[\]！￥（—）；“”‘、|《。》？【】]+/;
const cn_total_reg = /^[\u4e00-\u9fa5a-zA-Z\d\s-：:·,，/`~!@#$%^&*()_+<>?"{}.…;'[\]！￥（—）；“”‘、|《。》？【】]+$/;
const symbol_delete_reg = /[-：:·,，/`~!@#$%^&*()_+<>?"{}.…;[\]！￥（—）；“”‘、|《。》？【】]/g;

function parseURL(url) {
  let a;
  a = document.createElement('a');
  a.href = url;
  return {
    source: url,
    protocol: a.protocol.replace(':', ''),
    host: a.hostname,
    port: a.port,
    query: a.search,
    params: (function () {
      let i, len, ret, s, seg;
      ret = {};
      seg = a.search.replace(/^\?/, '').split('&');
      len = seg.length;
      i = 0;
      s = void 0;
      while (i < len) {
        if (!seg[i]) {
          i++;
          continue;
        }
        s = seg[i].split('=');
        ret[s[0]] = s[1];
        i++;
      }
      return ret;
    })(),
    file: (a.pathname.match(/\/([^\/?#]+)$/i) || [, ''])[1],
    hash: a.hash.replace('#', ''),
    path: a.pathname.replace(/^([^\/])/, '/$1'),
    relative: (a.href.match(/tps?:\/\/[^\/]+(.+)/) || [, ''])[1],
    segments: a.pathname.replace(/^\//, '').split('/')
  };
}

function update_bt_site(title, year, douban_ID, IMDb_ID, title_cn) {
  let name, sites;
  // title = encodeURI(title.trim());
  title = title.trim();
  sites = {
    // 'RARBG': 'https://proxyrarbg.org/torrents.php?imdb=' + IMDb_ID,
    'BTDigg.EN': 'https://www.btdig.com/search?q=' + title + ' ' + year + ' 1080p',
    'BTDigg.中': 'https://www.btdig.com/search?q=' + title_cn,
    '低端影视': 'https://ddys.pro/?s=' + douban_ID,
    '茶杯狐': 'https://cupfox.app/search?key=' + title_cn,
    'WebHD': 'https://webhd.top/d/' + douban_ID,
    '懒鱼看看': 'https://lykk.top/api/go?doubanId=' + douban_ID,
  }


  if (is_series(title))
    sites['BTDigg.EN'] = 'https://www.btdig.com/search?q=' + title + ' 1080p'
  // if (not_series_01(title))
  //   sites['RARBG'] = 'https://proxyrarbg.org/torrents.php?search=' + title


  for (name in sites) {
    let link = parse_sites(name, sites)
    $('#content div.site-bt-body ul').append(link);
  }
}


function update_sub_site(title, douban_ID, IMDb_ID) {
  let name, sites;
  title = encodeURI(title);

  sites = {
    'SubHD': 'https://subhd.tv/d/' + douban_ID,
    '字幕库': 'https://so.zimuku.org/search?q=' + IMDb_ID,
    '伪射手': 'https://assrt.net/sub/?searchword=' + title,
  }

  for (name in sites) {
    let link = parse_sites(name, sites)

    // //网站限制无法直接跳转，自动复制IMDb_ID到剪贴板，手动粘贴搜索
    // if (name === "字幕库") {
    //   link.on('click', function () {
    //     GM_setClipboard(IMDb_ID)
    //   });
    // }

    $('#content div.site-sub-body ul').append(link);
  }
}

function parse_sites(name, sites) {
  let link = sites[name], link_parsed = parseURL(link);
  let aTag = $('<a></a>')
  link = aTag.attr('href', link);
  link.attr('data-host', link_parsed.host);
  link.attr('target', '_blank').attr('rel', 'nofollow');
  link.html(name);

  return link
}

function get_other_title_en(other_title) {
  let other_title_en = '';
  //获取第一个英文副标题
  other_title.split("/").some((item) => {
    if (en_total_reg.test(item)) {
      other_title_en = item;
      return true;
    }
  });
  return other_title_en
}

function is_series(name) {
  return /S\d+$/.test(name);
}

function not_series_01(name) {
  return /S\d+$/.test(name) & !name.endsWith('S01');
}

function format_series_name(name) {
  if (!/\sSeason\s\d+$/.test(name))
    return name
  let name_arr = name.split("Season")
  let series_id = name_arr.slice(-1)[0].trim().padStart(2, '0')
  return name_arr[0] + "S" + series_id
}

function main() {
  const seBwhA = document.createElement("a");
  seBwhA.id = "seBwhA";
  document.getElementsByTagName("html")[0].appendChild(seBwhA);

  $(document).ready(() => {

    let site_sub = $(aside_html), selector = $('#content div.aside');
    site_sub.addClass('name-offline');
    site_sub.find('div.c-aside-body').addClass('site-sub-body');
    site_sub.find('h2 i').text('字幕直达');
    selector.prepend(site_sub);

    let site_bt = $(aside_html);
    site_bt.addClass('site_bt');
    site_bt.find('div.c-aside-body').addClass('site-bt-body');
    site_bt.find('h2 i').text('BT 搜索');
    selector.prepend(site_bt);


    let h1_span, title_cn, title_en, title_en_sub, bt_title, year, douban_ID, IMDb_ID;

    h1_span = $('#content > h1 > span');
    let title_all = h1_span[0].textContent

    if (cn_total_reg.test(title_all)) {
      //名称只有中英文时匹配英文——————————————
      title_en = title_all.match(en_end_reg);
      title_en = title_en ? title_en[0] : '';
    }

    if (title_en) {
      //有英文名时匹配中文——————————————
      title_cn = title_en ? title_all.split(title_en)[0] : '';
    } else {
      //直接匹配中文——————————————
      title_cn = title_all.match(cn_start_reg);
      title_cn = title_cn ? title_cn[0] : '';
    }

    //检查名称——————————————
    // console.log(title_all.length, (title_en + title_cn).length)
    if ((title_all.length !== (title_en + title_cn).length)) {

      title_cn = ""
      let title_array = title_all.split(" ");
      title_array.some(item => {
        if (!cn_total_reg.test(item))
          return true
        title_cn += item + " "
      })

      title_en = ''
    }

    //解析info内容
    let info_text = $('#info')[0].innerText, info_map = {}
    // console.log(info_text);
    info_text.split("\n").forEach(line => {
      let index = line.indexOf(":")
      if (index > 0)
        info_map[line.slice(0, index).trim()] = line.slice(index + 1).trim()
    })
    // console.log(info_map);

    //匹配备用英文名——————————————
    title_en_sub = info_map["又名"];
    title_en_sub = title_en_sub ? get_other_title_en(title_en_sub) : '';

    bt_title = title_en || title_en_sub || title_cn;
    //规范的命名只保留英文字母
    bt_title = bt_title.replaceAll(symbol_delete_reg, ' ').replace('\'', '').replace(/\s+/g, ' ').trim();
    bt_title = format_series_name(bt_title)

    // title_en = title_en ? title_en[0] : '';


    // console.log('title_all:' + title_all);
    // console.log('title_en:' + title_en);
    // console.log('title_cn:' + title_cn);
    // console.log('title_en_sub:' + title_en_sub);
    // console.log('bt_title:' + bt_title);

    // console.log(" h1_span[1].textContent", h1_span[1].textContent);
    year = h1_span[1].textContent.substr(1, 4);

    douban_ID = location.href.split('\/')[4] || title_cn;

    IMDb_ID = info_map["IMDb"];
    IMDb_ID = IMDb_ID ? IMDb_ID : title_cn;
    // console.log('IMDb_ID', IMDb_ID);

    update_bt_site(bt_title, year, douban_ID, IMDb_ID, title_cn);
    update_sub_site(title_cn, douban_ID, IMDb_ID);

  });
}

main()
