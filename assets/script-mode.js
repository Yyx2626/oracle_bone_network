(() => {
  const simpleToTrad = {万:'萬',东:'東',丧:'喪',为:'為',义:'義',乐:'樂',习:'習',乡:'鄉',买:'買',争:'爭',亚:'亞',仓:'倉',会:'會',传:'傳',侄:'姪',兑:'兌',兴:'興',养:'養',册:'冊',凄:'淒',凤:'鳳',凫:'鳧',刍:'芻',刚:'剛',剐:'剮',区:'區',华:'華',单:'單',卢:'盧',卫:'衛',吕:'呂',启:'啟',吴:'吳',员:'員',咙:'嚨',啬:'嗇',国:'國',圣:'聖',声:'聲',壶:'壺',夹:'夾',妇:'婦',娅:'婭',孙:'孫',宝:'寶',宠:'寵',宪:'憲',对:'對',寿:'壽',尘:'塵',尧:'堯',尽:'盡',岩:'巖',师:'師',带:'帶',庆:'慶',庞:'龐',异:'異',弃:'棄',归:'歸',戋:'戔',执:'執',时:'時',晋:'晉',晕:'暈',来:'來',栎:'櫟',梦:'夢',泷:'瀧',渔:'漁',滨:'濱',犹:'猶',献:'獻',监:'監',盗:'盜',竞:'競',终:'終',罗:'羅',羡:'羨',联:'聯',艰:'艱',苋:'莧',萨:'薩',蛊:'蠱',见:'見',设:'設',贝:'貝',贞:'貞',责:'責',败:'敗',贪:'貪',车:'車',辇:'輦',郁:'鬱',郑:'鄭',长:'長',门:'門',闭:'閉',问:'問',闻:'聞',阳:'陽',陆:'陸',韦:'韋',页:'頁',须:'須',顾:'顧',饱:'飽',饮:'飲',马:'馬',驶:'駛',骑:'騎',鱼:'魚',鲁:'魯',鲧:'鯀',鸟:'鳥',鸡:'雞',鸣:'鳴',麦:'麥',黄:'黃',黾:'黽',鼍:'鼉',齐:'齊',齿:'齒',龋:'齲',龙:'龍',龚:'龔',龟:'龜',丰:'豐'};
  Object.assign(simpleToTrad,{"删": "刪", "泪": "淚", "经": "經", "烛": "燭", "叶": "葉", "飞": "飛", "俭": "儉", "恒": "恆", "写": "寫", "读": "讀", "说": "說", "听": "聽", "亲": "親", "网": "網", "圆": "圓", "鲜": "鮮", "远": "遠", "愿": "願", "关": "關", "独": "獨", "丝": "絲", "岁": "歲", "进": "進", "满": "滿", "强": "強", "语": "語", "韵": "韻", "鹤": "鶴", "烂": "爛", "灿": "燦", "旧": "舊", "过": "過", "劳": "勞", "隶": "隸", "无": "無", "欢": "歡", "观": "觀", "贤": "賢", "离": "離", "静": "靜", "动": "動", "昼": "晝", "怼": "懟", "洁": "潔", "复": "復", "数": "數", "虚": "虛", "谦": "謙", "术": "術", "艺": "藝", "织": "織", "实": "實", "诚": "誠", "奋": "奮", "帜": "幟", "导": "導", "领": "領", "严": "嚴", "从": "從", "达": "達", "穷": "窮", "耻": "恥", "礼": "禮", "变": "變", "历": "歷", "画": "畫", "纪": "紀", "兽": "獸", "规": "規", "红": "紅", "学": "學", "诗": "詩", "当": "當", "担": "擔", "忧": "憂", "爱": "愛"});
  const tradToSimple = Object.fromEntries(Object.entries(simpleToTrad).map(([simple, traditional]) => [traditional, simple]));
  const canonical = value => tradToSimple[value] || value;
  const stored = localStorage.getItem('jiagu-script-mode');
  const api = {
    simpleToTrad,
    tradToSimple,
    mode: stored === 'traditional' ? 'traditional' : 'simplified',
    canonical,
    traditional(value) {
      const simple = canonical(value);
      return simpleToTrad[simple] || value;
    },
    display(value) {
      const simple = canonical(value);
      return this.mode === 'traditional' ? (simpleToTrad[simple] || value) : simple;
    },
    setMode(mode) {
      this.mode = mode === 'traditional' ? 'traditional' : 'simplified';
      localStorage.setItem('jiagu-script-mode', this.mode);
      document.documentElement.lang = this.mode === 'traditional' ? 'zh-Hant' : 'zh-CN';
      document.querySelectorAll('[data-script-mode]').forEach(button => {
        const active = button.dataset.scriptMode === this.mode;
        button.classList.toggle('active', active);
        button.setAttribute('aria-pressed', active ? 'true' : 'false');
      });
      window.dispatchEvent(new CustomEvent('oracle-script-change', { detail: { mode: this.mode } }));
    },
  };
  window.oracleScript = api;
  window.oracleTradAliases = simpleToTrad;
  window.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('[data-script-mode]').forEach(button => {
      button.addEventListener('click', () => api.setMode(button.dataset.scriptMode));
    });
    api.setMode(api.mode);
  });
})();

window.oracleRelatedSearch = {
  '有': { labels: ['㞢', '又'], note: '有：关联检索㞢、又。香港中文大学记载㞢在甲骨文中通读为有、又；保留各字原始标签及来源。' },
  '佑': { labels: ['㞢', '又'], note: '佑：关联检索㞢、又。㞢、又在卜辞中可用作福祐之祐；此为用法关联，不将原字形改标为佑。' },
  '祐': { labels: ['㞢', '又'], note: '祐：关联检索㞢、又的福祐用法，保留原始字名及来源。' }
};
