export const DAILY_WORD_COUNT = 4

export function localDayKey(date = new Date()) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

// MVP: rotate fixed groups by local calendar day. Later this can be replaced
// with the daily word IDs returned by the content API.
export function dailyWordIndexes(dayKey, wordCount, dailyCount = DAILY_WORD_COUNT) {
  if (!wordCount || dailyCount <= 0) return []
  const [year, month, day] = dayKey.split('-').map(Number)
  const dayNumber = Math.floor(Date.UTC(year, month - 1, day) / 86400000)
  const groupCount = Math.ceil(wordCount / dailyCount)
  const group = ((dayNumber % groupCount) + groupCount) % groupCount
  const start = group * dailyCount
  return Array.from({length: Math.min(dailyCount, wordCount)}, (_, index) => (start + index) % wordCount)
}
