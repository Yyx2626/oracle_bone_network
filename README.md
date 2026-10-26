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

The home graph starts with 王 at the center. It shows 12 similar characters by default, adjustable from 1 to 32. Click a glyph to recenter the graph; "后退 / Back" and "前进 / Forward" navigate browsing history. Image and freehand search offer four experimental methods: contour, skeleton, regional projection, and fusion.

首页以"王"为中心。关系图默认显示12个相似字，可输入1–32调整；点击字形可切换中心，"后退 / Back"和"前进 / Forward"可浏览历史记录。图片识别与手写识别支持轮廓、骨架、分区投影及融合四种实验方法。

## Data sources and references / 数据来源与参考

1. **CUHK Multi-function Chinese Character Database / 香港中文大学"汉语多功能字库"**  
   https://humanum.arts.cuhk.edu.hk/Lexis/lexi-mf/  
   Oracle bone component index / 甲骨部件表: https://humanum.arts.cuhk.edu.hk/Lexis/lexi-mf/oraclePiece.php
   The primary source for glyphs and their character mappings. Cards retain source links. Display images may differ from the originals because of cropping, inversion, and noise reduction.  
   主字库的主要字形及现代字对应来源。字卡保留具体来源链接；本地显示图经过裁剪、反色、去噪等处理，可能与原图不同。

2. **User-supplied, individually reviewed screenshots / 用户提供并逐图审校的截图**  
   Only 50 individually reviewed glyphs, covering 40 modern characters, were restored from the initial twelve screenshot pages. Unreviewed screenshots remain disabled. These images must not be attributed to CUHK; their earlier publication provenance is not fully established.  
   最初十二页截图仅恢复经用户审校的50幅字形（40个现代字）；其他未审校截图停用。截图不应被误标为中大原图，其更早出版来源尚未完整确认。

3. **Third-party supplementary reference collection / 第三方扩展参考字库**  
   https://github.com/leonsilicon/character-evolution-dataset-1bit  
   Used in the separate supplementary reference section and containing forms from different periods. Unreviewed supplementary glyphs are excluded from the main handwriting matcher and graph. Not every image should be treated as a typical oracle bone form. Consult the original repository for licensing and attribution requirements.  
   供独立扩展参考区使用，含不同时代字形。未审校的扩展字形不参与主字库的手绘匹配和关系图；不能把其中所有图都视为典型甲骨文。相关许可及署名要求以原仓库为准。

4. **CCDI "A Character a Day" articles / 中央纪委国家监委网站"每日一字"**  
   Character index / 字目索引: http://m.ccdi.gov.cn/content/cc/2e/16132.html
   Reference for 萬 / "万"参考: http://m.ccdi.gov.cn/content/90/71/16842.html
   Reference for 零 / "零"参考: https://m.ccdi.gov.cn/content/2e/b6/16713.html
   Used as leads for coverage checks and etymological context, not as proof that all illustrated forms have been verified and included. Searching 零 shows the related rain-associated character 霝, without labeling it as the oracle bone form of the numeral zero.  
   用于补缺线索及字源说明，不作为全部图片已核验收录的证明。"零"关联显示库中雨义的"霝"，不将其标成数字0的甲骨写法。

## Coverage and processing / 数据范围与加工

As of 2026-10-23, the main collection contains 2,944 active glyphs, including 2,883 attributed to CUHK and 50 reviewed screenshot glyphs; the remaining records retain their own source labels. There are 1,122 raw character labels; interface counts may differ after merging variants. At the user's request, a mirrored 左 glyph is provided as an explicitly labeled synthetic illustration for 右, not as an original CUHK oracle bone image of 右.

截至2026-10-23，主库有2,944幅有效字形，其中中大来源2,883幅、人工审校截图50幅；其余保留各自来源标记。原始标签有1,122个，界面归并后的计数可能不同。依用户建议，以"左"的字形镜像生成了"右"的示意图，明确标注为合成示意，不是中大提供的"右"字甲骨原图。

Image processing detects full or partial dark backgrounds, crops them, and aims to produce black strokes on white. Thresholding and small-component filtering reduce gray background noise. Automatic processing can mistake thick strokes, frames, or rubbing textures for background. Compare processed images with the originals when checking a glyph.

反色处理会检测整幅或局部黑底，裁剪后统一为白底黑线；二值阈值和小连通域过滤用于减弱灰底噪音。自动处理可能误判粗笔画、边框或拓片纹理。原图与处理图应对照核查。

Recognition uses offline template matching, not a trained oracle bone OCR model. Glyphs are cropped, centered, and normalized while preserving aspect ratio. Mirror matching is allowed except for 左 and 右. Variants are ordered by shape clusters, with manually selected representatives taking precedence. Similarities and scores are search aids, not reading probabilities or etymological relationships. Categories follow common modern meanings rather than necessarily reflecting ancient usage.

识别使用离线模板匹配，并非训练式甲骨文OCR模型。字形裁剪居中、保比例归一化，允许左右镜像比较，但"左""右"除外。同字变体按形态聚类排序，人工指定代表图优先。相似关系和分数仅为检索线索，不是释读置信度或字源关系。主题分类依据现代常见义，不代表甲骨文时代的原义。

## GitHub Pages deployment / GitHub Pages 部署

Upload `index.html`, the complete `assets` folder, and `favicon.ico` to the repository's publishing directory. Include this README as `README.md` for visitors. Enable GitHub Pages in repository Settings > Pages, selecting the publishing branch and directory (for example, `main` and `/ (root)`). Share the generated Pages URL; uploading files alone does not enable the website. No server API or build step is required.

将 `index.html`、完整的 `assets` 文件夹和 `favicon.ico` 上传到仓库发布目录；将本说明命名为 `README.md`，方便访客阅读。在仓库 Settings > Pages 中启用 GitHub Pages，选择发布分支及目录（例如 `main` 和 `/ (root)`），然后分享生成的 Pages 网址。仅上传文件不会自动启用网页；本站不需要服务器 API 或构建步骤。

### Additional headword / 补充字条

Added all 10 oracle-bone glyphs from CUHK’s 㞢 entry. Searches for 有 and 佑 also find 㞢 and 又; usage links do not relabel the original glyphs.

收录香港中文大学[㞢字条](https://humanum.arts.cuhk.edu.hk/Lexis/lexi-mf/search.php?word=%E3%9E%A2)的全部10幅甲骨字形；有、佑亦可检索㞢和又，保留原始字名及来源。


## Use and rights / 使用与权利说明

Retain the provenance of individual glyphs when citing them. This site's compilation, processing, and search features do not alter the rights in the original materials.

请在引用时同时保留具体字形的来源信息。本站的整理、加工和检索功能不改变原始资料的权利归属。

For personal use by enthusiasts only; please do not use commercially. If any content infringes your rights, please contact the site creator to request its removal.

仅供爱好者个人使用，请勿商用。如有内容侵犯您的权益，请联系网站制作者删除。
