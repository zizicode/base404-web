export function markdownToHtml(md: string): string {
  if (!md || typeof md !== 'string') return '';

  // Escape HTML special characters inside code blocks first.
  const codeBlocks: string[] = [];
  const inlineCodes: string[] = [];

  const extractBlock = (code: string): string => {
    const i = codeBlocks.length;
    codeBlocks.push(escapeHtml(code.trim()));
    return `\n<!--CODEBLOCK:${i}-->\n`;
  };

  const extractInline = (code: string): string => {
    const i = inlineCodes.length;
    inlineCodes.push(escapeHtml(code));
    return `<!--CODEINLINE:${i}-->`;
  };

  let html = md
    // Fenced code blocks
    .replace(/^```([\w]*)\n([\s\S]*?)```$/gm, (_, _lang, code) => extractBlock(code))
    // Inline code
    .replace(/`([^`]+)`/g, (_, code) => extractInline(code))
    // Headings
    .replace(/^###### (.*$)/gim, '<h6>$1</h6>')
    .replace(/^##### (.*$)/gim, '<h5>$1</h5>')
    .replace(/^#### (.*$)/gim, '<h4>$1</h4>')
    .replace(/^### (.*$)/gim, '<h3>$1</h3>')
    .replace(/^## (.*$)/gim, '<h2>$1</h2>')
    .replace(/^# (.*$)/gim, '<h1>$1</h1>')
    // Bold / italic
    .replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/___(.+?)___/g, '<strong><em>$1</em></strong>')
    .replace(/__(.+?)__/g, '<strong>$1</strong>')
    .replace(/_(.+?)_/g, '<em>$1</em>')
    // Links [text](url)
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
    // Images ![alt](url)
    .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" loading="lazy" />')
    // Blockquotes
    .replace(/^> (.*$)/gim, '<blockquote>$1</blockquote>')
    // Horizontal rule
    .replace(/^(-{3,}|\*{3,}|_{3,})$/gim, '<hr />');

  // Lists (unordered and ordered)
  html = parseLists(html);

  // Restore code blocks
  html = html
    .replace(/<!--CODEBLOCK:(\d+)-->/g, (_, i) =>
      `<pre><code>${codeBlocks[Number(i)]}</code></pre>`
    )
    .replace(/<!--CODEINLINE:(\d+)-->/g, (_, i) =>
      `<code>${inlineCodes[Number(i)]}</code>`
    );

  // Paragraphs: split by blank lines, wrap non-block lines.
  const blocks = html.split(/\n{2,}/).map((block) => block.trim()).filter(Boolean);
  const wrapped = blocks.map((block) => {
    if (/^<(h[1-6]|ul|ol|pre|blockquote|hr)/i.test(block)) return block;
    if (/^<\/p>/.test(block)) return block;
    return `<p>${block.replace(/\n/g, '<br />')}</p>`;
  });

  return wrapped.join('\n');
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function parseLists(md: string): string {
  const lines = md.split('\n');
  const out: string[] = [];
  let stack: { type: 'ul' | 'ol'; items: string[] } | null = null;

  const flush = () => {
    if (!stack) return;
    const tag = stack.type === 'ul' ? 'ul' : 'ol';
    out.push(`<${tag}>${stack.items.map((item) => `<li>${item.trim()}</li>`).join('')}</${tag}>`);
    stack = null;
  };

  for (const raw of lines) {
    const ul = raw.match(/^(?:[-*+]) (.+)$/);
    const ol = raw.match(/^\d+\. (.+)$/);

    if (ul) {
      if (!stack || stack.type !== 'ul') {
        flush();
        stack = { type: 'ul', items: [ul[1]] };
      } else {
        stack.items.push(ul[1]);
      }
      continue;
    }

    if (ol) {
      if (!stack || stack.type !== 'ol') {
        flush();
        stack = { type: 'ol', items: [ol[1]] };
      } else {
        stack.items.push(ol[1]);
      }
      continue;
    }

    if (stack && /^\s/.test(raw) && raw.trim()) {
      stack.items[stack.items.length - 1] += '<br />' + raw.trim();
      continue;
    }

    flush();
    out.push(raw);
  }

  flush();
  return out.join('\n');
}
