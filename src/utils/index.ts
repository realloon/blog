const segmenter = new Intl.Segmenter('zh', {
  granularity: 'word',
})

export function countMixed(text: string) {
  const segments = segmenter.segment(text)
  let count = 0

  for (const { segment, isWordLike } of segments) {
    if (/^\s+$/.test(segment)) continue

    if (isWordLike && /^[A-Za-z]+$/.test(segment)) {
      count += 1
    } else {
      count += Array.from(segment).length
    }
  }

  return count
}
