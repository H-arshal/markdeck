export const guideContent = [
    {
        category: 'Basic Syntax',
        items: [
            { name: 'Heading 1', syntax: '# Heading 1', result: '<h1>Heading 1</h1>' },
            { name: 'Heading 2', syntax: '## Heading 2', result: '<h2>Heading 2</h2>' },
            { name: 'Heading 3', syntax: '### Heading 3', result: '<h3>Heading 3</h3>' },
            { name: 'Bold', syntax: '**Bold Text**', result: '<strong>Bold Text</strong>' },
            { name: 'Italic', syntax: '*Italic Text*', result: '<em>Italic Text</em>' },
            { name: 'Strikethrough', syntax: '~~Strikethrough~~', result: '<del>Strikethrough</del>' },
            { name: 'Blockquote', syntax: '> Blockquote', result: '<blockquote>Blockquote</blockquote>' },
        ]
    },
    {
        category: 'Lists',
        items: [
            { name: 'Unordered List', syntax: '- Item 1\n- Item 2', result: '<ul><li>Item 1</li><li>Item 2</li></ul>' },
            { name: 'Ordered List', syntax: '1. Item 1\n2. Item 2', result: '<ol><li>Item 1</li><li>Item 2</li></ol>' },
            { name: 'Task List', syntax: '- [x] Done\n- [ ] Pending', result: '<ul><li>[x] Done</li><li>[ ] Pending</li></ul>' },
        ]
    },
    {
        category: 'Links & Images',
        items: [
            { name: 'Link', syntax: '[Google](https://google.com)', result: '<a href="https://google.com">Google</a>' },
            { name: 'Image', syntax: '![Alt Text](url)', result: '<img src="url" alt="Alt Text" style="max-width:50px">' },
        ]
    },
    {
        category: 'Code',
        items: [
            { name: 'Inline Code', syntax: '`code`', result: '<code>code</code>' },
            { name: 'Code Block', syntax: '```javascript\nconsole.log("Hi");\n```', result: '<pre><code>console.log("Hi");</code></pre>' },
        ]
    },
    {
        category: 'Advanced',
        items: [
            { name: 'Horizontal Rule', syntax: '---', result: '<hr>' },
            { name: 'Table', syntax: '| H1 | H2 |\n|---|---|\n| C1 | C2 |', result: '<table><thead><tr><th>H1</th><th>H2</th></tr></thead><tbody><tr><td>C1</td><td>C2</td></tr></tbody></table>' },
        ]
    }
];
