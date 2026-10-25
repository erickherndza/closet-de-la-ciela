"""Pre-zip check: Shopify silently drops a template when a section setting is rejected on import
(home became a 404 in v9). Flags the usual causes. Run: python3 tools/check_theme_json.py"""
import glob, json, re, sys
bad = []
for f in glob.glob('shopify-theme/templates/*.json') + glob.glob('shopify-theme/sections/*.json'):
    def walk(o, path):
        if isinstance(o, dict):
            for k, v in o.items(): walk(v, path + [k])
        elif isinstance(o, str) and len(o) > 255:
            bad.append(f'{f}: {"/".join(path)} has {len(o)} chars (>255)')
    walk(json.load(open(f)), [])
for f in glob.glob('shopify-theme/sections/*.liquid'):
    m = re.search(r'{%\s*schema\s*%}(.*?){%\s*endschema\s*%}', open(f).read(), re.S)
    for s in json.loads(m.group(1)).get('settings', []):
        if s.get('default') == '': bad.append(f'{f}: setting {s["id"]} has an empty default')
        if s.get('type') == 'url' and str(s.get('default', '')).startswith('http'): bad.append(f'{f}: setting {s["id"]} has an external url default')
print('\n'.join(bad) or 'ok')
sys.exit(1 if bad else 0)
