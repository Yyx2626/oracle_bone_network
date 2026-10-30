# Oracle Bone Network / 甲骨文网络

Explore similarities among oracle bone glyphs.

探索甲骨文字形的相似关系。

An interactive glyph similarity network for Chinese oracle bone script, with character lookup, handwriting search, and variant browsing. The network is based on visual similarity, not inferred etymological relationships.

以甲骨文字形相似关系网络为核心，支持文字搜索、手写识别与同字异形浏览。网络展示视觉相似关系，不代表字源关系。

## Notice / 使用提示

This website was created by an oracle bone script enthusiast using ChatGPT. Its glyph collection may contain omissions and errors, including incorrectly inverted images. It is provided for reference only. Thank you for your understanding.

本网站由甲骨文业余爱好者使用 ChatGPT 制作，甲骨文字图库可能存在缺漏和错误（包括反色处理可能存在错误反色的情况），仅供参考，请多包涵。

This is not a definitive scholarly edition or an endorsement by the cited institutions. Please consult the original sources and specialist research for character readings, dating, and provenance.

本站不是学术定本，也不代表所引用机构的审定意见。释字、字形年代及具体出处应以原始资料和专业研究为准。

## Online use / 在线使用

To use the website online, [click here](https://yyx2626.github.io/oracle_bone_network/).

在线使用本网站，请[点击此处](https://yyx2626.github.io/oracle_bone_network/)。

## Offline use / 离线使用

Extract the complete folder and open `index.html`. Keep `index.html` and the `assets` folder together. The main glyph collection, search, and relationship graph work offline; source links require an internet connection. The top-right control switches between simplified and traditional Chinese, and search supports the configured character correspondences.

解压完整文件夹，双击 `index.html` 即可使用。请将 `index.html` 与 `assets` 文件夹放在同一目录。主要字形、检索和关系图可离线运行；访问来源链接仍需联网。网页右上角可切换简体／繁體，搜索接受已配置对应关系的繁简字。

The home graph starts with 王 at the center. It shows 12 similar characters by default, adjustable from 1 to 32. Click a glyph to recenter the graph; "后退 / Back" and "前进 / Forward" navigate browsing history. Image and handwriting search automatically combine six groups of offline template scores (contour and skeleton comparisons are included in the fused score). Candidates are merged rank by rank, with more same-rank matches taking precedence and duplicate characters removed. Results show eight candidates per row, initially sixteen, with sixteen more available per click.

首页以"王"为中心。关系图默认显示12个相似字，可调整数量；点击字形可切换中心，"后退 / Back"和"前进 / Forward"可浏览历史记录。图片识别与手写识别自动综合六组离线模板评分（轮廓、骨架已计入融合评分）：逐名次合并，同层命中方法更多的优先，并去除重复字。候选每行8个，先显示16个，每次可再展开16个。


Oracle-bone forms from the supplementary dataset are now included in character details, handwriting search, and the similarity graph, with their dataset labels and provenance retained. The separate multi-period reference collection still loads only when requested. Recognition features are prepared on the first image or handwriting search, with progress feedback. Original images remain available for checking cropping and inversion. On narrow screens, the network scales to the available width.

扩展库中的甲骨字形已纳入各字详情、手写检索和相似网络，保留数据集原标签及来源；独立的历代字形参考区仍按需载入；首次图片或手写搜索时准备识别特征并显示进度。保留原图以核查裁剪与反色；窄屏下关系图按可用宽度等比例缩放。

## Project contributions and human review / 项目贡献与人工审校

The central contribution is an interactive network for exploring visual similarities among oracle bone glyphs, supported by a curated, traceable collection and offline search tools. Building it involved repeated source comparison, human correction, image-processing revisions, and user testing. The original glyph materials remain attributable to their respective sources.

本项目的核心是用于探索甲骨文字形相似关系的交互网络，以及支撑该网络的经整理、可追溯字库与离线检索工具。制作过程包含反复来源核对、人工纠错、图像处理修订及用户实测。原始字形资料仍归属于各自来源。

- **Human review and coverage checks.** The project creator located alternative source copies, reviewed character labels in spreadsheets and a row-based HTML review tool, corrected misreadings, and flagged unreadable entries for exclusion. Coverage checks and configured search correspondences improve access without silently changing original headwords.
- **人工审校与补缺。** 项目制作者寻找更清晰或无水印的来源，在 Excel 和逐行 HTML 审校界面核查现代字标签、纠正误识别，将无法确认的条目标记为不入库；通过补缺核对和检索对应关系改善可检索性，并保留原字头。
- **Image preparation and repair.** Chart segmentation, margin adjustments, dark-background inversion, partial-region cropping, and noise reduction were revised through comparison with originals. Reported clipping and inversion errors prompted targeted repairs; processed and original images can be compared in the site.
- **图像整理与修复。** 对整页对照表进行分格裁剪、留白调整、黑底反色、局部区域裁剪及去噪；根据原图对照和使用反馈，反复修正截断与反色问题，网页提供处理图与原图对照。
- **Collection organization.** Simplified/traditional headwords are merged for browsing and retrieval while retaining source labels and multiple glyph variants. Shape clustering helps order variants; manually chosen representative forms can take precedence. Modern-meaning categories and source descriptions were revised through review.
- **字库组织。** 归并繁简字条以便浏览与检索，同时保留来源字头和同字异形；通过字形聚类辅助排序，允许人工指定代表图；反复调整基于现代常见义的类别与来源说明。
- **Similarity search and evaluation.** Eight template comparisons cover contour, skeleton, spatial projections, feature fusion, aspect tolerance, rotation tolerance, local proportion changes, and disconnected-stroke structure. Rank-tier aggregation combines their results. Tests with translated, scaled, and slightly rotated glyphs and user-drawn examples guided revisions; these tests do not establish general handwriting accuracy.
- **相似检索与评估。** 模板比较涉及轮廓、骨架、空间投影、特征融合、宽高比例容错、旋转容错、局部比例变化及分离笔画结构，并按名次分层合并结果。使用字库字形的平移、缩放、轻微旋转变换及用户手绘实例检验并迭代；这些测试不等于普遍手写识别准确率。
- **Application development.** The offline interface includes a recenterable similarity graph, adjustable neighbor counts, browsing history, handwriting undo and erasing, simplified/traditional display, expandable categories, original-image inspection, loading feedback, and paginated recognition candidates.
- **应用开发。** 离线界面支持关系图切换中心、调整相似字数量、浏览前进后退、手写撤销与擦除、繁简显示、分类展开收起、查看原图、载入反馈和识别候选分批显示。

The project creator defined the requirements, selected sources, performed human review, tested the website, and directed corrections. ChatGPT assisted with code, automated processing, analysis, and debugging through repeated iterations. Human review was selective and iterative, not an independent scholarly verification of every glyph. Remaining errors should be checked against the originals.

项目制作者负责提出需求、选择来源、人工审校、网页实测及指导纠错；ChatGPT 在多轮交互中辅助完成代码、自动处理、分析和调试。人工审校是分批、反复进行的，并不代表已对每幅字形完成独立的甲骨学鉴定。仍可能存在的错误应结合原始资料核查。

See [CHANGELOG.md](CHANGELOG.md) for a retrospective of the major changes.

主要改进过程见 [CHANGELOG.md](CHANGELOG.md)。


## Data sources and references / 数据来源与参考

1. **CUHK Multi-function Chinese Character Database / 香港中文大学"汉语多功能字库"**  
   https://humanum.arts.cuhk.edu.hk/Lexis/lexi-mf/  
   Oracle bone component index / 甲骨部件表: https://humanum.arts.cuhk.edu.hk/Lexis/lexi-mf/oraclePiece.php
   The primary source for glyphs and their character mappings. Cards retain source links. Display images may differ from the originals because of cropping, inversion, and noise reduction.  
   主字库的主要字形及现代字对应来源。字卡保留具体来源链接；本地显示图经过裁剪、反色、去噪等处理，可能与原图不同。

2. **Oracle bone comparison charts, Beijing Municipal Education Commission website / 北京市教委网站刊载的甲骨文对照表**  
   https://jw.beijing.gov.cn/language/ywsh/201901/t20190103_1056839.html  
   The comparison charts were used for supplementary coverage and source comparison. Work began with phone screenshots and selective human review, then incorporated higher-quality chart copies and reviewed surname and pinyin chart material. The page identifies a reprint source, not the original archaeological publication of every glyph. See the additional chart sources below.  
   对照表用于补充覆盖与来源对照。整理从手机截图及部分逐字审校开始，之后引入更清晰的对照表副本，以及经审校的姓氏图和拼音字形表。该页面提供转载来源，不代表每幅字形的最初考古著录；其他对照表来源见下文。


3. **Third-party supplementary reference collection / 第三方扩展参考字库**  
   https://github.com/leonsilicon/character-evolution-dataset-1bit  
   By Leon Si; the upstream README declares MIT. In v279, 5,103 forms classified by that dataset as oracle-bone were added to the main matcher and graph after removing 6 pixel-identical duplicates within the same simplified/traditional character group. Original labels and 1-bit images are preserved; these records have not received individual expert review. Bronze, clerical, and other stages are not included in oracle matching. Source labels may reflect different readings or historical correspondences; not every image is a typical form. Existing curated representatives retain priority. Consult the original repository and underlying materials for rights and attribution.  
   由Leon Si整理，上游README声明MIT许可。v279将数据集标为甲骨文的5103幅字形纳入主检索和网络，同一繁简字组内6幅像素一致重复图未重复加入。保留原始字头及1-bit图片，尚未经逐图专家审校；金文、隶书等不参与甲骨匹配。标签可能涉及不同释读或古今字对应，不能把所有字形都当作典型写法。已有人工代表图仍优先。原始资料的权利及署名要求须结合其出处核实。

4. **CCDI "A Character a Day" articles / 中央纪委国家监委网站"每日一字"**  
   Character index / 字目索引: http://m.ccdi.gov.cn/content/cc/2e/16132.html
   Reference for 萬 / "万"参考: http://m.ccdi.gov.cn/content/90/71/16842.html
   Reference for 零 / "零"参考: https://m.ccdi.gov.cn/content/2e/b6/16713.html
   Used as leads for coverage checks and etymological context, not as proof that all illustrated forms have been verified and included. Searching 零 shows the related rain-associated character 霝, without labeling it as the oracle bone form of the numeral zero.  
   用于补缺线索及字源说明，不作为全部图片已核验收录的证明。"零"关联显示库中雨义的"霝"，不将其标成数字0的甲骨写法。

## Coverage and processing / 数据范围与加工

The collection combines CUHK glyphs with reviewed supplementary charts, retaining multiple forms of a character. Current interface counts reflect the active data and configured simplified/traditional merging; historical counts from early screenshot batches do not describe the current collection. At the user's request, a mirrored 左 glyph is included as an explicitly labeled synthetic illustration for 右, not as an original CUHK image of 右.

字库结合香港中文大学字形与经审校的补充对照表，保留同字多种写法。当前数量以网页有效数据及繁简归并后的统计为准；早期截图批次的数量不代表当前字库。依用户建议，以"左"字形镜像生成的"右"明确标为合成示意，不是香港中文大学提供的"右"字原图。


Image processing detects full or partial dark backgrounds, crops them, and aims to produce black strokes on white. Thresholding and small-component filtering reduce gray background noise. Automatic processing can mistake thick strokes, frames, or rubbing textures for background. Compare processed images with the originals when checking a glyph.

反色处理会检测整幅或局部黑底，裁剪后统一为白底黑线；二值阈值和小连通域过滤用于减弱灰底噪音。自动处理可能误判粗笔画、边框或拓片纹理。原图与处理图应对照核查。

Recognition uses offline template matching, not a trained oracle bone OCR model. Glyphs are cropped, centered, and normalized while preserving aspect ratio. Mirror matching is allowed except for 左 and 右. Variants are ordered by shape clusters, with manually selected representatives taking precedence. Similarities and scores are search aids, not reading probabilities or etymological relationships. Categories follow common modern meanings rather than necessarily reflecting ancient usage.

识别使用离线模板匹配，并非训练式甲骨文OCR模型。字形裁剪居中、保比例归一化，允许左右镜像比较，但"左""右"除外。同字变体按形态聚类排序，人工指定代表图优先。相似关系和分数仅为检索线索，不是释读置信度或字源关系。主题分类依据现代常见义，不代表甲骨文时代的原义。


### Additional headword / 补充字条

Added all 10 oracle-bone glyphs from CUHK’s 㞢 entry. Searches for 有 and 佑 also find 㞢 and 又; usage links do not relabel the original glyphs.

收录香港中文大学[㞢字条](https://humanum.arts.cuhk.edu.hk/Lexis/lexi-mf/search.php?word=%E3%9E%A2)的全部10幅甲骨字形；有、佑亦可检索㞢和又，保留原始字名及来源。

### Additional chart sources / 补充对照表来源

[Shufami oracle-bone surname chart](http://jiaguwen.shufami.com/baijiaxing.html): user-provided image used for the 180 reviewed cells. Calligraphic redrawings generated by the Shufami dictionary are excluded from display and matching.

[书法迷甲骨文百家姓](http://jiaguwen.shufami.com/baijiaxing.html)：用户提供的无水印图用于180格已审校字形。书法迷字典生成的书法化重绘字形不用于展示及匹配。


### Pinyin chart update / 拼音对照表更新

The pinyin chart images are cropped from user-provided watermark-free Shufami screenshots. Captions are mapped directly from its HTML, with original image URLs retained. The Beijing Municipal Education Commission page is also linked as a corresponding reprint source. The surname chart carries both references as well. Source labels are not independent scholarly verification of decipherment.

拼音对照表采用用户提供的书法迷无水印截图，文字标签直接对应网页HTML，并保留每幅图的原图地址；同时链接北京市教委转载页面作为对应资料来源。此前姓氏对照表也保留这两处来源。来源标签不代表已独立验证其甲骨学释读。

- [书法迷拼音目录](http://jiaguwen.shufami.com/type/)
- [书法迷百家姓](http://jiaguwen.shufami.com/baijiaxing.html)
- [北京市教委转载页面](https://jw.beijing.gov.cn/language/ywsh/201901/t20190103_1056839.html)

## Use and rights / 使用与权利说明

Retain the provenance of individual glyphs when citing them. This site's compilation, processing, and search features do not alter the rights in the original materials.

请在引用时同时保留具体字形的来源信息。本站的整理、加工和检索功能不改变原始资料的权利归属。

For personal use by enthusiasts only; please do not use commercially. If any content infringes your rights, please contact the site creator to request its removal.

仅供爱好者个人使用，请勿商用。如有内容侵犯您的权益，请联系网站制作者删除。

