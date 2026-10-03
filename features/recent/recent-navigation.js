import { startPuzzleSession } from '../puzzle/puzzle-session.js'

export function openRecentItem(item) {
  if (item.type === 'puzzle') { startPuzzleSession(item.index); return }
  const paths = {
    article:'/pages/reading/article?item=' + item.index,
    externalArticle:'/pages/reading/chapter?item=' + item.seriesIndex + '&chapter=' + item.chapterIndex,
    word:'/pages/vocab/detail?item=' + item.index + '&readonly=1',
    grammar:'/pages/grammar/detail?item=' + item.index
  }
  if (paths[item.type]) uni.navigateTo({url:paths[item.type]})
}

export function recentIcon(type) { return ({article:'▤',externalArticle:'▤',word:'Aa',grammar:'文',puzzle:'拼'})[type] || '•' }
export function recentTone(type) { return ({article:'blue',word:'mint',grammar:'lilac',puzzle:'gold'})[type] || 'blue' }
