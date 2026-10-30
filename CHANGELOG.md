# Changelog / 更新记录

This retrospective records major changes documented during development. Early work is grouped by topic because exact release dates and version boundaries were not consistently recorded; it is not a complete commit history. Version numbers below identify distributed offline packages.

本记录回顾开发过程中有据可查的主要改进。早期工作因未持续记录准确发布日期和版本边界，按主题归纳，不作为完整提交历史。下列版本号对应分发的离线包。

## v280 — CUHK gap filling / 中大字例补缺

- Added five CUHK oracle images: 育 (3) and 能 (2). Their original files and bibliographic captions are retained. These variants now participate in handwriting matching and the similarity network, taking priority over supplementary dataset variants.
- Removed black side margins from 育; inverted 能 to black strokes on white. All five untouched originals remain available for comparison.
- Total searchable forms: 9,810; simplified/traditional groups: 1,852. The next source request returned HTTP 503; remote requests stopped without retry. The official statistics page reports 1,150 oracle headwords, but a complete inventory has not been verified.

- 补入育3幅、能2幅中大甲骨原图，保留出处及未经处理的原图，加入手写检索和相似网络；同字展示优先于扩展来源。
- 育裁去两侧黑边，能反色为白底黑线。总计9810幅、1852个繁简字组。
- 后续请求收到HTTP 503，已停止且未快速重试。官方统计1150个甲骨字头，但本轮未完成全库覆盖核验。

## v279 — Supplementary oracle integration / 扩展甲骨入库

- Integrated 5,103 oracle forms after excluding six exact duplicates within canonical groups: now 9,805 forms in 1,852 simplified/traditional groups (+721). Variants participate in character details, handwriting matching and the rebuilt similarity network; existing curated representatives retain priority. Bronze and clerical forms remain reference-only.
- Checked bitmap validity and filename/label agreement; this is not scholarly review. Original bitmaps and source labels are retained. The upstream README attributes the dataset to Leon Si and declares MIT licensing.
- Additional CUHK spot checks found 育 (3 oracle images) and 能 (2), pending direct image acquisition; 作 and 使 had no oracle images in the inspected pages. This is not a complete CUHK inventory audit.

- 本地扩展库甲骨部分去除6幅同字像素一致重复图，纳入5103幅；现可检索9805幅、1852个繁简字组（新增721组）。扩展图加入详情、手写匹配与重算的相似网络；原有人工代表图优先，金文和隶书仅作参考。
- 已检查位图有效性及文件名字头一致性，不等同于逐字释读审校。保留原图与来源标签。
- 中大抽查发现育3幅、能2幅甲骨图尚待补采；作、使所查页面未列甲骨图。本次不宣称中大全库已补齐。

## v278 — Source coverage audit / 来源覆盖核验

- Checked 281 CUHK oracle component names against v277; inspected source pages for 17 absent character names and 屋. Component names alone do not constitute a complete inventory of oracle characters or glyph variants.
- Added 叀 (2 glyphs) and 爿 (1 glyph), with untouched originals, source URLs, handwriting entries, categories, and updated incoming/outgoing similarity edges. 爿 uses a cropped, inverted dark panel with detached scan noise removed; the raw original remains available for comparison.
- 屋 has a CUHK character page but its oracle section contained no images when checked; images from other historical scripts were not imported as oracle glyphs.
- Active collection: 4,702 glyphs and 1,131 simplified/traditional groups. The detailed checked-page list is in assets/source-audit/cuhk-2026-10-29.csv. This release does not claim complete CUHK coverage.

- 比对中大甲骨目录的281个部件名称，逐页核验缺少的17个字头及用户提出的“屋”；部件名称不等于全部甲骨字头及异体图清单。
- 补入叀2幅、爿1幅，保留未经处理的原图与来源，更新手写索引、分类及双向网络邻居。爿仅裁取黑底区域反色并清除分离噪点，可展开原图核对。
- 中大“屋”字条的甲骨栏在核验时为空；未将其他文字时期的图片误作甲骨文加入。
- 当前有效图库4702幅、繁简合并后1131组。核验清单见assets/source-audit/cuhk-2026-10-29.csv；本版不表示已完成中大全库补齐。

## v277 — Reusable index and disconnected-stroke matching / 索引复用与分离笔画匹配

- Skip descriptor preparation after successful initialization in the same page session. Later searches still display matching progress; refreshing the page prepares the index again.
- Compare component geometry without choosing a dominant stroke, which can change with pen width and rasterization. Contour and skeleton scores remain in the fused score but no longer occupy separate rank-tier slots; six score groups are merged.
- Development replay of the supplied screenshots: 川 ranks 16th and 水 8th in the merged results. These are targeted checks, not an independent accuracy benchmark.

- 同一页面成功准备索引后，后续搜索直接复用，不再重复准备循环及首次搜索提示；每次仍显示匹配进度，刷新页面后需重新准备。
- 分离笔画改为比较位置、长宽及数量，不再依赖可能因笔粗或栅格化而换位的最大笔画。轮廓与骨架保留在融合评分中，不再单独占用名次层；共合并六组评分。
- 所提供截图的开发复测：川排第16、水排第8。仅为针对性检查，不代表独立准确率测试。

## v276 — Persistent search results and detail layout / 搜索结果保留与详情布局

- Keep recognition candidates and expanded pages when selecting a glyph; remove the duplicated top-result and current-selection cards.
- Place graph explanations immediately below the graph, followed by character details and original-image controls, then the supplementary collection.
- Suppress redundant source links within CUHK original-image disclosure, retaining the character-page link in the main detail.

- 点击识别候选时保留候选列表及已展开数量，移除重复的首位候选卡片和当前选中字卡片。
- 关系图说明紧接图下，其后为当前字详情及原图按钮，再下方为扩展字库。
- 中大原图展开区域不再重复附来源链接，保留主详情中的字库页面入口。

## v275 — Disconnected strokes and relevant results / 分离笔画与结果区修正

- Added a general component matcher comparing the dominant stroke and relative locations and sizes of disconnected strokes. Included it in rank-tier aggregation; no character-specific promotion is used.
- Removed the default first-90-character list. After graph selection, the loaded result area shows only the selected character; an empty text query no longer displays unrelated entries.
- Replayed the supplied 水 screenshot as a development example. This is a targeted regression check, not an independent handwriting-accuracy benchmark.

- 增加通用的分离笔画结构比较，比较主笔画及分离短笔画的相对位置和大小，纳入按名次分层合并，不按特定字提权。
- 移除默认前90字列表；选字后，已加载的结果区仅显示当前字，空文字查询不再显示无关字条。
- 用用户提供的"水"手写截图进行复测；这是针对性回归检查，不代表独立手写识别准确率。

## v274 — Network-first startup and search navigation / 网络优先启动与搜索定位

- Defer the recognition metadata script and full search image preparation until the first text, handwriting, or image search. The startup overlay now waits for the graph, not the search index.
- Reuse compact Blob URLs for graph atlas rendering and use set-based category deduplication. Recognition retains the embedded image path for offline canvas compatibility.
- Category search reveals hidden results, opens their category, centers its internal scroll position on the selected character, and scrolls the page to the graph center. Supports supplementary-plane characters.
- Similarities remain precomputed: selection redraws two rings; the 32 setting limits the inner ring, with up to two additional neighbors per inner-ring character.

- 文字、手写、图片搜索首次使用时才载入识别元数据和准备整库检索图片；启动遮罩仅等待关系图。
- 网络图使用可复用的短 Blob 地址呈现图集，分类去重改用集合；识别保留内嵌图片路径以兼容离线画布读取。
- 分类搜索补显尚未展开的结果、展开对应类别，将分类内部滚动定位到选中字，再将页面滚至关系图中心；支持扩展区汉字。
- 相似关系仍为预计算，选字时重画两圈；32限制内圈数量，外圈每个内圈字最多再取2个邻居。

## v273 — Contextual supplementary glyphs / 扩展字形随选字显示

- Loading the supplementary collection immediately shows the current graph character. Graph navigation and recognition-candidate selection update the expanded glyphs; text searches remain supported. Lookup includes configured simplified/traditional counterparts with duplicate forms removed.
- Hide the mirror-matching option in text search; retain it for handwriting and image recognition.

- 载入扩展字库后立即显示关系图当前字的扩展字形；切换中心字及选择识别候选时同步更新，仍支持文字输入检索。查询已配置的繁简对应字并去除重复字形。
- 文字搜索页隐藏镜像匹配选项，手写及图片识别页保留。

## v272 — Offline loading compatibility / 离线加载兼容修复

- Restored embedded atlas image URLs to avoid file-origin canvas readback restrictions introduced by v271's external images. Retained on-demand supplementary data and first-search recognition feature preparation.
- Retained responsive mobile graph sizing and drawing-toolbar spacing. Synchronized README editorial changes from GitHub before adding current usage notes.
- v271 is superseded: its external-atlas optimization was rolled back; this release does not retain the 3.1 MB homepage claim.

- 恢复内嵌图集图片地址，避免 v271 外部图片在本地文件模式下触发画布像素读取限制；保留扩展数据按需载入及首次搜索准备识别特征。
- 保留手机关系图自适应和画板工具栏间距。先同步 GitHub 上的 README 编辑，再补充当前使用说明。
- 本版替代 v271：撤回外部图集优化，不再沿用首页3.1 MB的描述。

## v270 — Documentation of contributions / 贡献说明整理

- Expanded the README with human review, source comparison, image repair, collection organization, similarity-search development, and iterative testing contributions.
- Corrected outdated descriptions of the recognition methods and early collection counts; grouped supplementary source notes separately from rights information.
- Added this retrospective. This release changes documentation only; application behavior remains as in v269.

- 在 README 中补充人工审校、来源对照、图像修复、字库组织、相似检索开发与反复测试的贡献说明。
- 更新过时的识别方法和早期字库数量说明，将补充来源与权利说明分开整理。
- 新增本回顾记录。本版仅更新文档，网页功能沿用 v269。

## v268–v269 — Automatic recognition aggregation / 自动综合识别

- Replaced the method selector with automatic execution of seven template comparisons. Each method first produces a unique-character ranking using configured simplified/traditional correspondences.
- Merge rank 1 across methods, then rank 2, and so on; prioritize candidates supported by more methods within the same rank tier and omit already emitted characters. Ties retain method traversal order. Raw distances from different methods are not added together.
- Display eight candidates per row, initially sixteen, with sixteen more per click. Show animated progress during computation.
- Removed candidate rank/method-count captions in v269 at the user's request.

- 移除方法选择框，自动运行七种模板比较；先按已配置的繁简对应关系，将每种方法的结果归并为不重复字条排名。
- 先合并各方法第1名，再合并第2名，依次类推；同一名次层内获更多方法支持者优先，已输出的字不重复出现。同票保留方法遍历顺序，不直接相加不同方法的距离值。
- 候选每行8个，首次16个，每次可展开16个；计算期间展示动画进度。
- v269 按用户反馈删去候选下方的名次与方法数量提示。

## Recognition and graph refinement / 识别与关系图改进

- Expanded contour, skeleton, projection, and fusion matching with aspect-ratio, small-rotation, and local-proportion tolerance. Position and size normalization reduce sensitivity to canvas placement.
- Evaluated transformations of stored glyphs and specific hand-drawn examples, including 高 and 右. These were development checks, not independent estimates of general handwriting accuracy. Templates retained in the gallery make transformed-template tests easier than unseen handwriting.
- Preserved the exception that 左 and 右 are not matched by arbitrary horizontal reflection. A synthetic 右 illustration derived from 左 remains explicitly labeled.
- Removed duplicate simplified/traditional labels among graph neighbors and made original-headword labels conditional on a merged group containing different original labels.
- Corrected the reported 至 image processing issue in v267.

- 在轮廓、骨架、投影及融合比较基础上，加入宽高比例、小角度旋转与局部比例容错；通过位置和尺寸归一化减弱画布位置影响。
- 用字库字形变换及包括"高"、"右"在内的手绘实例检查并改进。这些属于开发验证，不是对一般手写准确率的独立估计；原模板仍在库中的变换测试比未知手写更容易。
- 保留"左""右"不任意镜像匹配的例外；由"左"翻转得到的"右"示意图继续明确标注为合成。
- 关系图相邻字按繁简归并后去重；仅当合并字条存在不同来源字头时显示原字头标签。
- v267 修正用户指出的"至"字图像处理问题。

## Source curation and image processing / 来源整理与图像处理

- Prioritized CUHK mappings after errors were identified in the original phone-screenshot recognition. Supplementary labels were reviewed through spreadsheets and an HTML tool with row-based layout and save support; unreadable entries were excluded pending confirmation.
- Compared Beijing Municipal Education Commission charts, Jyangkul copies, and Shufami chart material. Higher-quality or watermark-free copies were used where available. The thick calligraphic redrawings generated by the Shufami dictionary were excluded from display and matching.
- Revisited surname-chart segmentation, including reports of clipped 宠 and 霍; adjusted crop boundaries and margins. Original-image access and image-level provenance were added to aid inspection. Source defects and uncertain readings must not be silently treated as repaired historical evidence.
- Revisited dark-background inversion and noise removal after reports involving 冀, 丽, 尿, 尚, 李, 報, 至, and other glyphs. Preserved access to originals to expose processing differences.
- Merged simplified/traditional entries such as 丑/醜 and display both forms in merged detail headings. Retained multiple glyph variants and source labels rather than discarding legitimate variation.
- Added configured lookup links for 㞢, 有, 佑, and 又 without silently renaming the original glyphs; distinguished related-character lookup from proof of identical readings.

- 原始手机截图识别出现错误后，优先采用香港中文大学对应关系；通过 Excel 和带暂存功能的逐行 HTML 工具审校补充标签，无法确认的条目先不入库。
- 比较北京市教委对照表、Jyangkul 副本和书法迷图表，采用可获得的更清晰或无水印版本；排除书法迷字典生成的粗笔画书法化重绘字形。
- 针对"宠""霍"等被截断的反馈，复查姓氏图切割并调整边界与留白；补充查看原图及图片级来源信息，方便核查。原图缺损和存疑释读不能被默认为已经修复的历史证据。
- 根据"冀""丽""尿""尚""李""報""至"等反馈复查黑底反色与去噪，保留原图入口以便比较加工前后差异。
- 归并"丑/醜"等繁简字条，并在合并详情标题显示两种形式；保留同字异形和来源标签，不将合理字形差异一并删除。
- 增加"㞢""有""佑""又"的已配置检索关联，保留原始字名，区分相关字检索与释读完全相同的判断。

## Interface and offline delivery / 界面与离线交付

- Developed the visual-similarity network as the main interface, with 王 as the initial center and a manually chosen CUHK representative. Added adjustable neighbor count, history navigation, and layout refinements.
- Added simplified/traditional display, category expansion/collapse, handwriting-first search tabs, undo and erase tools, original-image disclosure, and loading feedback.
- Iteratively repaired resource-loading and packaging issues. Reduced package size using lossless image conversion and removal of unused assets while keeping required offline resources and original-image inspection.
- Added bilingual documentation, source references, limitations, and rights notices. The network expresses visual similarity, not established etymology; recognition runs locally without a trained OCR service.

- 以视觉相似关系网络为主要界面，初始中心为"王"并人工指定中大代表字形；增加相似字数量设置、历史导航及布局调整。
- 增加繁简显示、分类展开收起、默认手写识别页、撤销与擦除、原图展开及载入反馈。
- 反复修复资源加载与打包问题；采用无损图像转换并去除无用资源，精简包体，同时保留必要离线资源及原图查看能力。
- 增加双语说明、数据来源、局限与使用权利提示。网络展示视觉相似性，不代表已证实的字源关系；识别在本地运行，不依赖训练式 OCR 服务。

