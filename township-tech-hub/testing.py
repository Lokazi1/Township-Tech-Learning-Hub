"""
Test suite for the Township Tech Hub website — Python/pytest version.
Run with:
    pip install pytest
    pytest test_site.py -v
"""
import re
from pathlib import Path

import pytest

BASE_DIR = Path(__file__).parent

# ─────────────────────────────────────────────
# Fixtures — read each file once, fail clearly if missing
# ─────────────────────────────────────────────
@pytest.fixture(scope="module")
def html():
    path = BASE_DIR / "index.html"
    if not path.exists():
        pytest.fail(f"index.html not found at {path} — check this test file's location")
    return path.read_text(encoding="utf-8")


@pytest.fixture(scope="module")
def css():
    path = BASE_DIR / "styles.css"
    if not path.exists():
        pytest.fail(f"styles.css not found at {path}")
    return path.read_text(encoding="utf-8")


@pytest.fixture(scope="module")
def js():
    path = BASE_DIR / "script.js"
    if not path.exists():
        pytest.fail(f"script.js not found at {path}")
    return path.read_text(encoding="utf-8")


# ─────────────────────────────────────────────
# HTML structure (7 tests)
# ─────────────────────────────────────────────
def test_links_to_external_styles_and_script(html):
    assert re.search(r'href="styles\.css"', html)
    assert re.search(r'src="script\.js"', html)


def test_has_exactly_one_h1(html):
    matches = re.findall(r"<h1[\s>]", html)
    assert len(matches) == 1


def test_every_section_has_a_top_level_heading(html):
    sections = re.findall(r"<section[\s\S]*?</section>", html)
    assert len(sections) > 0
    for section in sections:
        assert re.search(r"<h1|<h2", section)


def test_declares_mobile_safe_viewport(html):
    assert re.search(r'<meta name="viewport" content="[^"]*width=device-width[^"]*"', html)


def test_hero_cta_and_journey_section_are_linked_by_anchor(html):
    assert 'href="#learn"' in html
    assert 'id="learn"' in html


def test_declares_utf8_charset(html):
    """Exception guard: without this, em-dashes/curly quotes can render as mojibake."""
    assert re.search(r'<meta charset="UTF-8">', html, re.IGNORECASE)


def test_every_svg_illustration_has_an_accessible_label(html):
    svgs = re.findall(r"<svg[^>]*>", html)
    assert len(svgs) > 0
    for tag in svgs:
        assert re.search(r'aria-label="[^"]+"', tag)


# ─────────────────────────────────────────────
# Content counts (3 tests)
# ─────────────────────────────────────────────
def test_contains_exactly_4_mindset_flip_cards(html):
    assert html.count('class="flip-card"') == 4


def test_contains_exactly_6_curriculum_modules(html):
    assert html.count('class="mod"') == 6


def test_contains_exactly_5_journey_steps(html):
    assert html.count('class="step"') == 5


# ─────────────────────────────────────────────
# Hygiene / exception tests (3 tests)
# ─────────────────────────────────────────────
def test_no_leftover_todo_or_fixme_markers(html):
    assert not re.search(r"TODO|FIXME", html, re.IGNORECASE)


def test_no_dead_empty_href_links(html):
    assert 'href=""' not in html


def test_flip_cards_are_native_keyboard_accessible_buttons(html):
    """Exception case: divs pretending to be buttons need manual keyboard
    handling and are easy to get wrong — see the QA finding on this project.
    Confirms the fix (native <button>) is still in place."""
    cards = re.findall(r'<button[^>]*class="flip-card"[^>]*>', html)
    assert len(cards) == 4
    for tag in cards:
        assert 'type="button"' in tag


# ─────────────────────────────────────────────
# script.js — static logic checks (4 tests)
# ─────────────────────────────────────────────
def test_script_defines_init_flip_cards_function(js):
    assert re.search(r"function\s+initFlipCards\s*\(", js)


def test_script_toggles_on_class_and_aria_pressed(js):
    assert "classList.toggle" in js
    assert "aria-pressed" in js


def test_script_guards_against_missing_root_argument(js):
    """Exception case: calling initFlipCards() with no argument must not crash."""
    assert re.search(r"root\s*=\s*root\s*\|\|\s*document", js)


def test_script_has_no_leftover_keydown_handling(js):
    """Regression: native <button> handles Enter/Space natively — a
    leftover manual keydown handler would be dead code duplicating that."""
    assert "keydown" not in js


# ─────────────────────────────────────────────
# styles.css — static checks (3 tests)
# ─────────────────────────────────────────────
def test_css_defines_core_palette_variables(css):
    for var in ("--night", "--gold", "--coral", "--paper"):
        assert var in css


def test_css_includes_a_mobile_responsive_breakpoint(css):
    assert re.search(r"@media\s*\(max-width:\s*\d+px\)", css)


def test_css_flip_card_has_no_leftover_tabindex_role_styling_conflicts(css):
    """Regression: since flip cards became native <button>s, there should be
    no CSS still targeting the old div[role="button"] pattern."""
    assert 'role="button"' not in css
