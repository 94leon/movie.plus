// ==UserScript==
// @name           绿豆瓣·豆瓣电影 BT/种子/资源/磁链/字幕 一键搜索下载
// @namespace      https://github.com/94leon/movie.plus
// @description    搜片神器，高清党福音；自动解析电影名/豆瓣ID/IMDb ID；BTDigg/SubHD/字幕库/伪射手 一键直达
// @author         94Léon
// @grant          GM_setClipboard
// @match          http*://movie.douban.com/subject/*/
// @exclude-match  http*://movie.douban.com/subject/*/*/
// @version        261002.4
// ==/UserScript==

const myScriptStyle = document.createElement("style");
myScriptStyle.innerHTML = "@charset utf-8;.c-aside {margin-bottom: 30px}  .c-aside-body {*letter-spacing: normal}  .c-aside-body a {border-radius: 6px;color: #37A;display: inline-block;letter-spacing: normal;margin: 0 8px 8px 0;padding: 0 8px;text-align: center;min-width: 65px}  .c-aside-body a:link, .c-aside-body a:visited {background-color: #f5f5f5;color: #37A}  .c-aside-body a:hover, .c-aside-body a:active {background-color: #e8e8e8;color: #37A}  .c-aside-body a.disabled {text-decoration: line-through}  .c-aside h2 a.res-toggle {color: #666;background-color: #f5f5f5;border-radius: 4px;cursor: pointer;font-size: 12px;margin-left: 8px;padding: 2px 6px;transition: all .15s}  .c-aside h2 a.res-toggle:hover {color: #37A;background-color: #e8e8e8}";
document.getElementsByTagName("head")[0].appendChild(myScriptStyle);
const aside_html = '<div class=c-aside > <h2><i class="">四字标题</i>· · · · · · </h2> <div class=c-aside-body  style="padding: 0 12px;"> <ul class=bs > </ul> </div> </div>';


const en_total_reg = /^[a-zA-Z\d\s-:·,/`~!@#$%^&*()_+<>?"{}.…;'[\]]+$/;
const en_end_reg = /\s[a-zA-Z\d\s-:·,/`~!@#$%^&*()_+<>?"{}.…;'[\]]+$/;
const cn_start_reg = /^[\u4e00-\u9fa5a-zA-Z\d\s-：:·,，/`~!@#$%^&*()_+<>?"{}.…;'[\]！￥（—）；“”‘、|《。》？【】]+/;
const cn_total_reg = /^[\u4e00-\u9fa5a-zA-Z\d\s-：:·,，/`~!@#$%^&*()_+<>?"{}.…;'[\]！￥（—）；“”‘、|《。》？【】]+$/;
const symbol_delete_reg = /[-：:·,，/`~!@#$%^&*()_+<>?"{}.…;[\]！￥（—）；“”‘、|《。》？【】]/g;

// btdig 查询串只认 + 作为空格，%20 会命中后端默认页；整体编码以处理片名中的 & 等字符
function btdig_url(query) {
    return 'https://www.btdig.com/search?q=' + encodeURIComponent(query).replace(/%20/g, '+')
}

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

function render_bt_links(title, year, title_cn) {
    let sites = build_bt_sites(title, year, title_cn, get_res_pref())
    let ul = $('#content div.site-bt-body ul').empty()
    for (let name in sites)
        ul.append(parse_sites(name, sites))
}


// 豆瓣 ID / IMDb ID 缺失或格式不对时返回 null，parse_sites 会置灰展示
function build_sub_sites(title, douban_ID, IMDb_ID) {
    title = encodeURIComponent(title.trim())
    return {
        'SubHD': /^\d+$/.test(douban_ID) ? 'https://subhd.tv/d/' + douban_ID : null,
        '字幕库': /^tt\d+$/i.test(IMDb_ID) ? 'https://zimuku.org/search?q=' + IMDb_ID : null,
        '伪射手': 'https://assrt.net/sub/?searchword=' + title,
    }
}

function update_sub_site(title, douban_ID, IMDb_ID) {
    let name, sites = build_sub_sites(title, douban_ID, IMDb_ID);

    for (name in sites) {
        let link = parse_sites(name, sites)
        $('#content div.site-sub-body ul').append(link);
    }
}

function parse_sites(name, sites) {
    let url = sites[name];
    let aTag = $('<a></a>').html(name);
    if (url) {
        aTag.attr('href', url);
        aTag.attr('target', '_blank').attr('rel', 'nofollow');
    } else {
        // 无可用 URL（如缺 ID）时置灰，不生成可点击链接
        aTag.addClass('disabled');
    }

    return aTag
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

function format_series_name(name) {
    if (!/\sSeason\s\d+$/.test(name))
        return name
    let name_arr = name.split("Season")
    let series_id = name_arr.slice(-1)[0].trim().padStart(2, '0')
    return name_arr[0] + "S" + series_id
}

function main() {
    $(document).ready(() => {

        let h1_span = $('#content > h1 > span');
        // 页面结构不符合预期（豆瓣改版等）时直接退出，避免插入空面板
        if (!h1_span.length || !h1_span[0].textContent)
            return

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


        let title_cn, title_en, title_en_sub, bt_title, year, douban_ID, IMDb_ID;

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

        //解析info内容（#info 缺失时按空处理，IMDb 相关链接会置灰）
        let info_el = $('#info')[0], info_map = {}
        if (info_el) {
            info_el.innerText.split("\n").forEach(line => {
                let index = line.indexOf(":")
                if (index > 0)
                    info_map[line.slice(0, index).trim()] = line.slice(index + 1).trim()
            })
        }

        //匹配备用英文名——————————————
        title_en_sub = info_map["又名"];
        title_en_sub = title_en_sub ? get_other_title_en(title_en_sub) : '';

        bt_title = title_en || title_en_sub || title_cn;
        //规范的命名只保留英文字母
        bt_title = bt_title.replaceAll(symbol_delete_reg, ' ').replace(/\s+/g, ' ').trim();
        bt_title = format_series_name(bt_title)

        year = h1_span[1] ? h1_span[1].textContent.substr(1, 4) : '';

        douban_ID = location.href.split('/')[4] || '';

        IMDb_ID = info_map["IMDb"] || '';

        render_bt_links(bt_title, year, title_cn);
        update_sub_site(title_cn, douban_ID, IMDb_ID);

        // 标题行清晰度切换：翻转偏好后标签更新、BT 链接立即重建
        let res_tag = $('<a class="res-toggle"></a>').text(get_res_pref()).attr('title', '切换默认清晰度');
        site_bt.find('h2').append(res_tag);
        res_tag.on('click', function () {
            $(this).text(toggle_res_pref());
            render_bt_links(bt_title, year, title_cn);
        });

    });
}

main()
