const imageHandler = () => { const quill = quillInstanceRef.value if (quill) { const range =
quill.getSelection(true) if (range && range.index !== undefined) { savedIndex = range.index } else {
savedIndex = quill.getLength() - 1 } } const input =
document.getElementById('quill-hidden-image-input') if (input) { input.click() } }
quill.insertEmbed(insertIndex, 'image', imageUrl, 'user') quill.insertText(insertIndex + 1, '\n',
'user') setTimeout(() => { quill.setSelection(insertIndex + 2, 0, 'silent') savedIndex = insertIndex
+ 2 }, 0)
