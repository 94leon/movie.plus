// ==UserScript==
// @name           豆瓣电影搜索下载在线观看·绿豆瓣 BT种子资源字幕 一键搜索下载 在线观看
// @description    找片神器，高清党福音；自动解析电影英文名，BTDigg一键搜索；低端影视 一键搜索，在线观看；RARBG、SubDH 一键直达；SubHD、字幕库、伪射手 一键直达；动漫站点 Nyaa、ACG.RIP 一键搜索
// @author         94Léon
// @grant          GM_xmlhttpRequest
// @grant          GM_setClipboard
// @grant          GM_addStyle
// @grant          GM_setValue
// @grant          GM_getValue
// @require        https://cdn.bootcss.com/jquery/3.2.1/jquery.min.js
// @require        https://cdn.bootcss.com/jqueryui/1.12.1/jquery-ui.min.js
// @match          https://movie.douban.com/subject/*
// @version        210408
// ==/UserScript==

const myScriptStyle = document.createElement("style");
myScriptStyle.innerHTML = "@charset utf-8;.c-aside {margin-bottom: 30px}  .c-aside-body {*letter-spacing: normal}  .c-aside-body a {border-radius: 6px;color: #37A;display: inline-block;letter-spacing: normal;margin: 0 8px 8px 0;padding: 0 8px;text-align: center;width: 65px}  .c-aside-body a:link, .c-aside-body a:visited {background-color: #f5f5f5;color: #37A}  .c-aside-body a:hover, .c-aside-body a:active {background-color: #e8e8e8;color: #37A}  .c-aside-body a.disabled {text-decoration: line-through}  .c-aside-body a.available {background-color: #5ccccc;color: #006363}  .c-aside-body a.available:hover, .c-aside-body a.available:active {background-color: #3cc}  .c-aside-body a.honse {background-color: #fff0f5;color: #006363}  .c-aside-body a.honse:hover, .c-aside-body a.honse:active {background-color: #3cc}  .c-aside-body a.sites_r0 {text-decoration: line-through}";
document.getElementsByTagName("head")[0].appendChild(myScriptStyle);
const aside_html = '<div class=c-aside > <h2><i class="">四字标题</i>· · · · · · </h2> <div class=c-aside-body  style="padding: 0 12px;"> <ul class=bs > </ul> </div> </div>';


const en_total_reg = /^[a-zA-Z\d\s-:·,/`~!@#$%^&*()_+<>?"{}.;'[\]]+$/;
const en_end_reg = /\s[a-zA-Z\d\s-:·,/`~!@#$%^&*()_+<>?"{}.;'[\]]+$/;
const cn_start_reg = /^[\u4e00-\u9fa5a-zA-Z\d\s-：:·,，/`~!@#$%^&*()_+<>?"{}.;'[\]！￥（—）；“”‘、|《。》？【】]+/;
const cn_total_reg = /^[\u4e00-\u9fa5a-zA-Z\d\s-：:·,，/`~!@#$%^&*()_+<>?"{}.;'[\]！￥（—）；“”‘、|《。》？【】]+$/;

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

function update_bt_site(title, year, douban_ID, IMDb_ID) {
  let name, sites;
  // title = encodeURI(title.trim());
  title = title.trim();
  sites = {
    // '低端影视': 'https://www.baidu.com/s?wd=site%3Addrk.me ' + title + ' ' + year,
    '低端影视': 'https://www.google.com/search?q=site%3Addrk.me ' + title + ' ' + year,
    'BTDigg': 'https://www.btdig.com/search?q=' + title + ' ' + year + '+1080p',
    'RARBG': 'https://rarbgprx.org/torrents.php?imdb=' + IMDb_ID,
    'subDH': 'https://subdh.com/d/' + douban_ID,
    '动漫Nyaa': 'https://nyaa.si/?f=0&c=0_0&q=' + title,
    'ACG.RIP': 'https://acg.rip/?term=' + title,
    // 'Torrentz2': 'https://torrentz2.is/searchS?f=' + title + '+1080p',
  }

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
    '字幕库': 'http://www.zimuku.la/search?q=' + IMDb_ID,
    '伪射手': 'http://assrt.net/sub/?searchword=' + title,
  }

  for (name in sites) {
    let link = parse_sites(name, sites)
    $('#content div.site-sub-body ul').append(link);
  }
}

function parse_sites(name, sites) {
  let link = sites[name], link_parsed = parseURL(link);
  link = $('<a></a>').attr('href', link);
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

    //匹配备用英文名——————————————
    title_en_sub = $('#info').html().split("又名:</span>")[1];
    title_en_sub = title_en_sub ? title_en_sub.split("<br>")[0] : '';
    title_en_sub = title_en_sub ? get_other_title_en(title_en_sub) : '';

    bt_title = title_en || title_en_sub || title_cn;

    // console.log('title_all:' + title_all);
    // console.log('title_en:' + title_en);
    // console.log('title_cn:' + title_cn);
    // console.log('title_en_sub:' + title_en_sub);
    // console.log('bt_title:' + bt_title);

    // console.log(" h1_span[1].textContent", h1_span[1].textContent);
    year = h1_span[1].textContent.substr(1, 4);

    douban_ID = location.href.split('\/')[4] || title_cn;
    IMDb_ID = document.querySelector('#info a[href*="://www.imdb.com/"]');
    IMDb_ID = IMDb_ID ? (IMDb_ID.textContent || title_cn) : title_cn;

    update_bt_site(bt_title, year, douban_ID, IMDb_ID);
    update_sub_site(title_cn, douban_ID, IMDb_ID);

  });
}

main()
