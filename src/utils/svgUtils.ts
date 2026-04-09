export function downloadSvg(svgCode: string, filename: string) {
  const blob = new Blob([svgCode], { type: 'image/svg+xml' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${filename}.svg`
  a.click()
  URL.revokeObjectURL(url)
}

export function copySvgToClipboard(svgCode: string): Promise<void> {
  return navigator.clipboard.writeText(svgCode)
}

export function sanitizeSvg(svgCode: string): string {
  // Basic sanitization - remove script tags and event handlers
  return svgCode
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/on\w+="[^"]*"/gi, '')
    .replace(/on\w+='[^']*'/gi, '')
    .replace(/javascript:/gi, '')
}
