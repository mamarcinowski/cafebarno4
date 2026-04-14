from pathlib import Path
import re

root = Path(r'c:\Projects\priv\cafebarno4')
src = root / 'src'

for fname in ['index.html', 'style.css', 'script.js']:
    content = src.joinpath(fname).read_text(encoding='utf-8')
    root.joinpath(fname).write_text(content, encoding='utf-8')

css_text = src.joinpath('style.css').read_text(encoding='utf-8')
css_text = re.sub(r'/\*.*?\*/', '', css_text, flags=re.S)
css_text = re.sub(r'\s+', ' ', css_text)
css_text = re.sub(r'\s*([{}:;,])\s*', r'\1', css_text)
css_text = re.sub(r';}', '}', css_text).strip()
root.joinpath('style.css').write_text(css_text, encoding='utf-8')

js_text = src.joinpath('script.js').read_text(encoding='utf-8')

quote_chars = ('"', "'", chr(96))

def minify_js(code):
    out = []
    state = 'normal'
    quote = ''
    escaped = False
    i = 0
    while i < len(code):
        c = code[i]
        nxt = code[i+1] if i+1 < len(code) else ''
        if state == 'normal':
            if c in quote_chars:
                out.append(c)
                state = 'string'
                quote = c
                escaped = False
            elif c == '/' and nxt == '/':
                i += 2
                while i < len(code) and code[i] not in '\r\n':
                    i += 1
                continue
            elif c == '/' and nxt == '*':
                i += 2
                while i+1 < len(code) and not (code[i] == '*' and code[i+1] == '/'):
                    i += 1
                i += 2
                continue
            elif c.isspace():
                if out and not out[-1].isspace():
                    j = i
                    while j < len(code) and code[j].isspace():
                        j += 1
                    if j < len(code):
                        nxt2 = code[j]
                        if (out[-1].isalnum() or out[-1] in '_$') and (nxt2.isalnum() or nxt2 in '_$'):
                            out.append(' ')
            else:
                out.append(c)
        else:
            out.append(c)
            if escaped:
                escaped = False
            elif c == '\\':
                escaped = True
            elif c == quote:
                state = 'normal'
        i += 1
    return ''.join(out)

root.joinpath('script.js').write_text(minify_js(js_text), encoding='utf-8')
print('root files restored and minified')
