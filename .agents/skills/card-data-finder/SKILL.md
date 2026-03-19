---
name: card-data-finder
description: 在新增卡牌时，从 PTCG-CHS 数据集中检索卡牌对象与 GitHub 图床链接。只要用户提到“查卡图”“查卡牌数据”“从 ptcg_chs_infos.json 匹配卡牌”“多个候选让我选”，都应使用此 skill。
---

# Card Data Finder

这个 skill 用于通过脚本更新远程数据集并检索卡牌，返回：

1) 匹配到的原始卡牌对象（JSON）
2) 对应 GitHub 图床 URL（`raw.githubusercontent.com`）

## 数据来源

- 元数据：`https://raw.githubusercontent.com/duanxr/PTCG-CHS-Datasets/main/ptcg_chs_infos.json`
- 图片路径来源于对象中的 `image` 字段，最终 URL 规则：
  - `https://raw.githubusercontent.com/duanxr/PTCG-CHS-Datasets/main/<image>`

## 脚本入口

- `scripts/resolve_card.py`

常用命令：

```bash
# 1) 更新本地缓存数据
python3 .agents/skills/card-data-finder/scripts/resolve_card.py update

# 2) 搜索卡牌（返回候选）
python3 .agents/skills/card-data-finder/scripts/resolve_card.py search "喷火龙"

# 3) 直接选择某个候选并返回对象
python3 .agents/skills/card-data-finder/scripts/resolve_card.py search "喷火龙" --select 1
```

## 标准流程

1. 执行 `update`，确保本地缓存是最新。
2. 执行 `search <query>` 获取候选。
3. 若 `total_matches == 0`：告知用户未命中，并建议补充关键信息（系列、编号、中文名）。
4. 若 `total_matches == 1`：直接返回 `selected.card` 与 `selected.image_url`。
5. 若 `total_matches > 1`：
   - 先把候选提炼成编号列表给用户选（至少展示 index、name、collection_name、collection_number、image_url）。
   - 用户选择后，再返回对应 `card` 对象与 `image_url`。

## 输出要求

- 不下载图片文件。
- 必须给出可直接访问的 GitHub 图床 URL。
- 返回对象要来自数据集记录（可带额外字段用于上下文，但不要伪造原字段）。

## 参考文档

- `references/workflow.md`：对话交互流程与返回格式
- `references/fields.md`：关键字段说明和展示建议
