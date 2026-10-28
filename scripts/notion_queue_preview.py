#!/usr/bin/env python3
"""Read-only preview for GuideHollow Pick's separate Notion queue.

Never stages, publishes, or changes a Notion page. Only manually invoked
workflow uses live Notion credentials.
"""
import argparse
import json
import os
import re
import sys
from urllib.error import HTTPError, URLError
from urllib.request import Request, urlopen

DATA_SOURCE_ID = "28c3c89a-de0d-48a1-9d32-85431590ed62"
VALID_CATEGORIES = {"생활가전", "청소·집안관리", "주방·살림"}
SLUG_RE = re.compile(r"^[a-z0-9]+(?:-[a-z0-9]+)*$")


def prop(page, name):
    return page.get("properties", {}).get(name, {})


def plain_text(items):
    return "".join(item.get("plain_text", "") for item in (items or []))


def candidate(page):
    p = lambda n: prop(page, n)
    title = plain_text(p("제목").get("title", []))
    slug = plain_text(p("슬러그").get("rich_text", []))
    state = (p("상태").get("status") or {}).get("name", "")
    cat = (p("카테고리").get("select") or {}).get("name", "")
    order = p("발행순서").get("number")
    checked = p("품질검수 완료").get("checkbox") is True
    problems = []
    if not isinstance(order, (int, float)) or order <= 0 or order != int(order):
        problems.append("invalid_order")
    if not title.strip():
        problems.append("missing_title")
    if not SLUG_RE.fullmatch(slug):
        problems.append("invalid_slug")
    if cat not in VALID_CATEGORIES:
        problems.append("invalid_category")
    if not checked:
        problems.append("not_approved")
    return {"page_id": page.get("id", ""), "order": order, "title": title,
            "slug": slug, "state": state, "category": cat,
            "ready": not problems, "problems": problems}


def evaluate(rows):
    seen_orders, seen_slugs = set(), set()
    ordered = sorted((candidate(row) for row in rows),
                     key=lambda p: (p["order"] if isinstance(p["order"], (int, float)) else float("inf"), p["page_id"]))
    for row in ordered:
        if row["order"] in seen_orders:
            row["ready"] = False
            row["problems"].append("duplicate_order")
        seen_orders.add(row["order"])
        if row["slug"] in seen_slugs:
            row["ready"] = False
            row["problems"].append("duplicate_slug")
        seen_slugs.add(row["slug"])
    return ordered


def query_pages(token):
    url = "https://api.notion.com/v1/data_sources/" + DATA_SOURCE_ID + "/query"
    cursor, pages = None, []
    while True:
        body = {"filter": {"property": "상태", "status": {"equals": "발행대기"}},
                "page_size": 100,
                "sorts": [{"property": "발행순서", "direction": "ascending"}]}
        if cursor:
            body["start_cursor"] = cursor
        req = Request(url, data=json.dumps(body).encode("utf-8"),
                      headers={"Authorization": "Bearer " + token,
                               "Notion-Version": "2025-09-03",
                               "Content-Type": "application/json"},
                      method="POST")
        with urlopen(req, timeout=20) as response:
            payload = json.load(response)
        pages.extend(payload.get("results", []))
        if len(pages) > 1000:
            raise RuntimeError("Queue exceeds safe read-only preview limit")
        cursor = payload.get("next_cursor")
        if not payload.get("has_more") or not cursor:
            break
    return pages


def self_test():
    def row(title, slug, order, approved=True):
        return {"id": "demo-" + str(order),
                "properties": {
                    "제목": {"title": [{"plain_text": title}]},
                    "슬러그": {"rich_text": [{"plain_text": slug}]},
                    "발행순서": {"number": order},
                    "상태": {"status": {"name": "발행대기"}},
                    "카테고리": {"select": {"name": "생활가전"}},
                    "품질검수 완료": {"checkbox": approved}}}
    out = evaluate([row("검증한 구매 가이드", "buying-guide", 2),
                    row("검수 전 원고", "unverified-guide", 1, False)])
    assert len(out) == 2 and out[0]["order"] == 1 and not out[0]["ready"]
    assert out[1]["order"] == 2 and out[1]["ready"]
    assert evaluate([row("A", "repeat", 3), row("B", "repeat", 4)])[1]["problems"] == ["duplicate_slug"]
    print("Read-only queue parser self-test passed")


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--self-test", action="store_true")
    args = parser.parse_args()
    if args.self_test:
        self_test()
        return 0
    token = os.getenv("NOTION_PICK_TOKEN")
    if not token:
        print("NOTION_PICK_TOKEN is missing: add a secret for this repository before manual preview.", file=sys.stderr)
        return 2
    try:
        rows = evaluate(query_pages(token))
    except (HTTPError, URLError, TimeoutError) as exc:
        print("Notion preview failed: " + type(exc).__name__ +
              " (verify integration access to the Pick database)", file=sys.stderr)
        return 3
    print(json.dumps({"mode": "read_only", "data_source_id": DATA_SOURCE_ID,
                      "waiting": len(rows), "approved": sum(row["ready"] for row in rows),
                      "candidates": rows[:10]}, ensure_ascii=False, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
