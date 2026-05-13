const isFileLike = (value: string): boolean =>
  typeof value === 'string' && (value.startsWith('data:') || value.startsWith('blob:'))

const dataUrlToBlob = (dataUrl: string): Blob => {
  const [header, base64] = dataUrl.split(',')
  const mimeMatch = header.match(/data:([^;]+);base64/)
  const mime = mimeMatch?.[1] ?? 'application/octet-stream'
  const binary = atob(base64)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i)
  return new Blob([bytes], { type: mime })
}

export async function dataUrlToFile(value: string, name = 'file'): Promise<File | string> {
  if (!isFileLike(value)) return value
  if (value.startsWith('data:')) {
    const blob = dataUrlToBlob(value)
    const ext = blob.type.split('/')[1] ?? 'bin'
    return new File([blob], `${name}.${ext}`, { type: blob.type })
  }
  return new Promise((resolve) => {
    const xhr = new XMLHttpRequest()
    xhr.open('GET', value, true)
    xhr.responseType = 'blob'
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        const blob = xhr.response as Blob
        const ext = blob.type.split('/')[1] ?? 'bin'
        resolve(new File([blob], `${name}.${ext}`, { type: blob.type }))
      } else {
        resolve(value)
      }
    }
    xhr.onerror = () => resolve(value)
    xhr.send()
  })
}
